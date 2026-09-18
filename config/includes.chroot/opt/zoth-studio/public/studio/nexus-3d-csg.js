/**
 * ⚡ ZOTH NEXUS 3D — CSG Boolean Operations & Marching Cubes Metaball Sculptor Engine
 * 
 * High-performance, pure JavaScript CAD-grade Constructive Solid Geometry (CSG)
 * and Marching Cubes / Voxel Scalar Potential Field Metaball Generator for Three.js.
 * 
 * Features:
 * - Pure JS Binary Space Partitioning (BSP) CSG Engine:
 *   * Union: Seamless solid mesh merging into watertight manifolds
 *   * Subtract: Precision carving of cylindrical cooling vents, hollow chambers, cavities, and chamfers
 *   * Intersect: Exact extraction of overlapping solid volumes
 *   * Robust vertex attribute interpolation (positions, unit normals, UV coordinates)
 * - Marching Cubes 3D Voxel Potential Field Generator:
 *   * Multi-charge potential fields (Wyvill smooth polynomial, Inverse Square, Gaussian)
 *   * Smooth organic blending for Liquid Metal / T-1000, Plasma Energy Blobs, Bio-Tissue organoids
 *   * Multi-octave Simplex noise perturbation for organic surface turbulence & cellular veins
 *   * Kinetic multi-body animations (mercury coalescence, tri-plasma orbit, cellular mitosis)
 * - 1-Click CAD Workflows:
 *   * Drill Vent Holes (linear, circular radial, lattice grid, cooling slots)
 *   * Carve Core Cavity (hollow engine housings & reactor access ports)
 *   * Fuse Geometries (multi-mesh solid unification)
 *   * Spawn Organic Metaballs
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
    root.Nexus3DCSG = factory(root.THREE);
  }
})(typeof self !== 'undefined' ? self : this, function (THREE) {
  'use strict';

  var VERSION = '2026-08-24-csg-metaball-v1.0';
  var EPSILON = 1e-5;

  // =========================================================================
  // 1. FAST SIMPLEX NOISE (Zero-Dependency 3D Permutation Noise)
  // =========================================================================
  var F3 = 1.0 / 3.0, G3 = 1.0 / 6.0;
  var pTable = new Uint8Array(512);
  var permMod12 = new Uint8Array(512);

  (function initSimplex() {
    var src = [
      151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,
      8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,
      35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,
      134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,
      55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,
      18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,
      250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,
      189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,
      172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,
      228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,
      107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,
      138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
    ];
    for (var i = 0; i < 512; i++) {
      pTable[i] = src[i & 255];
      permMod12[i] = src[i & 255] % 12;
    }
  })();

  var GRAD3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];

  function simplexNoise3D(xin, yin, zin) {
    var n0, n1, n2, n3;
    var s = (xin + yin + zin) * F3;
    var i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
    var t = (i + j + k) * G3;
    var X0 = i - t, Y0 = j - t, Z0 = k - t;
    var x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0;

    var i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
      else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
      else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
    } else {
      if (y0 < z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
      else if (x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
      else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
    }

    var x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    var x2 = x0 - i2 + 2.0*G3, y2 = y0 - j2 + 2.0*G3, z2 = z0 - k2 + 2.0*G3;
    var x3 = x0 - 1.0 + 3.0*G3, y3 = y0 - 1.0 + 3.0*G3, z3 = z0 - 1.0 + 3.0*G3;

    var ii = i & 255, jj = j & 255, kk = k & 255;
    var gi0 = permMod12[ii + pTable[jj + pTable[kk]]];
    var gi1 = permMod12[ii + i1 + pTable[jj + j1 + pTable[kk + k1]]];
    var gi2 = permMod12[ii + i2 + pTable[jj + j2 + pTable[kk + k2]]];
    var gi3 = permMod12[ii + 1 + pTable[jj + 1 + pTable[kk + 1]]];

    var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    n0 = t0 < 0 ? 0.0 : Math.pow(t0, 4) * (GRAD3[gi0][0]*x0 + GRAD3[gi0][1]*y0 + GRAD3[gi0][2]*z0);

    var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    n1 = t1 < 0 ? 0.0 : Math.pow(t1, 4) * (GRAD3[gi1][0]*x1 + GRAD3[gi1][1]*y1 + GRAD3[gi1][2]*z1);

    var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    n2 = t2 < 0 ? 0.0 : Math.pow(t2, 4) * (GRAD3[gi2][0]*x2 + GRAD3[gi2][1]*y2 + GRAD3[gi2][2]*z2);

    var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    n3 = t3 < 0 ? 0.0 : Math.pow(t3, 4) * (GRAD3[gi3][0]*x3 + GRAD3[gi3][1]*y3 + GRAD3[gi3][2]*z3);

    return 32.0 * (n0 + n1 + n2 + n3);
  }

  // =========================================================================
  // 2. CONSTRUCTIVE SOLID GEOMETRY (CSG) MATHEMATICAL CORE
  // =========================================================================

  /**
   * 3D Vector with full arithmetic and geometric operations
   */
  function Vector(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }
  Vector.prototype = {
    constructor: Vector,
    clone: function () { return new Vector(this.x, this.y, this.z); },
    negated: function () { return new Vector(-this.x, -this.y, -this.z); },
    add: function (a) { return new Vector(this.x + a.x, this.y + a.y, this.z + a.z); },
    sub: function (a) { return new Vector(this.x - a.x, this.y - a.y, this.z - a.z); },
    multiplyScalar: function (a) { return new Vector(this.x * a, this.y * a, this.z * a); },
    divideScalar: function (a) { return new Vector(this.x / a, this.y / a, this.z / a); },
    dot: function (a) { return this.x * a.x + this.y * a.y + this.z * a.z; },
    cross: function (a) {
      return new Vector(
        this.y * a.z - this.z * a.y,
        this.z * a.x - this.x * a.z,
        this.x * a.y - this.y * a.x
      );
    },
    length: function () { return Math.sqrt(this.dot(this)); },
    normalize: function () {
      var len = this.length();
      return len > 0 ? this.divideScalar(len) : new Vector(0, 1, 0);
    },
    lerp: function (a, t) {
      return this.add(a.sub(this).multiplyScalar(t));
    },
    distanceTo: function (a) {
      return this.sub(a).length();
    }
  };

  /**
   * Vertex representation with Position, Normal, and UV Coordinates
   */
  function Vertex(pos, normal, uv) {
    this.pos = pos instanceof Vector ? pos : new Vector(pos.x, pos.y, pos.z);
    this.normal = normal instanceof Vector ? normal : new Vector(normal ? normal.x : 0, normal ? normal.y : 1, normal ? normal.z : 0);
    this.uv = { x: uv && uv.x !== undefined ? uv.x : 0, y: uv && uv.y !== undefined ? uv.y : 0 };
  }
  Vertex.prototype = {
    constructor: Vertex,
    clone: function () {
      return new Vertex(this.pos.clone(), this.normal.clone(), { x: this.uv.x, y: this.uv.y });
    },
    flip: function () {
      this.normal = this.normal.negated();
    },
    interpolate: function (other, t) {
      return new Vertex(
        this.pos.lerp(other.pos, t),
        this.normal.lerp(other.normal, t).normalize(),
        {
          x: this.uv.x + (other.uv.x - this.uv.x) * t,
          y: this.uv.y + (other.uv.y - this.uv.y) * t
        }
      );
    }
  };

  /**
   * 3D Plane Representation (normal . x = w)
   */
  function Plane(normal, w) {
    this.normal = normal;
    this.w = w;
  }
  Plane.fromPoints = function (a, b, c) {
    var n = b.sub(a).cross(c.sub(a)).normalize();
    return new Plane(n, n.dot(a));
  };
  Plane.prototype = {
    constructor: Plane,
    clone: function () { return new Plane(this.normal.clone(), this.w); },
    flip: function () {
      this.normal = this.normal.negated();
      this.w = -this.w;
    },
    splitPolygon: function (polygon, coplanarFront, coplanarBack, front, back) {
      var COPLANAR = 0, FRONT = 1, BACK = 2, SPANNING = 3;
      var polygonType = 0;
      var types = [];
      var numVerts = polygon.vertices.length;

      for (var i = 0; i < numVerts; i++) {
        var t = this.normal.dot(polygon.vertices[i].pos) - this.w;
        var type = (t < -EPSILON) ? BACK : (t > EPSILON) ? FRONT : COPLANAR;
        polygonType |= type;
        types.push(type);
      }

      switch (polygonType) {
        case COPLANAR:
          (this.normal.dot(polygon.plane.normal) > 0 ? coplanarFront : coplanarBack).push(polygon);
          break;
        case FRONT:
          front.push(polygon);
          break;
        case BACK:
          back.push(polygon);
          break;
        case SPANNING:
          var f = [], b = [];
          for (var i = 0; i < numVerts; i++) {
            var j = (i + 1) % numVerts;
            var ti = types[i], tj = types[j];
            var vi = polygon.vertices[i], vj = polygon.vertices[j];

            if (ti !== BACK) f.push(vi);
            if (ti !== FRONT) b.push(ti !== BACK ? vi.clone() : vi);

            if ((ti | tj) === SPANNING) {
              var denom = this.normal.dot(vj.pos.sub(vi.pos));
              var t = Math.abs(denom) > 1e-10 ? (this.w - this.normal.dot(vi.pos)) / denom : 0.5;
              var clampedT = Math.max(0, Math.min(1, t));
              var v = vi.interpolate(vj, clampedT);
              f.push(v);
              b.push(v.clone());
            }
          }
          if (f.length >= 3) front.push(new Polygon(f, polygon.shared, polygon.plane));
          if (b.length >= 3) back.push(new Polygon(b, polygon.shared, polygon.plane));
          break;
      }
    }
  };

  /**
   * Convex Polygon representation with planar orientation
   */
  function Polygon(vertices, shared, plane) {
    this.vertices = vertices;
    this.shared = shared || null;
    this.plane = plane || (vertices.length >= 3 ? Plane.fromPoints(vertices[0].pos, vertices[1].pos, vertices[2].pos) : null);
  }
  Polygon.prototype = {
    constructor: Polygon,
    clone: function () {
      var verts = [];
      for (var i = 0; i < this.vertices.length; i++) {
        verts.push(this.vertices[i].clone());
      }
      return new Polygon(verts, this.shared, this.plane ? this.plane.clone() : null);
    },
    flip: function () {
      this.vertices.reverse();
      for (var i = 0; i < this.vertices.length; i++) {
        this.vertices[i].flip();
      }
      if (this.plane) this.plane.flip();
    }
  };

  /**
   * Binary Space Partitioning (BSP) Tree Node
   */
  function Node(polygons) {
    this.plane = null;
    this.front = null;
    this.back = null;
    this.polygons = [];
    if (polygons && polygons.length) this.build(polygons);
  }
  Node.prototype = {
    constructor: Node,
    clone: function () {
      var node = new Node();
      node.plane = this.plane && this.plane.clone();
      node.front = this.front && this.front.clone();
      node.back = this.back && this.back.clone();
      node.polygons = [];
      for (var i = 0; i < this.polygons.length; i++) {
        node.polygons.push(this.polygons[i].clone());
      }
      return node;
    },
    invert: function () {
      for (var i = 0; i < this.polygons.length; i++) {
        this.polygons[i].flip();
      }
      if (this.plane) this.plane.flip();
      if (this.front) this.front.invert();
      if (this.back) this.back.invert();
      var temp = this.front;
      this.front = this.back;
      this.back = temp;
    },
    clipPolygons: function (polygons) {
      if (!this.plane) return polygons.slice();
      var front = [], back = [];
      for (var i = 0; i < polygons.length; i++) {
        this.plane.splitPolygon(polygons[i], front, back, front, back);
      }
      if (this.front) front = this.front.clipPolygons(front);
      if (this.back) back = this.back.clipPolygons(back);
      else back = [];
      return front.concat(back);
    },
    clipTo: function (bsp) {
      this.polygons = bsp.clipPolygons(this.polygons);
      if (this.front) this.front.clipTo(bsp);
      if (this.back) this.back.clipTo(bsp);
    },
    allPolygons: function () {
      var list = this.polygons.slice();
      if (this.front) list = list.concat(this.front.allPolygons());
      if (this.back) list = list.concat(this.back.allPolygons());
      return list;
    },
    build: function (polygons) {
      if (!polygons || !polygons.length) return;
      if (!this.plane) this.plane = polygons[0].plane.clone();
      var front = [], back = [];
      for (var i = 0; i < polygons.length; i++) {
        this.plane.splitPolygon(polygons[i], this.polygons, this.polygons, front, back);
      }
      if (front.length) {
        if (!this.front) this.front = new Node();
        this.front.build(front);
      }
      if (back.length) {
        if (!this.back) this.back = new Node();
        this.back.build(back);
      }
    }
  };

  /**
   * High-Level Constructive Solid Geometry Wrapper
   */
  function CSG() {
    this.polygons = [];
  }
  CSG.prototype = {
    constructor: CSG,
    clone: function () {
      var csg = new CSG();
      for (var i = 0; i < this.polygons.length; i++) {
        csg.polygons.push(this.polygons[i].clone());
      }
      return csg;
    },
    toPolygons: function () {
      return this.polygons;
    },
    union: function (csg) {
      var a = new Node(this.clone().polygons);
      var b = new Node(csg.clone().polygons);
      a.clipTo(b);
      b.clipTo(a);
      b.invert();
      b.clipTo(a);
      b.invert();
      a.build(b.allPolygons());
      var result = new CSG();
      result.polygons = a.allPolygons();
      return result;
    },
    subtract: function (csg) {
      var a = new Node(this.clone().polygons);
      var b = new Node(csg.clone().polygons);
      a.invert();
      a.clipTo(b);
      b.clipTo(a);
      b.invert();
      b.clipTo(a);
      b.invert();
      a.build(b.allPolygons());
      a.invert();
      var result = new CSG();
      result.polygons = a.allPolygons();
      return result;
    },
    intersect: function (csg) {
      var a = new Node(this.clone().polygons);
      var b = new Node(csg.clone().polygons);
      a.invert();
      b.clipTo(a);
      b.invert();
      a.clipTo(b);
      b.clipTo(a);
      a.build(b.allPolygons());
      a.invert();
      var result = new CSG();
      result.polygons = a.allPolygons();
      return result;
    },
    inverse: function () {
      var csg = this.clone();
      for (var i = 0; i < csg.polygons.length; i++) {
        csg.polygons[i].flip();
      }
      return csg;
    },
    toGeometry: function () {
      var polygons = this.polygons;
      var positions = [];
      var normals = [];
      var uvs = [];

      for (var i = 0; i < polygons.length; i++) {
        var poly = polygons[i];
        var count = poly.vertices.length;
        for (var j = 2; j < count; j++) {
          var v0 = poly.vertices[0];
          var v1 = poly.vertices[j - 1];
          var v2 = poly.vertices[j];

          var tri = [v0, v1, v2];
          for (var k = 0; k < 3; k++) {
            var vert = tri[k];
            positions.push(vert.pos.x, vert.pos.y, vert.pos.z);
            normals.push(vert.normal.x, vert.normal.y, vert.normal.z);
            uvs.push(vert.uv.x, vert.uv.y);
          }
        }
      }

      if (!THREE || !THREE.BufferGeometry) {
        return {
          positions: new Float32Array(positions),
          normals: new Float32Array(normals),
          uvs: new Float32Array(uvs),
          vertexCount: positions.length / 3
        };
      }

      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.computeBoundingBox();
      geo.computeBoundingSphere();
      return geo;
    },
    toMesh: function (material) {
      var geo = this.toGeometry();
      var mat = material || (THREE ? new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        roughness: 0.2,
        metalness: 0.8
      }) : null);
      return THREE ? new THREE.Mesh(geo, mat) : geo;
    }
  };

  /**
   * Convert Three.js BufferGeometry to CSG
   */
  CSG.fromGeometry = function (geometry, matrix) {
    var geo = geometry;
    if (geo.isBufferGeometry && geo.index) {
      geo = geo.toNonIndexed();
    }
    var posAttr = geo.attributes.position;
    var normAttr = geo.attributes.normal;
    var uvAttr = geo.attributes.uv;
    var polygons = [];
    var mat = matrix || (THREE ? new THREE.Matrix4() : null);
    var normalMat = mat && THREE ? new THREE.Matrix3().getNormalMatrix(mat) : null;

    for (var i = 0; i < posAttr.count; i += 3) {
      var vertices = [];
      for (var j = 0; j < 3; j++) {
        var idx = i + j;
        var pX = posAttr.getX(idx), pY = posAttr.getY(idx), pZ = posAttr.getZ(idx);
        var nX = normAttr ? normAttr.getX(idx) : 0;
        var nY = normAttr ? normAttr.getY(idx) : 1;
        var nZ = normAttr ? normAttr.getZ(idx) : 0;

        if (mat && THREE) {
          var pVec = new THREE.Vector3(pX, pY, pZ).applyMatrix4(mat);
          pX = pVec.x; pY = pVec.y; pZ = pVec.z;
          if (normalMat) {
            var nVec = new THREE.Vector3(nX, nY, nZ).applyMatrix3(normalMat).normalize();
            nX = nVec.x; nY = nVec.y; nZ = nVec.z;
          }
        }

        var u = uvAttr ? uvAttr.getX(idx) : 0;
        var v = uvAttr ? uvAttr.getY(idx) : 0;
        vertices.push(new Vertex(new Vector(pX, pY, pZ), new Vector(nX, nY, nZ), { x: u, y: v }));
      }

      // Check triangle non-degeneracy
      var d1 = vertices[1].pos.sub(vertices[0].pos);
      var d2 = vertices[2].pos.sub(vertices[0].pos);
      var cross = d1.cross(d2);
      if (cross.length() > 1e-6) {
        polygons.push(new Polygon(vertices));
      }
    }

    var csg = new CSG();
    csg.polygons = polygons;
    return csg;
  };

  /**
   * Convert Three.js Mesh to CSG (taking world transform into account)
   */
  CSG.fromMesh = function (mesh) {
    if (mesh.updateMatrixWorld) mesh.updateMatrixWorld(true);
    var matrix = mesh.matrixWorld || mesh.matrix;
    return CSG.fromGeometry(mesh.geometry, matrix);
  };

  // =========================================================================
  // 3. MARCHING CUBES VOXEL LOOKUP TABLES (256-Configuration Complete Tables)
  // =========================================================================
  var MC_EDGE_TABLE = new Int32Array([
    0x0, 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c, 0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
    0x190, 0x99, 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c, 0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
    0x230, 0x339, 0x33, 0x13a, 0x636, 0x73f, 0x435, 0x53c, 0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
    0x3a0, 0x2a9, 0x1a3, 0xaa, 0x7a6, 0x6af, 0x5a5, 0x4ac, 0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
    0x460, 0x569, 0x663, 0x76a, 0x66, 0x16f, 0x265, 0x36c, 0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
    0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff, 0x3f5, 0x2fc, 0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
    0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55, 0x15c, 0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
    0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc, 0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
    0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc, 0xcc, 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
    0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c, 0x15c, 0x55, 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
    0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc, 0x2fc, 0x3f5, 0xff, 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
    0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c, 0x36c, 0x265, 0x16f, 0x66, 0x76a, 0x663, 0x569, 0x460,
    0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac, 0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa, 0x1a3, 0x2a9, 0x3a0,
    0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c, 0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33, 0x339, 0x230,
    0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c, 0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99, 0x190,
    0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c, 0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0
  ]);

  var MC_TRI_TABLE = new Int32Array([
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  1,  9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1,  8,  3,  9,  8,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1,  2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  1,  2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     9,  2, 10,  0,  2,  9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     2,  8,  3,  2, 10,  8, 10,  9,  8, -1, -1, -1, -1, -1, -1, -1,
     3, 11,  2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0, 11,  2,  8, 11,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1,  9,  0,  2,  3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1, 11,  2,  1,  9, 11,  9,  8, 11, -1, -1, -1, -1, -1, -1, -1,
     3, 10,  1, 11, 10,  3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0, 10,  1,  0,  8, 10,  8, 11, 10, -1, -1, -1, -1, -1, -1, -1,
     3,  9,  0,  3, 11,  9, 11, 10,  9, -1, -1, -1, -1, -1, -1, -1,
     9,  8, 10, 10,  8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     4,  7,  8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     4,  3,  0,  7,  3,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  1,  9,  8,  4,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     4,  1,  9,  4,  7,  1,  7,  3,  1, -1, -1, -1, -1, -1, -1, -1,
     1,  2, 10,  8,  4,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     3,  4,  7,  3,  0,  4,  1,  2, 10, -1, -1, -1, -1, -1, -1, -1,
     9,  2, 10,  9,  0,  2,  8,  4,  7, -1, -1, -1, -1, -1, -1, -1,
     2, 10,  9,  2,  9,  7,  2,  7,  3,  7,  9,  4, -1, -1, -1, -1,
     8,  4,  7,  3, 11,  2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    11,  4,  7, 11,  2,  4,  2,  0,  4, -1, -1, -1, -1, -1, -1, -1,
     9,  0,  1,  8,  4,  7,  2,  3, 11, -1, -1, -1, -1, -1, -1, -1,
     4,  7, 11,  9,  4, 11,  9, 11,  2,  9,  2,  1, -1, -1, -1, -1,
     3, 10,  1,  3, 11, 10,  7,  8,  4, -1, -1, -1, -1, -1, -1, -1,
     1, 11, 10,  1,  4, 11,  1,  0,  4,  7, 11,  4, -1, -1, -1, -1,
     4,  7,  8,  9,  0, 11,  9, 11, 10, 11,  0,  3, -1, -1, -1, -1,
     4,  7, 11,  4, 11,  9,  9, 11, 10, -1, -1, -1, -1, -1, -1, -1,
     9,  5,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     9,  5,  4,  0,  8,  3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  5,  4,  1,  5,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     8,  5,  4,  8,  3,  5,  3,  1,  5, -1, -1, -1, -1, -1, -1, -1,
     1,  2, 10,  9,  5,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     3,  0,  8,  1,  2, 10,  4,  9,  5, -1, -1, -1, -1, -1, -1, -1,
     5,  2, 10,  5,  4,  2,  4,  0,  2, -1, -1, -1, -1, -1, -1, -1,
     2, 10,  5,  3,  2,  5,  3,  5,  4,  3,  4,  8, -1, -1, -1, -1,
     9,  5,  4,  2,  3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0, 11,  2,  0,  8, 11,  4,  9,  5, -1, -1, -1, -1, -1, -1, -1,
     0,  5,  4,  0,  1,  5,  2,  3, 11, -1, -1, -1, -1, -1, -1, -1,
     2,  1,  5,  2,  5,  8,  2,  8, 11,  4,  8,  5, -1, -1, -1, -1,
    10,  3, 11, 10,  1,  3,  9,  5,  4, -1, -1, -1, -1, -1, -1, -1,
     4,  9,  5,  0,  8,  1,  8, 10,  1,  8, 11, 10, -1, -1, -1, -1,
     5,  4,  0,  5,  0, 11,  5, 11, 10, 11,  0,  3, -1, -1, -1, -1,
     5,  4,  8,  5,  8, 10, 10,  8, 11, -1, -1, -1, -1, -1, -1, -1,
     9,  7,  8,  5,  7,  9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     9,  3,  0,  9,  5,  3,  5,  7,  3, -1, -1, -1, -1, -1, -1, -1,
     0,  7,  8,  0,  1,  7,  1,  5,  7, -1, -1, -1, -1, -1, -1, -1,
     1,  5,  3,  3,  5,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     9,  7,  8,  9,  5,  7, 10,  1,  2, -1, -1, -1, -1, -1, -1, -1,
    10,  1,  2,  9,  5,  0,  5,  3,  0,  5,  7,  3, -1, -1, -1, -1,
     8,  0,  2,  8,  2,  5,  8,  5,  7, 10,  5,  2, -1, -1, -1, -1,
     2, 10,  5,  2,  5,  3,  3,  5,  7, -1, -1, -1, -1, -1, -1, -1,
     7,  9,  5,  7,  8,  9,  3, 11,  2, -1, -1, -1, -1, -1, -1, -1,
     9,  5,  7,  9,  7,  2,  9,  2,  0,  2,  7, 11, -1, -1, -1, -1,
     2,  3, 11,  0,  1,  8,  1,  7,  8,  1,  5,  7, -1, -1, -1, -1,
    11,  2,  1, 11,  1,  7,  7,  1,  5, -1, -1, -1, -1, -1, -1, -1,
     9,  5,  8,  8,  5,  7, 10,  1,  3, 10,  3, 11, -1, -1, -1, -1,
     5,  7,  0,  5,  0,  9,  7, 11,  0,  1,  0, 10, 11, 10,  0, -1,
    11, 10,  0, 11,  0,  3, 10,  5,  0,  8,  0,  7,  5,  7,  0, -1,
    11, 10,  5,  7, 11,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    10,  6,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  5, 10,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     9,  0,  1,  5, 10,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1,  8,  3,  1,  9,  8,  5, 10,  6, -1, -1, -1, -1, -1, -1, -1,
     1,  6,  5,  2,  6,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1,  6,  5,  1,  2,  6,  3,  0,  8, -1, -1, -1, -1, -1, -1, -1,
     9,  6,  5,  9,  0,  6,  0,  2,  6, -1, -1, -1, -1, -1, -1, -1,
     5,  9,  8,  5,  8,  2,  5,  2,  6,  3,  2,  8, -1, -1, -1, -1,
     2,  3, 11, 10,  6,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    11,  0,  8, 11,  2,  0, 10,  6,  5, -1, -1, -1, -1, -1, -1, -1,
     0,  1,  9,  2,  3, 11,  5, 10,  6, -1, -1, -1, -1, -1, -1, -1,
     5, 10,  6,  1,  9,  2,  9, 11,  2,  9,  8, 11, -1, -1, -1, -1,
     6,  3, 11,  6,  5,  3,  5,  1,  3, -1, -1, -1, -1, -1, -1, -1,
     0,  8, 11,  0, 11,  5,  0,  5,  1,  5, 11,  6, -1, -1, -1, -1,
     3, 11,  6,  0,  3,  6,  0,  6,  5,  0,  5,  9, -1, -1, -1, -1,
     6,  5,  9,  6,  9, 11, 11,  9,  8, -1, -1, -1, -1, -1, -1, -1,
     5, 10,  6,  4,  7,  8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     4,  3,  0,  4,  7,  3,  6,  5, 10, -1, -1, -1, -1, -1, -1, -1,
     1,  9,  0,  5, 10,  6,  8,  4,  7, -1, -1, -1, -1, -1, -1, -1,
    10,  6,  5,  1,  9,  7,  1,  7,  3,  7,  9,  4, -1, -1, -1, -1,
     6,  1,  2,  6,  5,  1,  4,  7,  8, -1, -1, -1, -1, -1, -1, -1,
     1,  2,  5,  5,  2,  6,  3,  0,  4,  3,  4,  7, -1, -1, -1, -1,
     8,  4,  7,  9,  0,  5,  0,  6,  5,  0,  2,  6, -1, -1, -1, -1,
     7,  3,  9,  7,  9,  4,  3,  2,  9,  5,  9,  6,  2,  6,  9, -1,
     3, 11,  2,  7,  8,  4, 10,  6,  5, -1, -1, -1, -1, -1, -1, -1,
     5, 10,  6,  4,  7,  2,  4,  2,  0,  2,  7, 11, -1, -1, -1, -1,
     0,  1,  9,  4,  7,  8,  2,  3, 11,  5, 10,  6, -1, -1, -1, -1,
     9,  2,  1,  9, 11,  2,  9,  4, 11,  7, 11,  4,  5, 10,  6, -1,
     8,  4,  7,  3, 11,  5,  3,  5,  1,  5, 11,  6, -1, -1, -1, -1,
     5,  1, 11,  5, 11,  6,  1,  0, 11,  7, 11,  4,  0,  4, 11, -1,
     0,  5,  9,  0,  6,  5,  0,  3,  6, 11,  6,  3,  8,  4,  7, -1,
     6,  5,  9,  6,  9, 11,  4,  7,  9,  7, 11,  9, -1, -1, -1, -1,
    10,  4,  9,  6,  4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     4, 10,  6,  4,  9, 10,  0,  8,  3, -1, -1, -1, -1, -1, -1, -1,
    10,  0,  1, 10,  6,  0,  6,  4,  0, -1, -1, -1, -1, -1, -1, -1,
     8,  3,  1,  8,  1,  6,  8,  6,  4,  6,  1, 10, -1, -1, -1, -1,
     1,  4,  9,  1,  2,  4,  2,  6,  4, -1, -1, -1, -1, -1, -1, -1,
     3,  0,  8,  1,  2,  9,  2,  4,  9,  2,  6,  4, -1, -1, -1, -1,
     0,  2,  4,  4,  2,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     8,  3,  2,  8,  2,  4,  4,  2,  6, -1, -1, -1, -1, -1, -1, -1,
    10,  4,  9, 10,  6,  4, 11,  2,  3, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  2,  2,  8, 11,  4,  9, 10,  4, 10,  6, -1, -1, -1, -1,
     3, 11,  2,  0,  1,  6,  0,  6,  4,  6,  1, 10, -1, -1, -1, -1,
     6,  4,  1,  6,  1, 10,  4,  8,  1,  2,  1, 11,  8, 11,  1, -1,
     9,  6,  4,  9,  3,  6,  9,  1,  3, 11,  6,  3, -1, -1, -1, -1,
     8, 11,  1,  8,  1,  0, 11,  6,  1,  9,  1,  4,  6,  4,  1, -1,
     3, 11,  6,  3,  6,  0,  0,  6,  4, -1, -1, -1, -1, -1, -1, -1,
     6,  4,  8, 11,  6,  8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     7, 10,  6,  7,  8, 10,  8,  9, 10, -1, -1, -1, -1, -1, -1, -1,
     0,  7,  3,  0, 10,  7,  0,  9, 10,  6,  7, 10, -1, -1, -1, -1,
    10,  6,  7,  1, 10,  7,  1,  7,  8,  1,  8,  0, -1, -1, -1, -1,
    10,  6,  7, 10,  7,  1,  1,  7,  3, -1, -1, -1, -1, -1, -1, -1,
     1,  2,  6,  1,  6,  8,  1,  8,  9,  8,  6,  7, -1, -1, -1, -1,
     2,  6,  9,  2,  9,  1,  6,  7,  9,  0,  9,  3,  7,  3,  9, -1,
     7,  8,  0,  7,  0,  6,  6,  0,  2, -1, -1, -1, -1, -1, -1, -1,
     7,  3,  2,  6,  7,  2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     2,  3, 11, 10,  6,  8, 10,  8,  9,  8,  6,  7, -1, -1, -1, -1,
     2,  0,  7,  2,  7, 11,  0,  9,  7,  6,  7, 10,  9, 10,  7, -1,
     1,  8,  0,  1,  7,  8,  1, 10,  7,  6,  7, 10,  2,  3, 11, -1,
    11,  2,  1, 11,  1,  7, 10,  6,  1,  6,  7,  1, -1, -1, -1, -1,
     8,  9,  6,  8,  6,  7,  9,  1,  6, 11,  6,  3,  1,  3,  6, -1,
     0,  9,  1, 11,  6,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     7,  8,  0,  7,  0,  6,  3, 11,  0, 11,  6,  0, -1, -1, -1, -1,
     7, 11,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     7,  6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     3,  0,  8, 11,  7,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  1,  9, 11,  7,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     8,  1,  9,  8,  3,  1, 11,  7,  6, -1, -1, -1, -1, -1, -1, -1,
    10,  1,  2,  6, 11,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1,  2, 10,  3,  0,  8,  6, 11,  7, -1, -1, -1, -1, -1, -1, -1,
     2,  9,  0,  2, 10,  9,  6, 11,  7, -1, -1, -1, -1, -1, -1, -1,
     6, 11,  7,  2, 10,  3, 10,  8,  3, 10,  9,  8, -1, -1, -1, -1,
     7,  2,  3,  6,  2,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     7,  0,  8,  7,  6,  0,  6,  2,  0, -1, -1, -1, -1, -1, -1, -1,
     2,  7,  6,  2,  3,  7,  0,  1,  9, -1, -1, -1, -1, -1, -1, -1,
     1,  6,  2,  1,  8,  6,  1,  9,  8,  8,  7,  6, -1, -1, -1, -1,
    10,  7,  6, 10,  1,  7,  1,  3,  7, -1, -1, -1, -1, -1, -1, -1,
    10,  7,  6,  1,  7, 10,  1,  8,  7,  1,  0,  8, -1, -1, -1, -1,
     0,  3,  7,  0,  7, 10,  0, 10,  9,  6, 10,  7, -1, -1, -1, -1,
     7,  6, 10,  7, 10,  8,  8, 10,  9, -1, -1, -1, -1, -1, -1, -1,
     6,  8,  4, 11,  8,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     3,  6, 11,  3,  0,  6,  0,  4,  6, -1, -1, -1, -1, -1, -1, -1,
     8,  6, 11,  8,  4,  6,  9,  0,  1, -1, -1, -1, -1, -1, -1, -1,
     9,  4,  6,  9,  6,  3,  9,  3,  1, 11,  3,  6, -1, -1, -1, -1,
     6,  8,  4,  6, 11,  8,  2, 10,  1, -1, -1, -1, -1, -1, -1, -1,
     1,  2, 10,  3,  0, 11,  0,  6, 11,  0,  4,  6, -1, -1, -1, -1,
     4, 11,  8,  4,  6, 11,  0,  2,  9,  2, 10,  9, -1, -1, -1, -1,
    10,  9,  3, 10,  3,  2,  9,  4,  3, 11,  3,  6,  4,  6,  3, -1,
     8,  2,  3,  8,  4,  2,  4,  6,  2, -1, -1, -1, -1, -1, -1, -1,
     0,  4,  2,  4,  6,  2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1,  9,  0,  2,  3,  4,  2,  4,  6,  4,  3,  8, -1, -1, -1, -1,
     1,  9,  4,  1,  4,  2,  2,  4,  6, -1, -1, -1, -1, -1, -1, -1,
     8,  1,  3,  8,  6,  1,  8,  4,  6,  6, 10,  1, -1, -1, -1, -1,
    10,  1,  0, 10,  0,  6,  6,  0,  4, -1, -1, -1, -1, -1, -1, -1,
     4,  6,  3,  4,  3,  8,  6, 10,  3,  0,  3,  9, 10,  9,  3, -1,
    10,  9,  4,  6, 10,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     4,  9,  5,  7,  6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  4,  9,  5, 11,  7,  6, -1, -1, -1, -1, -1, -1, -1,
     5,  0,  1,  5,  4,  0,  7,  6, 11, -1, -1, -1, -1, -1, -1, -1,
    11,  7,  6,  8,  3,  4,  3,  5,  4,  3,  1,  5, -1, -1, -1, -1,
     9,  5,  4, 10,  1,  2,  7,  6, 11, -1, -1, -1, -1, -1, -1, -1,
     6, 11,  7,  1,  2, 10,  0,  8,  3,  4,  9,  5, -1, -1, -1, -1,
     7,  6, 11,  5,  4, 10,  4,  2, 10,  4,  0,  2, -1, -1, -1, -1,
     3,  4,  8,  3,  5,  4,  3,  2,  5, 10,  5,  2, 11,  7,  6, -1,
     7,  2,  3,  7,  6,  2,  5,  4,  9, -1, -1, -1, -1, -1, -1, -1,
     9,  5,  4,  0,  8,  6,  0,  6,  2,  6,  8,  7, -1, -1, -1, -1,
     3,  6,  2,  3,  7,  6,  1,  5,  0,  5,  4,  0, -1, -1, -1, -1,
     6,  2,  8,  6,  8,  7,  2,  1,  8,  4,  8,  5,  1,  5,  8, -1,
     9,  5,  4, 10,  1,  6,  1,  7,  6,  1,  3,  7, -1, -1, -1, -1,
     1,  6, 10,  1,  7,  6,  1,  0,  7,  8,  7,  0,  9,  5,  4, -1,
     4,  0, 10,  4, 10,  5,  0,  3, 10,  6, 10,  7,  3,  7, 10, -1,
     7,  6, 10,  7, 10,  8,  5,  4, 10,  4,  8, 10, -1, -1, -1, -1,
     6,  9,  5,  6, 11,  9, 11,  8,  9, -1, -1, -1, -1, -1, -1, -1,
     3,  6, 11,  0,  6,  3,  0,  5,  6,  0,  9,  5, -1, -1, -1, -1,
     0, 11,  8,  0,  5, 11,  0,  1,  5,  5,  6, 11, -1, -1, -1, -1,
     6, 11,  3,  6,  3,  5,  5,  3,  1, -1, -1, -1, -1, -1, -1, -1,
     1,  2, 10,  9,  5, 11,  9, 11,  8, 11,  5,  6, -1, -1, -1, -1,
     0, 11,  3,  0,  6, 11,  0,  9,  6,  5,  6,  9,  1,  2, 10, -1,
    11,  8,  5, 11,  5,  6,  8,  0,  5, 10,  5,  2,  0,  2,  5, -1,
     6, 11,  3,  6,  3,  5,  2, 10,  3, 10,  5,  3, -1, -1, -1, -1,
     5,  8,  9,  5,  2,  8,  5,  6,  2,  3,  8,  2, -1, -1, -1, -1,
     9,  5,  6,  9,  6,  0,  0,  6,  2, -1, -1, -1, -1, -1, -1, -1,
     1,  5,  8,  1,  8,  0,  5,  6,  8,  3,  8,  2,  6,  2,  8, -1,
     1,  5,  6,  2,  1,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1,  3,  6,  1,  6, 10,  3,  8,  6,  5,  6,  9,  8,  9,  6, -1,
    10,  1,  0, 10,  0,  6,  9,  5,  0,  5,  6,  0, -1, -1, -1, -1,
     0,  3,  8,  5,  6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    10,  5,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    11,  5, 10,  7,  5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    11,  5, 10, 11,  7,  5,  8,  3,  0, -1, -1, -1, -1, -1, -1, -1,
     5, 11,  7,  5, 10, 11,  1,  9,  0, -1, -1, -1, -1, -1, -1, -1,
    10,  7,  5, 10, 11,  7,  9,  8,  1,  8,  3,  1, -1, -1, -1, -1,
    11,  1,  2, 11,  7,  1,  7,  5,  1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  1,  2,  7,  1,  7,  5,  7,  2, 11, -1, -1, -1, -1,
     9,  7,  5,  9,  2,  7,  9,  0,  2,  2, 11,  7, -1, -1, -1, -1,
     7,  5,  2,  7,  2, 11,  5,  9,  2,  3,  2,  8,  9,  8,  2, -1,
     2,  5, 10,  2,  3,  5,  3,  7,  5, -1, -1, -1, -1, -1, -1, -1,
     8,  2,  0,  8,  5,  2,  8,  7,  5, 10,  2,  5, -1, -1, -1, -1,
     9,  0,  1,  5, 10,  3,  5,  3,  7,  3, 10,  2, -1, -1, -1, -1,
     9,  8,  2,  9,  2,  1,  8,  7,  2, 10,  2,  5,  7,  5,  2, -1,
     1,  3,  5,  3,  7,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  7,  0,  7,  1,  1,  7,  5, -1, -1, -1, -1, -1, -1, -1,
     9,  0,  3,  9,  3,  5,  5,  3,  7, -1, -1, -1, -1, -1, -1, -1,
     9,  8,  7,  5,  9,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     5,  8,  4,  5, 10,  8, 10, 11,  8, -1, -1, -1, -1, -1, -1, -1,
     5,  0,  4,  5, 11,  0,  5, 10, 11, 11,  3,  0, -1, -1, -1, -1,
     0,  1,  9,  8,  4, 10,  8, 10, 11, 10,  4,  5, -1, -1, -1, -1,
    10, 11,  4, 10,  4,  5, 11,  3,  4,  9,  4,  1,  3,  1,  4, -1,
     2,  5,  1,  2,  8,  5,  2, 11,  8,  4,  5,  8, -1, -1, -1, -1,
     0,  4, 11,  0, 11,  3,  4,  5, 11,  2, 11,  1,  5,  1, 11, -1,
     0,  2,  5,  0,  5,  9,  2, 11,  5,  4,  5,  8, 11,  8,  5, -1,
     9,  4,  5,  2, 11,  3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     2,  5, 10,  3,  5,  2,  3,  4,  5,  3,  8,  4, -1, -1, -1, -1,
     5, 10,  2,  5,  2,  4,  4,  2,  0, -1, -1, -1, -1, -1, -1, -1,
     3, 10,  2,  3,  5, 10,  3,  8,  5,  4,  5,  8,  0,  1,  9, -1,
     5, 10,  2,  5,  2,  4,  1,  9,  2,  9,  4,  2, -1, -1, -1, -1,
     8,  4,  5,  8,  5,  3,  3,  5,  1, -1, -1, -1, -1, -1, -1, -1,
     0,  4,  5,  1,  0,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     8,  4,  5,  8,  5,  3,  9,  0,  5,  0,  3,  5, -1, -1, -1, -1,
     9,  4,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     4, 11,  7,  4,  9, 11,  9, 10, 11, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  4,  9,  7,  9, 11,  7,  9, 10, 11, -1, -1, -1, -1,
     1, 10, 11,  1, 11,  4,  1,  4,  0,  7,  4, 11, -1, -1, -1, -1,
     3,  1,  4,  3,  4,  8,  1, 10,  4,  7,  4, 11, 10, 11,  4, -1,
     4, 11,  7,  9, 11,  4,  9,  2, 11,  9,  1,  2, -1, -1, -1, -1,
     9,  7,  4,  9, 11,  7,  9,  1, 11,  2, 11,  1,  0,  8,  3, -1,
    11,  7,  4, 11,  4,  2,  2,  4,  0, -1, -1, -1, -1, -1, -1, -1,
    11,  7,  4, 11,  4,  2,  8,  3,  4,  3,  2,  4, -1, -1, -1, -1,
     2,  9, 10,  2,  7,  9,  2,  3,  7,  7,  4,  9, -1, -1, -1, -1,
     9, 10,  7,  9,  7,  4, 10,  2,  7,  8,  7,  0,  2,  0,  7, -1,
     3,  7, 10,  3, 10,  2,  7,  4, 10,  1, 10,  0,  4,  0, 10, -1,
     1, 10,  2,  8,  7,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     4,  9,  1,  4,  1,  7,  7,  1,  3, -1, -1, -1, -1, -1, -1, -1,
     4,  9,  1,  4,  1,  7,  0,  8,  1,  8,  7,  1, -1, -1, -1, -1,
     4,  0,  3,  7,  4,  3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     4,  8,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     9, 10,  8, 10, 11,  8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     3,  0,  9,  3,  9, 11, 11,  9, 10, -1, -1, -1, -1, -1, -1, -1,
     0,  1, 10,  0, 10,  8,  8, 10, 11, -1, -1, -1, -1, -1, -1, -1,
     3,  1, 10, 11,  3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1,  2, 11,  1, 11,  9,  9, 11,  8, -1, -1, -1, -1, -1, -1, -1,
     3,  0,  9,  3,  9, 11,  1,  2,  9,  2, 11,  9, -1, -1, -1, -1,
     0,  2, 11,  8,  0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     3,  2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     2,  3,  8,  2,  8, 10, 10,  8,  9, -1, -1, -1, -1, -1, -1, -1,
     9, 10,  2,  0,  9,  2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     2,  3,  8,  2,  8, 10,  0,  1,  8,  1, 10,  8, -1, -1, -1, -1,
     1, 10,  2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1,  3,  8,  9,  1,  8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  9,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  3,  8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  ]);

  // =========================================================================
  // 4. METABALL POTENTIAL FIELD GENERATOR
  // =========================================================================

  function MetaballField(options) {
    var opt = options || {};
    this.resolution = opt.resolution || 28;
    this.isolation = opt.isolation !== undefined ? opt.isolation : 20.0;
    this.bounds = opt.bounds || { min: [-2, -2, -2], max: [2, 2, 2] };
    this.blobs = opt.blobs ? opt.blobs.slice() : [];
    this.fieldFunction = opt.fieldFunction || 'wyvill'; // 'wyvill', 'inverse_square', 'gaussian'
    this.noiseEnabled = opt.noiseEnabled || false;
    this.noiseScale = opt.noiseScale || 1.5;
    this.noiseStrength = opt.noiseStrength || 0.25;
    this.noiseOctaves = opt.noiseOctaves || 2;
  }

  MetaballField.prototype = {
    constructor: MetaballField,
    addBlob: function (x, y, z, radius, strength, color, polarity) {
      this.blobs.push({
        x: x || 0,
        y: y || 0,
        z: z || 0,
        radius: radius || 1.2,
        strength: strength !== undefined ? strength : 35.0,
        color: color ? (THREE ? new THREE.Color(color) : color) : (THREE ? new THREE.Color(0x00f0ff) : 0x00f0ff),
        polarity: polarity !== undefined ? polarity : 1.0
      });
      return this;
    },
    clearBlobs: function () {
      this.blobs = [];
      return this;
    },
    evaluatePotential: function (x, y, z) {
      var pot = 0;
      var numBlobs = this.blobs.length;

      for (var i = 0; i < numBlobs; i++) {
        var b = this.blobs[i];
        var dx = x - b.x;
        var dy = y - b.y;
        var dz = z - b.z;
        var distSq = dx * dx + dy * dy + dz * dz;
        var rSq = b.radius * b.radius;

        if (this.fieldFunction === 'wyvill') {
          if (distSq < rSq) {
            var q = 1 - distSq / rSq;
            pot += (b.polarity || 1.0) * b.strength * q * q * q;
          }
        } else if (this.fieldFunction === 'gaussian') {
          var sigmaSq = (b.radius * 0.5) * (b.radius * 0.5);
          pot += (b.polarity || 1.0) * b.strength * Math.exp(-distSq / (2 * sigmaSq));
        } else {
          // Inverse square falloff
          pot += (b.polarity || 1.0) * (b.strength * rSq) / (distSq + 0.05);
        }
      }

      if (this.noiseEnabled) {
        var n = 0;
        var freq = this.noiseScale;
        var amp = this.noiseStrength * 10.0;
        for (var oct = 0; oct < this.noiseOctaves; oct++) {
          n += simplexNoise3D(x * freq, y * freq, z * freq) * amp;
          freq *= 2.0;
          amp *= 0.5;
        }
        pot += n;
      }

      return pot;
    },
    evaluateGradient: function (x, y, z) {
      var gx = 0, gy = 0, gz = 0;
      var numBlobs = this.blobs.length;

      for (var i = 0; i < numBlobs; i++) {
        var b = this.blobs[i];
        var dx = x - b.x;
        var dy = y - b.y;
        var dz = z - b.z;
        var distSq = dx * dx + dy * dy + dz * dz;
        var rSq = b.radius * b.radius;

        if (this.fieldFunction === 'wyvill') {
          if (distSq < rSq) {
            var q = 1 - distSq / rSq;
            var factor = 6.0 * (b.polarity || 1.0) * b.strength * (q * q) / rSq;
            gx += dx * factor;
            gy += dy * factor;
            gz += dz * factor;
          }
        } else if (this.fieldFunction === 'gaussian') {
          var sigmaSq = (b.radius * 0.5) * (b.radius * 0.5);
          var gFact = ((b.polarity || 1.0) * b.strength / sigmaSq) * Math.exp(-distSq / (2 * sigmaSq));
          gx += dx * gFact;
          gy += dy * gFact;
          gz += dz * gFact;
        } else {
          var denom = distSq + 0.05;
          var iFact = (2.0 * (b.polarity || 1.0) * b.strength * rSq) / (denom * denom);
          gx += dx * iFact;
          gy += dy * iFact;
          gz += dz * iFact;
        }
      }

      if (this.noiseEnabled) {
        var eps = 0.005;
        var nX = (simplexNoise3D((x + eps) * this.noiseScale, y * this.noiseScale, z * this.noiseScale) -
                  simplexNoise3D((x - eps) * this.noiseScale, y * this.noiseScale, z * this.noiseScale)) / (2 * eps);
        var nY = (simplexNoise3D(x * this.noiseScale, (y + eps) * this.noiseScale, z * this.noiseScale) -
                  simplexNoise3D(x * this.noiseScale, (y - eps) * this.noiseScale, z * this.noiseScale)) / (2 * eps);
        var nZ = (simplexNoise3D(x * this.noiseScale, y * this.noiseScale, (z + eps) * this.noiseScale) -
                  simplexNoise3D(x * this.noiseScale, y * this.noiseScale, (z - eps) * this.noiseScale)) / (2 * eps);
        gx -= nX * this.noiseStrength * 10.0;
        gy -= nY * this.noiseStrength * 10.0;
        gz -= nZ * this.noiseStrength * 10.0;
      }

      var len = Math.sqrt(gx * gx + gy * gy + gz * gz);
      if (len > 1e-6) {
        return { x: gx / len, y: gy / len, z: gz / len };
      }
      return { x: 0, y: 1, z: 0 };
    },
    generateGeometry: function () {
      var res = this.resolution;
      var res2 = res * res;
      var res3 = res2 * res;
      var field = new Float32Array(res3);
      var min = this.bounds.min;
      var max = this.bounds.max;

      var dx = (max[0] - min[0]) / (res - 1);
      var dy = (max[1] - min[1]) / (res - 1);
      var dz = (max[2] - min[2]) / (res - 1);

      var idx = 0;
      for (var k = 0; k < res; k++) {
        var z = min[2] + k * dz;
        for (var j = 0; j < res; j++) {
          var y = min[1] + j * dy;
          for (var i = 0; i < res; i++) {
            var x = min[0] + i * dx;
            field[idx++] = this.evaluatePotential(x, y, z);
          }
        }
      }

      var positions = [];
      var normals = [];
      var uvs = [];

      var vlist = new Float32Array(12 * 3);
      var isol = this.isolation;

      function getField(i, j, k) {
        return field[(k * res + j) * res + i];
      }

      function interp(offset, fx1, fy1, fz1, fx2, fy2, fz2, val1, val2) {
        var t = Math.abs(val2 - val1) > 1e-6 ? (isol - val1) / (val2 - val1) : 0.5;
        var mu = Math.max(0, Math.min(1, t));

        vlist[offset * 3 + 0] = fx1 + mu * (fx2 - fx1);
        vlist[offset * 3 + 1] = fy1 + mu * (fy2 - fy1);
        vlist[offset * 3 + 2] = fz1 + mu * (fz2 - fz1);
      }

      for (var k = 0; k < res - 1; k++) {
        var z0 = min[2] + k * dz;
        var z1 = z0 + dz;
        for (var j = 0; j < res - 1; j++) {
          var y0 = min[1] + j * dy;
          var y1 = y0 + dy;
          for (var i = 0; i < res - 1; i++) {
            var x0 = min[0] + i * dx;
            var x1 = x0 + dx;

            var f0 = getField(i, j, k);
            var f1 = getField(i + 1, j, k);
            var f2 = getField(i, j + 1, k);
            var f3 = getField(i + 1, j + 1, k);
            var f4 = getField(i, j, k + 1);
            var f5 = getField(i + 1, j, k + 1);
            var f6 = getField(i, j + 1, k + 1);
            var f7 = getField(i + 1, j + 1, k + 1);

            var cubeindex = 0;
            if (f0 < isol) cubeindex |= 1;
            if (f1 < isol) cubeindex |= 2;
            if (f3 < isol) cubeindex |= 4;
            if (f2 < isol) cubeindex |= 8;
            if (f4 < isol) cubeindex |= 16;
            if (f5 < isol) cubeindex |= 32;
            if (f7 < isol) cubeindex |= 64;
            if (f6 < isol) cubeindex |= 128;

            var bits = MC_EDGE_TABLE[cubeindex];
            if (bits === 0) continue;

            // Top of cube
            if (bits & 1) interp(0, x0, y0, z0, x1, y0, z0, f0, f1);
            if (bits & 2) interp(1, x1, y0, z0, x1, y1, z0, f1, f3);
            if (bits & 4) interp(2, x0, y1, z0, x1, y1, z0, f2, f3);
            if (bits & 8) interp(3, x0, y0, z0, x0, y1, z0, f0, f2);

            // Bottom of cube
            if (bits & 16) interp(4, x0, y0, z1, x1, y0, z1, f4, f5);
            if (bits & 32) interp(5, x1, y0, z1, x1, y1, z1, f5, f7);
            if (bits & 64) interp(6, x0, y1, z1, x1, y1, z1, f6, f7);
            if (bits & 128) interp(7, x0, y0, z1, x0, y1, z1, f4, f6);

            // Vertical edges of cube
            if (bits & 256) interp(8, x0, y0, z0, x0, y0, z1, f0, f4);
            if (bits & 512) interp(9, x1, y0, z0, x1, y0, z1, f1, f5);
            if (bits & 1024) interp(10, x1, y1, z0, x1, y1, z1, f3, f7);
            if (bits & 2048) interp(11, x0, y1, z0, x0, y1, z1, f2, f6);

            var triOffset = cubeindex << 4;
            var tIdx = 0;
            while (MC_TRI_TABLE[triOffset + tIdx] !== -1 && tIdx < 16) {
              var e1 = MC_TRI_TABLE[triOffset + tIdx];
              var e2 = MC_TRI_TABLE[triOffset + tIdx + 1];
              var e3 = MC_TRI_TABLE[triOffset + tIdx + 2];

              var edges = [e1, e2, e3];
              for (var v = 0; v < 3; v++) {
                var e = edges[v];
                var px = vlist[e * 3 + 0];
                var py = vlist[e * 3 + 1];
                var pz = vlist[e * 3 + 2];
                positions.push(px, py, pz);

                var grad = this.evaluateGradient(px, py, pz);
                normals.push(grad.x, grad.y, grad.z);

                // Spherical UV projection
                var u = 0.5 + Math.atan2(pz, px) / (2 * Math.PI);
                var vCoord = 0.5 - Math.asin(Math.max(-1, Math.min(1, py / 2.5))) / Math.PI;
                uvs.push(u, vCoord);
              }
              tIdx += 3;
            }
          }
        }
      }

      if (!THREE || !THREE.BufferGeometry) {
        return {
          positions: new Float32Array(positions),
          normals: new Float32Array(normals),
          uvs: new Float32Array(uvs),
          vertexCount: positions.length / 3
        };
      }

      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.computeBoundingBox();
      geo.computeBoundingSphere();
      return geo;
    },
    generateMesh: function (materialOptions) {
      var geo = this.generateGeometry();
      var opt = materialOptions || {};
      var mat;
      if (THREE) {
        var style = opt.style || 'liquid-metal';
        if (style === 'liquid-metal') {
          mat = new THREE.MeshPhysicalMaterial({
            color: opt.color || 0xdbeafe,
            roughness: 0.02,
            metalness: 0.98,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05
          });
        } else if (style === 'plasma-blob') {
          mat = new THREE.MeshPhysicalMaterial({
            color: opt.color || 0x00f0ff,
            emissive: opt.emissive || 0x00d4ff,
            emissiveIntensity: 0.75,
            roughness: 0.1,
            metalness: 0.5,
            transmission: 0.6,
            transparent: true,
            opacity: 0.88
          });
        } else if (style === 'bio-tissue') {
          mat = new THREE.MeshStandardMaterial({
            color: opt.color || 0xf43f5e,
            emissive: 0x881337,
            emissiveIntensity: 0.2,
            roughness: 0.35,
            metalness: 0.15
          });
        } else {
          mat = new THREE.MeshStandardMaterial({
            color: opt.color || 0x00f0ff,
            roughness: 0.2,
            metalness: 0.8
          });
        }
        return new THREE.Mesh(geo, mat);
      }
      return geo;
    },
    animate: function (time, mode) {
      var t = time || 0;
      var m = mode || 'liquid-mercury';
      var num = this.blobs.length;

      if (m === 'liquid-mercury') {
        for (var i = 0; i < num; i++) {
          var phase = (i / num) * Math.PI * 2;
          var speed = 1.0 + i * 0.2;
          this.blobs[i].x = Math.sin(t * speed + phase) * 0.75;
          this.blobs[i].y = Math.cos(t * speed * 0.8 + phase) * 0.5;
          this.blobs[i].z = Math.sin(t * speed * 1.2 + phase * 0.5) * 0.4;
        }
      } else if (m === 'plasma-core') {
        for (var i = 0; i < num; i++) {
          var angle = t * 1.5 + (i * Math.PI * 2) / num;
          var rad = 0.65 + Math.sin(t * 2.5 + i) * 0.2;
          this.blobs[i].x = Math.cos(angle) * rad;
          this.blobs[i].z = Math.sin(angle) * rad;
          this.blobs[i].y = Math.sin(t * 2.0 + i * 1.5) * 0.35;
        }
      } else if (m === 'cellular-mitosis') {
        var sep = Math.sin(t * 1.2) * 0.9;
        if (num >= 2) {
          this.blobs[0].x = -sep;
          this.blobs[1].x = sep;
        }
      }
    }
  };

  // =========================================================================
  // 5. HIGH-LEVEL CAD BOOLEAN CSG OPERATIONS & WORKFLOWS
  // =========================================================================

  /**
   * Union Boolean: Merge two or more solid meshes into a seamless manifold
   */
  function union(meshA, meshB, material) {
    var csgA = meshA.isMesh ? CSG.fromMesh(meshA) : CSG.fromGeometry(meshA);
    var csgB = meshB.isMesh ? CSG.fromMesh(meshB) : CSG.fromGeometry(meshB);
    var resultCSG = csgA.union(csgB);
    var mat = material || (meshA.material ? meshA.material.clone() : null);
    var mesh = resultCSG.toMesh(mat);
    mesh.name = (meshA.name || 'SolidA') + '_Fused_' + (meshB.name || 'SolidB');
    return mesh;
  }

  /**
   * Subtract Boolean: Carve Cutter mesh B from Base mesh A
   */
  function subtract(meshA, meshB, material) {
    var csgA = meshA.isMesh ? CSG.fromMesh(meshA) : CSG.fromGeometry(meshA);
    var csgB = meshB.isMesh ? CSG.fromMesh(meshB) : CSG.fromGeometry(meshB);
    var resultCSG = csgA.subtract(csgB);
    var mat = material || (meshA.material ? meshA.material.clone() : null);
    var mesh = resultCSG.toMesh(mat);
    mesh.name = (meshA.name || 'Base') + '_Carved';
    return mesh;
  }

  /**
   * Intersect Boolean: Extract overlapping volume of mesh A and mesh B
   */
  function intersect(meshA, meshB, material) {
    var csgA = meshA.isMesh ? CSG.fromMesh(meshA) : CSG.fromGeometry(meshA);
    var csgB = meshB.isMesh ? CSG.fromMesh(meshB) : CSG.fromGeometry(meshB);
    var resultCSG = csgA.intersect(csgB);
    var mat = material || (meshA.material ? meshA.material.clone() : null);
    var mesh = resultCSG.toMesh(mat);
    mesh.name = (meshA.name || 'SolidA') + '_Intersect_' + (meshB.name || 'SolidB');
    return mesh;
  }

  /**
   * 1-Click CAD Tool: Drill Cooling Vents / Holes
   * Creates an array of cylindrical ventilation channels carved from base mesh.
   */
  function drillVentHoles(baseMesh, options) {
    if (!THREE) throw new Error('Three.js required for drillVentHoles');
    var opt = options || {};
    var count = opt.count || 6;
    var radius = opt.radius || 0.12;
    var depth = opt.depth || 3.0;
    var pattern = opt.pattern || 'linear'; // 'linear', 'circular', 'grid', 'slot'
    var axis = opt.axis || 'z'; // 'x', 'y', 'z'
    var spacing = opt.spacing || 0.35;
    var offset = opt.offset || [0, 0, 0];

    var baseCSG = baseMesh.isMesh ? CSG.fromMesh(baseMesh) : CSG.fromGeometry(baseMesh);

    // Build compound cutter
    var cutterGroupCSG = null;

    if (pattern === 'circular') {
      var ringRadius = opt.ringRadius || 0.65;
      for (var i = 0; i < count; i++) {
        var angle = (i / count) * Math.PI * 2;
        var cx = Math.cos(angle) * ringRadius + offset[0];
        var cy = Math.sin(angle) * ringRadius + offset[1];
        var cz = offset[2];

        var cylGeo = new THREE.CylinderGeometry(radius, radius, depth, 16);
        if (axis === 'z') cylGeo.rotateX(Math.PI / 2);
        else if (axis === 'x') cylGeo.rotateZ(Math.PI / 2);

        var cylMesh = new THREE.Mesh(cylGeo);
        cylMesh.position.set(cx, cy, cz);
        cylMesh.updateMatrixWorld(true);

        var cylCSG = CSG.fromMesh(cylMesh);
        cutterGroupCSG = cutterGroupCSG ? cutterGroupCSG.union(cylCSG) : cylCSG;
      }
    } else if (pattern === 'grid') {
      var rows = opt.rows || 3;
      var cols = opt.cols || 3;
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var cx = (c - (cols - 1) / 2) * spacing + offset[0];
          var cy = (r - (rows - 1) / 2) * spacing + offset[1];
          var cz = offset[2];

          var cylGeo = new THREE.CylinderGeometry(radius, radius, depth, 14);
          if (axis === 'z') cylGeo.rotateX(Math.PI / 2);
          else if (axis === 'x') cylGeo.rotateZ(Math.PI / 2);

          var cylMesh = new THREE.Mesh(cylGeo);
          cylMesh.position.set(cx, cy, cz);
          cylMesh.updateMatrixWorld(true);

          var cylCSG = CSG.fromMesh(cylMesh);
          cutterGroupCSG = cutterGroupCSG ? cutterGroupCSG.union(cylCSG) : cylCSG;
        }
      }
    } else if (pattern === 'slot') {
      for (var i = 0; i < count; i++) {
        var cy = (i - (count - 1) / 2) * spacing + offset[1];
        var slotGeo = new THREE.BoxGeometry(opt.slotWidth || 0.8, radius * 2, depth);
        if (axis === 'x') slotGeo.rotateY(Math.PI / 2);

        var slotMesh = new THREE.Mesh(slotGeo);
        slotMesh.position.set(offset[0], cy, offset[2]);
        slotMesh.updateMatrixWorld(true);

        var slotCSG = CSG.fromMesh(slotMesh);
        cutterGroupCSG = cutterGroupCSG ? cutterGroupCSG.union(slotCSG) : slotCSG;
      }
    } else {
      // Linear array
      for (var i = 0; i < count; i++) {
        var cx = (i - (count - 1) / 2) * spacing + offset[0];
        var cy = offset[1];
        var cz = offset[2];

        var cylGeo = new THREE.CylinderGeometry(radius, radius, depth, 14);
        if (axis === 'z') cylGeo.rotateX(Math.PI / 2);
        else if (axis === 'x') cylGeo.rotateZ(Math.PI / 2);

        var cylMesh = new THREE.Mesh(cylGeo);
        cylMesh.position.set(cx, cy, cz);
        cylMesh.updateMatrixWorld(true);

        var cylCSG = CSG.fromMesh(cylMesh);
        cutterGroupCSG = cutterGroupCSG ? cutterGroupCSG.union(cylCSG) : cylCSG;
      }
    }

    var resultCSG = baseCSG.subtract(cutterGroupCSG);
    var mat = baseMesh.material ? baseMesh.material.clone() : new THREE.MeshStandardMaterial({ color: 0x00e5ff });
    var resMesh = resultCSG.toMesh(mat);
    resMesh.name = (baseMesh.name || 'Mesh') + '_Vented';
    return resMesh;
  }

  /**
   * 1-Click CAD Tool: Carve Core Cavity
   * Hollows out inner volume with optional reactor viewport / access port opening.
   */
  function carveCoreCavity(baseMesh, options) {
    if (!THREE) throw new Error('Three.js required for carveCoreCavity');
    var opt = options || {};
    var shape = opt.shape || 'sphere'; // 'sphere', 'box', 'cylinder'
    var scaleRatio = opt.scaleRatio || 0.7;
    var accessPort = opt.accessPort !== undefined ? opt.accessPort : true;
    var portRadius = opt.portRadius || 0.35;
    var portAxis = opt.portAxis || 'z';

    var baseCSG = baseMesh.isMesh ? CSG.fromMesh(baseMesh) : CSG.fromGeometry(baseMesh);

    // Compute bounding box
    var bbox = new THREE.Box3();
    if (baseMesh.isMesh) {
      baseMesh.geometry.computeBoundingBox();
      bbox.copy(baseMesh.geometry.boundingBox);
    } else {
      baseMesh.computeBoundingBox();
      bbox.copy(baseMesh.boundingBox);
    }

    var size = new THREE.Vector3();
    bbox.getSize(size);
    var center = new THREE.Vector3();
    bbox.getCenter(center);

    var cavityGeo;
    if (shape === 'box') {
      cavityGeo = new THREE.BoxGeometry(size.x * scaleRatio, size.y * scaleRatio, size.z * scaleRatio);
    } else if (shape === 'cylinder') {
      var r = Math.min(size.x, size.z) * 0.5 * scaleRatio;
      cavityGeo = new THREE.CylinderGeometry(r, r, size.y * scaleRatio, 24);
    } else {
      var avgR = Math.min(size.x, size.y, size.z) * 0.5 * scaleRatio;
      cavityGeo = new THREE.SphereGeometry(avgR, 20, 20);
    }

    var cavityMesh = new THREE.Mesh(cavityGeo);
    cavityMesh.position.copy(center);
    cavityMesh.updateMatrixWorld(true);
    var cavityCSG = CSG.fromMesh(cavityMesh);

    if (accessPort) {
      var portDepth = Math.max(size.x, size.y, size.z) * 1.5;
      var portGeo = new THREE.CylinderGeometry(portRadius, portRadius, portDepth, 20);
      if (portAxis === 'z') portGeo.rotateX(Math.PI / 2);
      else if (portAxis === 'x') portGeo.rotateZ(Math.PI / 2);

      var portMesh = new THREE.Mesh(portGeo);
      portMesh.position.copy(center);
      portMesh.updateMatrixWorld(true);
      var portCSG = CSG.fromMesh(portMesh);
      cavityCSG = cavityCSG.union(portCSG);
    }

    var resultCSG = baseCSG.subtract(cavityCSG);
    var mat = baseMesh.material ? baseMesh.material.clone() : new THREE.MeshStandardMaterial({ color: 0x00e5ff });
    var resMesh = resultCSG.toMesh(mat);
    resMesh.name = (baseMesh.name || 'Mesh') + '_HollowCore';
    return resMesh;
  }

  /**
   * Fuse Multiple Geometries into a Single Seamless Manifold
   */
  function fuseGeometries(meshList, options) {
    if (!meshList || meshList.length === 0) return null;
    if (meshList.length === 1) return meshList[0];

    var baseCSG = meshList[0].isMesh ? CSG.fromMesh(meshList[0]) : CSG.fromGeometry(meshList[0]);
    for (var i = 1; i < meshList.length; i++) {
      var nextCSG = meshList[i].isMesh ? CSG.fromMesh(meshList[i]) : CSG.fromGeometry(meshList[i]);
      baseCSG = baseCSG.union(nextCSG);
    }

    var mat = meshList[0].material ? meshList[0].material.clone() : null;
    var resultMesh = baseCSG.toMesh(mat);
    resultMesh.name = 'Fused_Composite_Manifold';
    return resultMesh;
  }

  /**
   * 1-Click CAD Tool: Chamfer Bevel Edges
   */
  function chamferBevel(baseMesh, options) {
    if (!THREE) throw new Error('Three.js required for chamferBevel');
    var opt = options || {};
    var bevelSize = opt.bevelSize || 0.15;
    var axis = opt.axis || 'y';

    var baseCSG = baseMesh.isMesh ? CSG.fromMesh(baseMesh) : CSG.fromGeometry(baseMesh);

    // Bounding Box
    var bbox = new THREE.Box3();
    if (baseMesh.isMesh) {
      baseMesh.geometry.computeBoundingBox();
      bbox.copy(baseMesh.geometry.boundingBox);
    } else {
      baseMesh.computeBoundingBox();
      bbox.copy(baseMesh.boundingBox);
    }

    var size = new THREE.Vector3();
    bbox.getSize(size);
    var center = new THREE.Vector3();
    bbox.getCenter(center);

    // 4 Corner 45° Chamfer Cutters
    var cutterCSG = null;
    var halfX = size.x * 0.5;
    var halfZ = size.z * 0.5;
    var cDist = bevelSize * 1.414;
    var cutterGeo = new THREE.BoxGeometry(cDist, size.y * 1.5, cDist);
    cutterGeo.rotateY(Math.PI / 4);

    var cornerOffsets = [
      [center.x + halfX, center.y, center.z + halfZ],
      [center.x - halfX, center.y, center.z + halfZ],
      [center.x + halfX, center.y, center.z - halfZ],
      [center.x - halfX, center.y, center.z - halfZ]
    ];

    for (var i = 0; i < cornerOffsets.length; i++) {
      var cMesh = new THREE.Mesh(cutterGeo);
      cMesh.position.set(cornerOffsets[i][0], cornerOffsets[i][1], cornerOffsets[i][2]);
      cMesh.updateMatrixWorld(true);
      var cCSG = CSG.fromMesh(cMesh);
      cutterCSG = cutterCSG ? cutterCSG.union(cCSG) : cCSG;
    }

    var resultCSG = baseCSG.subtract(cutterCSG);
    var mat = baseMesh.material ? baseMesh.material.clone() : new THREE.MeshStandardMaterial({ color: 0x00e5ff });
    var resMesh = resultCSG.toMesh(mat);
    resMesh.name = (baseMesh.name || 'Mesh') + '_Beveled';
    return resMesh;
  }

  // =========================================================================
  // 6. METABALL SCULPTOR PRESET GENERATORS
  // =========================================================================

  /**
   * Spawn Liquid Metal (T-1000 Chrome) Droplet Cluster
   */
  function createLiquidMetalSculpt(options) {
    var opt = options || {};
    var field = new MetaballField({
      resolution: opt.resolution || 30,
      isolation: opt.isolation || 22.0,
      bounds: opt.bounds || { min: [-2.2, -2.2, -2.2], max: [2.2, 2.2, 2.2] }
    });

    field.addBlob(-0.55, 0.1, 0, 1.25, 38, 0xdbeafe);
    field.addBlob(0.55, -0.1, 0.1, 1.25, 38, 0xdbeafe);
    field.addBlob(0, 0.65, -0.15, 0.95, 30, 0xdbeafe);
    field.addBlob(0.2, -0.7, 0.1, 0.85, 25, 0xdbeafe);
    field.addBlob(-0.6, -0.5, 0.2, 0.75, 22, 0xdbeafe);

    var mesh = field.generateMesh({
      style: 'liquid-metal',
      color: 0xecfeff
    });
    mesh.name = 'Liquid_Metal_Sculpt';
    mesh.userData = { isMetaballField: true, field: field, animationMode: 'liquid-mercury' };
    return mesh;
  }

  /**
   * Spawn Pulsating Plasma Energy Blob Cluster
   */
  function createPlasmaBlobSculpt(options) {
    var opt = options || {};
    var field = new MetaballField({
      resolution: opt.resolution || 28,
      isolation: opt.isolation || 18.0,
      noiseEnabled: true,
      noiseScale: 1.8,
      noiseStrength: 0.18,
      bounds: opt.bounds || { min: [-2.0, -2.0, -2.0], max: [2.0, 2.0, 2.0] }
    });

    field.addBlob(0, 0, 0, 1.35, 42, 0x00f0ff);
    field.addBlob(-0.7, 0.3, 0.2, 0.9, 28, 0xd946ef);
    field.addBlob(0.7, -0.3, -0.2, 0.9, 28, 0x00f0ff);
    field.addBlob(0, 0.8, 0.3, 0.75, 24, 0xfacc15);

    var mesh = field.generateMesh({
      style: 'plasma-blob',
      color: 0x00f0ff,
      emissive: 0x00e5ff
    });
    mesh.name = 'Plasma_Blob_Sculpt';
    mesh.userData = { isMetaballField: true, field: field, animationMode: 'plasma-core' };
    return mesh;
  }

  /**
   * Spawn Organic Cellular Biological Tissue Organoid
   */
  function createBioTissueSculpt(options) {
    var opt = options || {};
    var field = new MetaballField({
      resolution: opt.resolution || 30,
      isolation: opt.isolation || 20.0,
      noiseEnabled: true,
      noiseScale: 2.2,
      noiseStrength: 0.3,
      noiseOctaves: 3,
      bounds: opt.bounds || { min: [-2.2, -2.2, -2.2], max: [2.2, 2.2, 2.2] }
    });

    field.addBlob(-0.5, 0, 0, 1.3, 38, 0xf43f5e);
    field.addBlob(0.5, 0, 0, 1.3, 38, 0xf43f5e);
    field.addBlob(0, 0.6, 0.3, 0.9, 26, 0xfb7185);
    field.addBlob(0, -0.5, -0.3, 0.85, 24, 0xfb7185);
    field.addBlob(0.6, 0.5, -0.4, 0.65, 18, 0xf43f5e);

    var mesh = field.generateMesh({
      style: 'bio-tissue',
      color: 0xe11d48
    });
    mesh.name = 'Bio_Tissue_Sculpt';
    mesh.userData = { isMetaballField: true, field: field, animationMode: 'cellular-mitosis' };
    return mesh;
  }

  /**
   * General High-Level Metaball Spawner
   */
  function spawnMetaballs(preset, options) {
    var p = preset || 'liquid-metal';
    if (p === 'plasma-blob' || p === 'plasma') {
      return createPlasmaBlobSculpt(options);
    } else if (p === 'bio-tissue' || p === 'organic') {
      return createBioTissueSculpt(options);
    } else {
      return createLiquidMetalSculpt(options);
    }
  }

  // =========================================================================
  // 7. PUBLIC ENGINE EXPORTS
  // =========================================================================
  var Nexus3DCSG = {
    VERSION: VERSION,
    EPSILON: EPSILON,

    // Core CSG Classes
    Vector: Vector,
    Vertex: Vertex,
    Plane: Plane,
    Polygon: Polygon,
    Node: Node,
    CSG: CSG,

    // High-Level Boolean Operations
    union: union,
    subtract: subtract,
    intersect: intersect,

    // Precision CAD Boolean Workflow Tools
    drillVentHoles: drillVentHoles,
    carveCoreCavity: carveCoreCavity,
    fuseGeometries: fuseGeometries,
    chamferBevel: chamferBevel,

    // Marching Cubes & Metaballs
    MC_EDGE_TABLE: MC_EDGE_TABLE,
    MC_TRI_TABLE: MC_TRI_TABLE,
    MetaballField: MetaballField,
    simplexNoise3D: simplexNoise3D,

    // Metaball Sculptor Presets
    createLiquidMetalSculpt: createLiquidMetalSculpt,
    createPlasmaBlobSculpt: createPlasmaBlobSculpt,
    createBioTissueSculpt: createBioTissueSculpt,
    spawnMetaballs: spawnMetaballs
  };

  return Nexus3DCSG;
});
