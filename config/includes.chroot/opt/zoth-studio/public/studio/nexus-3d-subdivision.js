/**
 * ⚡ ZOTH NEXUS 3D — Catmull-Clark & Loop Mesh Subdivision & High-Fidelity Normal Map Engine
 * 
 * High-performance, pure JavaScript CAD-grade mesh subdivision and tangent-space normal map
 * generator for Three.js BufferGeometry.
 * 
 * Features:
 * - Loop Mesh Subdivision:
 *   * Evaluates edge points (3/8, 1/8) and vertex points ((1-nβ), β) for smooth organic curvature
 *   * Multi-level subdivision (Level 1, Level 2)
 *   * Boundary edge preservation (1/2 edge midpoint, 3/4 + 1/8 boundary neighbors)
 * - Catmull-Clark Mesh Subdivision:
 *   * Evaluates face points (centroid), edge points (average of endpoints and adjacent face points),
 *     and vertex points ((F + 2R + (n-3)V)/n)
 *   * Multi-level quad-based subdivision with boundary and crease angle preservation
 *   * Robust attribute interpolation (positions, normals, UV coordinates)
 * - High-Fidelity 3x3 Normal Map Filters:
 *   * Sobel 3x3 gradient filter
 *   * Scharr 3x3 high-fidelity rotational symmetry & edge-preservation filter
 *   * Adjustable bump scale, tangent-space encoding, OpenGL / DirectX orientation
 *   * Sharp CAD chamfer and bevel crease preservation
 *   * Procedural heightmap synthesis (CAD chamfers, carbon weave, hex plates, bio-ripples, damascus, circuits)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    var threeInstance;
    try {
      threeInstance = require('three');
    } catch (e) {
      try {
        threeInstance = require('../assets/vendor/three.min.js');
      } catch (e2) {
        threeInstance = root.THREE;
      }
    }
    module.exports = factory(threeInstance);
  } else {
    root.Nexus3DSubdivision = factory(root.THREE);
  }
})(typeof self !== 'undefined' ? self : this, function (THREE) {
  'use strict';

  var VERSION = '2026-08-24-subdivision-normal-v1.0';
  var EPSILON = 1e-6;

  // =========================================================================
  // 1. TOPOLOGY & ADJACENCY DATA STRUCTURES
  // =========================================================================

  /**
   * Helper 3D vector math (Zero-dependency fallback if THREE is minimal)
   */
  function vec3Create(x, y, z) {
    return { x: x || 0, y: y || 0, z: z || 0 };
  }

  function vec3Copy(out, a) {
    out.x = a.x; out.y = a.y; out.z = a.z;
    return out;
  }

  function vec3Add(out, a, b) {
    out.x = a.x + b.x; out.y = a.y + b.y; out.z = a.z + b.z;
    return out;
  }

  function vec3Sub(out, a, b) {
    out.x = a.x - b.x; out.y = a.y - b.y; out.z = a.z - b.z;
    return out;
  }

  function vec3Scale(out, a, s) {
    out.x = a.x * s; out.y = a.y * s; out.z = a.z * s;
    return out;
  }

  function vec3ScaleAndAdd(out, a, b, s) {
    out.x = a.x + b.x * s; out.y = a.y + b.y * s; out.z = a.z + b.z * s;
    return out;
  }

  function vec3Dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function vec3Cross(out, a, b) {
    var ax = a.x, ay = a.y, az = a.z;
    var bx = b.x, by = b.y, bz = b.z;
    out.x = ay * bz - az * by;
    out.y = az * bx - ax * bz;
    out.z = ax * by - ay * bx;
    return out;
  }

  function vec3Length(a) {
    return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
  }

  function vec3Normalize(out, a) {
    var len = vec3Length(a);
    if (len > EPSILON) {
      out.x = a.x / len; out.y = a.y / len; out.z = a.z / len;
    } else {
      out.x = 0; out.y = 0; out.z = 1;
    }
    return out;
  }

  function vec2Create(u, v) {
    return { x: u || 0, y: v || 0 };
  }

  /**
   * Spatial hashing key for 3D coordinates (welds duplicate positions for topology)
   */
  function posHashKey(x, y, z, precision) {
    var p = precision || 10000;
    return Math.round(x * p) + '_' + Math.round(y * p) + '_' + Math.round(z * p);
  }

  /**
   * Canonical edge key (min_max)
   */
  function edgeKey(i0, i1) {
    return i0 < i1 ? i0 + '_' + i1 : i1 + '_' + i0;
  }

  /**
   * Builds an indexed topological representation of a Three.js BufferGeometry
   */
  function buildMeshTopology(geometry) {
    var posAttr = geometry.attributes.position;
    if (!posAttr || posAttr.count === 0) {
      throw new Error("Invalid geometry: missing position attribute");
    }

    var uvAttr = geometry.attributes.uv;
    var normAttr = geometry.attributes.normal;
    var indexAttr = geometry.index;

    var numVertices = posAttr.count;
    var numFaces = indexAttr ? indexAttr.count / 3 : numVertices / 3;

    // 1. Identify unique spatial vertex coordinates
    var uniquePositions = [];
    var uniqueUVs = [];
    var uniqueNormals = [];
    var posToUniqueMap = new Int32Array(numVertices);
    var hashMap = {};
    var uniqueCount = 0;

    for (var i = 0; i < numVertices; i++) {
      var x = posAttr.getX(i);
      var y = posAttr.getY(i);
      var z = posAttr.getZ(i);
      var key = posHashKey(x, y, z);

      if (hashMap[key] !== undefined) {
        posToUniqueMap[i] = hashMap[key];
      } else {
        hashMap[key] = uniqueCount;
        posToUniqueMap[i] = uniqueCount;
        uniquePositions.push(vec3Create(x, y, z));
        uniqueUVs.push(uvAttr ? vec2Create(uvAttr.getX(i), uvAttr.getY(i)) : vec2Create(0, 0));
        uniqueNormals.push(normAttr ? vec3Create(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i)) : vec3Create(0, 1, 0));
        uniqueCount++;
      }
    }

    // 2. Build Faces and Corner Attribute mappings
    var faces = [];
    var faceCorners = []; // stores original buffer indices for attribute lookup

    for (var f = 0; f < numFaces; f++) {
      var i0, i1, i2;
      if (indexAttr) {
        i0 = indexAttr.getX(f * 3);
        i1 = indexAttr.getX(f * 3 + 1);
        i2 = indexAttr.getX(f * 3 + 2);
      } else {
        i0 = f * 3;
        i1 = f * 3 + 1;
        i2 = f * 3 + 2;
      }

      var u0 = posToUniqueMap[i0];
      var u1 = posToUniqueMap[i1];
      var u2 = posToUniqueMap[i2];

      // Degenerate triangle check
      if (u0 !== u1 && u1 !== u2 && u2 !== u0) {
        faces.push([u0, u1, u2]);
        faceCorners.push([i0, i1, i2]);
      }
    }

    // 3. Build Edges and Adjacency Graph
    var edges = [];
    var edgeMap = {}; // key -> edge index
    var vertexEdges = []; // vertex index -> array of edge indices
    var vertexFaces = []; // vertex index -> array of face indices
    var vertexNeighbors = []; // vertex index -> Set of neighbor vertex indices

    for (var v = 0; v < uniqueCount; v++) {
      vertexEdges.push([]);
      vertexFaces.push([]);
      vertexNeighbors.push(new Set());
    }

    for (var fIdx = 0; fIdx < faces.length; fIdx++) {
      var face = faces[fIdx];
      var fLen = face.length;

      for (var j = 0; j < fLen; j++) {
        var va = face[j];
        var vb = face[(j + 1) % fLen];
        var vc = face[(j + 2) % fLen];

        vertexFaces[va].push(fIdx);
        vertexNeighbors[va].add(vb);
        vertexNeighbors[vb].add(va);

        var eKey = edgeKey(va, vb);
        var eIdx;

        if (edgeMap[eKey] !== undefined) {
          eIdx = edgeMap[eKey];
          var edgeObj = edges[eIdx];
          edgeObj.faces.push(fIdx);
          edgeObj.oppositeVertices.push(vc);
        } else {
          eIdx = edges.length;
          edgeMap[eKey] = eIdx;
          var newEdge = {
            index: eIdx,
            v0: Math.min(va, vb),
            v1: Math.max(va, vb),
            faces: [fIdx],
            oppositeVertices: [vc],
            isBoundary: false
          };
          edges.push(newEdge);
          vertexEdges[va].push(eIdx);
          vertexEdges[vb].push(eIdx);
        }
      }
    }

    // 4. Classify Boundary Edges and Boundary Vertices
    var boundaryVertices = new Uint8Array(uniqueCount);
    var boundaryEdges = [];
    var vertexBoundaryNeighbors = []; // v -> [neighborV1, neighborV2]
    for (var bv = 0; bv < uniqueCount; bv++) {
      vertexBoundaryNeighbors.push([]);
    }

    for (var e = 0; e < edges.length; e++) {
      var edge = edges[e];
      if (edge.faces.length === 1) {
        edge.isBoundary = true;
        boundaryEdges.push(e);
        boundaryVertices[edge.v0] = 1;
        boundaryVertices[edge.v1] = 1;
        vertexBoundaryNeighbors[edge.v0].push(edge.v1);
        vertexBoundaryNeighbors[edge.v1].push(edge.v0);
      }
    }

    return {
      uniquePositions: uniquePositions,
      uniqueUVs: uniqueUVs,
      uniqueNormals: uniqueNormals,
      posToUniqueMap: posToUniqueMap,
      faces: faces,
      faceCorners: faceCorners,
      edges: edges,
      edgeMap: edgeMap,
      vertexEdges: vertexEdges,
      vertexFaces: vertexFaces,
      vertexNeighbors: vertexNeighbors,
      boundaryVertices: boundaryVertices,
      boundaryEdges: boundaryEdges,
      vertexBoundaryNeighbors: vertexBoundaryNeighbors,
      hasUVs: !!uvAttr,
      hasNormals: !!normAttr,
      originalPosAttr: posAttr,
      originalUvAttr: uvAttr,
      originalNormAttr: normAttr
    };
  }

  // =========================================================================
  // 2. LOOP MESH SUBDIVISION ALGORITHM
  // =========================================================================

  /**
   * Single iteration of Loop Subdivision on a triangle mesh
   * Evaluates edge points (3/8, 1/8) and updated vertex points ((1-nβ), β)
   * with boundary edge preservation.
   */
  function loopSubdivideOnce(topology) {
    var numOldVertices = topology.uniquePositions.length;
    var numEdges = topology.edges.length;

    // --- STEP A: Compute New Edge Vertices ---
    var edgePoints = new Array(numEdges);
    var edgeUVs = new Array(numEdges);

    for (var e = 0; e < numEdges; e++) {
      var edge = topology.edges[e];
      var v0 = topology.uniquePositions[edge.v0];
      var v1 = topology.uniquePositions[edge.v1];
      var uv0 = topology.uniqueUVs[edge.v0];
      var uv1 = topology.uniqueUVs[edge.v1];

      var ePt = vec3Create();
      var eUV = vec2Create();

      if (edge.isBoundary || edge.oppositeVertices.length < 2) {
        // Boundary edge: Midpoint rule (1/2 * v0 + 1/2 * v1)
        ePt.x = 0.5 * (v0.x + v1.x);
        ePt.y = 0.5 * (v0.y + v1.y);
        ePt.z = 0.5 * (v0.z + v1.z);

        eUV.x = 0.5 * (uv0.x + uv1.x);
        eUV.y = 0.5 * (uv0.y + uv1.y);
      } else {
        // Interior edge: 3/8*(v0 + v1) + 1/8*(v2 + v3)
        var v2 = topology.uniquePositions[edge.oppositeVertices[0]];
        var v3 = topology.uniquePositions[edge.oppositeVertices[1]];

        ePt.x = (3.0 / 8.0) * (v0.x + v1.x) + (1.0 / 8.0) * (v2.x + v3.x);
        ePt.y = (3.0 / 8.0) * (v0.y + v1.y) + (1.0 / 8.0) * (v2.y + v3.y);
        ePt.z = (3.0 / 8.0) * (v0.z + v1.z) + (1.0 / 8.0) * (v2.z + v3.z);

        eUV.x = 0.5 * (uv0.x + uv1.x);
        eUV.y = 0.5 * (uv0.y + uv1.y);
      }

      edgePoints[e] = ePt;
      edgeUVs[e] = eUV;
    }

    // --- STEP B: Update Existing (Old) Vertices ---
    var updatedOldPositions = new Array(numOldVertices);
    var updatedOldUVs = new Array(numOldVertices);

    for (var v = 0; v < numOldVertices; v++) {
      var vPos = topology.uniquePositions[v];
      var vUV = topology.uniqueUVs[v];
      var newPos = vec3Create();

      if (topology.boundaryVertices[v]) {
        // Boundary vertex: 3/4 * v + 1/8 * (v_b0 + v_b1)
        var bNeighbors = topology.vertexBoundaryNeighbors[v];
        if (bNeighbors.length >= 2) {
          var vb0 = topology.uniquePositions[bNeighbors[0]];
          var vb1 = topology.uniquePositions[bNeighbors[1]];
          newPos.x = 0.75 * vPos.x + 0.125 * (vb0.x + vb1.x);
          newPos.y = 0.75 * vPos.y + 0.125 * (vb0.y + vb1.y);
          newPos.z = 0.75 * vPos.z + 0.125 * (vb0.z + vb1.z);
        } else if (bNeighbors.length === 1) {
          var vb = topology.uniquePositions[bNeighbors[0]];
          newPos.x = 0.75 * vPos.x + 0.25 * vb.x;
          newPos.y = 0.75 * vPos.y + 0.25 * vb.y;
          newPos.z = 0.75 * vPos.z + 0.25 * vb.z;
        } else {
          vec3Copy(newPos, vPos);
        }
      } else {
        // Interior vertex: (1 - n*beta)*v + beta * sum(neighbors)
        var neighbors = Array.from(topology.vertexNeighbors[v]);
        var n = neighbors.length;

        if (n < 3) {
          vec3Copy(newPos, vPos);
        } else {
          // Standard Loop beta formula
          var cosVal = Math.cos((2.0 * Math.PI) / n);
          var term = 0.375 + 0.25 * cosVal;
          var beta = (1.0 / n) * (0.625 - term * term);

          var sumX = 0, sumY = 0, sumZ = 0;
          for (var ni = 0; ni < n; ni++) {
            var nPos = topology.uniquePositions[neighbors[ni]];
            sumX += nPos.x;
            sumY += nPos.y;
            sumZ += nPos.z;
          }

          var alpha = 1.0 - n * beta;
          newPos.x = alpha * vPos.x + beta * sumX;
          newPos.y = alpha * vPos.y + beta * sumY;
          newPos.z = alpha * vPos.z + beta * sumZ;
        }
      }

      updatedOldPositions[v] = newPos;
      updatedOldUVs[v] = vec2Create(vUV.x, vUV.y);
    }

    // --- STEP C: Build Subdivided Triangles ---
    // All vertices: updatedOldPositions [0..numOldVertices-1] followed by edgePoints [0..numEdges-1]
    var allPositions = [];
    var allUVs = [];

    for (var i = 0; i < numOldVertices; i++) {
      allPositions.push(updatedOldPositions[i]);
      allUVs.push(updatedOldUVs[i]);
    }
    for (var j = 0; j < numEdges; j++) {
      allPositions.push(edgePoints[j]);
      allUVs.push(edgeUVs[j]);
    }

    var newFaces = [];

    for (var f = 0; f < topology.faces.length; f++) {
      var face = topology.faces[f];
      var v0 = face[0];
      var v1 = face[1];
      var v2 = face[2];

      var e01 = numOldVertices + topology.edgeMap[edgeKey(v0, v1)];
      var e12 = numOldVertices + topology.edgeMap[edgeKey(v1, v2)];
      var e20 = numOldVertices + topology.edgeMap[edgeKey(v2, v0)];

      // 4 new triangles
      // T0: (v0, e01, e20)
      newFaces.push([v0, e01, e20]);
      // T1: (v1, e12, e01)
      newFaces.push([v1, e12, e01]);
      // T2: (v2, e20, e12)
      newFaces.push([v2, e20, e12]);
      // T3: (e01, e12, e20)
      newFaces.push([e01, e12, e20]);
    }

    return constructBufferGeometryFromFaces(allPositions, allUVs, newFaces, true);
  }

  // =========================================================================
  // 3. CATMULL-CLARK MESH SUBDIVISION ALGORITHM
  // =========================================================================

  /**
   * Single iteration of Catmull-Clark Subdivision on BufferGeometry
   * Evaluates face points, edge points, and vertex points.
   * Multi-level quad-based subdivision with boundary preservation and CAD crease preservation.
   */
  function catmullClarkSubdivideOnce(topology, options) {
    options = options || {};
    var creaseAngle = options.creaseAngle !== undefined ? options.creaseAngle : 45.0; // degrees
    var creaseThresholdCos = Math.cos((creaseAngle * Math.PI) / 180.0);
    var preserveCreases = options.preserveCreases !== false;

    var numOldVertices = topology.uniquePositions.length;
    var numFaces = topology.faces.length;
    var numEdges = topology.edges.length;

    // --- STEP 1: Compute Face Points ---
    var facePoints = new Array(numFaces);
    var faceUVs = new Array(numFaces);
    var faceNormals = new Array(numFaces);

    for (var f = 0; f < numFaces; f++) {
      var face = topology.faces[f];
      var fLen = face.length;
      var fPt = vec3Create();
      var fUV = vec2Create();

      for (var fi = 0; fi < fLen; fi++) {
        var vIdx = face[fi];
        var pos = topology.uniquePositions[vIdx];
        var uv = topology.uniqueUVs[vIdx];
        fPt.x += pos.x;
        fPt.y += pos.y;
        fPt.z += pos.z;
        fUV.x += uv.x;
        fUV.y += uv.y;
      }
      fPt.x /= fLen;
      fPt.y /= fLen;
      fPt.z /= fLen;
      fUV.x /= fLen;
      fUV.y /= fLen;

      facePoints[f] = fPt;
      faceUVs[f] = fUV;

      // Compute face geometric normal for crease detection
      if (fLen >= 3) {
        var p0 = topology.uniquePositions[face[0]];
        var p1 = topology.uniquePositions[face[1]];
        var p2 = topology.uniquePositions[face[2]];
        var d1 = vec3Sub(vec3Create(), p1, p0);
        var d2 = vec3Sub(vec3Create(), p2, p0);
        var fNorm = vec3Cross(vec3Create(), d1, d2);
        vec3Normalize(fNorm, fNorm);
        faceNormals[f] = fNorm;
      } else {
        faceNormals[f] = vec3Create(0, 1, 0);
      }
    }

    // --- STEP 2: Detect Sharp Crease Edges & Compute Edge Points ---
    var edgePoints = new Array(numEdges);
    var edgeUVs = new Array(numEdges);
    var edgeIsSharp = new Uint8Array(numEdges);

    for (var e = 0; e < numEdges; e++) {
      var edge = topology.edges[e];
      var v0 = topology.uniquePositions[edge.v0];
      var v1 = topology.uniquePositions[edge.v1];
      var uv0 = topology.uniqueUVs[edge.v0];
      var uv1 = topology.uniqueUVs[edge.v1];

      // Check if crease edge
      var isCrease = false;
      if (edge.faces.length >= 2 && preserveCreases) {
        var fn0 = faceNormals[edge.faces[0]];
        var fn1 = faceNormals[edge.faces[1]];
        var dotVal = vec3Dot(fn0, fn1);
        if (dotVal < creaseThresholdCos) {
          isCrease = true;
        }
      }
      edgeIsSharp[e] = (edge.isBoundary || isCrease) ? 1 : 0;

      var ePt = vec3Create();
      var eUV = vec2Create(0.5 * (uv0.x + uv1.x), 0.5 * (uv0.y + uv1.y));

      if (edge.isBoundary || isCrease || edge.faces.length < 2) {
        // Boundary or Crease Edge Rule: Edge point is midpoint of edge endpoints
        ePt.x = 0.5 * (v0.x + v1.x);
        ePt.y = 0.5 * (v0.y + v1.y);
        ePt.z = 0.5 * (v0.z + v1.z);
      } else {
        // Catmull-Clark Interior Edge Rule:
        // E = (v0 + v1 + F1 + F2) / 4
        var f1 = facePoints[edge.faces[0]];
        var f2 = facePoints[edge.faces[1]];

        ePt.x = 0.25 * (v0.x + v1.x + f1.x + f2.x);
        ePt.y = 0.25 * (v0.y + v1.y + f1.y + f2.y);
        ePt.z = 0.25 * (v0.z + v1.z + f1.z + f2.z);
      }

      edgePoints[e] = ePt;
      edgeUVs[e] = eUV;
    }

    // --- STEP 3: Compute Updated Vertex Points ---
    var updatedVertexPoints = new Array(numOldVertices);
    var updatedVertexUVs = new Array(numOldVertices);

    for (var v = 0; v < numOldVertices; v++) {
      var vPos = topology.uniquePositions[v];
      var vUV = topology.uniqueUVs[v];
      var adjEdges = topology.vertexEdges[v];
      var adjFaces = topology.vertexFaces[v];
      var n = adjFaces.length;

      var vPt = vec3Create();

      // Count sharp/crease incident edges
      var sharpIncidentEdges = [];
      for (var ei = 0; ei < adjEdges.length; ei++) {
        var edgeIdx = adjEdges[ei];
        if (edgeIsSharp[edgeIdx]) {
          sharpIncidentEdges.push(edgeIdx);
        }
      }

      if (topology.boundaryVertices[v] || sharpIncidentEdges.length >= 2) {
        // Boundary or Sharp Crease Rule:
        // V' = 3/4 * V + 1/8 * (V_sharp1 + V_sharp2)
        if (sharpIncidentEdges.length >= 2) {
          var e0 = topology.edges[sharpIncidentEdges[0]];
          var e1 = topology.edges[sharpIncidentEdges[1]];
          var otherV0 = (e0.v0 === v) ? e0.v1 : e0.v0;
          var otherV1 = (e1.v0 === v) ? e1.v1 : e1.v0;
          var p0 = topology.uniquePositions[otherV0];
          var p1 = topology.uniquePositions[otherV1];

          vPt.x = 0.75 * vPos.x + 0.125 * (p0.x + p1.x);
          vPt.y = 0.75 * vPos.y + 0.125 * (p0.y + p1.y);
          vPt.z = 0.75 * vPos.z + 0.125 * (p0.z + p1.z);
        } else if (topology.boundaryVertices[v]) {
          var bNbrs = topology.vertexBoundaryNeighbors[v];
          if (bNbrs.length >= 2) {
            var bp0 = topology.uniquePositions[bNbrs[0]];
            var bp1 = topology.uniquePositions[bNbrs[1]];
            vPt.x = 0.75 * vPos.x + 0.125 * (bp0.x + bp1.x);
            vPt.y = 0.75 * vPos.y + 0.125 * (bp0.y + bp1.y);
            vPt.z = 0.75 * vPos.z + 0.125 * (bp0.z + bp1.z);
          } else {
            vec3Copy(vPt, vPos);
          }
        } else {
          vec3Copy(vPt, vPos);
        }
      } else if (n < 3) {
        vec3Copy(vPt, vPos);
      } else {
        // Catmull-Clark Standard Interior Vertex Rule:
        // V' = (F_avg + 2*R_avg + (n-3)*V) / n
        // F_avg = average of face points of all faces sharing V
        // R_avg = average of midpoints of all edges sharing V
        var sumFx = 0, sumFy = 0, sumFz = 0;
        for (var fi = 0; fi < n; fi++) {
          var fp = facePoints[adjFaces[fi]];
          sumFx += fp.x;
          sumFy += fp.y;
          sumFz += fp.z;
        }
        var favgX = sumFx / n;
        var favgY = sumFy / n;
        var favgZ = sumFz / n;

        var sumRx = 0, sumRy = 0, sumRz = 0;
        var numAdjEdges = adjEdges.length;
        for (var aei = 0; aei < numAdjEdges; aei++) {
          var aEdge = topology.edges[adjEdges[aei]];
          var ep0 = topology.uniquePositions[aEdge.v0];
          var ep1 = topology.uniquePositions[aEdge.v1];
          sumRx += 0.5 * (ep0.x + ep1.x);
          sumRy += 0.5 * (ep0.y + ep1.y);
          sumRz += 0.5 * (ep0.z + ep1.z);
        }
        var ravgX = sumRx / numAdjEdges;
        var ravgY = sumRy / numAdjEdges;
        var ravgZ = sumRz / numAdjEdges;

        vPt.x = (favgX + 2.0 * ravgX + (n - 3.0) * vPos.x) / n;
        vPt.y = (favgY + 2.0 * ravgY + (n - 3.0) * vPos.y) / n;
        vPt.z = (favgZ + 2.0 * ravgZ + (n - 3.0) * vPos.z) / n;
      }

      updatedVertexPoints[v] = vPt;
      updatedVertexUVs[v] = vec2Create(vUV.x, vUV.y);
    }

    // --- STEP 4: Build Subdivided Mesh (Quads split to Triangles) ---
    // Layout of vertices array:
    // [0 .. numOldVertices-1] = updatedVertexPoints
    // [numOldVertices .. numOldVertices + numEdges - 1] = edgePoints
    // [numOldVertices + numEdges .. numOldVertices + numEdges + numFaces - 1] = facePoints
    var allPositions = [];
    var allUVs = [];

    for (var i = 0; i < numOldVertices; i++) {
      allPositions.push(updatedVertexPoints[i]);
      allUVs.push(updatedVertexUVs[i]);
    }
    for (var j = 0; j < numEdges; j++) {
      allPositions.push(edgePoints[j]);
      allUVs.push(edgeUVs[j]);
    }
    for (var k = 0; k < numFaces; k++) {
      allPositions.push(facePoints[k]);
      allUVs.push(faceUVs[k]);
    }

    var edgeOffset = numOldVertices;
    var faceOffset = numOldVertices + numEdges;

    var newTriangles = [];

    for (var fIdx = 0; fIdx < numFaces; fIdx++) {
      var face = topology.faces[fIdx];
      var fLen = face.length;
      var fPtIdx = faceOffset + fIdx;

      for (var c = 0; c < fLen; c++) {
        var vCurr = face[c];
        var vPrev = face[(c - 1 + fLen) % fLen];
        var vNext = face[(c + 1) % fLen];

        var ePrevIdx = edgeOffset + topology.edgeMap[edgeKey(vPrev, vCurr)];
        var eNextIdx = edgeOffset + topology.edgeMap[edgeKey(vCurr, vNext)];

        // Quad = (vCurr, eNextIdx, fPtIdx, ePrevIdx)
        // Split quad into 2 triangles:
        // Tri 1: (vCurr, eNextIdx, fPtIdx)
        newTriangles.push([vCurr, eNextIdx, fPtIdx]);
        // Tri 2: (vCurr, fPtIdx, ePrevIdx)
        newTriangles.push([vCurr, fPtIdx, ePrevIdx]);
      }
    }

    return constructBufferGeometryFromFaces(allPositions, allUVs, newTriangles, true);
  }

  /**
   * Constructs a Three.js BufferGeometry with unified normals and UVs from face index array
   */
  function constructBufferGeometryFromFaces(positions, uvs, faces, computeNormals) {
    var numTriangles = faces.length;
    var numVertices = numTriangles * 3;

    var posBuffer = new Float32Array(numVertices * 3);
    var uvBuffer = new Float32Array(numVertices * 2);
    var normBuffer = new Float32Array(numVertices * 3);

    for (var t = 0; t < numTriangles; t++) {
      var face = faces[t];
      var p0 = positions[face[0]];
      var p1 = positions[face[1]];
      var p2 = positions[face[2]];

      var uv0 = uvs[face[0]] || { x: 0, y: 0 };
      var uv1 = uvs[face[1]] || { x: 0, y: 0 };
      var uv2 = uvs[face[2]] || { x: 0, y: 0 };

      var base = t * 9;
      var uvBase = t * 6;

      posBuffer[base + 0] = p0.x; posBuffer[base + 1] = p0.y; posBuffer[base + 2] = p0.z;
      posBuffer[base + 3] = p1.x; posBuffer[base + 4] = p1.y; posBuffer[base + 5] = p1.z;
      posBuffer[base + 6] = p2.x; posBuffer[base + 7] = p2.y; posBuffer[base + 8] = p2.z;

      uvBuffer[uvBase + 0] = uv0.x; uvBuffer[uvBase + 1] = uv0.y;
      uvBuffer[uvBase + 2] = uv1.x; uvBuffer[uvBase + 3] = uv1.y;
      uvBuffer[uvBase + 4] = uv2.x; uvBuffer[uvBase + 5] = uv2.y;

      if (computeNormals) {
        var d1x = p1.x - p0.x, d1y = p1.y - p0.y, d1z = p1.z - p0.z;
        var d2x = p2.x - p0.x, d2y = p2.y - p0.y, d2z = p2.z - p0.z;
        var nx = d1y * d2z - d1z * d2y;
        var ny = d1z * d2x - d1x * d2z;
        var nz = d1x * d2y - d1y * d2x;
        var nlen = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (nlen > EPSILON) { nx /= nlen; ny /= nlen; nz /= nlen; }
        else { nx = 0; ny = 1; nz = 0; }

        normBuffer[base + 0] = nx; normBuffer[base + 1] = ny; normBuffer[base + 2] = nz;
        normBuffer[base + 3] = nx; normBuffer[base + 4] = ny; normBuffer[base + 5] = nz;
        normBuffer[base + 6] = nx; normBuffer[base + 7] = ny; normBuffer[base + 8] = nz;
      }
    }

    var geom;
    if (THREE && THREE.BufferGeometry) {
      geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(posBuffer, 3));
      geom.setAttribute('uv', new THREE.BufferAttribute(uvBuffer, 2));
      geom.setAttribute('normal', new THREE.BufferAttribute(normBuffer, 3));
      if (computeNormals && geom.computeVertexNormals) {
        geom.computeVertexNormals();
      }
    } else {
      // Mock / headless representation
      geom = {
        isBufferGeometry: true,
        attributes: {
          position: { array: posBuffer, count: numVertices, itemSize: 3, getX: function(i){return posBuffer[i*3];}, getY: function(i){return posBuffer[i*3+1];}, getZ: function(i){return posBuffer[i*3+2];} },
          uv: { array: uvBuffer, count: numVertices, itemSize: 2, getX: function(i){return uvBuffer[i*2];}, getY: function(i){return uvBuffer[i*2+1];} },
          normal: { array: normBuffer, count: numVertices, itemSize: 3, getX: function(i){return normBuffer[i*3];}, getY: function(i){return normBuffer[i*3+1];}, getZ: function(i){return normBuffer[i*3+2];} }
        },
        computeVertexNormals: function() {}
      };
    }

    return geom;
  }

  /**
   * Multi-Level Mesh Subdivision API
   * Supports 'loop' and 'catmull-clark' algorithms
   *
   * @param {THREE.BufferGeometry} geometry Input geometry
   * @param {Object} [options] Subdivision options
   * @param {string} [options.type='catmull-clark'] 'catmull-clark' | 'loop'
   * @param {number} [options.level=1] Subdivision iterations (1 or 2 recommended)
   * @param {boolean} [options.preserveBoundaries=true] Preserve boundary silhouettes
   * @param {boolean} [options.preserveCreases=true] Preserve sharp CAD creases (>creaseAngle)
   * @param {number} [options.creaseAngle=45.0] Crease threshold in degrees
   * @returns {THREE.BufferGeometry} Subdivided geometry
   */
  function subdivideBufferGeometry(geometry, options) {
    options = options || {};
    var type = (options.type || 'catmull-clark').toLowerCase();
    var level = options.level !== undefined ? Math.max(1, Math.min(4, Math.floor(options.level))) : 1;

    var currentGeom = geometry;

    for (var l = 0; l < level; l++) {
      var topology = buildMeshTopology(currentGeom);
      if (type === 'loop') {
        currentGeom = loopSubdivideOnce(topology);
      } else {
        currentGeom = catmullClarkSubdivideOnce(topology, options);
      }
    }

    return currentGeom;
  }

  function loopSubdivide(geometry, level, options) {
    var opts = Object.assign({}, options, { type: 'loop', level: level || 1 });
    return subdivideBufferGeometry(geometry, opts);
  }

  function catmullClarkSubdivide(geometry, level, options) {
    var opts = Object.assign({}, options, { type: 'catmull-clark', level: level || 1 });
    return subdivideBufferGeometry(geometry, opts);
  }

  /**
   * Subdivides a Three.js Mesh, updating its geometry and metadata
   */
  function subdivideMesh(mesh, options) {
    if (!mesh || !mesh.geometry) {
      throw new Error("Invalid mesh or missing geometry");
    }
    var origVerts = mesh.geometry.attributes.position ? mesh.geometry.attributes.position.count : 0;
    var subdividedGeom = subdivideBufferGeometry(mesh.geometry, options);
    var newVerts = subdividedGeom.attributes.position ? subdividedGeom.attributes.position.count : 0;

    if (mesh.geometry.dispose) {
      mesh.geometry.dispose();
    }
    mesh.geometry = subdividedGeom;
    if (!mesh.userData) mesh.userData = {};
    mesh.userData.subdivided = true;
    mesh.userData.subdivisionLevel = (options && options.level) || 1;
    mesh.userData.subdivisionType = (options && options.type) || 'catmull-clark';
    mesh.userData.originalVertexCount = origVerts;
    mesh.userData.subdividedVertexCount = newVerts;

    return mesh;
  }

  // =========================================================================
  // 4. HIGH-FIDELITY SOBEL & SCHARR 3x3 NORMAL MAP FILTERS
  // =========================================================================

  /**
   * 3x3 Kernel Convolutions:
   * Sobel: standard gradient
   * Scharr: rotational symmetry & higher angular accuracy for sharp CAD bevels
   */
  var KERNELS = {
    sobel: {
      x: [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
      ],
      y: [
        [-1, -2, -1],
        [ 0,  0,  0],
        [ 1,  2,  1]
      ],
      divisor: 8.0
    },
    scharr: {
      x: [
        [-3,  0,  3],
        [-10, 0, 10],
        [-3,  0,  3]
      ],
      y: [
        [-3, -10, -3],
        [ 0,   0,  0],
        [ 3,  10,  3]
      ],
      divisor: 32.0
    }
  };

  /**
   * Extracts or generates a normalized 2D Float32Array heightmap from diverse inputs
   */
  function getNormalizedHeightmap(source, width, height) {
    var total = width * height;
    var heights = new Float32Array(total);

    if (typeof source === 'function') {
      // Procedural height function f(x/width, y/height)
      for (var y = 0; y < height; y++) {
        var v = y / height;
        for (var x = 0; x < width; x++) {
          var u = x / width;
          var h = source(u, v, x, y);
          heights[y * width + x] = Math.max(0.0, Math.min(1.0, h));
        }
      }
    } else if (source instanceof Float32Array) {
      if (source.length === total) {
        heights.set(source);
      } else {
        // Resample 1D float buffer
        var srcW = Math.round(Math.sqrt(source.length));
        var srcH = srcW;
        for (var y = 0; y < height; y++) {
          var sy = (y / height) * srcH;
          var iy = Math.min(srcH - 1, Math.floor(sy));
          for (var x = 0; x < width; x++) {
            var sx = (x / width) * srcW;
            var ix = Math.min(srcW - 1, Math.floor(sx));
            heights[y * width + x] = source[iy * srcW + ix];
          }
        }
      }
    } else if (Array.isArray(source)) {
      if (Array.isArray(source[0])) {
        // 2D Array [y][x]
        var srcH = source.length;
        var srcW = source[0].length;
        for (var y = 0; y < height; y++) {
          var iy = Math.min(srcH - 1, Math.floor((y / height) * srcH));
          for (var x = 0; x < width; x++) {
            var ix = Math.min(srcW - 1, Math.floor((x / width) * srcW));
            heights[y * width + x] = source[iy][ix];
          }
        }
      } else {
        // 1D Array
        for (var i = 0; i < Math.min(total, source.length); i++) {
          heights[i] = source[i];
        }
      }
    } else if (source && source.data && source.data.length >= total * 4) {
      // ImageData / RGBA Uint8ClampedArray
      for (var i = 0; i < total; i++) {
        var r = source.data[i * 4];
        var g = source.data[i * 4 + 1];
        var b = source.data[i * 4 + 2];
        // Luminance
        heights[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
      }
    } else {
      // Default flat height
      heights.fill(0.5);
    }

    return heights;
  }

  /**
   * Generates a high-fidelity tangent-space normal map using Sobel or Scharr 3x3 filter
   *
   * @param {Function|Float32Array|Array|ImageData} heightSource Heightmap input
   * @param {Object} [options] Normal map parameters
   * @param {number} [options.width=512] Texture width
   * @param {number} [options.height=512] Texture height
   * @param {string} [options.filter='scharr'] 'scharr' | 'sobel'
   * @param {number} [options.bumpScale=2.5] Bump height intensity scale
   * @param {boolean} [options.wrap=true] Seamless toroidal texture wrapping
   * @param {boolean} [options.invertR=false] Invert red (X) tangent direction
   * @param {boolean} [options.invertG=false] Invert green (Y) tangent direction (OpenGL vs DirectX)
   * @param {boolean} [options.preserveCreases=true] Sharp CAD chamfer/bevel crease preservation
   * @param {number} [options.creaseThreshold=0.25] Gradient threshold for crease enhancement
   * @returns {Uint8ClampedArray} RGBA normal map pixel buffer
   */
  function generateNormalMapBuffer(heightSource, options) {
    options = options || {};
    var width = options.width || 512;
    var height = options.height || 512;
    var filterName = (options.filter || 'scharr').toLowerCase();
    var kernelDef = KERNELS[filterName] || KERNELS.scharr;
    var bumpScale = options.bumpScale !== undefined ? options.bumpScale : 2.5;
    var wrap = options.wrap !== false;
    var invertR = !!options.invertR;
    var invertG = !!options.invertG;
    var preserveCreases = options.preserveCreases !== false;
    var creaseThreshold = options.creaseThreshold !== undefined ? options.creaseThreshold : 0.25;

    var heights = getNormalizedHeightmap(heightSource, width, height);
    var totalPixels = width * height;
    var rgbaBuffer = new Uint8ClampedArray(totalPixels * 4);

    var kx = kernelDef.x;
    var ky = kernelDef.y;
    var div = kernelDef.divisor;

    // Helper for sample fetch with wrap or clamp
    function sampleHeight(px, py) {
      var x = px;
      var y = py;
      if (wrap) {
        x = (x % width + width) % width;
        y = (y % height + height) % height;
      } else {
        x = Math.max(0, Math.min(width - 1, x));
        y = Math.max(0, Math.min(height - 1, y));
      }
      return heights[y * width + x];
    }

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        // Convolve 3x3 neighborhood
        var gx = 0.0;
        var gy = 0.0;

        for (var kyIdx = -1; kyIdx <= 1; kyIdx++) {
          for (var kxIdx = -1; kxIdx <= 1; kxIdx++) {
            var hVal = sampleHeight(x + kxIdx, y + kyIdx);
            gx += kx[kyIdx + 1][kxIdx + 1] * hVal;
            gy += ky[kyIdx + 1][kxIdx + 1] * hVal;
          }
        }

        gx /= div;
        gy /= div;

        // CAD Crease & Chamfer Sharpening Filter:
        // Preserves crisp step transitions on bevels while maintaining smooth organic curves
        if (preserveCreases) {
          var gradMagnitude = Math.sqrt(gx * gx + gy * gy);
          if (gradMagnitude > creaseThreshold) {
            var sharpenFactor = 1.0 + Math.min(2.0, (gradMagnitude - creaseThreshold) * 4.0);
            gx *= sharpenFactor;
            gy *= sharpenFactor;
          }
        }

        // Tangent space normal vector: N = normalize(-gx * bumpScale, -gy * bumpScale, 1.0)
        var nx = -gx * bumpScale;
        var ny = -gy * bumpScale;
        var nz = 1.0;

        if (invertR) nx = -nx;
        if (invertG) ny = -ny;

        var len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (len > EPSILON) {
          nx /= len;
          ny /= len;
          nz /= len;
        } else {
          nx = 0; ny = 0; nz = 1;
        }

        // Encode normal [-1, 1] to RGB [0, 255]
        var r = Math.round((nx * 0.5 + 0.5) * 255.0);
        var g = Math.round((ny * 0.5 + 0.5) * 255.0);
        var b = Math.round((nz * 0.5 + 0.5) * 255.0);

        var idx = (y * width + x) * 4;
        rgbaBuffer[idx + 0] = Math.max(0, Math.min(255, r));
        rgbaBuffer[idx + 1] = Math.max(0, Math.min(255, g));
        rgbaBuffer[idx + 2] = Math.max(0, Math.min(255, b));
        rgbaBuffer[idx + 3] = 255;
      }
    }

    return rgbaBuffer;
  }

  // =========================================================================
  // 5. PROCEDURAL HEIGHTMAP PRESETS FOR CAD & ORGANIC SCULPTING
  // =========================================================================

  var PROCEDURAL_HEIGHTMAP_PRESETS = {
    'cad-chamfer-bevel': function (u, v) {
      // 45° beveled rectangular tiles with crisp chamfer creases
      var freq = 4.0;
      var fx = (u * freq) % 1.0;
      var fy = (v * freq) % 1.0;
      var bevelWidth = 0.15;
      var dx = Math.min(fx, 1.0 - fx);
      var dy = Math.min(fy, 1.0 - fy);
      var distToEdge = Math.min(dx, dy);
      if (distToEdge < bevelWidth) {
        return distToEdge / bevelWidth;
      }
      return 1.0;
    },
    'brushed-carbon': function (u, v) {
      // Micro-grooved carbon twill weave
      var scale = 32.0;
      var x = u * scale;
      var y = v * scale;
      var twill = Math.sin(x * Math.PI * 2) * Math.cos(y * Math.PI * 2);
      var fineGrooves = Math.sin(x * 128.0) * 0.15;
      return 0.5 + 0.35 * twill + fineGrooves;
    },
    'hex-armor-plate': function (u, v) {
      // Interlocking hexagonal armor tiles with beveled perimeter
      var s = 6.0;
      var px = u * s * Math.sqrt(3);
      var py = v * s;
      // Hex grid distance approximation
      var hx = Math.abs(Math.sin(px * 2.0));
      var hy = Math.abs(Math.cos(py * 2.0));
      var hexVal = Math.min(1.0, Math.max(0.0, (hx + hy) * 0.7));
      return Math.pow(hexVal, 2.2);
    },
    'organic-bio-ripple': function (u, v) {
      // Smooth organic biological membrane ripples
      var r1 = Math.sin(u * 12.0 + Math.cos(v * 8.0) * 2.0);
      var r2 = Math.cos(v * 14.0 + Math.sin(u * 10.0) * 2.5);
      var r3 = Math.sin((u + v) * 20.0) * 0.3;
      return (r1 * 0.4 + r2 * 0.4 + r3 + 1.0) * 0.5;
    },
    'damascus-ripple': function (u, v) {
      // Layered folded steel damascus bands
      var wave1 = Math.sin(u * 40.0 + Math.sin(v * 20.0) * 4.0);
      var wave2 = Math.cos(v * 30.0 + Math.sin(u * 25.0) * 3.0);
      return Math.abs(wave1 * wave2);
    },
    'circuit-traces': function (u, v) {
      // Precision 90° CAD etched circuit traces
      var cx = Math.floor(u * 16.0);
      var cy = Math.floor(v * 16.0);
      var fx = (u * 16.0) % 1.0;
      var fy = (v * 16.0) % 1.0;
      var isTrace = (fx < 0.18 || fy < 0.18) && ((cx + cy) % 2 === 0);
      return isTrace ? 1.0 : 0.1;
    },
    'perlin-terrain': function (u, v) {
      // Multi-octave continuous fractal surface
      var o1 = Math.sin(u * 6.28 * 2) * Math.cos(v * 6.28 * 2);
      var o2 = Math.sin(u * 6.28 * 4 + 1.2) * Math.cos(v * 6.28 * 4 + 0.8) * 0.5;
      var o3 = Math.sin(u * 6.28 * 8 + 2.4) * Math.cos(v * 6.28 * 8 + 1.6) * 0.25;
      return (o1 + o2 + o3 + 1.75) / 3.5;
    }
  };

  /**
   * Generates a Three.js DataTexture or CanvasTexture containing the computed normal map
   */
  function createNormalMapTexture(heightSourceOrPreset, options) {
    options = options || {};
    var width = options.width || 512;
    var height = options.height || 512;

    var source = heightSourceOrPreset;
    if (typeof heightSourceOrPreset === 'string' && PROCEDURAL_HEIGHTMAP_PRESETS[heightSourceOrPreset]) {
      source = PROCEDURAL_HEIGHTMAP_PRESETS[heightSourceOrPreset];
    }

    var rgbaBuffer = generateNormalMapBuffer(source, options);

    if (THREE && THREE.DataTexture) {
      var texture = new THREE.DataTexture(
        rgbaBuffer,
        width,
        height,
        THREE.RGBAFormat,
        THREE.UnsignedByteType
      );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.needsUpdate = true;
      return texture;
    }

    // Fallback: return raw buffer and metadata
    return {
      isDataTexture: true,
      data: rgbaBuffer,
      width: width,
      height: height,
      wrapS: 1000,
      wrapT: 1000
    };
  }

  /**
   * Applies the generated High-Fidelity Normal Map directly to a Three.js Mesh Material
   */
  function applyNormalMapToMesh(mesh, heightSourceOrPreset, options) {
    if (!mesh || !mesh.material) {
      throw new Error("Invalid mesh or missing material");
    }

    options = options || {};
    var normalTex = createNormalMapTexture(heightSourceOrPreset, options);
    var bumpScale = options.bumpScale !== undefined ? options.bumpScale : 2.5;

    var mat = mesh.material;
    if (Array.isArray(mat)) {
      mat = mat[0];
    }

    if (mat) {
      mat.normalMap = normalTex;
      if (mat.normalScale && mat.normalScale.set) {
        mat.normalScale.set(bumpScale, bumpScale);
      }
      mat.needsUpdate = true;
    }

    if (!mesh.userData) mesh.userData = {};
    mesh.userData.hasCustomNormalMap = true;
    mesh.userData.normalMapFilter = options.filter || 'scharr';
    mesh.userData.normalMapPreset = typeof heightSourceOrPreset === 'string' ? heightSourceOrPreset : 'custom';
    mesh.userData.bumpScale = bumpScale;

    return mesh;
  }

  // =========================================================================
  // 6. EXPORTS & PUBLIC API
  // =========================================================================

  return {
    VERSION: VERSION,
    // Topology & Math
    buildMeshTopology: buildMeshTopology,
    // Subdivision Algorithms
    subdivideBufferGeometry: subdivideBufferGeometry,
    catmullClarkSubdivide: catmullClarkSubdivide,
    loopSubdivide: loopSubdivide,
    subdivideMesh: subdivideMesh,
    // Normal Map Filters
    generateNormalMapBuffer: generateNormalMapBuffer,
    createNormalMapTexture: createNormalMapTexture,
    applyNormalMapToMesh: applyNormalMapToMesh,
    // Presets & Kernels
    KERNELS: KERNELS,
    PROCEDURAL_HEIGHTMAP_PRESETS: PROCEDURAL_HEIGHTMAP_PRESETS,
    getNormalizedHeightmap: getNormalizedHeightmap
  };
});
