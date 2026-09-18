/**
 * ⚡ ZOTH NEXUS 3D — Multi-Threaded Geometry Computation Web Worker & Bridge Engine
 * 
 * Offloads heavy mathematical and volumetric 3D geometry workloads to dedicated
 * Web Worker threads with zero-copy Transferable ArrayBuffer data exchange:
 * - Asynchronous Simplex noise volumetric displacement (fBm multi-octave perturbation)
 * - Asynchronous Marching Cubes 3D voxel potential field extraction (256-table isosurface generator)
 * - Asynchronous Constructive Solid Geometry (CSG) Boolean slicing and BSP tree clipping
 * - Zero-copy Transferable ArrayBuffer memory exchange (Float32Array positions, normals, uvs)
 * - Seamless Main-Thread fallback execution with identical Promise API for Node.js & non-Worker environments
 * - High-throughput Worker Pool with telemetry, error handling, and timeout safeguards
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node.js CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else {
    // Browser Global or Web Worker Global Scope
    var exports = factory();
    if (typeof self !== 'undefined') {
      self.Nexus3DWorkerBridge = exports.Nexus3DWorkerBridge;
      self.Nexus3DWorkerCore = exports.Nexus3DWorkerCore;
    }
    if (typeof window !== 'undefined') {
      window.Nexus3DWorkerBridge = exports.Nexus3DWorkerBridge;
      window.Nexus3DWorkerCore = exports.Nexus3DWorkerCore;
    }
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '2026-08-24-worker-threading-v1.0';
  var EPSILON = 1e-5;

  // =========================================================================
  // 1. MATHEMATICAL CONSTANTS & SIMPLEX NOISE ALGORITHM (Self-Contained)
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
  // 2. VOLUMETRIC SIMPLEX NOISE GEOMETRY DISPLACEMENT ALGORITHM
  // =========================================================================

  /**
   * Displaces vertex position buffers along normals with multi-octave Simplex noise
   * @param {Float32Array} positions - In/Out Flat Float32Array [x0, y0, z0, x1, y1, z1, ...]
   * @param {Float32Array|null} normals - In/Out Flat Float32Array [nx0, ny0, nz0, ...]
   * @param {Object} options - Displacement settings (frequency, amplitude, octaves, power)
   * @returns {{ positions: Float32Array, normals: Float32Array, count: number }}
   */
  function displacePositions(positions, normals, options) {
    options = options || {};
    var freq = options.frequency || 0.8;
    var amp = options.amplitude || 0.25;
    var octaves = options.octaves || 3;
    var power = options.power !== undefined ? options.power : 1.0;
    var normalOffset = options.normalOffset || 0.0;
    var recomputeNormals = options.recomputeNormals !== undefined ? options.recomputeNormals : true;

    var count = (positions.length / 3) | 0;
    var outPositions = new Float32Array(positions.length);
    outPositions.set(positions);

    var outNormals;
    if (normals && normals.length === positions.length) {
      outNormals = new Float32Array(normals.length);
      outNormals.set(normals);
    } else {
      outNormals = new Float32Array(positions.length);
      for (var i = 0; i < count; i++) {
        var idx = i * 3;
        var px = outPositions[idx], py = outPositions[idx + 1], pz = outPositions[idx + 2];
        var len = Math.sqrt(px * px + py * py + pz * pz);
        if (len > 1e-5) {
          outNormals[idx] = px / len;
          outNormals[idx + 1] = py / len;
          outNormals[idx + 2] = pz / len;
        } else {
          outNormals[idx] = 0;
          outNormals[idx + 1] = 1;
          outNormals[idx + 2] = 0;
        }
      }
    }

    for (var i = 0; i < count; i++) {
      var idx = i * 3;
      var vx = outPositions[idx];
      var vy = outPositions[idx + 1];
      var vz = outPositions[idx + 2];

      var nx = outNormals[idx];
      var ny = outNormals[idx + 1];
      var nz = outNormals[idx + 2];

      var totalNoise = 0;
      var currentFreq = freq;
      var currentAmp = amp;

      for (var o = 0; o < octaves; o++) {
        totalNoise += simplexNoise3D(vx * currentFreq, vy * currentFreq, vz * currentFreq) * currentAmp;
        currentFreq *= 2.0;
        currentAmp *= 0.5;
      }

      if (power !== 1.0) {
        totalNoise = Math.sign(totalNoise) * Math.pow(Math.abs(totalNoise), power);
      }

      var disp = totalNoise + normalOffset;
      outPositions[idx] = vx + nx * disp;
      outPositions[idx + 1] = vy + ny * disp;
      outPositions[idx + 2] = vz + nz * disp;
    }

    if (recomputeNormals && count >= 3) {
      var normalAcc = new Float32Array(positions.length);
      for (var t = 0; t < count - 2; t += 3) {
        var i0 = t * 3, i1 = (t + 1) * 3, i2 = (t + 2) * 3;

        var ax = outPositions[i1] - outPositions[i0];
        var ay = outPositions[i1 + 1] - outPositions[i0 + 1];
        var az = outPositions[i1 + 2] - outPositions[i0 + 2];

        var bx = outPositions[i2] - outPositions[i0];
        var by = outPositions[i2 + 1] - outPositions[i0 + 1];
        var bz = outPositions[i2 + 2] - outPositions[i0 + 2];

        var cx = ay * bz - az * by;
        var cy = az * bx - ax * bz;
        var cz = ax * by - ay * bx;

        var clen = Math.sqrt(cx * cx + cy * cy + cz * cz);
        if (clen > 1e-6) {
          cx /= clen; cy /= clen; cz /= clen;
          normalAcc[i0] += cx; normalAcc[i0 + 1] += cy; normalAcc[i0 + 2] += cz;
          normalAcc[i1] += cx; normalAcc[i1 + 1] += cy; normalAcc[i1 + 2] += cz;
          normalAcc[i2] += cx; normalAcc[i2 + 1] += cy; normalAcc[i2 + 2] += cz;
        }
      }

      for (var k = 0; k < count; k++) {
        var kIdx = k * 3;
        var nLen = Math.sqrt(normalAcc[kIdx]*normalAcc[kIdx] + normalAcc[kIdx+1]*normalAcc[kIdx+1] + normalAcc[kIdx+2]*normalAcc[kIdx+2]);
        if (nLen > 1e-6) {
          outNormals[kIdx] = normalAcc[kIdx] / nLen;
          outNormals[kIdx + 1] = normalAcc[kIdx + 1] / nLen;
          outNormals[kIdx + 2] = normalAcc[kIdx + 2] / nLen;
        }
      }
    }

    return {
      positions: outPositions,
      normals: outNormals,
      count: count
    };
  }

  // =========================================================================
  // 3. MARCHING CUBES VOXEL LOOKUP TABLES (256-Configuration Complete)
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
     2, 10,  8,  2,  8,  3,  4,  8, 10,  5,  4, 10, -1, -1, -1, -1,
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
     0,  5,  9,  0,  7,  5,  0,  3,  7,  8,  7,  9,  5,  6, 11, -1,
     6, 11,  4,  6,  4,  5,  9,  5,  4,  8,  4, 11, -1, -1, -1, -1,
     4,  9,  6,  4,  6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  4,  9,  6,  4,  6, 10, -1, -1, -1, -1, -1, -1, -1,
     9,  0,  1,  6, 10,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1,  8,  3,  1,  9,  8,  4,  6, 10, -1, -1, -1, -1, -1, -1, -1,
     1,  4,  9,  1,  2,  4,  2,  6,  4, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  1,  4,  9,  1,  2,  4,  2,  6,  4, -1, -1, -1, -1,
     0,  2,  4,  4,  2,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     8,  3,  2,  8,  2,  4,  4,  2,  6, -1, -1, -1, -1, -1, -1, -1,
    10,  4,  9, 10,  6,  4, 11,  2,  3, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  2,  8, 11,  2,  4,  9,  6,  4,  6, 10, -1, -1, -1, -1,
     1,  9,  0,  2,  3, 11,  4,  9,  6,  4,  6, 10, -1, -1, -1, -1,
     1,  4,  9,  1,  2,  4,  2,  6,  4,  3, 11,  8,  8, 11,  2, -1,
    11,  1,  3, 11,  6,  1,  6,  4,  1, -1, -1, -1, -1, -1, -1, -1,
     0,  8, 10,  0, 10,  1,  6,  4, 11,  8, 11, 10, -1, -1, -1, -1,
     4, 11,  6,  4,  1, 11,  4,  0,  1,  3, 11,  1, -1, -1, -1, -1,
     4, 11,  6,  4,  8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     7,  8,  6,  8, 10,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  4,  3,  7,  3,  4,  8, 10,  6, -1, -1, -1, -1, -1, -1, -1,
     0,  1,  9,  7,  8,  6,  8, 10,  6, -1, -1, -1, -1, -1, -1, -1,
     7,  3,  1,  7,  1,  6,  6,  1, 10,  8,  4,  1, -1, -1, -1, -1,
     1,  2,  4,  2,  6,  4,  7,  8, 10, -1, -1, -1, -1, -1, -1, -1,
     0,  4,  3,  7,  3,  4,  1,  2,  6,  1,  6,  8, -1, -1, -1, -1,
     7,  8,  6,  8, 10,  6,  0,  2,  4,  4,  2,  6, -1, -1, -1, -1,
     7,  3,  2,  7,  2,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     2,  3, 11,  7,  8,  6,  8, 10,  6, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  2,  8, 11,  2,  7,  8,  6,  8, 10,  6, -1, -1, -1, -1,
     2,  3, 11,  0,  1,  9,  7,  8,  6,  8, 10,  6, -1, -1, -1, -1,
     1,  9,  2,  9, 11,  2,  9,  8, 11,  7,  8,  6,  8, 10,  6, -1,
     3, 11,  6,  3,  6,  1,  1,  6, 10,  7,  8,  6, -1, -1, -1, -1,
     0,  8, 10,  0, 10,  1,  7,  8,  6,  8, 11,  6, -1, -1, -1, -1,
     3, 11,  6,  3,  6,  0,  0,  6,  7,  0,  7,  9, -1, -1, -1, -1,
     7,  8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     7, 10, 11,  5, 10,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  7, 10, 11,  5, 10,  7, -1, -1, -1, -1, -1, -1, -1,
     0,  1,  9,  7, 10, 11,  5, 10,  7, -1, -1, -1, -1, -1, -1, -1,
     1,  8,  3,  1,  9,  8,  7, 10, 11,  5, 10,  7, -1, -1, -1, -1,
     1,  2, 10,  7, 10, 11,  5, 10,  7, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  1,  2, 10,  7, 10, 11,  5, 10,  7, -1, -1, -1, -1,
     9,  2, 10,  0,  2,  9,  7, 10, 11,  5, 10,  7, -1, -1, -1, -1,
     2,  8,  3,  2, 10,  8, 10,  9,  8,  7, 10, 11,  5, 10,  7, -1,
     2,  3,  7,  2,  7, 10,  5, 10,  7, -1, -1, -1, -1, -1, -1, -1,
     0, 11,  2,  8, 11,  0,  2,  3,  7,  2,  7, 10,  5, 10,  7, -1,
     1,  9,  0,  2,  3,  7,  2,  7, 10,  5, 10,  7, -1, -1, -1, -1,
     1, 11,  2,  1,  9, 11,  9,  8, 11,  2,  3,  7,  2,  7, 10,  5,
     3, 10,  1, 11, 10,  3,  7, 10, 11,  5, 10,  7, -1, -1, -1, -1,
     0, 10,  1,  0,  8, 10,  8, 11, 10,  7, 10, 11,  5, 10,  7, -1,
     3,  9,  0,  3, 11,  9, 11, 10,  9,  7, 10, 11,  5, 10,  7, -1,
     9,  8, 10, 10,  8, 11,  7, 10, 11,  5, 10,  7, -1, -1, -1, -1,
     4,  5, 11,  5, 10, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     4,  3,  0,  7,  3,  4,  4,  5, 11,  5, 10, 11, -1, -1, -1, -1,
     0,  1,  9,  8,  4,  7,  4,  5, 11,  5, 10, 11, -1, -1, -1, -1,
     4,  1,  9,  4,  7,  1,  7,  3,  1,  4,  5, 11,  5, 10, 11, -1,
     1,  2, 10,  8,  4,  7,  4,  5, 11,  5, 10, 11, -1, -1, -1, -1,
     3,  4,  7,  3,  0,  4,  1,  2, 10,  4,  5, 11,  5, 10, 11, -1,
     9,  2, 10,  9,  0,  2,  8,  4,  7,  4,  5, 11,  5, 10, 11, -1,
     2, 10,  9,  2,  9,  7,  2,  7,  3,  7,  9,  4,  4,  5, 11,  5,
     8,  4,  7,  3, 11,  2,  4,  5, 11,  5, 10, 11, -1, -1, -1, -1,
    11,  4,  7, 11,  2,  4,  2,  0,  4,  4,  5, 11,  5, 10, 11, -1,
     9,  0,  1,  8,  4,  7,  2,  3, 11,  4,  5, 11,  5, 10, 11, -1,
     4,  7, 11,  9,  4, 11,  9, 11,  2,  9,  2,  1,  4,  5, 11,  5,
     3, 10,  1,  3, 11, 10,  7,  8,  4,  4,  5, 11,  5, 10, 11, -1,
     1, 11, 10,  1,  4, 11,  1,  0,  4,  7, 11,  4,  4,  5, 11,  5,
     4,  7,  8,  9,  0, 11,  9, 11, 10, 11,  0,  3,  4,  5, 11,  5,
     4,  7, 11,  4, 11,  9,  9, 11, 10,  4,  5, 11,  5, 10, 11, -1,
     9, 10, 11,  9, 11,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  9, 10, 11,  9, 11,  4, -1, -1, -1, -1, -1, -1, -1,
     0,  1, 11,  0, 11,  4,  1, 10, 11, -1, -1, -1, -1, -1, -1, -1,
     8,  3,  1,  8,  1,  4,  4,  1, 10,  4, 10, 11, -1, -1, -1, -1,
     1,  2,  9,  2,  4,  9,  2, 11,  4, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  1,  2,  9,  2,  4,  9,  2, 11,  4, -1, -1, -1, -1,
     0,  2, 11,  0, 11,  4,  0,  1,  2, -1, -1, -1, -1, -1, -1, -1,
     8,  3,  2,  8,  2,  4,  4,  2, 11, -1, -1, -1, -1, -1, -1, -1,
     3,  9, 10,  3, 10,  2,  3,  4,  9, -1, -1, -1, -1, -1, -1, -1,
     0,  9, 10,  0, 10,  8,  8, 10,  2,  8,  2,  3,  8,  4,  9, -1,
     1,  4,  0,  1, 10,  4,  1,  2, 10,  2,  3, 10, -1, -1, -1, -1,
     8,  4,  1,  8,  1,  2,  8,  2,  3,  4, 10,  1, -1, -1, -1, -1,
     3, 11,  9,  3,  9,  1,  1,  9,  4, -1, -1, -1, -1, -1, -1, -1,
     0,  8, 11,  0, 11,  9,  9, 11,  4,  9,  4,  1, -1, -1, -1, -1,
     0,  3, 11,  0, 11,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     8, 11,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     6,  7, 10,  7, 11, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  6,  7, 10,  7, 11, 10, -1, -1, -1, -1, -1, -1, -1,
     0,  1,  9,  6,  7, 10,  7, 11, 10, -1, -1, -1, -1, -1, -1, -1,
     1,  8,  3,  1,  9,  8,  6,  7, 10,  7, 11, 10, -1, -1, -1, -1,
     1,  2,  6,  1,  6,  7,  7,  6, 11, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  1,  2,  6,  1,  6,  7,  7,  6, 11, -1, -1, -1, -1,
     0,  2,  6,  0,  6,  9,  9,  6,  7,  7,  6, 11, -1, -1, -1, -1,
     8,  3,  2,  8,  2,  6,  8,  6,  7,  7,  6, 11, -1, -1, -1, -1,
     3,  6,  2,  3,  7,  6,  7, 10,  6, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  6,  0,  6,  2,  6,  8,  3,  6,  7, 10,  7, 11, 10, -1,
     0,  1,  9,  3,  6,  2,  3,  7,  6,  7, 10,  6, -1, -1, -1, -1,
     1,  9,  8,  1,  8,  3,  3,  6,  2,  3,  7,  6,  7, 10,  6, -1,
     1,  3,  6,  1,  6, 10,  3,  7,  6, -1, -1, -1, -1, -1, -1, -1,
     0,  8, 10,  0, 10,  1,  7,  6, 10,  8, 10,  6, -1, -1, -1, -1,
     0,  3,  7,  0,  7,  9,  9,  7,  6,  9,  6, 10, -1, -1, -1, -1,
     8, 10,  6,  8,  6,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     6,  7,  4,  6,  4,  9,  9,  4, 10, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  6,  7,  4,  6,  4,  9,  9,  4, 10, -1, -1, -1, -1,
     0,  1,  4,  1, 10,  4,  6,  7,  4, -1, -1, -1, -1, -1, -1, -1,
     8,  3,  1,  8,  1,  4,  6,  7,  4,  4,  1, 10, -1, -1, -1, -1,
     1,  2,  6,  1,  6,  4,  4,  6,  7,  9,  4,  1, -1, -1, -1, -1,
     0,  8,  3,  1,  2,  6,  1,  6,  4,  4,  6,  7,  9,  4,  1, -1,
     0,  2,  6,  0,  6,  4,  4,  6,  7, -1, -1, -1, -1, -1, -1, -1,
     8,  3,  2,  8,  2,  6,  8,  6,  4,  4,  6,  7, -1, -1, -1, -1,
     3,  6,  2,  3,  7,  6,  4,  9, 10,  4, 10,  6, -1, -1, -1, -1,
     0,  8,  3,  3,  6,  2,  3,  7,  6,  4,  9, 10,  4, 10,  6, -1,
     0,  1,  9,  3,  6,  2,  3,  7,  6,  4,  9, 10,  4, 10,  6, -1,
     1,  9,  8,  1,  8,  3,  3,  6,  2,  3,  7,  6,  4,  9, 10,  4,
     1,  3,  6,  1,  6, 10,  3,  7,  6,  4,  9, 10,  4, 10,  6, -1,
     0,  8, 10,  0, 10,  1,  7,  6, 10,  8, 10,  6,  4,  9, 10,  4,
     0,  3,  7,  0,  7,  9,  9,  7,  6,  9,  6, 10,  4,  9, 10,  4,
     6,  7,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     5, 11, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  5, 11, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  1,  9,  5, 11, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1,  8,  3,  1,  9,  8,  5, 11, 10, -1, -1, -1, -1, -1, -1, -1,
     1,  2,  5,  2, 11,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  1,  2,  5,  2, 11,  5, -1, -1, -1, -1, -1, -1, -1,
     0,  2, 11,  0, 11,  5,  0,  5,  9, -1, -1, -1, -1, -1, -1, -1,
     8,  3,  2,  8,  2, 11,  8, 11,  5, -1, -1, -1, -1, -1, -1, -1,
     3, 11,  2,  5, 11, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0, 11,  2,  8, 11,  0,  5, 11, 10, -1, -1, -1, -1, -1, -1, -1,
     1,  9,  0,  2,  3, 11,  5, 11, 10, -1, -1, -1, -1, -1, -1, -1,
     1, 11,  2,  1,  9, 11,  9,  8, 11,  5, 11, 10, -1, -1, -1, -1,
     1,  3, 11,  1, 11,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8, 11,  0, 11,  5,  0,  5,  1, -1, -1, -1, -1, -1, -1, -1,
     0,  3, 11,  0, 11,  5,  0,  5,  9, -1, -1, -1, -1, -1, -1, -1,
     8, 11,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     4,  5,  8,  5, 10,  8, 10, 11,  8, -1, -1, -1, -1, -1, -1, -1,
     4,  3,  0,  7,  3,  4,  5, 11, 10, -1, -1, -1, -1, -1, -1, -1,
     0,  1,  9,  8,  4,  7,  5, 11, 10, -1, -1, -1, -1, -1, -1, -1,
     4,  1,  9,  4,  7,  1,  7,  3,  1,  5, 11, 10, -1, -1, -1, -1,
     1,  2,  5,  2, 11,  5,  8,  4,  7, -1, -1, -1, -1, -1, -1, -1,
     3,  4,  7,  3,  0,  4,  1,  2,  5,  2, 11,  5, -1, -1, -1, -1,
     9,  2, 11,  9, 11,  5,  9,  0,  2,  8,  4,  7, -1, -1, -1, -1,
     2, 11,  5,  2,  5,  7,  2,  7,  3,  7,  9,  4, -1, -1, -1, -1,
     8,  4,  7,  3, 11,  2,  5, 11, 10, -1, -1, -1, -1, -1, -1, -1,
    11,  4,  7, 11,  2,  4,  2,  0,  4,  5, 11, 10, -1, -1, -1, -1,
     9,  0,  1,  8,  4,  7,  2,  3, 11,  5, 11, 10, -1, -1, -1, -1,
     4,  7, 11,  9,  4, 11,  9, 11,  2,  9,  2,  1,  5, 11, 10, -1,
     3, 11,  5,  3,  5,  1,  8,  4,  7, -1, -1, -1, -1, -1, -1, -1,
     1, 11,  5,  1,  0, 11,  8,  4,  7,  0,  4, 11, -1, -1, -1, -1,
     0,  3, 11,  0, 11,  5,  0,  5,  9,  8,  4,  7, -1, -1, -1, -1,
     4,  7, 11,  4, 11,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     9,  4,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  9,  4,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  1,  4,  1,  5,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     8,  3,  1,  8,  1,  5,  8,  5,  4, -1, -1, -1, -1, -1, -1, -1,
     1,  2, 10,  9,  4,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0,  8,  3,  1,  2, 10,  9,  4,  5, -1, -1, -1, -1, -1, -1, -1,
     0,  2, 10,  0, 10,  5,  0,  5,  4, -1, -1, -1, -1, -1, -1, -1,
     8,  3,  2,  8,  2, 10,  8, 10,  5,  8,  5,  4, -1, -1, -1, -1,
     3, 11,  2,  9,  4,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     0, 11,  2,  8, 11,  0,  9,  4,  5, -1, -1, -1, -1, -1, -1, -1,
     0,  1,  4,  1,  5,  4,  2,  3, 11, -1, -1, -1, -1, -1, -1, -1,
     8,  3,  1,  8,  1,  5,  8,  5,  4,  2,  3, 11, -1, -1, -1, -1,
     1,  3, 10,  3, 11, 10,  9,  4,  5, -1, -1, -1, -1, -1, -1, -1,
     0,  8, 11,  0, 11, 10,  0, 10,  1,  9,  4,  5, -1, -1, -1, -1,
     0,  3, 11,  0, 11, 10,  0, 10,  5,  0,  5,  4, -1, -1, -1, -1,
     8, 11, 10,  8, 10,  5,  8,  5,  4, -1, -1, -1, -1, -1, -1, -1,
     4,  7,  8,  9,  4,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     4,  3,  0,  7,  3,  4,  9,  4,  5, -1, -1, -1, -1, -1, -1, -1,
     0,  1,  7,  0,  7,  8,  1,  5,  7, -1, -1, -1, -1, -1, -1, -1,
     1,  5,  3,  5,  7,  3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     1,  2, 10,  4,  7,  8,  9,  4,  5, -1, -1, -1, -1, -1, -1, -1,
     3,  4,  7,  3,  0,  4,  1,  2, 10,  9,  4,  5, -1, -1, -1, -1,
     2, 10,  5,  2,  5,  0,  0,  5,  7,  0,  7,  8, -1, -1, -1, -1,
     2, 10,  5,  2,  5,  7,  2,  7,  3, -1, -1, -1, -1, -1, -1, -1,
     8,  4,  7,  3, 11,  2,  9,  4,  5, -1, -1, -1, -1, -1, -1, -1,
    11,  4,  7, 11,  2,  4,  2,  0,  4,  9,  4,  5, -1, -1, -1, -1,
     0,  1,  7,  0,  7,  8,  1,  5,  7,  2,  3, 11, -1, -1, -1, -1,
     1,  5,  7,  1,  7,  3,  2,  3, 11, -1, -1, -1, -1, -1, -1, -1,
     3, 10,  1,  3, 11, 10,  7,  8,  4,  9,  4,  5, -1, -1, -1, -1,
     1, 11, 10,  1,  4, 11,  1,  0,  4,  7, 11,  4,  9,  4,  5, -1,
     0,  3,  7,  0,  7,  5,  0,  5,  1, -1, -1, -1, -1, -1, -1, -1,
     7, 11, 10,  7, 10,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
  ]);

  // =========================================================================
  // 4. MARCHING CUBES POTENTIAL FIELD EVALUATION & VOXELIZATION
  // =========================================================================

  function evaluateField(x, y, z, blobs, fieldFunction, noiseOpt) {
    var pot = 0;
    var numBlobs = blobs ? blobs.length : 0;

    for (var i = 0; i < numBlobs; i++) {
      var b = blobs[i];
      var dx = x - b.x;
      var dy = y - b.y;
      var dz = z - b.z;
      var distSq = dx * dx + dy * dy + dz * dz;
      var rSq = b.radius * b.radius;
      var pol = b.polarity !== undefined ? b.polarity : 1.0;
      var str = b.strength !== undefined ? b.strength : 35.0;

      if (fieldFunction === 'wyvill') {
        if (distSq < rSq) {
          var q = 1.0 - distSq / rSq;
          pot += pol * str * q * q * q;
        }
      } else if (fieldFunction === 'gaussian') {
        var sigmaSq = (b.radius * 0.5) * (b.radius * 0.5);
        pot += pol * str * Math.exp(-distSq / (2.0 * sigmaSq));
      } else {
        pot += (pol * str * rSq) / (distSq + 0.05);
      }
    }

    if (noiseOpt && noiseOpt.enabled) {
      var n = 0;
      var freq = noiseOpt.scale || 1.5;
      var amp = (noiseOpt.strength !== undefined ? noiseOpt.strength : 0.25) * 10.0;
      var oct = noiseOpt.octaves || 2;
      for (var o = 0; o < oct; o++) {
        n += simplexNoise3D(x * freq, y * freq, z * freq) * amp;
        freq *= 2.0;
        amp *= 0.5;
      }
      pot += n;
    }

    return pot;
  }

  function evaluateGradient(x, y, z, blobs, fieldFunction, noiseOpt) {
    var gx = 0, gy = 0, gz = 0;
    var numBlobs = blobs ? blobs.length : 0;

    for (var i = 0; i < numBlobs; i++) {
      var b = blobs[i];
      var dx = x - b.x;
      var dy = y - b.y;
      var dz = z - b.z;
      var distSq = dx * dx + dy * dy + dz * dz;
      var rSq = b.radius * b.radius;
      var pol = b.polarity !== undefined ? b.polarity : 1.0;
      var str = b.strength !== undefined ? b.strength : 35.0;

      if (fieldFunction === 'wyvill') {
        if (distSq < rSq) {
          var q = 1.0 - distSq / rSq;
          var factor = 6.0 * pol * str * (q * q) / rSq;
          gx += dx * factor;
          gy += dy * factor;
          gz += dz * factor;
        }
      } else if (fieldFunction === 'gaussian') {
        var sigmaSq = (b.radius * 0.5) * (b.radius * 0.5);
        var gFact = ((pol * str) / sigmaSq) * Math.exp(-distSq / (2.0 * sigmaSq));
        gx += dx * gFact;
        gy += dy * gFact;
        gz += dz * gFact;
      } else {
        var denom = distSq + 0.05;
        var iFact = (2.0 * pol * str * rSq) / (denom * denom);
        gx += dx * iFact;
        gy += dy * iFact;
        gz += dz * iFact;
      }
    }

    if (noiseOpt && noiseOpt.enabled) {
      var eps = 0.005;
      var nScale = noiseOpt.scale || 1.5;
      var nAmp = (noiseOpt.strength !== undefined ? noiseOpt.strength : 0.25) * 10.0;

      var nX = (simplexNoise3D((x + eps) * nScale, y * nScale, z * nScale) -
                simplexNoise3D((x - eps) * nScale, y * nScale, z * nScale)) / (2 * eps);
      var nY = (simplexNoise3D(x * nScale, (y + eps) * nScale, z * nScale) -
                simplexNoise3D(x * nScale, (y - eps) * nScale, z * nScale)) / (2 * eps);
      var nZ = (simplexNoise3D(x * nScale, y * nScale, (z + eps) * nScale) -
                simplexNoise3D(x * nScale, y * nScale, (z - eps) * nScale)) / (2 * eps);
      gx -= nX * nAmp;
      gy -= nY * nAmp;
      gz -= nZ * nAmp;
    }

    var len = Math.sqrt(gx * gx + gy * gy + gz * gz);
    if (len > 1e-6) {
      return { x: gx / len, y: gy / len, z: gz / len };
    }
    return { x: 0, y: 1, z: 0 };
  }

  /**
   * Generates polygon mesh attributes for a 3D scalar field via Marching Cubes
   * @param {Object} options - Resolution, bounds, blobs, fieldFunction, isolation, noise
   * @returns {{ positions: Float32Array, normals: Float32Array, uvs: Float32Array, vertexCount: number }}
   */
  function generateMarchingCubes(options) {
    var opt = options || {};
    var res = opt.resolution || 28;
    var isol = opt.isolation !== undefined ? opt.isolation : 20.0;
    var bounds = opt.bounds || { min: [-2, -2, -2], max: [2, 2, 2] };
    var blobs = opt.blobs || [{ x: 0, y: 0, z: 0, radius: 1.2, strength: 35.0, polarity: 1.0 }];
    var fieldFunction = opt.fieldFunction || 'wyvill';
    var noiseOpt = {
      enabled: !!opt.noiseEnabled,
      scale: opt.noiseScale || 1.5,
      strength: opt.noiseStrength !== undefined ? opt.noiseStrength : 0.25,
      octaves: opt.noiseOctaves || 2
    };

    var min = bounds.min || [-2, -2, -2];
    var max = bounds.max || [2, 2, 2];

    var res2 = res * res;
    var res3 = res2 * res;
    var field = new Float32Array(res3);

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
          field[idx++] = evaluateField(x, y, z, blobs, fieldFunction, noiseOpt);
        }
      }
    }

    var positions = [];
    var normals = [];
    var uvs = [];
    var vlist = new Float32Array(12 * 3);

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

          // Top
          if (bits & 1) interp(0, x0, y0, z0, x1, y0, z0, f0, f1);
          if (bits & 2) interp(1, x1, y0, z0, x1, y1, z0, f1, f3);
          if (bits & 4) interp(2, x0, y1, z0, x1, y1, z0, f2, f3);
          if (bits & 8) interp(3, x0, y0, z0, x0, y1, z0, f0, f2);

          // Bottom
          if (bits & 16) interp(4, x0, y0, z1, x1, y0, z1, f4, f5);
          if (bits & 32) interp(5, x1, y0, z1, x1, y1, z1, f5, f7);
          if (bits & 64) interp(6, x0, y1, z1, x1, y1, z1, f6, f7);
          if (bits & 128) interp(7, x0, y0, z1, x0, y1, z1, f4, f6);

          // Vertical
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

              var grad = evaluateGradient(px, py, pz, blobs, fieldFunction, noiseOpt);
              normals.push(grad.x, grad.y, grad.z);

              var u = 0.5 + Math.atan2(pz, px) / (2 * Math.PI);
              var vCoord = 0.5 - Math.asin(Math.max(-1, Math.min(1, py / 2.5))) / Math.PI;
              uvs.push(u, vCoord);
            }
            tIdx += 3;
          }
        }
      }
    }

    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      vertexCount: (positions.length / 3) | 0
    };
  }

  // =========================================================================
  // 5. CONSTRUCTIVE SOLID GEOMETRY (CSG) BSP ENGINE (Self-Contained)
  // =========================================================================

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
    }
  };

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
      var res = new CSG();
      res.polygons = a.allPolygons();
      return res;
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
      var res = new CSG();
      res.polygons = a.allPolygons();
      return res;
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
      var res = new CSG();
      res.polygons = a.allPolygons();
      return res;
    },
    inverse: function () {
      var csg = this.clone();
      for (var i = 0; i < csg.polygons.length; i++) {
        csg.polygons[i].flip();
      }
      return csg;
    },
    toBuffers: function () {
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

      return {
        positions: new Float32Array(positions),
        normals: new Float32Array(normals),
        uvs: new Float32Array(uvs),
        vertexCount: (positions.length / 3) | 0
      };
    }
  };

  /**
   * Constructs CSG tree from raw Buffer Arrays (Float32Array)
   */
  CSG.fromBuffers = function (positions, normals, uvs, indices, matrixArray) {
    var polygons = [];
    var hasIndices = indices && indices.length > 0;
    var count = hasIndices ? indices.length : ((positions.length / 3) | 0);

    for (var i = 0; i < count; i += 3) {
      var vertices = [];
      for (var j = 0; j < 3; j++) {
        var vIdx = hasIndices ? indices[i + j] : (i + j);
        var pX = positions[vIdx * 3];
        var pY = positions[vIdx * 3 + 1];
        var pZ = positions[vIdx * 3 + 2];

        var nX = normals && normals.length > vIdx * 3 ? normals[vIdx * 3] : 0;
        var nY = normals && normals.length > vIdx * 3 + 1 ? normals[vIdx * 3 + 1] : 1;
        var nZ = normals && normals.length > vIdx * 3 + 2 ? normals[vIdx * 3 + 2] : 0;

        var u = uvs && uvs.length > vIdx * 2 ? uvs[vIdx * 2] : 0;
        var v = uvs && uvs.length > vIdx * 2 + 1 ? uvs[vIdx * 2 + 1] : 0;

        if (matrixArray && matrixArray.length === 16) {
          var m = matrixArray;
          var tx = m[0]*pX + m[4]*pY + m[8]*pZ + m[12];
          var ty = m[1]*pX + m[5]*pY + m[9]*pZ + m[13];
          var tz = m[2]*pX + m[6]*pY + m[10]*pZ + m[14];
          pX = tx; pY = ty; pZ = tz;

          var tnx = m[0]*nX + m[4]*nY + m[8]*nZ;
          var tny = m[1]*nX + m[5]*nY + m[9]*nZ;
          var tnz = m[2]*nX + m[6]*nY + m[10]*nZ;
          var nLen = Math.sqrt(tnx*tnx + tny*tny + tnz*tnz);
          if (nLen > 1e-6) {
            nX = tnx / nLen; nY = tny / nLen; nZ = tnz / nLen;
          }
        }

        vertices.push(new Vertex(new Vector(pX, pY, pZ), new Vector(nX, nY, nZ), { x: u, y: v }));
      }

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

  function performCSG(operation, geomA, geomB, options) {
    var csgA = CSG.fromBuffers(geomA.positions, geomA.normals, geomA.uvs, geomA.indices, geomA.matrix);
    var csgB = geomB ? CSG.fromBuffers(geomB.positions, geomB.normals, geomB.uvs, geomB.indices, geomB.matrix) : null;

    var resultCSG;
    if (operation === 'union') {
      resultCSG = csgA.union(csgB);
    } else if (operation === 'subtract') {
      resultCSG = csgA.subtract(csgB);
    } else if (operation === 'intersect') {
      resultCSG = csgA.intersect(csgB);
    } else if (operation === 'inverse') {
      resultCSG = csgA.inverse();
    } else {
      throw new Error('Unknown CSG operation: ' + operation);
    }

    return resultCSG.toBuffers();
  }

  function sliceGeometry(geom, planePoint, planeNormal) {
    var pNormal = planeNormal ? new Vector(planeNormal.x, planeNormal.y, planeNormal.z).normalize() : new Vector(0, 1, 0);
    var pPoint = planePoint ? new Vector(planePoint.x, planePoint.y, planePoint.z) : new Vector(0, 0, 0);
    var w = pNormal.dot(pPoint);

    var plane = new Plane(pNormal, w);
    var csg = CSG.fromBuffers(geom.positions, geom.normals, geom.uvs, geom.indices, geom.matrix);

    var node = new Node(csg.polygons);
    var front = [], back = [];
    var polys = node.allPolygons();

    for (var i = 0; i < polys.length; i++) {
      plane.splitPolygon(polys[i], front, back, front, back);
    }

    var frontCSG = new CSG();
    frontCSG.polygons = front;
    return frontCSG.toBuffers();
  }

  // =========================================================================
  // 6. WORKER TASK DISPATCHER & CORE ENGINE
  // =========================================================================

  var Nexus3DWorkerCore = {
    VERSION: VERSION,
    simplexNoise3D: simplexNoise3D,
    displacePositions: displacePositions,
    generateMarchingCubes: generateMarchingCubes,
    performCSG: performCSG,
    sliceGeometry: sliceGeometry,
    Vector: Vector,
    Vertex: Vertex,
    Plane: Plane,
    Polygon: Polygon,
    Node: Node,
    CSG: CSG,

    executeTask: function (message) {
      var id = message.id || ('task_' + Math.random().toString(36).substr(2, 9));
      var type = message.type;
      var payload = message.payload || {};
      var t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();

      var result;
      var transferables = [];

      switch (type) {
        case 'DISPLACE_NOISE': {
          var dispRes = displacePositions(payload.positions, payload.normals, payload.options);
          result = dispRes;
          if (result.positions && result.positions.buffer) transferables.push(result.positions.buffer);
          if (result.normals && result.normals.buffer) transferables.push(result.normals.buffer);
          break;
        }

        case 'MARCHING_CUBES': {
          var mcRes = generateMarchingCubes(payload);
          result = mcRes;
          if (result.positions && result.positions.buffer) transferables.push(result.positions.buffer);
          if (result.normals && result.normals.buffer) transferables.push(result.normals.buffer);
          if (result.uvs && result.uvs.buffer) transferables.push(result.uvs.buffer);
          break;
        }

        case 'CSG_BOOLEAN': {
          var csgRes = performCSG(payload.operation, payload.geomA, payload.geomB, payload.options);
          result = csgRes;
          if (result.positions && result.positions.buffer) transferables.push(result.positions.buffer);
          if (result.normals && result.normals.buffer) transferables.push(result.normals.buffer);
          if (result.uvs && result.uvs.buffer) transferables.push(result.uvs.buffer);
          break;
        }

        case 'CSG_SLICE': {
          var sliceRes = sliceGeometry(payload.geom, payload.planePoint, payload.planeNormal);
          result = sliceRes;
          if (result.positions && result.positions.buffer) transferables.push(result.positions.buffer);
          if (result.normals && result.normals.buffer) transferables.push(result.normals.buffer);
          if (result.uvs && result.uvs.buffer) transferables.push(result.uvs.buffer);
          break;
        }

        case 'PING': {
          result = { pong: true, timestamp: Date.now() };
          break;
        }

        default:
          throw new Error('Unsupported Nexus 3D worker task type: ' + type);
      }

      var t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();
      var durationMs = t1 - t0;
      var vertexCount = result.vertexCount || (result.positions ? (result.positions.length / 3) | 0 : 0);
      var throughput = durationMs > 0 ? (vertexCount / (durationMs / 1000)) : 0;

      return {
        id: id,
        type: 'SUCCESS',
        result: result,
        transferables: transferables,
        perf: {
          durationMs: durationMs,
          vertexCount: vertexCount,
          throughputVertsPerSec: Math.round(throughput)
        }
      };
    }
  };

  // =========================================================================
  // 7. WEB WORKER THREAD ENTRY POINT (Executed inside Worker Scope)
  // =========================================================================

  var isWorkerScope = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) ||
                      (typeof importScripts === 'function' && typeof window === 'undefined') ||
                      (typeof self !== 'undefined' && typeof window === 'undefined' && typeof self.postMessage === 'function');

  if (isWorkerScope) {
    self.onmessage = function (e) {
      var data = e.data;
      if (!data) return;

      try {
        var outcome = Nexus3DWorkerCore.executeTask(data);
        if (typeof self.postMessage === 'function') {
          self.postMessage(outcome, outcome.transferables);
        }
      } catch (err) {
        if (typeof self.postMessage === 'function') {
          self.postMessage({
            id: data.id,
            type: 'ERROR',
            error: err.message || String(err)
          });
        }
      }
    };
  }

  // =========================================================================
  // 8. MAIN THREAD CLIENT BRIDGE & WORKER POOL (Nexus3DWorkerBridge)
  // =========================================================================

  var pendingRequests = new Map();
  var workerPool = [];
  var workerPoolIndex = 0;
  var isInitialized = false;
  var workerUrl = null;
  var forceFallback = false;

  var telemetry = {
    tasksDispatched: 0,
    tasksCompleted: 0,
    tasksFailed: 0,
    totalVerticesProcessed: 0,
    totalBytesTransferred: 0,
    totalDurationMs: 0,
    fallbackInvocations: 0
  };

  function hasWorkerSupport() {
    return typeof Worker !== 'undefined' && !forceFallback;
  }

  function initWorkerPool(options) {
    options = options || {};
    forceFallback = !!options.forceFallback;
    var poolSize = options.poolSize || (typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? Math.min(4, Math.max(1, navigator.hardwareConcurrency - 1)) : 2);

    if (!hasWorkerSupport()) {
      isInitialized = true;
      return;
    }

    if (workerPool.length > 0) {
      terminate();
    }

    try {
      var scriptPath = options.workerUrl || '/studio/nexus-3d-worker.js';
      workerUrl = scriptPath;

      for (var i = 0; i < poolSize; i++) {
        var worker = new Worker(scriptPath);

        worker.onmessage = function (e) {
          handleWorkerResponse(e.data);
        };

        worker.onerror = function (err) {
          console.warn('[Nexus3DWorkerBridge] Worker error:', err);
        };

        workerPool.push(worker);
      }
      isInitialized = true;
    } catch (err) {
      console.warn('[Nexus3DWorkerBridge] Could not instantiate Web Worker pool, using main thread fallback:', err);
      workerPool = [];
      isInitialized = true;
    }
  }

  function handleWorkerResponse(response) {
    if (!response || !response.id) return;
    var req = pendingRequests.get(response.id);
    if (!req) return;

    clearTimeout(req.timeoutId);
    pendingRequests.delete(response.id);

    if (response.type === 'SUCCESS') {
      telemetry.tasksCompleted++;
      if (response.perf) {
        telemetry.totalVerticesProcessed += response.perf.vertexCount || 0;
        telemetry.totalDurationMs += response.perf.durationMs || 0;
      }
      req.resolve(response.result);
    } else {
      telemetry.tasksFailed++;
      req.reject(new Error(response.error || 'Worker task failed'));
    }
  }

  function dispatchTask(type, payload, transferables, timeoutMs) {
    telemetry.tasksDispatched++;
    var id = 'nexus_task_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    timeoutMs = timeoutMs || 30000;

    // Main thread fallback execution if worker unavailable or forced
    if (!hasWorkerSupport() || workerPool.length === 0) {
      telemetry.fallbackInvocations++;
      return new Promise(function (resolve, reject) {
        try {
          var res = Nexus3DWorkerCore.executeTask({ id: id, type: type, payload: payload });
          telemetry.tasksCompleted++;
          if (res.perf) {
            telemetry.totalVerticesProcessed += res.perf.vertexCount || 0;
            telemetry.totalDurationMs += res.perf.durationMs || 0;
          }
          resolve(res.result);
        } catch (e) {
          telemetry.tasksFailed++;
          reject(e);
        }
      });
    }

    return new Promise(function (resolve, reject) {
      var timeoutId = setTimeout(function () {
        if (pendingRequests.has(id)) {
          pendingRequests.delete(id);
          telemetry.tasksFailed++;
          reject(new Error('Worker task timeout exceeded (' + timeoutMs + 'ms) for ' + type));
        }
      }, timeoutMs);

      pendingRequests.set(id, {
        resolve: resolve,
        reject: reject,
        timeoutId: timeoutId,
        startTime: Date.now()
      });

      var worker = workerPool[workerPoolIndex % workerPool.length];
      workerPoolIndex++;

      var transferList = transferables || [];
      transferList.forEach(function (buf) {
        if (buf && buf.byteLength) telemetry.totalBytesTransferred += buf.byteLength;
      });

      try {
        worker.postMessage({ id: id, type: type, payload: payload }, transferList);
      } catch (postErr) {
        worker.postMessage({ id: id, type: type, payload: payload });
      }
    });
  }

  function terminate() {
    workerPool.forEach(function (w) {
      try { w.terminate(); } catch (e) {}
    });
    workerPool = [];
    pendingRequests.forEach(function (req) {
      clearTimeout(req.timeoutId);
      req.reject(new Error('Worker bridge terminated'));
    });
    pendingRequests.clear();
    isInitialized = false;
  }

  // =========================================================================
  // 9. HIGH-LEVEL CLIENT PROMISE API
  // =========================================================================

  var Nexus3DWorkerBridge = {
    VERSION: VERSION,

    init: function (options) {
      initWorkerPool(options);
      return this;
    },

    isWorkerSupported: function () {
      return hasWorkerSupport() && workerPool.length > 0;
    },

    setForceFallback: function (val) {
      forceFallback = !!val;
    },

    displaceNoiseAsync: function (positions, normals, options) {
      var transferables = [];
      if (positions && positions.buffer) transferables.push(positions.buffer);
      if (normals && normals.buffer) transferables.push(normals.buffer);

      return dispatchTask('DISPLACE_NOISE', {
        positions: positions,
        normals: normals,
        options: options
      }, transferables);
    },

    displaceGeometry: function (geometry, options) {
      if (!geometry || !geometry.attributes || !geometry.attributes.position) {
        return Promise.reject(new Error('Invalid BufferGeometry passed to displaceGeometry'));
      }

      var posAttr = geometry.attributes.position;
      var normAttr = geometry.attributes.normal;

      var posArray = new Float32Array(posAttr.array);
      var normArray = normAttr ? new Float32Array(normAttr.array) : null;

      return this.displaceNoiseAsync(posArray, normArray, options).then(function (res) {
        if (posAttr.array.length === res.positions.length) {
          posAttr.array.set(res.positions);
        } else if (typeof THREE !== 'undefined' && THREE.Float32BufferAttribute) {
          geometry.setAttribute('position', new THREE.Float32BufferAttribute(res.positions, 3));
        }
        posAttr.needsUpdate = true;

        if (res.normals) {
          if (normAttr && normAttr.array.length === res.normals.length) {
            normAttr.array.set(res.normals);
            normAttr.needsUpdate = true;
          } else if (typeof THREE !== 'undefined' && THREE.Float32BufferAttribute) {
            geometry.setAttribute('normal', new THREE.Float32BufferAttribute(res.normals, 3));
          }
        }

        if (geometry.computeBoundingBox) geometry.computeBoundingBox();
        if (geometry.computeBoundingSphere) geometry.computeBoundingSphere();
        return geometry;
      });
    },

    generateMarchingCubesAsync: function (options) {
      return dispatchTask('MARCHING_CUBES', options || {});
    },

    generateMarchingCubesGeometry: function (options, threeInstance) {
      var THREE_LIB = threeInstance || (typeof THREE !== 'undefined' ? THREE : null);
      return this.generateMarchingCubesAsync(options).then(function (res) {
        if (!THREE_LIB || !THREE_LIB.BufferGeometry) {
          return res;
        }
        var geo = new THREE_LIB.BufferGeometry();
        geo.setAttribute('position', new THREE_LIB.Float32BufferAttribute(res.positions, 3));
        geo.setAttribute('normal', new THREE_LIB.Float32BufferAttribute(res.normals, 3));
        geo.setAttribute('uv', new THREE_LIB.Float32BufferAttribute(res.uvs, 2));
        geo.computeBoundingBox();
        geo.computeBoundingSphere();
        return geo;
      });
    },

    performCSGAsync: function (operation, geomA, geomB, options) {
      var transferables = [];
      if (geomA.positions && geomA.positions.buffer) transferables.push(geomA.positions.buffer);
      if (geomB && geomB.positions && geomB.positions.buffer) transferables.push(geomB.positions.buffer);

      return dispatchTask('CSG_BOOLEAN', {
        operation: operation,
        geomA: geomA,
        geomB: geomB,
        options: options
      }, transferables);
    },

    performCSGGeometry: function (operation, threeGeomA, threeGeomB, options, threeInstance) {
      var THREE_LIB = threeInstance || (typeof THREE !== 'undefined' ? THREE : null);

      function extractBuffers(geom) {
        var g = geom;
        if (g.isBufferGeometry && g.index) {
          g = g.toNonIndexed();
        }
        var p = g.attributes.position ? new Float32Array(g.attributes.position.array) : new Float32Array(0);
        var n = g.attributes.normal ? new Float32Array(g.attributes.normal.array) : null;
        var u = g.attributes.uv ? new Float32Array(g.attributes.uv.array) : null;
        return { positions: p, normals: n, uvs: u };
      }

      var bA = extractBuffers(threeGeomA);
      var bB = threeGeomB ? extractBuffers(threeGeomB) : null;

      return this.performCSGAsync(operation, bA, bB, options).then(function (res) {
        if (!THREE_LIB || !THREE_LIB.BufferGeometry) {
          return res;
        }
        var geo = new THREE_LIB.BufferGeometry();
        geo.setAttribute('position', new THREE_LIB.Float32BufferAttribute(res.positions, 3));
        geo.setAttribute('normal', new THREE_LIB.Float32BufferAttribute(res.normals, 3));
        geo.setAttribute('uv', new THREE_LIB.Float32BufferAttribute(res.uvs, 2));
        geo.computeBoundingBox();
        geo.computeBoundingSphere();
        return geo;
      });
    },

    sliceGeometryAsync: function (geom, planePoint, planeNormal) {
      var transferables = [];
      if (geom.positions && geom.positions.buffer) transferables.push(geom.positions.buffer);

      return dispatchTask('CSG_SLICE', {
        geom: geom,
        planePoint: planePoint,
        planeNormal: planeNormal
      }, transferables);
    },

    runBenchmark: function (options) {
      options = options || {};
      var vertexCount = options.vertexCount || 10000;
      var positions = new Float32Array(vertexCount * 3);
      var normals = new Float32Array(vertexCount * 3);

      for (var i = 0; i < vertexCount; i++) {
        var idx = i * 3;
        positions[idx] = (Math.random() - 0.5) * 10;
        positions[idx + 1] = (Math.random() - 0.5) * 10;
        positions[idx + 2] = (Math.random() - 0.5) * 10;
        normals[idx] = 0; normals[idx + 1] = 1; normals[idx + 2] = 0;
      }

      var selfBridge = this;
      var t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();

      return selfBridge.displaceNoiseAsync(positions, normals, { octaves: 4, frequency: 1.2, amplitude: 0.5 })
        .then(function (dispRes) {
          var t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();
          var dispTime = t1 - t0;

          var mcT0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
          return selfBridge.generateMarchingCubesAsync({ resolution: 24, isolation: 20.0, noiseEnabled: true })
            .then(function (mcRes) {
              var mcT1 = typeof performance !== 'undefined' ? performance.now() : Date.now();
              var mcTime = mcT1 - mcT0;

              return {
                status: 'PASSED',
                displacement: {
                  vertexCount: vertexCount,
                  durationMs: parseFloat(dispTime.toFixed(2)),
                  throughputVertsPerSec: Math.round(vertexCount / (dispTime / 1000))
                },
                marchingCubes: {
                  vertexCount: mcRes.vertexCount,
                  durationMs: parseFloat(mcTime.toFixed(2)),
                  throughputVertsPerSec: Math.round(mcRes.vertexCount / (mcTime / 1000))
                },
                isMultiThreaded: selfBridge.isWorkerSupported(),
                telemetry: selfBridge.getStats()
              };
            });
        });
    },

    getStats: function () {
      var avgMs = telemetry.tasksCompleted > 0 ? (telemetry.totalDurationMs / telemetry.tasksCompleted) : 0;
      return {
        tasksDispatched: telemetry.tasksDispatched,
        tasksCompleted: telemetry.tasksCompleted,
        tasksFailed: telemetry.tasksFailed,
        totalVerticesProcessed: telemetry.totalVerticesProcessed,
        totalBytesTransferred: telemetry.totalBytesTransferred,
        avgDurationMs: parseFloat(avgMs.toFixed(2)),
        activeWorkers: workerPool.length,
        fallbackInvocations: telemetry.fallbackInvocations,
        mode: workerPool.length > 0 ? 'multi-threaded-worker' : 'main-thread-fallback'
      };
    },

    terminate: terminate
  };

  return {
    Nexus3DWorkerBridge: Nexus3DWorkerBridge,
    Nexus3DWorkerCore: Nexus3DWorkerCore
  };
});
