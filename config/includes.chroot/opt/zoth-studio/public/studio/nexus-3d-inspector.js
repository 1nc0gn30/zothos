/**
 * ⚡ ZOTH NEXUS 3D — Mathematical CAD Inspector & Live Parameter Node Engine
 * 
 * High-performance real-time parametric CAD parameter inspector, live equation editor,
 * mathematical formula evaluator, and sacred geometry telemetry synthesizer for Three.js.
 * 
 * Features:
 * 1. Superquadric Equation Inspector & Generator:
 *    - Parametric exponents s1, s2, radii rx, ry, rz
 *    - Modifiers: Axial Tapering (k_taper), Waist Pinching (k_pinch), Curvature Bending (k_bend)
 *    - Curvature & topology classification (Astroid, Octahedroid, Boxoid, Cylindroid, Ellipsoid)
 * 2. Involute Gear Formula Inspector & Generator:
 *    - Module m, Teeth N, Pressure Angle alpha, Addendum, Dedendum, Backlash, Axle Keyway
 *    - Pitch, Base, Root, Addendum diameters, Circular pitch, Involute function inv(alpha)
 *    - Precision 3D keyed gear solid with inner bore and keyway notch
 * 3. Calabi-Yau 6D Manifold Inspector & Generator:
 *    - Complex exponent n, multi-sheet count k_max, 4D-to-3D projection angles (alpha, beta, gamma, delta)
 *    - Topological invariants: Euler characteristic chi = 2(h^{1,1} - h^{2,1}), Hodge numbers, SU(3) holonomy
 * 4. Torus Knot Parametric Inspector & Generator:
 *    - p, q windings, major radius R, tube radius r, harmonic modulation amplitude & frequency
 *    - Topological classification (Trefoil, Cinquefoil, Septafoil, Links, Unknot), arc length, crossing number
 * 5. Sacred Geometry & Physical Telemetry Breakdown:
 *    - Signed tetrahedral mesh volume V = 1/6 sum(v1 . (v2 x v3)) (Divergence theorem)
 *    - Exact surface area, center of mass / centroid, bounding box
 *    - Bounding mass across 10 material densities (Titanium, Gold, Carbon Fiber, Glass, Steel, etc.)
 *    - Golden ratio Phi breakdown: aspect ratios, Phi proximity score, Fibonacci alignment
 *    - Sacred Harmonic Resonance Frequencies: 432 Hz (Verdi), 528 Hz (Transformation/MI), 888 Hz (Christ Harmonic)
 * 6. Live Formula Parser & Safe Evaluator:
 *    - Real-time custom parametric surface generation: x(u, v, t), y(u, v, t), z(u, v, t)
 *    - Rich mathematical functions, implicit multiplication, constants (pi, e, phi, tau)
 *    - Built-in parametric presets: Enneper, Dini Pseudosphere, Bohemian Dome, Roman Steiner, Apple, Clifford Torus, Seashell, Trefoil Ribbon
 *    - Instant mesh generation with automatic normals, UVs, and vertex bounds
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
    root.Nexus3DInspector = factory(root.THREE);
  }
})(typeof self !== 'undefined' ? self : this, function (THREE) {
  'use strict';

  var VERSION = '2026-08-24-inspector-v1.0';

  // =========================================================================
  // 1. MATHEMATICAL CONSTANTS & SACRED HARMONIC PHYSICS
  // =========================================================================
  var PHI = (1.0 + Math.sqrt(5.0)) / 2.0; // Golden Ratio Φ ≈ 1.618033988749895
  var PHI_INV = 1.0 / PHI; // 0.618033988749895
  var GOLDEN_ANGLE = Math.PI * (3.0 - Math.sqrt(5.0)); // ≈ 2.3999632 rad (137.507764°)
  var TAU = Math.PI * 2.0;

  // Sacred Harmonic Resonance Frequencies (Hz)
  var SACRED_FREQUENCIES = {
    VERDI_432: 432,       // Natural harmonic tuning & cosmic vibration (A=432Hz)
    SOLFEGGIO_528: 528,   // Transformation, DNA repair & Miracle frequency (MI=528Hz)
    COSMIC_888: 888,      // Higher Octave Harmonic / Christ consciousness frequency
    UT_396: 396,          // Liberating Guilt & Fear
    RE_417: 417,          // Undoing Situations & Facilitating Change
    FA_639: 639,          // Connecting Relationships
    SOL_741: 741,         // Awakening Intuition
    LA_852: 852,          // Returning to Spiritual Order
    SI_963: 963           // Pure Higher Transcendence
  };

  // Material Densities (g/cm^3) for Precision CAD Mass Calculation
  var MATERIAL_DENSITIES = {
    titanium: 4.506,       // Grade 5 Titanium (Ti-6Al-4V)
    gold: 19.320,          // 24K Pure Sacred Gold
    azoth_gold: 19.320,    // 24K Alchemical Gold Leaf
    amber: 1.080,          // Natural Baltic Amber Resin
    carbon_fiber: 1.600,   // Toray T1000 Carbon Composite
    glass: 2.500,          // Borosilicate Optical Glass
    steel: 7.850,          // Structural Damascus Tool Steel
    aluminum: 2.700,       // Aerospace 7075-T6 Aluminum
    copper: 8.960,         // High-conductivity Tellurium Copper
    silver: 10.490,        // Pure Sterling Silver
    silicon: 2.330,        // Semiconductor Grade Monocrystalline Silicon
    obsidian: 2.450,       // Volcanic Obsidian Glass
    obsidian_matte: 2.450, // Velvet Obsidian Matte / Carbon
    hologram_grid: 0.001,  // Photonic Lattice Matrix Medium
    neon_wireframe: 1.200, // Electroluminescent CAD Array
    bioluminescent_pulse: 1.040 // Organic Cellular Bioluminescent Matrix
  };

  // Speed of Sound in Air at 20°C (m/s)
  var SPEED_OF_SOUND_AIR = 343.2;

  // =========================================================================
  // 2. SIMPLEX NOISE (Zero-Dependency 3D Permutation Noise for Formulas)
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
    for (var i = 0; i < 256; i++) {
      pTable[i] = src[i];
      pTable[256 + i] = src[i];
    }
    for (var j = 0; j < 512; j++) {
      permMod12[j] = (pTable[j & 255] % 12);
    }
  })();

  var grad3 = new Float32Array([
    1,1,0, -1,1,0, 1,-1,0, -1,-1,0,
    1,0,1, -1,0,1, 1,0,-1, -1,0,-1,
    0,1,1, 0,-1,1, 0,1,-1, 0,-1,-1
  ]);

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
    var x2 = x0 - i2 + 2.0 * G3, y2 = y0 - j2 + 2.0 * G3, z2 = z0 - k2 + 2.0 * G3;
    var x3 = x0 - 1.0 + 3.0 * G3, y3 = y0 - 1.0 + 3.0 * G3, z3 = z0 - 1.0 + 3.0 * G3;

    var ii = i & 255, jj = j & 255, kk = k & 255;
    var gi0 = permMod12[ii + pTable[jj + pTable[kk]]] * 3;
    var gi1 = permMod12[ii + i1 + pTable[jj + j1 + pTable[kk + k1]]] * 3;
    var gi2 = permMod12[ii + i2 + pTable[jj + j2 + pTable[kk + k2]]] * 3;
    var gi3 = permMod12[ii + 1 + pTable[jj + 1 + pTable[kk + 1]]] * 3;

    var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if (t0 < 0) n0 = 0.0;
    else { t0 *= t0; n0 = t0 * t0 * (grad3[gi0]*x0 + grad3[gi0+1]*y0 + grad3[gi0+2]*z0); }

    var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if (t1 < 0) n1 = 0.0;
    else { t1 *= t1; n1 = t1 * t1 * (grad3[gi1]*x1 + grad3[gi1+1]*y0 + grad3[gi1+2]*z1); }

    var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if (t2 < 0) n2 = 0.0;
    else { t2 *= t2; n2 = t2 * t2 * (grad3[gi2]*x2 + grad3[gi2+1]*y2 + grad3[gi2+2]*z2); }

    var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if (t3 < 0) n3 = 0.0;
    else { t3 *= t3; n3 = t3 * t3 * (grad3[gi3]*x3 + grad3[gi3+1]*y3 + grad3[gi3+2]*z3); }

    return 32.0 * (n0 + n1 + n2 + n3);
  }

  // =========================================================================
  // 3. AUXILIARY MATHEMATICAL FUNCTIONS
  // =========================================================================
  function signedPow(val, exp) {
    if (val === 0) return 0;
    var s = val < 0 ? -1 : 1;
    return s * Math.pow(Math.abs(val), exp);
  }

  function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
      var t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  // =========================================================================
  // 4. SUPERQUADRIC EQUATION INSPECTOR & GENERATOR
  // =========================================================================

  /**
   * Generates a parametric Superquadric BufferGeometry with tapering, pinching, and bending.
   * Equation:
   *   x(u, v) = rx * sgn(cos u)|cos u|^s1 * sgn(cos v)|cos v|^s2
   *   y(u, v) = ry * sgn(sin u)|sin u|^s1
   *   z(u, v) = rz * sgn(cos u)|cos u|^s1 * sgn(sin v)|sin v|^s2
   * Modifiers:
   *   - Tapering k_taper: scale x, z by (1 + k_taper * (y/ry))
   *   - Pinching k_pinch: scale x, z by (1 - k_pinch * (1 - (y/ry)^2))
   *   - Bending k_bend:   bend along y with curvature radius R = 1/k_bend
   */
  function createSuperquadricGeometry(options) {
    options = options || {};
    var s1 = options.s1 !== undefined ? Math.max(0.01, options.s1) : 0.3;
    var s2 = options.s2 !== undefined ? Math.max(0.01, options.s2) : 0.3;
    var rx = options.radiusX || options.radius || 1.2;
    var ry = options.radiusY || options.radius || 1.8;
    var rz = options.radiusZ || options.radius || 1.2;
    var segU = Math.max(8, options.segmentsU || 32);
    var segV = Math.max(8, options.segmentsV || 32);
    var taper = options.taper !== undefined ? options.taper : (options.k_taper || 0.0);
    var pinch = options.pinch !== undefined ? options.pinch : (options.k_pinch || 0.0);
    var bend = options.bend !== undefined ? options.bend : (options.k_bend || 0.0);

    var positions = [];
    var uvs = [];
    var indices = [];

    for (var i = 0; i <= segU; i++) {
      var u = -Math.PI / 2.0 + (i / segU) * Math.PI;
      var cu = signedPow(Math.cos(u), s1);
      var su = signedPow(Math.sin(u), s1);

      for (var j = 0; j <= segV; j++) {
        var v = -Math.PI + (j / segV) * (2.0 * Math.PI);
        var cv = signedPow(Math.cos(v), s2);
        var sv = signedPow(Math.sin(v), s2);

        var x0 = rx * cu * cv;
        var y0 = ry * su;
        var z0 = rz * cu * sv;

        var yn = ry !== 0 ? (y0 / ry) : 0;

        // Axial Tapering
        if (taper !== 0) {
          var tFactor = Math.max(0.001, 1.0 + taper * yn);
          x0 *= tFactor;
          z0 *= tFactor;
        }

        // Waist Pinching
        if (pinch !== 0) {
          var pFactor = Math.max(0.001, 1.0 - pinch * (1.0 - yn * yn));
          x0 *= pFactor;
          z0 *= pFactor;
        }

        // Radial Bending
        if (bend !== 0) {
          var theta = bend * yn;
          var R = 1.0 / bend;
          y0 = R * Math.sin(theta) * ry;
          x0 = x0 + (R - R * Math.cos(theta)) * (bend > 0 ? 1 : -1);
        }

        positions.push(x0, y0, z0);
        uvs.push(j / segV, i / segU);
      }
    }

    for (var i2 = 0; i2 < segU; i2++) {
      for (var j2 = 0; j2 < segV; j2++) {
        var a = i2 * (segV + 1) + j2;
        var b = (i2 + 1) * (segV + 1) + j2;
        var c = (i2 + 1) * (segV + 1) + (j2 + 1);
        var d = i2 * (segV + 1) + (j2 + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    geo.userData = {
      type: 'Superquadric',
      parameters: { s1: s1, s2: s2, radiusX: rx, radiusY: ry, radiusZ: rz, taper: taper, pinch: pinch, bend: bend, segmentsU: segU, segmentsV: segV }
    };

    return geo;
  }

  /**
   * Mathematical Inspector for Superquadrics.
   * Returns classification, analytical properties, LaTeX formulas, and parameter telemetry.
   */
  function inspectSuperquadric(options) {
    options = options || {};
    var s1 = options.s1 !== undefined ? options.s1 : 0.3;
    var s2 = options.s2 !== undefined ? options.s2 : 0.3;
    var rx = options.radiusX || options.radius || 1.2;
    var ry = options.radiusY || options.radius || 1.8;
    var rz = options.radiusZ || options.radius || 1.2;
    var taper = options.taper !== undefined ? options.taper : (options.k_taper || 0.0);
    var pinch = options.pinch !== undefined ? options.pinch : (options.k_pinch || 0.0);
    var bend = options.bend !== undefined ? options.bend : (options.k_bend || 0.0);

    var classification = 'General Superellipsoid';
    if (s1 < 0.5 && s2 < 0.5) classification = 'Hyper-Chamfered Boxoid / Monolith';
    else if (s1 > 1.5 && s2 > 1.5) classification = 'Astroid / Octahedral Star';
    else if (Math.abs(s1 - 1.0) < 0.05 && Math.abs(s2 - 1.0) < 0.05) classification = 'Standard Ellipsoid';
    else if (s1 < 0.5 && Math.abs(s2 - 1.0) < 0.05) classification = 'Cylindroid Pill / Capsule';
    else if (s1 > 1.5 && s2 < 0.5) classification = 'Bipyramidal Prism';

    var volumeFactor = Math.pow(Math.min(2.0, 2.0 / (s1 + 1.0)), 0.8) * Math.pow(Math.min(2.0, 2.0 / (s2 + 1.0)), 0.8);
    var approxVolume = (4.0 / 3.0) * Math.PI * rx * ry * rz * (volumeFactor / 1.5);

    var formulaLatex = {
      x: 'x(u,v) = r_x \\cdot \\text{sgn}(\\cos u)|\\cos u|^{s_1} \\cdot \\text{sgn}(\\cos v)|\\cos v|^{s_2} \\cdot f_{\\text{taper}}(y) \\cdot f_{\\text{pinch}}(y)',
      y: 'y(u,v) = r_y \\cdot \\text{sgn}(\\sin u)|\\sin u|^{s_1}',
      z: 'z(u,v) = r_z \\cdot \\text{sgn}(\\cos u)|\\cos u|^{s_1} \\cdot \\text{sgn}(\\sin v)|\\sin v|^{s_2} \\cdot f_{\\text{taper}}(y) \\cdot f_{\\text{pinch}}(y)',
      taper: 'f_{\\text{taper}}(y) = 1 + k_{\\text{taper}} \\cdot \\left(\\frac{y}{r_y}\\right)',
      pinch: 'f_{\\text{pinch}}(y) = 1 - k_{\\text{pinch}} \\cdot \\left(1 - \\left(\\frac{y}{r_y}\\right)^2\\right)',
      bend: 'R = \\frac{1}{k_{\\text{bend}}}, \\quad \\theta = k_{\\text{bend}} \\cdot \\left(\\frac{y}{r_y}\\right)'
    };

    return {
      type: 'Superquadric',
      classification: classification,
      parameters: { s1: s1, s2: s2, radiusX: rx, radiusY: ry, radiusZ: rz, taper: taper, pinch: pinch, bend: bend },
      formulas: formulaLatex,
      approxVolume: approxVolume,
      activeModifiers: {
        tapering: taper !== 0 ? (taper > 0 ? 'Expansive Upward (+)' : 'Conical Taper (-)') : 'None',
        pinching: pinch !== 0 ? (pinch > 0 ? 'Hourglass Waist' : 'Spherical Bulge') : 'None',
        bending: bend !== 0 ? (bend > 0 ? 'Rightward Arc' : 'Leftward Arc') : 'None'
      }
    };
  }

  // =========================================================================
  // 5. INVOLUTE GEAR FORMULA INSPECTOR & GENERATOR
  // =========================================================================

  /**
   * Generates a precision 3D CAD Involute Gear geometry with keyed axle bore.
   */
  function createInvoluteGearGeometry(options) {
    options = options || {};
    var numTeeth = Math.max(4, Math.round(options.numTeeth || options.teeth || 16));
    var m = options.m || options.module || 0.25; // Module
    var pressureAngleDeg = options.pressureAngle !== undefined ? options.pressureAngle : 20.0;
    var pressureAngleRad = pressureAngleDeg * Math.PI / 180.0;
    var pitchRadius = (m * numTeeth) / 2.0;
    if (options.pitchRadius) {
      pitchRadius = options.pitchRadius;
      m = (2.0 * pitchRadius) / numTeeth;
    }
    var thickness = options.thickness !== undefined ? options.thickness : 0.5;
    var boreRadius = options.boreRadius !== undefined ? options.boreRadius : (pitchRadius * 0.25);
    var keyway = options.keyway !== false;
    var backlash = options.backlash || 0.02;
    var keywayWidth = options.keywayWidth || (boreRadius * 0.4);
    var keywayHeight = options.keywayHeight || (boreRadius * 0.25);

    var addendum = (options.addendumCoeff || 1.0) * m;
    var dedendum = (options.dedendumCoeff || 1.25) * m;
    var outerRadius = pitchRadius + addendum;
    var baseRadius = pitchRadius * Math.cos(pressureAngleRad);
    var rootRadius = Math.max(boreRadius + 0.15, pitchRadius - dedendum);

    var outerPts = [];
    var toothAngle = (2.0 * Math.PI) / numTeeth;

    // Build tooth profile using piecewise involute approximation
    for (var t = 0; t < numTeeth; t++) {
      var mid = t * toothAngle;
      var a_r1 = mid - toothAngle * 0.44;
      var a_p1 = mid - toothAngle * (0.22 + backlash * 0.05);
      var a_t1 = mid - toothAngle * 0.11;
      var a_t2 = mid + toothAngle * 0.11;
      var a_p2 = mid + toothAngle * (0.22 + backlash * 0.05);
      var a_r2 = mid + toothAngle * 0.44;

      outerPts.push([rootRadius * Math.cos(a_r1), rootRadius * Math.sin(a_r1)]);
      outerPts.push([baseRadius * Math.cos(a_p1 * 0.9 + a_r1 * 0.1), baseRadius * Math.sin(a_p1 * 0.9 + a_r1 * 0.1)]);
      outerPts.push([pitchRadius * Math.cos(a_p1), pitchRadius * Math.sin(a_p1)]);
      outerPts.push([outerRadius * Math.cos(a_t1), outerRadius * Math.sin(a_t1)]);
      outerPts.push([outerRadius * Math.cos(a_t2), outerRadius * Math.sin(a_t2)]);
      outerPts.push([pitchRadius * Math.cos(a_p2), pitchRadius * Math.sin(a_p2)]);
      outerPts.push([baseRadius * Math.cos(a_p2 * 0.9 + a_r2 * 0.1), baseRadius * Math.sin(a_p2 * 0.9 + a_r2 * 0.1)]);
      outerPts.push([rootRadius * Math.cos(a_r2), rootRadius * Math.sin(a_r2)]);
    }

    var borePts = [];
    var nPts = outerPts.length;

    for (var b = 0; b < nPts; b++) {
      var bAngle = (b / nPts) * 2.0 * Math.PI;
      var bx = boreRadius * Math.cos(bAngle);
      var by = boreRadius * Math.sin(bAngle);
      if (keyway && Math.abs(bAngle - Math.PI / 2.0) < (keywayWidth / (2.0 * boreRadius))) {
        by += keywayHeight;
      }
      borePts.push([bx, by]);
    }

    var positions = [];
    var uvs = [];
    var indices = [];

    var zF = thickness / 2.0;
    var zB = -thickness / 2.0;

    // 0..nPts-1: Front Outer
    for (var i = 0; i < nPts; i++) {
      positions.push(outerPts[i][0], outerPts[i][1], zF);
      uvs.push(outerPts[i][0] / (2.0 * outerRadius) + 0.5, outerPts[i][1] / (2.0 * outerRadius) + 0.5);
    }
    // nPts..2nPts-1: Front Bore
    for (var i = 0; i < nPts; i++) {
      positions.push(borePts[i][0], borePts[i][1], zF);
      uvs.push(borePts[i][0] / (2.0 * outerRadius) + 0.5, borePts[i][1] / (2.0 * outerRadius) + 0.5);
    }
    // 2nPts..3nPts-1: Back Outer
    for (var i = 0; i < nPts; i++) {
      positions.push(outerPts[i][0], outerPts[i][1], zB);
      uvs.push(outerPts[i][0] / (2.0 * outerRadius) + 0.5, outerPts[i][1] / (2.0 * outerRadius) + 0.5);
    }
    // 3nPts..4nPts-1: Back Bore
    for (var i = 0; i < nPts; i++) {
      positions.push(borePts[i][0], borePts[i][1], zB);
      uvs.push(borePts[i][0] / (2.0 * outerRadius) + 0.5, borePts[i][1] / (2.0 * outerRadius) + 0.5);
    }

    // Front Cap Faces
    for (var i = 0; i < nPts; i++) {
      var next = (i + 1) % nPts;
      indices.push(i, next, nPts + next);
      indices.push(i, nPts + next, nPts + i);
    }

    // Back Cap Faces
    for (var i = 0; i < nPts; i++) {
      var next = (i + 1) % nPts;
      indices.push(2 * nPts + i, 3 * nPts + next, 2 * nPts + next);
      indices.push(2 * nPts + i, 3 * nPts + i, 3 * nPts + next);
    }

    // Outer Tooth Sidewalls
    for (var i = 0; i < nPts; i++) {
      var next = (i + 1) % nPts;
      indices.push(i, 2 * nPts + i, 2 * nPts + next);
      indices.push(i, 2 * nPts + next, next);
    }

    // Inner Bore Sidewalls
    for (var i = 0; i < nPts; i++) {
      var next = (i + 1) % nPts;
      indices.push(nPts + i, nPts + next, 3 * nPts + next);
      indices.push(nPts + i, 3 * nPts + next, 3 * nPts + i);
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    geo.userData = {
      type: 'InvoluteGear',
      parameters: {
        numTeeth: numTeeth,
        m: m,
        pressureAngle: pressureAngleDeg,
        pitchRadius: pitchRadius,
        thickness: thickness,
        boreRadius: boreRadius,
        keyway: keyway,
        backlash: backlash,
        keywayWidth: keywayWidth,
        keywayHeight: keywayHeight
      }
    };

    return geo;
  }

  /**
   * Mathematical CAD Inspector for Involute Gears.
   */
  function inspectInvoluteGear(options) {
    options = options || {};
    var numTeeth = Math.max(4, Math.round(options.numTeeth || options.teeth || 16));
    var m = options.m || options.module || 0.25;
    var pressureAngleDeg = options.pressureAngle !== undefined ? options.pressureAngle : 20.0;
    var pressureAngleRad = pressureAngleDeg * Math.PI / 180.0;
    var pitchDiameter = m * numTeeth;
    var pitchRadius = pitchDiameter / 2.0;
    var baseDiameter = pitchDiameter * Math.cos(pressureAngleRad);
    var baseRadius = baseDiameter / 2.0;
    var addendum = (options.addendumCoeff || 1.0) * m;
    var dedendum = (options.dedendumCoeff || 1.25) * m;
    var tipDiameter = pitchDiameter + 2.0 * addendum;
    var rootDiameter = pitchDiameter - 2.0 * dedendum;
    var circularPitch = Math.PI * m;
    var toothThickness = circularPitch / 2.0 - (options.backlash || 0.02) / 2.0;
    var involuteAngle = Math.tan(pressureAngleRad) - pressureAngleRad; // inv(alpha)
    var diametralPitch = 25.4 / m; // Imperial equivalent DP

    return {
      type: 'InvoluteGear',
      module: m,
      teeth: numTeeth,
      pressureAngle: pressureAngleDeg,
      pitchDiameter: pitchDiameter,
      pitchRadius: pitchRadius,
      baseDiameter: baseDiameter,
      baseRadius: baseRadius,
      tipDiameter: tipDiameter,
      rootDiameter: rootDiameter,
      circularPitch: circularPitch,
      diametralPitch: diametralPitch,
      toothThickness: toothThickness,
      involuteRad: involuteAngle,
      addendum: addendum,
      dedendum: dedendum,
      contactRatioStandard: Math.sqrt(Math.pow(tipDiameter/2.0, 2) - Math.pow(baseRadius, 2)) / (Math.PI * m * Math.cos(pressureAngleRad)),
      formulas: {
        pitchDiameter: 'd = m \\cdot N',
        baseDiameter: 'd_b = d \\cdot \\cos(\\alpha)',
        addendum: 'h_a = 1.0 \\cdot m',
        dedendum: 'h_d = 1.25 \\cdot m',
        circularPitch: 'p = \\pi \\cdot m',
        involute: '\\text{inv}(\\alpha) = \\tan(\\alpha) - \\alpha',
        involuteParametric: 'x(\\theta) = r_b(\\cos\\theta + \\theta\\sin\\theta), \\quad y(\\theta) = r_b(\\sin\\theta - \\theta\\cos\\theta)'
      }
    };
  }

  // =========================================================================
  // 6. CALABI-YAU 6D MANIFOLD INSPECTOR & GENERATOR
  // =========================================================================

  /**
   * Generates a 3D cross-section projection of the 6D Calabi-Yau Fermat Hypersurface.
   * z1 = cos(v)^(2/n) * e^(i*u)
   * z2 = sin(v)^(2/n) * e^(i*(u + 2*pi*k/n))
   */
  function createCalabiYauGeometry(options) {
    options = options || {};
    var n = options.n || 5;
    var kMax = options.kMax || Math.min(n, 3);
    var radius = options.radius || 2.0;
    var segU = options.segmentsU || 32;
    var segV = options.segmentsV || 32;
    var alpha = options.alpha !== undefined ? options.alpha : 0.45;
    var beta = options.beta !== undefined ? options.beta : 0.35;
    var gamma = options.gamma !== undefined ? options.gamma : 0.60;
    var delta = options.delta !== undefined ? options.delta : 0.20;

    var cosA = Math.cos(alpha), sinA = Math.sin(alpha);
    var cosB = Math.cos(beta), sinB = Math.sin(beta);
    var cosG = Math.cos(gamma), sinG = Math.sin(gamma);
    var cosD = Math.cos(delta), sinD = Math.sin(delta);

    var positions = [];
    var uvs = [];
    var indices = [];
    var vertexOffset = 0;

    for (var k = 0; k < kMax; k++) {
      var kStart = vertexOffset;
      for (var i = 0; i <= segU; i++) {
        var u = -Math.PI + (i / segU) * (2.0 * Math.PI);
        for (var j = 0; j <= segV; j++) {
          var v = (j / segV) * (Math.PI / 2.0);
          var cosV = Math.cos(v);
          var sinV = Math.sin(v);

          var cosVPow = cosV > 0 ? Math.pow(cosV, 2.0 / n) : 0;
          var sinVPow = sinV > 0 ? Math.pow(sinV, 2.0 / n) : 0;

          var re1 = Math.cos(u) * cosVPow;
          var im1 = Math.sin(u) * cosVPow;

          var phi2 = u + (2.0 * Math.PI * k / n);
          var re2 = Math.cos(phi2) * sinVPow;
          var im2 = Math.sin(phi2) * sinVPow;

          // 4D -> 3D Projection Matrix Transformation
          var px = (re1 * cosA - im1 * sinA + re2 * cosB * cosD - im2 * sinB) * radius;
          var py = (re2 * sinB + im2 * cosG * cosD + im1 * sinD) * radius;
          var pz = (im1 * cosA + re1 * sinA - im2 * sinG + re2 * cosB * sinD) * radius;

          positions.push(px, py, pz);
          uvs.push(j / segV, (i + k * segU) / (segU * kMax));
          vertexOffset++;
        }
      }

      for (var i2 = 0; i2 < segU; i2++) {
        for (var j2 = 0; j2 < segV; j2++) {
          var a = kStart + i2 * (segV + 1) + j2;
          var b = kStart + (i2 + 1) * (segV + 1) + j2;
          var c = kStart + (i2 + 1) * (segV + 1) + (j2 + 1);
          var d = kStart + i2 * (segV + 1) + (j2 + 1);

          indices.push(a, b, d);
          indices.push(b, c, d);
          // Two-sided geometry
          indices.push(a, d, b);
          indices.push(b, d, c);
        }
      }
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    geo.userData = {
      type: 'CalabiYau',
      parameters: { n: n, kMax: kMax, radius: radius, alpha: alpha, beta: beta, gamma: gamma, delta: delta }
    };

    return geo;
  }

  /**
   * Mathematical & Topological Inspector for Calabi-Yau Manifolds.
   */
  function inspectCalabiYau(options) {
    options = options || {};
    var n = options.n || 5;
    var kMax = options.kMax || Math.min(n, 3);
    var radius = options.radius || 2.0;

    // Topological invariants for Fermat hypersurface X_n in CP^{n-1}
    var eulerChar = -200;
    var h11 = 1;
    var h21 = 101;
    if (n === 3) {
      eulerChar = -18;
      h11 = 1;
      h21 = 10;
    } else if (n === 4) {
      eulerChar = -80;
      h11 = 1;
      h21 = 41;
    } else if (n === 6) {
      eulerChar = -420;
      h11 = 1;
      h21 = 211;
    }

    return {
      type: 'CalabiYau',
      complexExponent: n,
      sheetCount: kMax,
      totalSheets: n,
      radius: radius,
      complexDimension: 3,
      realDimension: 6,
      holonomyGroup: 'SU(3)',
      firstChernClass: 'c_1(M) = 0 (Ricci-Flat)',
      hodgeNumbers: { h11: h11, h21: h21 },
      eulerCharacteristic: eulerChar,
      projectionAngles: {
        alpha: options.alpha !== undefined ? options.alpha : 0.45,
        beta: options.beta !== undefined ? options.beta : 0.35,
        gamma: options.gamma !== undefined ? options.gamma : 0.60,
        delta: options.delta !== undefined ? options.delta : 0.20
      },
      formulas: {
        z1: 'z_1(u,v) = \\cos(v)^{2/n} \\cdot e^{i u}',
        z2: 'z_2(u,v,k) = \\sin(v)^{2/n} \\cdot e^{i \\left(u + \\frac{2\\pi k}{n}\\right)}',
        euler: '\\chi = 2(h^{1,1} - h^{2,1}) = -200 \\quad (n=5)'
      }
    };
  }

  // =========================================================================
  // 7. TORUS KNOT PARAMETRIC EQUATIONS INSPECTOR & GENERATOR
  // =========================================================================

  /**
   * Generates a 3D Torus Knot with harmonic modulation and tubular extrusion.
   */
  function createTorusKnotGeometry(options) {
    options = options || {};
    var p = Math.round(options.p || 2);
    var q = Math.round(options.q || 3);
    var radius = options.radius || 2.0;
    var tube = options.tube || options.tubeRadius || 0.4;
    var tubularSegments = Math.max(32, options.tubularSegments || 128);
    var radialSegments = Math.max(6, options.radialSegments || 16);
    var pMod = options.pMod || 0.0;
    var qMod = options.qMod || 1.0;

    var positions = [];
    var normals = [];
    var uvs = [];
    var indices = [];

    // Sample centerline curve points and compute Frenet frames
    var points = [];
    var tangents = [];
    var normalsCurve = [];
    var binormals = [];

    for (var i = 0; i <= tubularSegments; i++) {
      var t = (i / tubularSegments) * Math.PI * 2.0;
      var rKnot = radius * (1.0 + pMod * Math.cos(qMod * t));
      var cx = rKnot * Math.cos(p * t);
      var cy = rKnot * Math.sin(p * t);
      var cz = -radius * 0.6 * Math.sin(q * t);
      points.push(new THREE.Vector3(cx, cy, cz));

      // Derivative / Tangent
      var dt = 0.001;
      var tPlus = t + dt;
      var rKnotPlus = radius * (1.0 + pMod * Math.cos(qMod * tPlus));
      var cxPlus = rKnotPlus * Math.cos(p * tPlus);
      var cyPlus = rKnotPlus * Math.sin(p * tPlus);
      var czPlus = -radius * 0.6 * Math.sin(q * tPlus);
      var tan = new THREE.Vector3(cxPlus - cx, cyPlus - cy, czPlus - cz).normalize();
      tangents.push(tan);
    }

    // Parallel transport frame initialization
    var initialNormal = new THREE.Vector3(0, 0, 1);
    if (Math.abs(tangents[0].dot(initialNormal)) > 0.9) initialNormal.set(1, 0, 0);
    var curNormal = new THREE.Vector3().crossVectors(tangents[0], initialNormal).normalize();
    var curBinormal = new THREE.Vector3().crossVectors(tangents[0], curNormal).normalize();

    normalsCurve.push(curNormal.clone());
    binormals.push(curBinormal.clone());

    for (var i = 1; i <= tubularSegments; i++) {
      var prevTan = tangents[i - 1];
      var nextTan = tangents[i];
      var axis = new THREE.Vector3().crossVectors(prevTan, nextTan);
      if (axis.length() > 1e-6) {
        var angle = Math.asin(Math.min(1.0, axis.length()));
        axis.normalize();
        curNormal.applyAxisAngle(axis, angle);
        curBinormal.applyAxisAngle(axis, angle);
      }
      normalsCurve.push(curNormal.clone());
      binormals.push(curBinormal.clone());
    }

    // Extrude radial tube cross-section
    for (var i = 0; i <= tubularSegments; i++) {
      var pt = points[i];
      var N = normalsCurve[i];
      var B = binormals[i];

      for (var j = 0; j <= radialSegments; j++) {
        var v = (j / radialSegments) * Math.PI * 2.0;
        var norm = new THREE.Vector3()
          .addScaledVector(N, Math.cos(v))
          .addScaledVector(B, Math.sin(v))
          .normalize();

        var vert = new THREE.Vector3().copy(pt).addScaledVector(norm, tube);

        positions.push(vert.x, vert.y, vert.z);
        normals.push(norm.x, norm.y, norm.z);
        uvs.push(i / tubularSegments, j / radialSegments);
      }
    }

    for (var i = 0; i < tubularSegments; i++) {
      for (var j = 0; j < radialSegments; j++) {
        var a = i * (radialSegments + 1) + j;
        var b = (i + 1) * (radialSegments + 1) + j;
        var c = (i + 1) * (radialSegments + 1) + (j + 1);
        var d = i * (radialSegments + 1) + (j + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);

    geo.userData = {
      type: 'TorusKnot',
      parameters: { p: p, q: q, radius: radius, tube: tube, tubularSegments: tubularSegments, radialSegments: radialSegments, pMod: pMod, qMod: qMod }
    };

    return geo;
  }

  /**
   * Topological & Mathematical Inspector for Torus Knots.
   */
  function inspectTorusKnot(options) {
    options = options || {};
    var p = Math.round(options.p || 2);
    var q = Math.round(options.q || 3);
    var radius = options.radius || 2.0;
    var tube = options.tube || 0.4;

    var g = gcd(p, q);
    var isLink = g > 1;
    var knotName = 'Custom Torus Knot';
    if (p === 2 && q === 3) knotName = 'Trefoil Knot (3_1)';
    else if (p === 2 && q === 5) knotName = 'Cinquefoil Knot (5_1)';
    else if (p === 3 && q === 4) knotName = 'Septafoil Knot (7_1)';
    else if (p === 3 && q === 5) knotName = 'Octafoil Knot (8_19)';
    else if (p === 1 || q === 1) knotName = 'Unknot (Trivial Torus Loop)';
    else if (isLink) knotName = 'Torus Link with ' + g + ' Disjoint Components';

    var crossingNumber = isLink ? (p * (q - 1)) : Math.min(p * (q - 1), q * (p - 1));
    var approxArcLength = 2.0 * Math.PI * Math.sqrt(Math.pow(radius * p, 2) + Math.pow(radius * 0.6 * q, 2));
    var approxSurfaceArea = 2.0 * Math.PI * tube * approxArcLength;
    var approxVolume = Math.PI * Math.pow(tube, 2) * approxArcLength;

    return {
      type: 'TorusKnot',
      windings: { p: p, q: q },
      gcd: g,
      isLink: isLink,
      classification: knotName,
      crossingNumber: crossingNumber,
      majorRadius: radius,
      tubeRadius: tube,
      approxArcLength: approxArcLength,
      surfaceArea: approxSurfaceArea,
      volume: approxVolume,
      formulas: {
        centerline: 'r(t) = R, \\quad x(t) = r(t)\\cos(p t), \\quad y(t) = r(t)\\sin(p t), \\quad z(t) = -h\\sin(q t)',
        crossing: 'c(T_{p,q}) = \\min(p(q-1), q(p-1)) \\quad \\text{if } \\gcd(p,q)=1'
      }
    };
  }

  // =========================================================================
  // 8. SACRED GEOMETRY, GOLDEN RATIO & PHYSICAL MASS TELEMETRY ENGINE
  // =========================================================================

  /**
   * Computes exact signed tetrahedral volume, surface area, bounding box,
   * centroid, golden ratio proportions, and acoustic harmonic resonance matches.
   */
  function computeMeshTelemetry(meshOrGeo, options) {
    options = options || {};
    var geo = (meshOrGeo && meshOrGeo.isBufferGeometry) ? meshOrGeo : (meshOrGeo && meshOrGeo.geometry ? meshOrGeo.geometry : null);
    if (!geo || !geo.attributes || !geo.attributes.position) {
      return {
        volume: 0,
        surfaceArea: 0,
        vertexCount: 0,
        triangleCount: 0,
        centroid: new THREE.Vector3(),
        boundingBox: { min: new THREE.Vector3(), max: new THREE.Vector3(), size: new THREE.Vector3() },
        massBreakdown: {},
        goldenRatioMetrics: { phiFitScore: 0, intervals: [] },
        resonanceFrequencies: []
      };
    }

    var pos = geo.attributes.position.array;
    var index = geo.index ? geo.index.array : null;
    var triCount = index ? (index.length / 3) : (pos.length / 9);
    var vertCount = pos.length / 3;

    var totalVolume = 0.0;
    var totalArea = 0.0;
    var centroidSum = new THREE.Vector3(0, 0, 0);

    var minX = Infinity, minY = Infinity, minZ = Infinity;
    var maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    var pA = new THREE.Vector3(), pB = new THREE.Vector3(), pC = new THREE.Vector3();
    var cb = new THREE.Vector3(), ab = new THREE.Vector3(), cross = new THREE.Vector3();

    for (var i = 0; i < triCount; i++) {
      var i0 = index ? index[i * 3] : (i * 3);
      var i1 = index ? index[i * 3 + 1] : (i * 3 + 1);
      var i2 = index ? index[i * 3 + 2] : (i * 3 + 2);

      pA.set(pos[i0 * 3], pos[i0 * 3 + 1], pos[i0 * 3 + 2]);
      pB.set(pos[i1 * 3], pos[i1 * 3 + 1], pos[i1 * 3 + 2]);
      pC.set(pos[i2 * 3], pos[i2 * 3 + 1], pos[i2 * 3 + 2]);

      // Update Bounding Box
      minX = Math.min(minX, pA.x, pB.x, pC.x);
      minY = Math.min(minY, pA.y, pB.y, pC.y);
      minZ = Math.min(minZ, pA.z, pB.z, pC.z);
      maxX = Math.max(maxX, pA.x, pB.x, pC.x);
      maxY = Math.max(maxY, pA.y, pB.y, pC.y);
      maxZ = Math.max(maxZ, pA.z, pB.z, pC.z);

      // Signed Tetrahedral Volume: V = 1/6 * (pA . (pB x pC))
      cross.crossVectors(pB, pC);
      var signedVolTet = pA.dot(cross) / 6.0;
      totalVolume += signedVolTet;

      // Centroid contribution
      var tetCentroid = new THREE.Vector3().add(pA).add(pB).add(pC).multiplyScalar(0.25);
      centroidSum.addScaledVector(tetCentroid, signedVolTet);

      // Surface Area
      cb.subVectors(pC, pB);
      ab.subVectors(pA, pB);
      cross.crossVectors(cb, ab);
      totalArea += cross.length() * 0.5;
    }

    var absVolume = Math.abs(totalVolume);
    var centroid = absVolume > 1e-7 ? centroidSum.multiplyScalar(1.0 / totalVolume) : new THREE.Vector3((minX + maxX)/2, (minY + maxY)/2, (minZ + maxZ)/2);

    var sizeX = Math.max(0.001, maxX - minX);
    var sizeY = Math.max(0.001, maxY - minY);
    var sizeZ = Math.max(0.001, maxZ - minZ);
    var boundingVolume = sizeX * sizeY * sizeZ;

    // Material Mass Breakdown (assuming mesh units in centimeters or scale factor)
    var unitScale = options.unitScale || 1.0; // cm per unit
    var volumeInCm3 = absVolume * Math.pow(unitScale, 3);
    var massMap = {};
    for (var matKey in MATERIAL_DENSITIES) {
      var density = MATERIAL_DENSITIES[matKey];
      var massGrams = volumeInCm3 * density;
      massMap[matKey] = {
        density_g_cm3: density,
        mass_grams: massGrams,
        mass_kg: massGrams / 1000.0,
        mass_lbs: massGrams * 0.00220462
      };
    }

    // Golden Ratio Proportions Breakdown
    var aspectXY = Math.max(sizeX / sizeY, sizeY / sizeX);
    var aspectXZ = Math.max(sizeX / sizeZ, sizeZ / sizeX);
    var aspectYZ = Math.max(sizeY / sizeZ, sizeZ / sizeY);

    var errorXY = Math.abs(aspectXY - PHI) / PHI;
    var errorXZ = Math.abs(aspectXZ - PHI) / PHI;
    var errorYZ = Math.abs(aspectYZ - PHI) / PHI;
    var minPhiError = Math.min(errorXY, errorXZ, errorYZ);
    var phiFitScore = Math.max(0.0, Math.min(100.0, (1.0 - minPhiError) * 100.0));

    var phiIntervals = [
      { name: 'Minor Sub-Phi (1/Φ)', target: PHI_INV, measured: 1.0 / aspectXY, matchPct: Math.max(0, 100 - Math.abs(1.0/aspectXY - PHI_INV)*100) },
      { name: 'Major Golden Ratio (Φ)', target: PHI, measured: aspectXY, matchPct: Math.max(0, 100 - Math.abs(aspectXY - PHI)*100) },
      { name: 'Super-Phi (Φ²)', target: PHI * PHI, measured: aspectXZ, matchPct: Math.max(0, 100 - Math.abs(aspectXZ - PHI*PHI)*50) }
    ];

    // Harmonic Resonance Frequencies (Cavity Eigenmode Wavelengths)
    var charLengthMeters = (Math.cbrt(absVolume) * unitScale) / 100.0; // in meters
    var baseCavityFreq = charLengthMeters > 0.001 ? (SPEED_OF_SOUND_AIR / (2.0 * charLengthMeters)) : 432.0;

    var resonanceMatches = [
      { freq: 432, name: 'Verdi A-432 Harmonic', deviationHz: Math.abs(baseCavityFreq % 432), status: Math.abs(baseCavityFreq % 432) < 25 ? 'Resonant Harmonic' : 'Sub-harmonic' },
      { freq: 528, name: 'Solfeggio 528 Miracle MI', deviationHz: Math.abs(baseCavityFreq % 528), status: Math.abs(baseCavityFreq % 528) < 30 ? 'Resonant Harmonic' : 'Sub-harmonic' },
      { freq: 888, name: 'Cosmic Octave 888', deviationHz: Math.abs(baseCavityFreq % 888), status: Math.abs(baseCavityFreq % 888) < 40 ? 'Resonant Harmonic' : 'Sub-harmonic' }
    ];

    return {
      vertexCount: vertCount,
      triangleCount: triCount,
      signedVolume: totalVolume,
      volume: absVolume,
      surfaceArea: totalArea,
      boundingVolume: boundingVolume,
      compactness: totalArea > 0 ? ((36.0 * Math.PI * Math.pow(absVolume, 2)) / Math.pow(totalArea, 3)) : 0,
      centroid: centroid,
      boundingBox: {
        min: new THREE.Vector3(minX, minY, minZ),
        max: new THREE.Vector3(maxX, maxY, maxZ),
        size: new THREE.Vector3(sizeX, sizeY, sizeZ)
      },
      aspectRatios: { XY: aspectXY, XZ: aspectXZ, YZ: aspectYZ },
      goldenRatioMetrics: {
        phi: PHI,
        phiFitScore: phiFitScore,
        minPhiError: minPhiError,
        intervals: phiIntervals
      },
      massBreakdown: massMap,
      characteristicLengthM: charLengthMeters,
      cavityFundamentalHz: baseCavityFreq,
      resonanceFrequencies: resonanceMatches
    };
  }

  // =========================================================================
  // 9. LIVE FORMULA PARSER & SAFE PARAMETRIC SURFACE EVALUATOR
  // =========================================================================

  var ALLOWED_MATH_IDENTIFIERS = {
    sin: 'Math.sin', cos: 'Math.cos', tan: 'Math.tan',
    asin: 'Math.asin', acos: 'Math.acos', atan: 'Math.atan', atan2: 'Math.atan2',
    sinh: 'Math.sinh', cosh: 'Math.cosh', tanh: 'Math.tanh',
    exp: 'Math.exp', log: 'Math.log', ln: 'Math.log',
    sqrt: 'Math.sqrt', cbrt: 'Math.cbrt', abs: 'Math.abs',
    sign: 'Math.sign', sgn: 'Math.sign', pow: 'Math.pow',
    min: 'Math.min', max: 'Math.max', floor: 'Math.floor', ceil: 'Math.ceil', round: 'Math.round',
    hypot: 'Math.hypot',
    pi: 'Math.PI', PI: 'Math.PI',
    e: 'Math.E', E: 'Math.E',
    phi: '(' + PHI + ')', PHI: '(' + PHI + ')',
    tau: '(' + TAU + ')', TAU: '(' + TAU + ')',
    noise: '_noise'
  };

  /**
   * Compiles a mathematical equation string into a fast, sandboxed JS function.
   * Signature: (u, v, t, vars) => number
   */
  function parseParametricEquation(exprStr) {
    if (typeof exprStr === 'function') return exprStr;
    if (!exprStr || typeof exprStr !== 'string') {
      return function () { return 0.0; };
    }

    var clean = exprStr.trim();
    if (clean.length === 0) return function () { return 0.0; };

    // 1. Implicit multiplication: 2u -> 2*u, 3cos(v) -> 3*cos(v), (u)(v) -> (u)*(v), u v -> u*v
    clean = clean.replace(/(\d+)\s*([a-zA-Z\(])/g, '$1 * $2');
    clean = clean.replace(/(\))\s*(\()/g, '$1 * $2');
    clean = clean.replace(/(\))\s*([a-zA-Z0-9])/g, '$1 * $2');
    clean = clean.replace(/([uUvVtT])\s+([uUvVtT])/g, '$1 * $2');

    // 2. Power operator ^ -> **
    clean = clean.replace(/\^/g, '**');

    // 3. Tokenize identifiers and replace with Math equivalents safely
    var transformed = clean.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, function (match) {
      var lower = match.toLowerCase();
      if (lower === 'u' || lower === 'v' || lower === 't') return lower;
      if (ALLOWED_MATH_IDENTIFIERS[match]) return ALLOWED_MATH_IDENTIFIERS[match];
      if (ALLOWED_MATH_IDENTIFIERS[lower]) return ALLOWED_MATH_IDENTIFIERS[lower];
      // Check if variable in vars
      return '(vars && vars["' + match + '"] !== undefined ? vars["' + match + '"] : 0)';
    });

    // 4. Wrap with safe execution and clamp NaN / Inf to 0
    var code = 'return (function(u, v, t, vars, _noise) {\n' +
               '  try {\n' +
               '    var val = (' + transformed + ');\n' +
               '    return isFinite(val) ? val : 0.0;\n' +
               '  } catch(err) { return 0.0; }\n' +
               '})(u, v, t, vars, _noise);';

    try {
      var compiledFn = new Function('u', 'v', 't', 'vars', '_noise', code);
      return function (u, v, t, vars) {
        return compiledFn(u, v, t || 0.0, vars || {}, simplexNoise3D);
      };
    } catch (e) {
      return function () { return 0.0; };
    }
  }

  /**
   * Evaluates custom parametric functions x(u,v,t), y(u,v,t), z(u,v,t)
   * and generates a complete Three.js BufferGeometry with normals and UVs.
   */
  function createCustomParametricGeometry(options) {
    options = options || {};
    var fnX = parseParametricEquation(options.fx || options.x || 'u');
    var fnY = parseParametricEquation(options.fy || options.y || 'v');
    var fnZ = parseParametricEquation(options.fz || options.z || '0');

    var uMin = options.uMin !== undefined ? options.uMin : -Math.PI;
    var uMax = options.uMax !== undefined ? options.uMax : Math.PI;
    var vMin = options.vMin !== undefined ? options.vMin : -Math.PI;
    var vMax = options.vMax !== undefined ? options.vMax : Math.PI;
    var segU = Math.max(4, options.segmentsU || 48);
    var segV = Math.max(4, options.segmentsV || 48);
    var t = options.t || 0.0;
    var vars = options.vars || {};
    var scale = options.scale || 1.0;

    var positions = [];
    var uvs = [];
    var indices = [];

    for (var i = 0; i <= segU; i++) {
      var u = uMin + (i / segU) * (uMax - uMin);
      for (var j = 0; j <= segV; j++) {
        var v = vMin + (j / segV) * (vMax - vMin);

        var px = fnX(u, v, t, vars) * scale;
        var py = fnY(u, v, t, vars) * scale;
        var pz = fnZ(u, v, t, vars) * scale;

        // Ensure clean finite bounds
        px = isFinite(px) ? px : 0.0;
        py = isFinite(py) ? py : 0.0;
        pz = isFinite(pz) ? pz : 0.0;

        positions.push(px, py, pz);
        uvs.push(i / segU, j / segV);
      }
    }

    for (var i = 0; i < segU; i++) {
      for (var j = 0; j < segV; j++) {
        var a = i * (segV + 1) + j;
        var b = (i + 1) * (segV + 1) + j;
        var c = (i + 1) * (segV + 1) + (j + 1);
        var d = i * (segV + 1) + (j + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
        // Double-sided rendering for open surfaces
        indices.push(a, d, b);
        indices.push(b, d, c);
      }
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    geo.userData = {
      type: 'CustomParametric',
      parameters: {
        fx: options.fx || options.x,
        fy: options.fy || options.y,
        fz: options.fz || options.z,
        uMin: uMin, uMax: uMax,
        vMin: vMin, vMax: vMax,
        segmentsU: segU, segmentsV: segV,
        t: t, vars: vars
      }
    };

    return geo;
  }

  // =========================================================================
  // 10. BUILT-IN MATHEMATICAL SURFACE PRESETS
  // =========================================================================
  var PARAMETRIC_PRESETS = {
    enneper: {
      name: "Enneper's Minimal Surface",
      category: 'Minimal Surfaces',
      fx: 'u - (u^3)/3 + u * v^2',
      fy: '-v + (v^3)/3 - u^2 * v',
      fz: 'u^2 - v^2',
      uMin: -1.8, uMax: 1.8,
      vMin: -1.8, vMax: 1.8,
      segmentsU: 48, segmentsV: 48,
      scale: 0.65,
      description: 'Self-intersecting minimal surface with constant zero mean curvature H=0'
    },
    dini: {
      name: "Dini's Pseudosphere",
      category: 'Constant Negative Curvature',
      fx: 'cos(u) * sin(v)',
      fy: 'sin(u) * sin(v)',
      fz: 'cos(v) + log(tan(v/2 + 0.001)) + 0.2 * u',
      uMin: 0, uMax: 4 * Math.PI,
      vMin: 0.05, vMax: 2.0,
      segmentsU: 64, segmentsV: 32,
      scale: 1.2,
      description: 'Helicoidal pseudospherical surface with constant negative Gaussian curvature K=-1'
    },
    bohemian_dome: {
      name: 'Bohemian Dome',
      category: 'Classical Manifolds',
      fx: '1.2 * cos(u)',
      fy: '0.8 * cos(v) + 1.2 * sin(u)',
      fz: '1.0 * sin(v)',
      uMin: 0, uMax: 2 * Math.PI,
      vMin: 0, vMax: 2 * Math.PI,
      segmentsU: 48, segmentsV: 48,
      scale: 1.0,
      description: 'Translational quartic surface generated by a vertical circle swept along a horizontal circle'
    },
    roman_steiner: {
      name: 'Roman Steiner Surface',
      category: 'Topological Immersions',
      fx: 'sin(2*u) * cos(v)^2 / 2',
      fy: 'sin(u) * sin(2*v) / 2',
      fz: 'cos(u) * sin(2*v) / 2',
      uMin: -Math.PI / 2, uMax: Math.PI / 2,
      vMin: -Math.PI / 2, vMax: Math.PI / 2,
      segmentsU: 48, segmentsV: 48,
      scale: 3.2,
      description: 'Self-intersecting real projective plane RP^2 with tetrahedral symmetry and 6 cross-caps'
    },
    apple_surface: {
      name: 'Apple Soliton Surface',
      category: 'Solitons & Biological Form',
      fx: 'cos(u) * (4 + 3.8 * cos(v))',
      fy: 'sin(u) * (4 + 3.8 * cos(v))',
      fz: '(cos(v) + sin(v) - 1) * (1 + sin(v)) * log(1 - (pi * v) / 10 + 0.001) + 7.5 * sin(v)',
      uMin: 0, uMax: 2 * Math.PI,
      vMin: -Math.PI, vMax: Math.PI,
      segmentsU: 48, segmentsV: 48,
      scale: 0.28,
      description: 'Smooth toroidal bio-organic vortex with indented logarithmic peduncle and calyx'
    },
    clifford_torus: {
      name: 'Clifford Torus 4D Projection',
      category: '4D Hypersurface Projections',
      fx: 'cos(u + v) / (sqrt(2) + cos(u - v))',
      fy: 'sin(u + v) / (sqrt(2) + cos(u - v))',
      fz: 'sin(u - v) / (sqrt(2) + cos(u - v))',
      uMin: 0, uMax: 2 * Math.PI,
      vMin: 0, vMax: 2 * Math.PI,
      segmentsU: 50, segmentsV: 50,
      scale: 1.8,
      description: 'Flat torus embedded in S^3 hypersphere stereographically projected into 3D Euclidean space'
    },
    seashell: {
      name: 'Conchoid Seashell',
      category: 'Logarithmic Fibonacci Spirals',
      fx: '2 * (1 - exp(u / (6*pi))) * cos(u) * cos(v/2)^2',
      fy: '2 * (-1 + exp(u / (6*pi))) * sin(u) * cos(v/2)^2',
      fz: '1 - exp(u / (3*pi)) - sin(v) + exp(u / (6*pi)) * sin(v)',
      uMin: 0, uMax: 6 * Math.PI,
      vMin: 0, vMax: 2 * Math.PI,
      segmentsU: 64, segmentsV: 32,
      scale: 0.8,
      description: 'Golden spiral logarithmic conch with continuous accretionary growth along generating helices'
    },
    trefoil_ribbon: {
      name: 'Harmonic Trefoil Ribbon',
      category: 'Knots & Bands',
      fx: 'sin(u) + 2*sin(2*u) + v*cos(u/2)*sin(u)',
      fy: 'cos(u) - 2*cos(2*u) + v*cos(u/2)*cos(u)',
      fz: '-sin(3*u) + v*sin(u/2)',
      uMin: 0, uMax: 2 * Math.PI,
      vMin: -0.35, vMax: 0.35,
      segmentsU: 96, segmentsV: 12,
      scale: 0.85,
      description: 'Non-orientable harmonic trefoil ribbon with intrinsic half-integer twist'
    }
  };

  // =========================================================================
  // 11. EXPORTS
  // =========================================================================
  return {
    VERSION: VERSION,
    PHI: PHI,
    PHI_INV: PHI_INV,
    GOLDEN_ANGLE: GOLDEN_ANGLE,
    TAU: TAU,
    SACRED_FREQUENCIES: SACRED_FREQUENCIES,
    MATERIAL_DENSITIES: MATERIAL_DENSITIES,
    PARAMETRIC_PRESETS: PARAMETRIC_PRESETS,
    noise: simplexNoise3D,
    // Superquadrics
    createSuperquadricGeometry: createSuperquadricGeometry,
    inspectSuperquadric: inspectSuperquadric,
    // Involute Gears
    createInvoluteGearGeometry: createInvoluteGearGeometry,
    inspectInvoluteGear: inspectInvoluteGear,
    // Calabi-Yau
    createCalabiYauGeometry: createCalabiYauGeometry,
    inspectCalabiYau: inspectCalabiYau,
    // Torus Knots
    createTorusKnotGeometry: createTorusKnotGeometry,
    inspectTorusKnot: inspectTorusKnot,
    // Sacred Geometry & Physical Telemetry
    computeMeshTelemetry: computeMeshTelemetry,
    // Custom Parametric Formula Engine
    parseParametricEquation: parseParametricEquation,
    createCustomParametricGeometry: createCustomParametricGeometry
  };
});
