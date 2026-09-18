/**
 * ⚡ ZOTH NEXUS 3D — Algorithmic Procedural 3D Generator Engine
 * 
 * Generates CAD-grade 3D meshes, full 3D environmental scenes, procedural PBR materials,
 * and complex sci-fi/sacred geometries from text prompts and mathematical algorithms
 * with ZERO heavy VRAM or GPU requirements.
 * 
 * Features:
 * - Natural Language Intent & Archetype Decomposer (Objects & Full 3D Scenes)
 * - Complete 3D Environmental Scene Graph Synthesizer (City, Space, Temple, Hangar, Matrix, Islands)
 * - Procedural Multi-Part Composite Assembly (Vehicles, Weapons, Mechs, Tech, Architecture, Creatures)
 * - 3D Simplex / Perlin Volumetric Noise Geometry Displacer
 * - 4D Tesseract Hypercube Stereographic Projection
 * - Parametric Torus Knots, Superquadrics, and Fibonacci Phyllotaxis Lattices
 * - Procedural PBR Canvas Texture Forge (Albedo, Normal, Roughness, Metalness, Emissive)
 * - 1-Click GLB, OBJ, and STL Exporters
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
    root.Nexus3DGenerator = factory(root.THREE);
  }
})(typeof self !== 'undefined' ? self : this, function (THREE) {
  'use strict';

  var VERSION = '2026-08-24-procedural-v3.2';

  // =========================================================================
  // 1. MATHEMATICAL CONSTANTS & SACRED PROPORTIONS
  // =========================================================================
  var PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio Φ ≈ 1.6180339887
  var GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // Golden Angle ≈ 137.5077°

  // =========================================================================
  // 2. SIMPLEX NOISE ALGORITHM (Zero-Dependency Pure JS)
  // =========================================================================
  var F3 = 1.0 / 3.0, G3 = 1.0 / 6.0;
  var p = new Uint8Array(512);
  var perm = new Uint8Array(512);
  var permMod12 = new Uint8Array(512);

  (function initNoise() {
    var source = new Uint8Array([
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
    ]);
    for (var i = 0; i < 256; i++) {
      p[i] = source[i];
      p[256 + i] = source[i];
    }
    for (var j = 0; j < 512; j++) {
      perm[j] = p[j & 255];
      permMod12[j] = (perm[j] % 12);
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
    var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
    var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
    var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
    var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;

    var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if (t0 < 0) n0 = 0.0;
    else { t0 *= t0; n0 = t0 * t0 * (grad3[gi0]*x0 + grad3[gi0+1]*y0 + grad3[gi0+2]*z0); }

    var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if (t1 < 0) n1 = 0.0;
    else { t1 *= t1; n1 = t1 * t1 * (grad3[gi1]*x1 + grad3[gi1+1]*y1 + grad3[gi1+2]*z1); }

    var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if (t2 < 0) n2 = 0.0;
    else { t2 *= t2; n2 = t2 * t2 * (grad3[gi2]*x2 + grad3[gi2+1]*y2 + grad3[gi2+2]*z2); }

    var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if (t3 < 0) n3 = 0.0;
    else { t3 *= t3; n3 = t3 * t3 * (grad3[gi3]*x3 + grad3[gi3+1]*y3 + grad3[gi3+2]*z3); }

    return 32.0 * (n0 + n1 + n2 + n3);
  }

  var PBR_STYLES = [
    'carbon-fiber',
    'brushed-titanium',
    'iridescent-hologram',
    'bio-organic',
    'damascus-steel',
    'cyber-circuit',
    'hologram-grid',
    'azoth-gold',
    'obsidian-matte',
    'neon-wireframe',
    'bioluminescent-pulse'
  ];

  function hexToRgb(hex, defaultRgb) {
    if (!hex) return defaultRgb || { r: 0, g: 240, b: 255 };
    var cleanHex = String(hex).replace(/^#/, '').trim();
    if (cleanHex.length === 3) {
      cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
    }
    var num = parseInt(cleanHex, 16);
    if (isNaN(num)) return defaultRgb || { r: 0, g: 240, b: 255 };
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    var m = l - c / 2;
    var r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((g + m) * 255)
    };
  }

  // Seamless periodic noise on a 2D torus mapped in 3D simplex space
  function torusNoise(px, py, size, freq) {
    var u = (px / size) * Math.PI * 2;
    var v = (py / size) * Math.PI * 2;
    var nx = Math.cos(u) * freq;
    var ny = Math.sin(u) * freq;
    var nz = Math.cos(v) * freq;
    var nw = Math.sin(v) * freq;
    return (simplexNoise3D(nx, ny, nz) + 0.5 * simplexNoise3D(ny, nz, nw)) / 1.5;
  }

  function seamlessFBM(px, py, size, baseFreq, octaves, persistence) {
    octaves = octaves || 3;
    persistence = persistence || 0.5;
    var total = 0, maxVal = 0, amp = 1.0, f = baseFreq;
    for (var o = 0; o < octaves; o++) {
      total += torusNoise(px, py, size, f) * amp;
      maxVal += amp;
      amp *= persistence;
      f *= 2.0;
    }
    return total / maxVal;
  }

  // =========================================================================
  // 3. PROCEDURAL PBR TEXTURE SYNTHESIZER (Canvas 2D -> WebGL Texture)
  // =========================================================================

  function generatePBRBuffers(params) {
    params = params || {};
    var size = params.size || 512;
    var themeColor = params.themeColor || '#00f0ff';
    var rawStyle = (params.style || 'cyber-circuit').toLowerCase().trim();

    // Resolve style aliases
    var style = 'cyber-circuit';
    if (rawStyle === 'hologram-grid' || rawStyle === 'hologram' || rawStyle === 'holo-grid' || rawStyle === 'matrix-grid' || rawStyle === 'grid-hologram') {
      style = 'hologram-grid';
    } else if (rawStyle === 'azoth-gold' || rawStyle === 'gold-leaf' || rawStyle === 'amber' || rawStyle === 'alchemical-gold' || rawStyle === 'azoth-amber') {
      style = 'azoth-gold';
    } else if (rawStyle === 'obsidian-matte' || rawStyle === 'obsidian' || rawStyle === 'matte-carbon' || rawStyle === 'carbon-matte' || rawStyle === 'obsidian-carbon') {
      style = 'obsidian-matte';
    } else if (rawStyle === 'neon-wireframe' || rawStyle === 'neon-edge' || rawStyle === 'wireframe' || rawStyle === 'cad-wireframe' || rawStyle === 'neon-edge-wireframe') {
      style = 'neon-wireframe';
    } else if (rawStyle === 'bioluminescent-pulse' || rawStyle === 'bioluminescent' || rawStyle === 'bio-pulse' || rawStyle === 'pulse-veins' || rawStyle === 'luminescent') {
      style = 'bioluminescent-pulse';
    } else if (rawStyle === 'carbon-fiber' || rawStyle === 'carbon' || rawStyle === 'weave' || rawStyle === 'kevlar') {
      style = 'carbon-fiber';
    } else if (rawStyle === 'brushed-titanium' || rawStyle === 'titanium' || rawStyle === 'brushed-metal' || rawStyle === 'brushed' || rawStyle === 'metal') {
      style = 'brushed-titanium';
    } else if (rawStyle === 'iridescent-hologram' || rawStyle === 'iridescent' || rawStyle === 'holographic' || rawStyle === 'chromatic' || rawStyle === 'prism' || rawStyle === 'chrome') {
      style = 'iridescent-hologram';
    } else if (rawStyle === 'bio-organic' || rawStyle === 'bio' || rawStyle === 'organic' || rawStyle === 'alien' || rawStyle === 'cellular' || rawStyle === 'voronoi' || rawStyle === 'matrix') {
      style = 'bio-organic';
    } else if (rawStyle === 'damascus-steel' || rawStyle === 'damascus' || rawStyle === 'folded-steel' || rawStyle === 'alchemical' || rawStyle === 'gold') {
      style = 'damascus-steel';
    } else {
      style = 'cyber-circuit';
    }

    var themeRGB = hexToRgb(themeColor, { r: 0, g: 240, b: 255 });
    var baseRGB = hexToRgb(params.baseColor, { r: 9, g: 13, b: 22 });

    var totalPixels = size * size;
    var dataA = new Uint8ClampedArray(totalPixels * 4);
    var dataN = new Uint8ClampedArray(totalPixels * 4);
    var dataR = new Uint8ClampedArray(totalPixels * 4);
    var dataM = new Uint8ClampedArray(totalPixels * 4);
    var dataE = new Uint8ClampedArray(totalPixels * 4);
    var heightMap = new Float32Array(totalPixels);

    // 1. PRIMARY MAPS SYNTHESIS (Albedo, Roughness, Metalness, Emissive, Height)
    for (var py = 0; py < size; py++) {
      var rowOffset = py * size;
      for (var px = 0; px < size; px++) {
        var idx = rowOffset + px;
        var p4 = idx * 4;

        var rA = 0, gA = 0, bA = 0;
        var rVal = 128, mVal = 128;
        var rE = 0, gE = 0, bE = 0;
        var hVal = 0.5;

        if (style === 'carbon-fiber') {
          var repCF = size >= 1024 ? 64 : 32;
          var uCF = (px / size) * repCF;
          var vCF = (py / size) * repCF;
          var cxCF = Math.floor(uCF);
          var cyCF = Math.floor(vCF);
          var fxCF = uCF - cxCF;
          var fyCF = vCF - cyCF;
          var isHoriz = ((cxCF + cyCF) % 4) < 2;

          var strandCF, microCF, anisoCF, shadeCF;
          var edgeDistCF = Math.min(fxCF, 1.0 - fxCF, fyCF, 1.0 - fyCF);
          var gapCF = Math.min(1.0, edgeDistCF * 14.0);

          if (isHoriz) {
            strandCF = Math.sin(fyCF * Math.PI);
            microCF = Math.sin(fyCF * Math.PI * 8.0) * 0.12;
            anisoCF = 0.5 + 0.5 * Math.sin((fxCF + microCF) * Math.PI);
            hVal = (0.45 + 0.5 * strandCF * (0.75 + 0.25 * anisoCF)) * gapCF;
            shadeCF = Math.floor(22 + 42 * strandCF * anisoCF);
          } else {
            strandCF = Math.sin(fxCF * Math.PI);
            microCF = Math.sin(fxCF * Math.PI * 8.0) * 0.12;
            anisoCF = 0.5 + 0.5 * Math.sin((fyCF + microCF) * Math.PI);
            hVal = (0.45 + 0.5 * strandCF * (0.75 + 0.25 * anisoCF)) * gapCF;
            shadeCF = Math.floor(18 + 36 * strandCF * anisoCF);
          }

          rA = Math.min(255, shadeCF + 12);
          gA = Math.min(255, shadeCF + 14);
          bA = Math.min(255, shadeCF + 18);

          var roughCF = 0.20 + 0.55 * (1.0 - strandCF * gapCF);
          rVal = Math.floor(roughCF * 255);

          var metalCF = 0.42 + 0.25 * strandCF;
          mVal = Math.floor(metalCF * 255);

          rE = 0; gE = 0; bE = 0;
        }
        else if (style === 'brushed-titanium') {
          var uTi = (px / size) * Math.PI * 2;
          var vTi = (py / size) * Math.PI * 2;
          var sc1 = torusNoise(px, py, size, 1.2);
          var sc2 = torusNoise(px, py, size, 3.5);
          var sc3 = Math.pow(0.5 + 0.5 * Math.sin(vTi * 8.0 + torusNoise(px, py, size, 1.8) * 4.0), 3.0);
          var scratch = 0.45 * sc1 + 0.35 * sc2 + 0.20 * sc3;

          var tintNoise = 0.5 + 0.5 * torusNoise(px, py, size, 0.5);
          hVal = 0.5 + 0.4 * scratch;

          var baseTitanium = 190 + scratch * 55;
          rA = Math.min(255, Math.max(0, Math.floor(baseTitanium * 0.94 + tintNoise * 14)));
          gA = Math.min(255, Math.max(0, Math.floor(baseTitanium * 0.97 + tintNoise * 4)));
          bA = Math.min(255, Math.max(0, Math.floor(baseTitanium * 1.02 + (1.0 - tintNoise) * 16)));

          var roughTi = 0.20 + 0.24 * (0.5 + 0.5 * scratch);
          rVal = Math.floor(roughTi * 255);

          var metalTi = 0.94 + 0.04 * (1.0 - Math.abs(scratch));
          mVal = Math.floor(metalTi * 255);

          rE = 0; gE = 0; bE = 0;
        }
        else if (style === 'iridescent-hologram') {
          var uHolo = (px / size) * Math.PI * 2;
          var vHolo = (py / size) * Math.PI * 2;
          var w1Holo = Math.sin(Math.sin(uHolo) * 6.0 + Math.cos(vHolo) * 6.0);
          var w2Holo = seamlessFBM(px, py, size, 1.2, 3, 0.6);
          var w3Holo = Math.sin(uHolo * 4.0 + vHolo * 3.0 + w2Holo * 3.0);

          var phaseHolo = Math.sin(uHolo) * 0.8 + Math.cos(vHolo) * 0.6 + w1Holo * 0.4 + w2Holo * 0.8 + w3Holo * 0.3;
          var hueHolo = ((phaseHolo * 360) % 360 + 360) % 360;
          var chromaRGB = hslToRgb(hueHolo, 0.92, 0.60 + 0.25 * w1Holo);

          hVal = 0.5 + 0.3 * w1Holo + 0.2 * w3Holo;

          rA = chromaRGB.r;
          gA = chromaRGB.g;
          bA = chromaRGB.b;

          var roughHolo = 0.05 + 0.08 * (0.5 + 0.5 * w1Holo);
          rVal = Math.floor(roughHolo * 255);

          mVal = Math.floor(0.88 * 255);

          var glowFactor = 0.6 + 0.4 * Math.sin(w3Holo * Math.PI);
          rE = Math.floor(chromaRGB.r * 0.7 * glowFactor + themeRGB.r * 0.3);
          gE = Math.floor(chromaRGB.g * 0.7 * glowFactor + themeRGB.g * 0.3);
          bE = Math.floor(chromaRGB.b * 0.7 * glowFactor + themeRGB.b * 0.3);
        }
        else if (style === 'bio-organic') {
          var cellNoise = seamlessFBM(px, py, size, 2.5, 4, 0.55);
          var scaleRidge = 1.0 - Math.abs(torusNoise(px, py, size, 3.0) * 2.0);
          var scaleDome = Math.sin(Math.max(0, scaleRidge) * Math.PI * 0.5);

          var v1Bio = Math.abs(torusNoise(px, py, size, 1.2));
          var vein1Bio = Math.max(0, 1.0 - v1Bio * 5.5);
          var v2Bio = Math.abs(torusNoise(px, py, size, 2.4));
          var vein2Bio = Math.max(0, 1.0 - v2Bio * 7.0);
          var veinTotal = Math.min(1.0, Math.pow(vein1Bio, 2.5) * 1.2 + Math.pow(vein2Bio, 2.0) * 0.7);

          hVal = 0.25 * cellNoise + 0.35 * scaleDome + 0.40 * veinTotal;

          var sssScatter = Math.pow(veinTotal, 0.5);
          var baseSkinR = 16, baseSkinG = 28, baseSkinB = 24;
          rA = Math.min(255, Math.floor(baseSkinR * (1 - sssScatter) + (themeRGB.r * 0.9 + 30) * sssScatter));
          gA = Math.min(255, Math.floor(baseSkinG * (1 - sssScatter) + (themeRGB.g * 0.9 + 30) * sssScatter));
          bA = Math.min(255, Math.floor(baseSkinB * (1 - sssScatter) + (themeRGB.b * 0.9 + 30) * sssScatter));

          var roughBio = 0.35 * (1.0 - veinTotal * 0.65) + 0.10 * cellNoise;
          rVal = Math.floor(roughBio * 255);

          mVal = Math.floor(0.03 * 255);

          rE = Math.min(255, Math.floor(themeRGB.r * veinTotal * 1.4));
          gE = Math.min(255, Math.floor(themeRGB.g * veinTotal * 1.4));
          bE = Math.min(255, Math.floor(themeRGB.b * veinTotal * 1.4));
        }
        else if (style === 'damascus-steel') {
          var uDam = (px / size) * Math.PI * 2;
          var vDam = (py / size) * Math.PI * 2;
          var warpX = seamlessFBM(px, py, size, 0.5, 3, 0.5) * 2.0;
          var warpY = seamlessFBM(px, py, size, 0.5, 3, 0.5) * 2.0;
          var waveDam = Math.sin(uDam * 2.0 + warpX + Math.sin(vDam * 2.0 + warpY) * 0.8);
          var raindrop = Math.sin(uDam * 2.0) * Math.sin(vDam * 2.0);
          var foldField = waveDam * 0.8 + raindrop * 0.2;

          var bandDam = 0.5 + 0.5 * Math.sin(foldField * Math.PI * 1.5);
          var etchedDam = Math.pow(bandDam, 1.8);

          hVal = etchedDam;

          rA = Math.floor(28 + (219 - 28) * etchedDam);
          gA = Math.floor(32 + (226 - 32) * etchedDam);
          bA = Math.floor(40 + (237 - 40) * etchedDam);

          var roughDam = 0.46 - (0.46 - 0.14) * etchedDam;
          rVal = Math.floor(roughDam * 255);

          var metalDam = 0.90 + 0.08 * etchedDam;
          mVal = Math.floor(metalDam * 255);

          var seamGlow = Math.abs(etchedDam - 0.5) < 0.06 ? 0.35 : 0.0;
          rE = Math.floor(themeRGB.r * seamGlow);
          gE = Math.floor(themeRGB.g * seamGlow);
          bE = Math.floor(themeRGB.b * seamGlow);
        }
        else if (style === 'hologram-grid') {
          var repHG = size >= 1024 ? 32 : 16;
          var uHG = (px / size) * repHG;
          var vHG = (py / size) * repHG;
          var lxHG = uHG - Math.floor(uHG);
          var lyHG = vHG - Math.floor(vHG);
          var distEdgeHG = Math.min(lxHG, 1.0 - lxHG, lyHG, 1.0 - lyHG);
          var isLineHG = distEdgeHG < 0.08;
          var isNodeHG = (lxHG < 0.16 || lxHG > 0.84) && (lyHG < 0.16 || lyHG > 0.84);
          var scanlineHG = 0.5 + 0.5 * Math.sin((py / size) * Math.PI * 64.0);
          var waveHG = torusNoise(px, py, size, 1.5);

          hVal = isNodeHG ? 0.95 : isLineHG ? 0.75 : (0.15 + 0.10 * scanlineHG);

          var baseHoloR = 4, baseHoloG = 12, baseHoloB = 28;
          if (isNodeHG) {
            rA = 240; gA = 255; bA = 255;
            rVal = 30; mVal = 240;
            rE = Math.min(255, themeRGB.r + 50);
            gE = Math.min(255, themeRGB.g + 50);
            bE = Math.min(255, themeRGB.b + 50);
          } else if (isLineHG) {
            rA = themeRGB.r; gA = themeRGB.g; bA = themeRGB.b;
            rVal = 45; mVal = 210;
            rE = Math.floor(themeRGB.r * 0.9);
            gE = Math.floor(themeRGB.g * 0.9);
            bE = Math.floor(themeRGB.b * 0.9);
          } else {
            rA = Math.floor(baseHoloR + 8 * waveHG);
            gA = Math.floor(baseHoloG + 14 * waveHG);
            bA = Math.floor(baseHoloB + 20 * waveHG);
            rVal = 160; mVal = 40;
            var scanGlowHG = 0.25 * scanlineHG;
            rE = Math.floor(themeRGB.r * scanGlowHG);
            gE = Math.floor(themeRGB.g * scanGlowHG);
            bE = Math.floor(themeRGB.b * scanGlowHG);
          }
        }
        else if (style === 'azoth-gold') {
          var flakeNoise = seamlessFBM(px, py, size, 3.5, 4, 0.62);
          var amberNoise = torusNoise(px, py, size, 1.2);
          var leafEdge = Math.pow(Math.max(0, flakeNoise), 1.8);
          var crackNoise = Math.abs(torusNoise(px, py, size, 5.0));
          var isVein = crackNoise < 0.08 ? 1.0 : 0.0;

          hVal = 0.5 + 0.4 * leafEdge - 0.2 * isVein;

          var baseGoldR = 251, baseGoldG = 191, baseGoldB = 36;
          var amberR = 217, amberG = 119, amberB = 6;

          rA = Math.min(255, Math.floor(baseGoldR * (0.6 + 0.4 * leafEdge) + 20 * (1.0 - isVein)));
          gA = Math.min(255, Math.floor((baseGoldG * 0.7 + amberG * 0.3) * (0.6 + 0.4 * leafEdge)));
          bA = Math.min(255, Math.floor((baseGoldB * 0.5 + amberB * 0.5) * (0.4 + 0.6 * leafEdge)));

          rVal = Math.floor((0.08 + 0.18 * (1.0 - leafEdge) + 0.3 * isVein) * 255);
          mVal = Math.floor((0.92 + 0.06 * leafEdge - 0.25 * isVein) * 255);

          var goldResonance = 0.35 + 0.45 * leafEdge;
          rE = Math.floor(baseGoldR * 0.35 * goldResonance);
          gE = Math.floor(baseGoldG * 0.30 * goldResonance);
          bE = Math.floor(baseGoldB * 0.10 * goldResonance);
        }
        else if (style === 'obsidian-matte') {
          var fbmObs = seamlessFBM(px, py, size, 2.2, 4, 0.55);
          var repC = size >= 1024 ? 48 : 24;
          var microWeave = 0.5 + 0.5 * Math.sin((px / size) * Math.PI * repC) * Math.sin((py / size) * Math.PI * repC);
          var edgeFacet = Math.abs(torusNoise(px, py, size, 3.8));

          hVal = 0.45 + 0.3 * fbmObs + 0.15 * microWeave;

          var baseObs = 12 + Math.floor(10 * fbmObs + 6 * microWeave);
          rA = Math.min(255, baseObs);
          gA = Math.min(255, baseObs + 2);
          bA = Math.min(255, baseObs + 6);

          rVal = Math.floor((0.32 + 0.18 * microWeave + 0.10 * (1.0 - fbmObs)) * 255);
          mVal = Math.floor((0.14 + 0.10 * microWeave) * 255);

          var darkEdgeReflect = edgeFacet < 0.06 ? 0.20 : 0.0;
          rE = Math.floor(themeRGB.r * darkEdgeReflect * 0.3);
          gE = Math.floor(themeRGB.g * darkEdgeReflect * 0.3);
          bE = Math.floor(themeRGB.b * darkEdgeReflect * 0.3);
        }
        else if (style === 'neon-wireframe') {
          var repNW = size >= 1024 ? 24 : 12;
          var uNW = (px / size) * repNW;
          var vNW = (py / size) * repNW;
          var lxNW = uNW - Math.floor(uNW);
          var lyNW = vNW - Math.floor(vNW);
          var edgeDistNW = Math.min(lxNW, 1.0 - lxNW, lyNW, 1.0 - lyNW);
          var diagDistNW = Math.min(Math.abs(lxNW - lyNW), Math.abs(lxNW - (1.0 - lyNW)));
          var isEdgeNW = edgeDistNW < 0.07;
          var isDiagNW = diagDistNW < 0.05;
          var isWireNW = isEdgeNW || isDiagNW;
          var isVertexNW = (lxNW < 0.12 || lxNW > 0.88) && (lyNW < 0.12 || lyNW > 0.88);

          hVal = isVertexNW ? 0.98 : isWireNW ? 0.80 : 0.05;

          if (isVertexNW) {
            rA = 255; gA = 255; bA = 255;
            rVal = 20; mVal = 240;
            rE = 255; gE = 255; bE = 255;
          } else if (isWireNW) {
            rA = themeRGB.r; gA = themeRGB.g; bA = themeRGB.b;
            rVal = 35; mVal = 210;
            rE = themeRGB.r; gE = themeRGB.g; bE = themeRGB.b;
          } else {
            rA = 3; gA = 6; bA = 12;
            rVal = 220; mVal = 10;
            rE = 0; gE = 0; bE = 0;
          }
        }
        else if (style === 'bioluminescent-pulse') {
          var bioFBM = seamlessFBM(px, py, size, 2.0, 4, 0.58);
          var bioVein1 = Math.abs(torusNoise(px, py, size, 2.2));
          var bioVein2 = Math.abs(torusNoise(px, py, size, 4.4));
          var veinMask = Math.max(0.0, 1.0 - bioVein1 * 4.2) * 0.7 + Math.max(0.0, 1.0 - bioVein2 * 6.0) * 0.5;
          var pulseNode = Math.pow(Math.min(1.0, veinMask), 2.2);

          hVal = 0.25 * bioFBM + 0.75 * pulseNode;

          var darkSkinR = 6, darkSkinG = 20, darkSkinB = 26;
          var emeraldR = 52, emeraldG = 211, emeraldB = 153;

          rA = Math.min(255, Math.floor(darkSkinR * (1.0 - pulseNode) + (emeraldR * 0.7 + themeRGB.r * 0.3) * pulseNode));
          gA = Math.min(255, Math.floor(darkSkinG * (1.0 - pulseNode) + (emeraldG * 0.8 + themeRGB.g * 0.2) * pulseNode));
          bA = Math.min(255, Math.floor(darkSkinB * (1.0 - pulseNode) + (emeraldB * 0.6 + themeRGB.b * 0.4) * pulseNode));

          rVal = Math.floor((0.25 * (1.0 - pulseNode * 0.7) + 0.10 * bioFBM) * 255);
          mVal = Math.floor(0.08 * 255);

          rE = Math.min(255, Math.floor((emeraldR * 0.6 + themeRGB.r * 0.4) * pulseNode * 1.6));
          gE = Math.min(255, Math.floor((emeraldG * 0.7 + themeRGB.g * 0.3) * pulseNode * 1.6));
          bE = Math.min(255, Math.floor((emeraldB * 0.5 + themeRGB.b * 0.5) * pulseNode * 1.6));
        }
        else {
          // 'cyber-circuit'
          var gridSize = size >= 1024 ? 32 : 16;
          var gx = Math.floor(px / gridSize);
          var gy = Math.floor(py / gridSize);
          var lx = px % gridSize;
          var ly = py % gridSize;
          var cellHash = ((((gx * 1973 + gy * 9277) ^ (gx * 389 + gy * 7919)) >>> 0) % 1000);

          var isTrace = (Math.abs(lx - gridSize / 2) < 2) || (Math.abs(ly - gridSize / 2) < 2) || ((Math.abs(lx - ly) < 2) && (cellHash % 3 === 0));
          var centerDist = Math.hypot(lx - gridSize / 2, ly - gridSize / 2);
          var isPad = (cellHash % 5 === 0) && (centerDist < gridSize * 0.38);
          var isHole = isPad && (centerDist < gridSize * 0.16);
          var isChip = (cellHash % 13 === 0) && (lx > 2 && lx < gridSize - 2 && ly > 2 && ly < gridSize - 2);

          var isBusX = ((Math.floor(px / (gridSize * 4)) % 4 === 0) && (ly >= 4 && ly <= 8));
          var isBusY = ((Math.floor(py / (gridSize * 4)) % 4 === 0) && (lx >= 4 && lx <= 8));
          var isBus = isBusX || isBusY;
          var isBusNode = isBusX && isBusY;

          if (isHole) {
            hVal = 0.05; rA = 5; gA = 7; bA = 12; rVal = 200; mVal = 30;
          } else if (isPad) {
            hVal = 0.70; rA = 229; gA = 184; bA = 66; rVal = 35; mVal = 245;
          } else if (isChip) {
            hVal = 0.90; rA = 16; gA = 21; bA = 36; rVal = 50; mVal = 75;
          } else if (isBus) {
            hVal = 0.60; rA = 16; gA = 48; bA = 72; rVal = 40; mVal = 230;
          } else if (isTrace) {
            hVal = 0.45; rA = 24; gA = 40; bA = 64; rVal = 65; mVal = 240;
          } else {
            hVal = 0.10; rA = baseRGB.r; gA = baseRGB.g; bA = baseRGB.b; rVal = 175; mVal = 12;
          }

          var glowCircuit = isBusNode ? 1.0 : isBus ? 0.85 : (isPad && (cellHash % 2 === 0)) ? 0.9 : 0.0;
          rE = Math.floor(themeRGB.r * glowCircuit);
          gE = Math.floor(themeRGB.g * glowCircuit);
          bE = Math.floor(themeRGB.b * glowCircuit);
        }

        heightMap[idx] = hVal;

        dataA[p4] = rA;
        dataA[p4 + 1] = gA;
        dataA[p4 + 2] = bA;
        dataA[p4 + 3] = 255;

        dataR[p4] = rVal;
        dataR[p4 + 1] = rVal;
        dataR[p4 + 2] = rVal;
        dataR[p4 + 3] = 255;

        dataM[p4] = mVal;
        dataM[p4 + 1] = mVal;
        dataM[p4 + 2] = mVal;
        dataM[p4 + 3] = 255;

        dataE[p4] = rE;
        dataE[p4 + 1] = gE;
        dataE[p4 + 2] = bE;
        dataE[p4 + 3] = 255;
      }
    }

    // 2. TANGENT-SPACE NORMAL MAP DERIVATION (Seamless Torus Gradient)
    var normalScale = params.normalScale || (
      style === 'damascus-steel' ? 3.0 :
      style === 'carbon-fiber' ? 2.5 :
      style === 'brushed-titanium' ? 1.8 :
      style === 'bio-organic' ? 3.2 :
      style === 'cyber-circuit' ? 2.8 :
      style === 'hologram-grid' ? 2.6 :
      style === 'azoth-gold' ? 2.4 :
      style === 'obsidian-matte' ? 2.2 :
      style === 'neon-wireframe' ? 3.0 :
      style === 'bioluminescent-pulse' ? 3.4 : 2.5
    );

    for (var pyN = 0; pyN < size; pyN++) {
      var pyUp = (pyN - 1 + size) % size;
      var pyDown = (pyN + 1) % size;
      var rowOffsetN = pyN * size;
      var rowUpOffsetN = pyUp * size;
      var rowDownOffsetN = pyDown * size;

      for (var pxN = 0; pxN < size; pxN++) {
        var pxLeft = (pxN - 1 + size) % size;
        var pxRight = (pxN + 1) % size;

        var hL = heightMap[rowOffsetN + pxLeft];
        var hR = heightMap[rowOffsetN + pxRight];
        var hU = heightMap[rowUpOffsetN + pxN];
        var hD = heightMap[rowDownOffsetN + pxN];

        var dx = (hR - hL) * normalScale;
        var dy = (hD - hU) * normalScale;
        var dz = 1.0;

        var invLen = 1.0 / Math.sqrt(dx * dx + dy * dy + dz * dz);
        var nx = -dx * invLen;
        var ny = -dy * invLen;
        var nz = dz * invLen;

        var nIdx = (rowOffsetN + pxN) * 4;
        dataN[nIdx] = Math.floor((nx * 0.5 + 0.5) * 255);
        dataN[nIdx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
        dataN[nIdx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
        dataN[nIdx + 3] = 255;
      }
    }

    return {
      style: style,
      size: size,
      width: size,
      height: size,
      albedo: dataA,
      normal: dataN,
      roughness: dataR,
      metalness: dataM,
      emissive: dataE,
      heightMap: heightMap
    };
  }

  function createProceduralPBRTextures(params) {
    if (typeof document === 'undefined' || !document.createElement) {
      return {
        map: null,
        normalMap: null,
        roughnessMap: null,
        metalnessMap: null,
        emissiveMap: null,
        canvases: null
      };
    }
    params = params || {};
    var pbr = generatePBRBuffers(params);
    var size = pbr.size;

    var cAlbedo = document.createElement('canvas');
    cAlbedo.width = cAlbedo.height = size;
    var ctxA = cAlbedo.getContext('2d');
    var imgA = ctxA.createImageData(size, size);
    imgA.data.set(pbr.albedo);
    ctxA.putImageData(imgA, 0, 0);

    var cNormal = document.createElement('canvas');
    cNormal.width = cNormal.height = size;
    var ctxN = cNormal.getContext('2d');
    var imgN = ctxN.createImageData(size, size);
    imgN.data.set(pbr.normal);
    ctxN.putImageData(imgN, 0, 0);

    var cRough = document.createElement('canvas');
    cRough.width = cRough.height = size;
    var ctxR = cRough.getContext('2d');
    var imgR = ctxR.createImageData(size, size);
    imgR.data.set(pbr.roughness);
    ctxR.putImageData(imgR, 0, 0);

    var cMetal = document.createElement('canvas');
    cMetal.width = cMetal.height = size;
    var ctxM = cMetal.getContext('2d');
    var imgM = ctxM.createImageData(size, size);
    imgM.data.set(pbr.metalness);
    ctxM.putImageData(imgM, 0, 0);

    var cEmissive = document.createElement('canvas');
    cEmissive.width = cEmissive.height = size;
    var ctxE = cEmissive.getContext('2d');
    var imgE = ctxE.createImageData(size, size);
    imgE.data.set(pbr.emissive);
    ctxE.putImageData(imgE, 0, 0);

    var texAlbedo = (THREE && THREE.CanvasTexture) ? new THREE.CanvasTexture(cAlbedo) : null;
    var texNormal = (THREE && THREE.CanvasTexture) ? new THREE.CanvasTexture(cNormal) : null;
    var texRough = (THREE && THREE.CanvasTexture) ? new THREE.CanvasTexture(cRough) : null;
    var texMetal = (THREE && THREE.CanvasTexture) ? new THREE.CanvasTexture(cMetal) : null;
    var texEmissive = (THREE && THREE.CanvasTexture) ? new THREE.CanvasTexture(cEmissive) : null;

    [texAlbedo, texNormal, texRough, texMetal, texEmissive].forEach(function (t) {
      if (t && THREE && THREE.RepeatWrapping) {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
      }
    });

    return {
      map: texAlbedo,
      normalMap: texNormal,
      roughnessMap: texRough,
      metalnessMap: texMetal,
      emissiveMap: texEmissive,
      canvases: {
        albedo: cAlbedo,
        normal: cNormal,
        roughness: cRough,
        metalness: cMetal,
        emissive: cEmissive
      }
    };
  }

  // =========================================================================
  // 4. PROCEDURAL GEOMETRY UTILITIES
  // =========================================================================

  function applyNoiseDisplacement(geometry, options) {
    options = options || {};
    var freq = options.frequency || 0.8;
    var amp = options.amplitude || 0.25;
    var octaves = options.octaves || 3;
    var power = options.power || 1.0;

    var pos = geometry.attributes.position;
    var norm = geometry.attributes.normal;
    if (!norm) {
      geometry.computeVertexNormals();
      norm = geometry.attributes.normal;
    }

    var v = new THREE.Vector3();
    var n = new THREE.Vector3();

    for (var i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      n.fromBufferAttribute(norm, i);

      var totalNoise = 0;
      var currentFreq = freq;
      var currentAmp = amp;

      for (var o = 0; o < octaves; o++) {
        totalNoise += simplexNoise3D(v.x * currentFreq, v.y * currentFreq, v.z * currentFreq) * currentAmp;
        currentFreq *= 2.0;
        currentAmp *= 0.5;
      }

      if (power !== 1.0) {
        totalNoise = Math.sign(totalNoise) * Math.pow(Math.abs(totalNoise), power);
      }

      v.addScaledVector(n, totalNoise);
      pos.setXYZ(i, v.x, v.y, v.z);
    }

    geometry.computeVertexNormals();
    pos.needsUpdate = true;
    return geometry;
  }

  function create4DTesseractGeometry(size, angle4D) {
    size = size || 2.0;
    angle4D = angle4D || 0.0;

    var vertices4D = [];
    for (var x = -1; x <= 1; x += 2) {
      for (var y = -1; y <= 1; y += 2) {
        for (var z = -1; z <= 1; z += 2) {
          for (var w = -1; w <= 1; w += 2) {
            vertices4D.push([x, y, z, w]);
          }
        }
      }
    }

    var cosA = Math.cos(angle4D);
    var sinA = Math.sin(angle4D);
    var distance4D = 2.8;

    var projected3D = [];
    for (var i = 0; i < vertices4D.length; i++) {
      var v4 = vertices4D[i];
      var rx = v4[0] * cosA - v4[3] * sinA;
      var rw = v4[0] * sinA + v4[3] * cosA;
      var factor = 1.0 / (distance4D - rw);
      projected3D.push(new THREE.Vector3(rx * factor * size, v4[1] * factor * size, v4[2] * factor * size));
    }

    var linePoints = [];
    for (var a = 0; a < 16; a++) {
      for (var b = a + 1; b < 16; b++) {
        var diff = 0;
        for (var k = 0; k < 4; k++) {
          if (vertices4D[a][k] !== vertices4D[b][k]) diff++;
        }
        if (diff === 1) {
          linePoints.push(projected3D[a].x, projected3D[a].y, projected3D[a].z);
          linePoints.push(projected3D[b].x, projected3D[b].y, projected3D[b].z);
        }
      }
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
    return geo;
  }

  function createFibonacciPhyllotaxisGeometry(count, radius) {
    count = count || 300;
    radius = radius || 2.5;
    var positions = [];

    for (var i = 0; i < count; i++) {
      var y = 1 - (i / (count - 1)) * 2;
      var radiusAtY = Math.sqrt(1 - y * y);
      var theta = i * GOLDEN_ANGLE;
      var x = Math.cos(theta) * radiusAtY;
      var z = Math.sin(theta) * radiusAtY;
      positions.push(x * radius, y * radius, z * radius);
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }

  function signedPow(v, e) {
    if (v === 0) return 0;
    return Math.sign(v) * Math.pow(Math.abs(v), e);
  }

  function createSuperquadricGeometry(options) {
    options = options || {};
    var s1 = options.s1 !== undefined ? options.s1 : 0.3;
    var s2 = options.s2 !== undefined ? options.s2 : 0.3;
    var rx = options.radiusX || options.radius || 1.2;
    var ry = options.radiusY || options.radius || 1.8;
    var rz = options.radiusZ || options.radius || 1.2;
    var segU = options.segmentsU || 32;
    var segV = options.segmentsV || 32;
    var pinch = options.pinch || 0.0;
    var taper = options.taper || 0.0;
    var bend = options.bend || 0.0;

    var positions = [];
    var uvs = [];
    var indices = [];

    for (var i = 0; i <= segU; i++) {
      var u = -Math.PI / 2 + (i / segU) * Math.PI;
      var cu = signedPow(Math.cos(u), s1);
      var su = signedPow(Math.sin(u), s1);

      for (var j = 0; j <= segV; j++) {
        var v = -Math.PI + (j / segV) * 2 * Math.PI;
        var cv = signedPow(Math.cos(v), s2);
        var sv = signedPow(Math.sin(v), s2);

        var x0 = rx * cu * cv;
        var y0 = ry * su;
        var z0 = rz * cu * sv;

        var yn = ry !== 0 ? (y0 / ry) : 0;

        if (taper !== 0) {
          var tFactor = Math.max(0.001, 1.0 + taper * yn);
          x0 *= tFactor;
          z0 *= tFactor;
        }

        if (pinch !== 0) {
          var pFactor = Math.max(0.001, 1.0 - pinch * (1.0 - yn * yn));
          x0 *= pFactor;
          z0 *= pFactor;
        }

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
    return geo;
  }

  function createCalabiYauGeometry(options) {
    options = options || {};
    var n = options.n || 5;
    var kMax = options.kMax || 3;
    var radius = options.radius || 2.0;
    var segU = options.segmentsU || 32;
    var segV = options.segmentsV || 32;
    var alpha = options.alpha !== undefined ? options.alpha : 0.45;
    var beta = options.beta !== undefined ? options.beta : 0.35;
    var gamma = options.gamma !== undefined ? options.gamma : 0.6;

    var cosA = Math.cos(alpha), sinA = Math.sin(alpha);
    var cosB = Math.cos(beta), sinB = Math.sin(beta);
    var cosG = Math.cos(gamma), sinG = Math.sin(gamma);

    var positions = [];
    var uvs = [];
    var indices = [];
    var vertexOffset = 0;

    for (var k = 0; k < kMax; k++) {
      var kStart = vertexOffset;
      for (var i = 0; i <= segU; i++) {
        var u = -Math.PI + (i / segU) * 2 * Math.PI;
        for (var j = 0; j <= segV; j++) {
          var v = (j / segV) * (Math.PI / 2);
          var cosV = Math.cos(v);
          var sinV = Math.sin(v);

          var cosVPow = cosV > 0 ? Math.pow(cosV, 2.0 / n) : 0;
          var sinVPow = sinV > 0 ? Math.pow(sinV, 2.0 / n) : 0;

          var x1 = Math.cos(u) * cosVPow;
          var y1 = Math.sin(u) * cosVPow;

          var phi2 = u + (2.0 * Math.PI * k / n);
          var x2 = Math.cos(phi2) * sinVPow;
          var y2 = Math.sin(phi2) * sinVPow;

          var px = (x1 * cosA - y1 * sinA + x2 * cosB * 0.5) * radius;
          var py = (x2 * sinB + y2 * cosG) * radius;
          var pz = (y1 * cosA + x1 * sinA - y2 * sinG) * radius;

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
    return geo;
  }

  function createInvoluteGearGeometry(options) {
    options = options || {};
    var numTeeth = options.numTeeth || 16;
    var pitchRadius = options.pitchRadius || 2.0;
    var pressureAngle = (options.pressureAngle || 20) * Math.PI / 180;
    var thickness = options.thickness || 0.5;
    var boreRadius = options.boreRadius || (pitchRadius * 0.25);
    var keyway = options.keyway !== false;

    var m = 2.0 * pitchRadius / numTeeth;
    var addendum = 1.0 * m;
    var dedendum = 1.25 * m;
    var outerRadius = pitchRadius + addendum;
    var rootRadius = Math.max(boreRadius + 0.2, pitchRadius - dedendum);

    var outerPts = [];
    var toothAngle = (2 * Math.PI) / numTeeth;

    for (var t = 0; t < numTeeth; t++) {
      var mid = t * toothAngle;
      var a_r1 = mid - toothAngle * 0.45;
      var a_p1 = mid - toothAngle * 0.22;
      var a_t1 = mid - toothAngle * 0.12;
      var a_t2 = mid + toothAngle * 0.12;
      var a_p2 = mid + toothAngle * 0.22;
      var a_r2 = mid + toothAngle * 0.45;

      outerPts.push([rootRadius * Math.cos(a_r1), rootRadius * Math.sin(a_r1)]);
      outerPts.push([pitchRadius * Math.cos(a_p1), pitchRadius * Math.sin(a_p1)]);
      outerPts.push([outerRadius * Math.cos(a_t1), outerRadius * Math.sin(a_t1)]);
      outerPts.push([outerRadius * Math.cos(a_t2), outerRadius * Math.sin(a_t2)]);
      outerPts.push([pitchRadius * Math.cos(a_p2), pitchRadius * Math.sin(a_p2)]);
      outerPts.push([rootRadius * Math.cos(a_r2), rootRadius * Math.sin(a_r2)]);
    }

    var borePts = [];
    var nPts = outerPts.length;
    var kwH = boreRadius * 0.3;

    for (var b = 0; b < nPts; b++) {
      var bAngle = (b / nPts) * 2 * Math.PI;
      var bx = boreRadius * Math.cos(bAngle);
      var by = boreRadius * Math.sin(bAngle);
      if (keyway && Math.abs(bAngle - Math.PI / 2) < 0.25) {
        by += kwH;
      }
      borePts.push([bx, by]);
    }

    var positions = [];
    var uvs = [];
    var indices = [];

    var zF = thickness / 2;
    var zB = -thickness / 2;

    for (var i = 0; i < nPts; i++) {
      positions.push(outerPts[i][0], outerPts[i][1], zF);
      uvs.push(outerPts[i][0] / (2 * outerRadius) + 0.5, outerPts[i][1] / (2 * outerRadius) + 0.5);
    }
    for (var i = 0; i < nPts; i++) {
      positions.push(borePts[i][0], borePts[i][1], zF);
      uvs.push(borePts[i][0] / (2 * outerRadius) + 0.5, borePts[i][1] / (2 * outerRadius) + 0.5);
    }
    for (var i = 0; i < nPts; i++) {
      positions.push(outerPts[i][0], outerPts[i][1], zB);
      uvs.push(outerPts[i][0] / (2 * outerRadius) + 0.5, outerPts[i][1] / (2 * outerRadius) + 0.5);
    }
    for (var i = 0; i < nPts; i++) {
      positions.push(borePts[i][0], borePts[i][1], zB);
      uvs.push(borePts[i][0] / (2 * outerRadius) + 0.5, borePts[i][1] / (2 * outerRadius) + 0.5);
    }

    // Front Cap
    for (var i = 0; i < nPts; i++) {
      var next = (i + 1) % nPts;
      indices.push(i, next, nPts + next);
      indices.push(i, nPts + next, nPts + i);
    }

    // Back Cap
    for (var i = 0; i < nPts; i++) {
      var next = (i + 1) % nPts;
      indices.push(2 * nPts + i, 3 * nPts + next, 2 * nPts + next);
      indices.push(2 * nPts + i, 3 * nPts + i, 3 * nPts + next);
    }

    // Outer Sidewalls
    for (var i = 0; i < nPts; i++) {
      var next = (i + 1) % nPts;
      indices.push(i, 2 * nPts + i, 2 * nPts + next);
      indices.push(i, 2 * nPts + next, next);
    }

    // Bore Sidewalls
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
    return geo;
  }

  function createCyberArmorPlateGeometry(options) {
    options = options || {};
    var pattern = options.pattern || 'hexagonal';
    var rows = options.rows || 3;
    var cols = options.cols || 3;
    var plateRadius = options.plateRadius || 0.75;
    var thickness = options.thickness || 0.18;
    var bevelSize = options.bevelSize || 0.06;
    var gap = options.gap || 0.06;
    var curvature = options.curvature || 4.5;

    var polySides = pattern === 'diamond' ? 4 : 6;
    var polyPts = [];
    if (pattern === 'diamond') {
      for (var a = 0; a < 4; a++) {
        var ang = (Math.PI / 2) * a;
        polyPts.push([plateRadius * 1.25 * Math.cos(ang), plateRadius * 0.8 * Math.sin(ang)]);
      }
    } else {
      for (var a = 0; a < 6; a++) {
        var ang = (Math.PI / 3) * a;
        polyPts.push([plateRadius * Math.cos(ang), plateRadius * Math.sin(ang)]);
      }
    }

    var bevelScale = Math.max(0.2, (plateRadius - bevelSize) / plateRadius);
    var beveledPts = polyPts.map(function (p) {
      return [p[0] * bevelScale, p[1] * bevelScale];
    });

    var positions = [];
    var uvs = [];
    var indices = [];
    var vertOffset = 0;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var cx, cy;
        if (pattern === 'diamond') {
          cx = (c - (cols - 1) / 2) * (plateRadius * 1.25 * 2 + gap);
          cy = (r - (rows - 1) / 2) * (plateRadius * 0.8 * 2 + gap);
          if (r % 2 === 1) cx += plateRadius * 1.25 + gap / 2;
        } else {
          var hStepX = plateRadius * Math.sqrt(3) + gap;
          var hStepY = plateRadius * 1.5 + gap;
          cx = (c - (cols - 1) / 2) * hStepX + ((r % 2) * (hStepX / 2));
          cy = (r - (rows - 1) / 2) * hStepY;
        }

        var cz = curvature > 0 ? -((cx * cx + cy * cy) / (2 * curvature)) : 0;
        var baseIdx = vertOffset;

        for (var p = 0; p < polySides; p++) {
          positions.push(cx + polyPts[p][0], cy + polyPts[p][1], cz);
          uvs.push(0.5 + polyPts[p][0] / 2, 0.5 + polyPts[p][1] / 2);
          vertOffset++;
        }

        for (var p = 0; p < polySides; p++) {
          positions.push(cx + polyPts[p][0], cy + polyPts[p][1], cz + thickness - bevelSize);
          uvs.push(0.5 + polyPts[p][0] / 2, 0.5 + polyPts[p][1] / 2);
          vertOffset++;
        }

        for (var p = 0; p < polySides; p++) {
          positions.push(cx + beveledPts[p][0], cy + beveledPts[p][1], cz + thickness);
          uvs.push(0.5 + beveledPts[p][0] / 2, 0.5 + beveledPts[p][1] / 2);
          vertOffset++;
        }

        positions.push(cx, cy, cz + thickness - bevelSize * 0.3);
        uvs.push(0.5, 0.5);
        var topCenterIdx = vertOffset;
        vertOffset++;

        // Bottom face
        for (var i = 1; i < polySides - 1; i++) {
          indices.push(baseIdx, baseIdx + i + 1, baseIdx + i);
        }

        // Side walls
        for (var i = 0; i < polySides; i++) {
          var next = (i + 1) % polySides;
          var b0 = baseIdx + i;
          var b1 = baseIdx + next;
          var m0 = baseIdx + polySides + i;
          var m1 = baseIdx + polySides + next;
          indices.push(b0, b1, m1);
          indices.push(b0, m1, m0);
        }

        // Chamfer Bevels
        for (var i = 0; i < polySides; i++) {
          var next = (i + 1) % polySides;
          var m0 = baseIdx + polySides + i;
          var m1 = baseIdx + polySides + next;
          var t0 = baseIdx + 2 * polySides + i;
          var t1 = baseIdx + 2 * polySides + next;
          indices.push(m0, m1, t1);
          indices.push(m0, t1, t0);
        }

        // Top Cap
        for (var i = 0; i < polySides; i++) {
          var next = (i + 1) % polySides;
          var t0 = baseIdx + 2 * polySides + i;
          var t1 = baseIdx + 2 * polySides + next;
          indices.push(topCenterIdx, t0, t1);
        }
      }
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  function createKleinBottleGeometry(options) {
    options = options || {};
    var radius = options.radius || 1.8;
    var tubeRadius = options.tubeRadius || 0.6;
    var segU = options.segmentsU || 40;
    var segV = options.segmentsV || 40;

    var positions = [];
    var uvs = [];
    var indices = [];

    for (var i = 0; i <= segU; i++) {
      var u = (i / segU) * 2 * Math.PI;
      var cosU = Math.cos(u);
      var sinU = Math.sin(u);
      var cosHalfU = Math.cos(u / 2);
      var sinHalfU = Math.sin(u / 2);

      for (var j = 0; j <= segV; j++) {
        var v = (j / segV) * 2 * Math.PI;
        var sinV = Math.sin(v);
        var sin2V = Math.sin(2 * v);

        var w = tubeRadius * (cosHalfU * sinV - sinHalfU * sin2V);
        var x = (radius + w) * cosU;
        var y = (radius + w) * sinU;
        var z = tubeRadius * (sinHalfU * sinV + cosHalfU * sin2V);

        positions.push(x, y, z);
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
        indices.push(a, d, b);
        indices.push(b, d, c);
      }
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  function createMobiusStripGeometry(options) {
    options = options || {};
    var radius = options.radius || 2.0;
    var width = options.width || 0.8;
    var thickness = options.thickness || 0.08;
    var twists = options.twists || 1;
    var segU = options.segmentsU || 64;
    var segV = options.segmentsV || 16;

    var positions = [];
    var uvs = [];
    var indices = [];

    var halfThick = thickness / 2;
    var vertOffset = 0;

    for (var layer = -1; layer <= 1; layer += 2) {
      var layerStart = vertOffset;
      var zOffset = layer * halfThick;

      for (var i = 0; i <= segU; i++) {
        var u = (i / segU) * 2 * Math.PI;
        var cosU = Math.cos(u);
        var sinU = Math.sin(u);
        var twistAng = (twists * u) / 2;
        var cosTw = Math.cos(twistAng);
        var sinTw = Math.sin(twistAng);

        for (var j = 0; j <= segV; j++) {
          var t = -width / 2 + (j / segV) * width;
          var x = (radius + t * cosTw) * cosU;
          var y = (radius + t * cosTw) * sinU;
          var z = t * sinTw + zOffset * cosTw;

          positions.push(x, y, z);
          uvs.push(j / segV, i / segU);
          vertOffset++;
        }
      }

      for (var i2 = 0; i2 < segU; i2++) {
        for (var j2 = 0; j2 < segV; j2++) {
          var a = layerStart + i2 * (segV + 1) + j2;
          var b = layerStart + (i2 + 1) * (segV + 1) + j2;
          var c = layerStart + (i2 + 1) * (segV + 1) + (j2 + 1);
          var d = layerStart + i2 * (segV + 1) + (j2 + 1);

          if (layer === 1) {
            indices.push(a, b, d);
            indices.push(b, c, d);
          } else {
            indices.push(a, d, b);
            indices.push(b, d, c);
          }
        }
      }
    }

    var topStart = (segU + 1) * (segV + 1);
    for (var edge = 0; edge <= 1; edge++) {
      var jIdx = edge === 0 ? 0 : segV;
      for (var i = 0; i < segU; i++) {
        var bot_i0 = i * (segV + 1) + jIdx;
        var bot_i1 = (i + 1) * (segV + 1) + jIdx;
        var top_i0 = topStart + i * (segV + 1) + jIdx;
        var top_i1 = topStart + (i + 1) * (segV + 1) + jIdx;

        if (edge === 0) {
          indices.push(bot_i0, top_i0, top_i1);
          indices.push(bot_i0, top_i1, bot_i1);
        } else {
          indices.push(bot_i0, top_i1, top_i0);
          indices.push(bot_i0, bot_i1, top_i1);
        }
      }
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  // =========================================================================
  // 5. MASTER 3D ENVIRONMENTAL SCENE PRESET REGISTRY & SYNTHESIZER
  // =========================================================================

  var SCENE_PRESETS = {
    cyberpunk_megacity: {
      id: "cyberpunk_megacity",
      name: "🌆 Cyberpunk Megacity Plaza",
      category: "Sci-Fi & Cyberpunk",
      description: "Dense high-tech metropolis with neon skyscrapers, reflective asphalt, holographic signage, and speeder corridors.",
      environment: {
        background: "#030712",
        backgroundGradient: "radial-gradient(circle at 50% 30%, #0d1527 0%, #030712 100%)",
        fogColor: "#050b1a",
        fogDensity: 0.018,
        ground: {
          type: "reflective_asphalt",
          size: 60,
          color: "#0a0f1d",
          grid: "#00f0ff",
          roughness: 0.1,
          metalness: 0.9
        }
      },
      lighting: {
        ambient: { color: "#1e293b", intensity: 0.8 },
        key: { color: "#00f0ff", intensity: 2.5, pos: [15, 25, 15] },
        fill: { color: "#ec4899", intensity: 2.0, pos: [-18, 15, -15] },
        accents: [
          { color: "#fbbf24", intensity: 1.5, pos: [0, 8, 0] },
          { color: "#34d399", intensity: 1.2, pos: [-15, 5, 10] }
        ]
      },
      particles: { count: 450, color: "#38bdf8", speed: 0.4, type: "cyber_dust", size: 0.15 }
    },
    deep_space_station: {
      id: "deep_space_station",
      name: "🌌 Deep Space Nebula Observatory",
      category: "Space & Cosmos",
      description: "Orbital research station torus hovering inside a vivid purple nebula surrounded by an asteroid field.",
      environment: {
        background: "#020108",
        backgroundGradient: "radial-gradient(circle at 50% 50%, #1e0b36 0%, #020108 100%)",
        fogColor: "#080417",
        fogDensity: 0.008,
        ground: {
          type: "asteroid_belt",
          size: 80,
          color: "#0f0b1e",
          grid: "#a855f7",
          roughness: 0.8,
          metalness: 0.3
        }
      },
      lighting: {
        ambient: { color: "#2e1065", intensity: 0.9 },
        key: { color: "#c084fc", intensity: 3.0, pos: [20, 30, 20] },
        fill: { color: "#38bdf8", intensity: 1.8, pos: [-20, -10, -20] },
        accents: [
          { color: "#f472b6", intensity: 1.8, pos: [0, 2, 0] }
        ]
      },
      particles: { count: 650, color: "#f3e8ff", speed: 0.2, type: "starfield", size: 0.12 }
    },
    alchemical_sanctum: {
      id: "alchemical_sanctum",
      name: "🏛️ Sacred Alchemical Sanctum",
      category: "Sacred & Alchemical",
      description: "Ancient golden marble temple with Fibonacci phyllotaxis floor, 6 floating obelisks, and the Master Azoth solar core.",
      environment: {
        background: "#070503",
        backgroundGradient: "radial-gradient(circle at 50% 40%, #2b1805 0%, #070503 100%)",
        fogColor: "#140e06",
        fogDensity: 0.015,
        ground: {
          type: "sacred_marble",
          size: 50,
          color: "#17120a",
          grid: "#e8c872",
          roughness: 0.2,
          metalness: 0.85
        }
      },
      lighting: {
        ambient: { color: "#78350f", intensity: 1.0 },
        key: { color: "#fbbf24", intensity: 3.2, pos: [0, 20, 0] },
        fill: { color: "#d97706", intensity: 1.5, pos: [15, 10, 15] },
        accents: [
          { color: "#fef08a", intensity: 2.0, pos: [0, 4, 0] }
        ]
      },
      particles: { count: 400, color: "#fde68a", speed: 0.35, type: "golden_sparks", size: 0.14 }
    },
    matrix_holodeck: {
      id: "matrix_holodeck",
      name: "🟩 Quantum Matrix Holodeck",
      category: "Cyber & VR",
      description: "Boundless 3D perspective cyber grid with pulsating green data towers, holographic wireframes, and stream feeds.",
      environment: {
        background: "#020704",
        backgroundGradient: "radial-gradient(circle at 50% 50%, #062b14 0%, #020704 100%)",
        fogColor: "#041409",
        fogDensity: 0.02,
        ground: {
          type: "matrix_grid",
          size: 60,
          color: "#061a0d",
          grid: "#34d399",
          roughness: 0.15,
          metalness: 0.8
        }
      },
      lighting: {
        ambient: { color: "#064e3b", intensity: 1.0 },
        key: { color: "#34d399", intensity: 2.8, pos: [12, 18, 12] },
        fill: { color: "#10b981", intensity: 1.6, pos: [-12, 10, -12] },
        accents: [
          { color: "#6ee7b7", intensity: 1.8, pos: [0, 5, 0] }
        ]
      },
      particles: { count: 550, color: "#a7f3d0", speed: 0.8, type: "digital_glyphs", size: 0.15 }
    },
    scifi_hangar_bay: {
      id: "scifi_hangar_bay",
      name: "🚀 Sci-Fi Mech Hangar & Launch Deck",
      category: "Industrial Sci-Fi",
      description: "Heavy industrial starship hangar with warning hazard stripes, gantry cranes, staging pads, and maintenance pylons.",
      environment: {
        background: "#05070a",
        backgroundGradient: "radial-gradient(circle at 50% 40%, #161f2e 0%, #05070a 100%)",
        fogColor: "#0b1119",
        fogDensity: 0.016,
        ground: {
          type: "industrial_deck",
          size: 55,
          color: "#111827",
          grid: "#f59e0b",
          roughness: 0.3,
          metalness: 0.7
        }
      },
      lighting: {
        ambient: { color: "#1f2937", intensity: 0.9 },
        key: { color: "#f59e0b", intensity: 2.6, pos: [10, 22, 5] },
        fill: { color: "#00f0ff", intensity: 1.4, pos: [-14, 12, -10] },
        accents: [
          { color: "#ef4444", intensity: 1.6, pos: [8, 2, 8] },
          { color: "#ef4444", intensity: 1.6, pos: [-8, 2, -8] }
        ]
      },
      particles: { count: 350, color: "#fef08a", speed: 0.55, type: "weld_sparks", size: 0.12 }
    },
    crystal_sky_islands: {
      id: "crystal_sky_islands",
      name: "🏝️ Floating Celestial Crystal Islands",
      category: "Fantasy & Nature",
      description: "Multi-tier floating rock islands with bioluminescent crystal spires, bridge links, and ethereal clouds.",
      environment: {
        background: "#030814",
        backgroundGradient: "radial-gradient(circle at 50% 50%, #082240 0%, #030814 100%)",
        fogColor: "#071224",
        fogDensity: 0.012,
        ground: {
          type: "floating_island",
          size: 40,
          color: "#0b192e",
          grid: "#38bdf8",
          roughness: 0.4,
          metalness: 0.6
        }
      },
      lighting: {
        ambient: { color: "#0c4a6e", intensity: 1.0 },
        key: { color: "#38bdf8", intensity: 2.5, pos: [15, 20, 15] },
        fill: { color: "#a855f7", intensity: 1.8, pos: [-15, 10, -15] },
        accents: [
          { color: "#67e8f9", intensity: 1.5, pos: [0, 3, 0] }
        ]
      },
      particles: { count: 500, color: "#bae6fd", speed: 0.3, type: "ethereal_spores", size: 0.16 }
    },
    alien_crystalline_desert: {
      id: "alien_crystalline_desert",
      name: "🪐 Alien Crystalline Desert with Dual Moons",
      category: "Extraterrestrial & Alien Worlds",
      description: "Vast alien dunes with towering phosphorescent crystal obelisks, dual celestial orbital moons, and prismatic atmospheric dust.",
      environment: {
        background: "#090412",
        backgroundGradient: "radial-gradient(circle at 50% 30%, #280e45 0%, #090412 100%)",
        fogColor: "#160b26",
        fogDensity: 0.014,
        ground: {
          type: "alien_dunes",
          size: 65,
          color: "#180d2b",
          grid: "#e879f9",
          roughness: 0.35,
          metalness: 0.7
        }
      },
      lighting: {
        ambient: { color: "#3b0764", intensity: 0.95 },
        key: { color: "#f472b6", intensity: 2.8, pos: [25, 20, 15] },
        fill: { color: "#38bdf8", intensity: 1.8, pos: [-20, 15, -20] },
        accents: [
          { color: "#c084fc", intensity: 2.0, pos: [0, 10, -10] },
          { color: "#f43f5e", intensity: 1.5, pos: [12, 4, -12] }
        ]
      },
      particles: { count: 480, color: "#f0abfc", speed: 0.35, type: "prismatic_dust", size: 0.14 }
    },
    sunken_cyber_atlantis: {
      id: "sunken_cyber_atlantis",
      name: "🌊 Sunken Cyber Atlantis Trench with Bioluminescent Reefs",
      category: "Abyssal & Aquatic Cyber",
      description: "Subaquatic abyssal trench with sunken cyber-nanotech temples, hydrothermal vents, bioluminescent coral reefs, and ascending bubble cascades.",
      environment: {
        background: "#010c14",
        backgroundGradient: "radial-gradient(circle at 50% 35%, #022b3a 0%, #010c14 100%)",
        fogColor: "#021824",
        fogDensity: 0.022,
        ground: {
          type: "abyssal_trench_floor",
          size: 60,
          color: "#041c2c",
          grid: "#00f0ff",
          roughness: 0.2,
          metalness: 0.85
        }
      },
      lighting: {
        ambient: { color: "#042f2e", intensity: 1.1 },
        key: { color: "#00f0ff", intensity: 3.0, pos: [12, 25, 10] },
        fill: { color: "#2dd4bf", intensity: 2.2, pos: [-15, 10, -12] },
        accents: [
          { color: "#a7f3d0", intensity: 1.8, pos: [0, 4, 0] },
          { color: "#38bdf8", intensity: 1.5, pos: [-10, 6, 8] }
        ]
      },
      particles: { count: 600, color: "#5eead4", speed: 0.45, type: "bioluminescent_bubbles", size: 0.16 }
    },
    volcanic_magma_forge: {
      id: "volcanic_magma_forge",
      name: "🌋 Volcanic Forge with Molten Magma Streams",
      category: "Elemental & Volcanic",
      description: "Subterranean basalt caldera with glowing molten magma rivers, industrial geothermal extractors, magma obsidian arches, and rising volcanic ember sparks.",
      environment: {
        background: "#120303",
        backgroundGradient: "radial-gradient(circle at 50% 40%, #360707 0%, #120303 100%)",
        fogColor: "#240707",
        fogDensity: 0.020,
        ground: {
          type: "volcanic_basalt_crust",
          size: 60,
          color: "#1f0a0a",
          grid: "#ff4400",
          roughness: 0.5,
          metalness: 0.6
        }
      },
      lighting: {
        ambient: { color: "#450a0a", intensity: 1.2 },
        key: { color: "#ff4400", intensity: 3.5, pos: [0, 4, 0] },
        fill: { color: "#fbbf24", intensity: 2.0, pos: [18, 18, 15] },
        accents: [
          { color: "#ef4444", intensity: 2.2, pos: [-15, 8, -15] },
          { color: "#ff7700", intensity: 1.8, pos: [10, 2, -10] }
        ]
      },
      particles: { count: 550, color: "#fca5a5", speed: 0.65, type: "volcanic_ember_sparks", size: 0.15 }
    }
  };

  function getScenePresets() {
    return Object.keys(SCENE_PRESETS).map(function(key) {
      return SCENE_PRESETS[key];
    });
  }

  function synthesizeScenePreset(sceneId, options) {
    options = options || {};
    var preset = SCENE_PRESETS[sceneId] || SCENE_PRESETS.cyberpunk_megacity;
    var group = new THREE.Group();
    group.name = 'ProceduralScene_' + preset.id;
    group.userData = { preset: preset, sceneId: preset.id };

    var pbrMaps = createProceduralPBRTextures({
      themeColor: preset.lighting.key ? preset.lighting.key.color : '#00f0ff',
      style: 'cyber-circuit',
      size: options.textureSize || 512
    });

    var matAccentGlow = function(colorHex, intensity) {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex || '#00f0ff'),
        roughness: 0.15,
        metalness: 0.85,
        emissive: new THREE.Color(colorHex || '#00f0ff'),
        emissiveIntensity: intensity !== undefined ? intensity : 1.8
      });
    };

    var matPrimary = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.25,
      metalness: 0.85,
      map: pbrMaps.map,
      normalMap: pbrMaps.normalMap,
      roughnessMap: pbrMaps.roughnessMap,
      metalnessMap: pbrMaps.metalnessMap,
      emissiveMap: pbrMaps.emissiveMap,
      emissive: new THREE.Color(preset.lighting.key ? preset.lighting.key.color : '#00f0ff'),
      emissiveIntensity: 0.4
    });

    var matGold = new THREE.MeshStandardMaterial({
      color: 0xe8c872,
      roughness: 0.2,
      metalness: 0.95,
      emissive: 0xd97706,
      emissiveIntensity: 0.5
    });

    var matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 1.0,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      emissive: new THREE.Color(preset.lighting.key ? preset.lighting.key.color : '#00f0ff'),
      emissiveIntensity: 0.3
    });

    // -------------------------------------------------------------------------
    // 1. ALIEN CRYSTALLINE DESERT WITH DUAL MOONS
    // -------------------------------------------------------------------------
    if (preset.id === 'alien_crystalline_desert') {
      // Undulating dunes ground geometry with simplex noise displacement
      var dunesGeo = new THREE.PlaneGeometry(65, 65, 32, 32);
      applyNoiseDisplacement(dunesGeo, { amplitude: 0.6, frequency: 0.4, octaves: 3 });
      var dunesMat = new THREE.MeshStandardMaterial({
        color: 0x180d2b,
        roughness: 0.35,
        metalness: 0.7,
        emissive: 0x3b0764,
        emissiveIntensity: 0.25
      });
      var dunes = new THREE.Mesh(dunesGeo, dunesMat);
      dunes.rotation.x = -Math.PI / 2;
      group.add(dunes);

      // Celestial Dual Moons in backdrop sky
      var moon1Geo = new THREE.SphereGeometry(6.0, 32, 32);
      var moon1Mat = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        roughness: 0.3,
        metalness: 0.5,
        emissive: 0x7c3aed,
        emissiveIntensity: 1.2
      });
      var moon1 = new THREE.Mesh(moon1Geo, moon1Mat);
      moon1.position.set(20, 28, -32);
      group.add(moon1);

      // Moon 1 celestial halo orbit ring
      var moonHaloGeo = new THREE.TorusGeometry(8.5, 0.08, 16, 64);
      var moonHaloMat = new THREE.MeshBasicMaterial({ color: 0xe879f9, transparent: true, opacity: 0.6 });
      var moonHalo = new THREE.Mesh(moonHaloGeo, moonHaloMat);
      moonHalo.position.set(20, 28, -32);
      moonHalo.rotation.x = Math.PI / 3;
      group.add(moonHalo);

      // Secondary Cyan Moon
      var moon2Geo = new THREE.SphereGeometry(2.5, 24, 24);
      var moon2Mat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.2,
        metalness: 0.7,
        emissive: 0x0284c7,
        emissiveIntensity: 1.4
      });
      var moon2 = new THREE.Mesh(moon2Geo, moon2Mat);
      moon2.position.set(-18, 22, -28);
      group.add(moon2);

      // 6 Phosphorescent Crystalline Obelisks along dune ridges
      var obCoords = [
        [-16, 3.5, -12, 1.2, 7.0],
        [18, 3.5, -10, 1.4, 8.0],
        [-12, 2.5, 14, 1.0, 5.5],
        [14, 2.8, 12, 1.1, 6.0],
        [-22, 3.0, -5, 1.3, 6.5],
        [22, 3.2, 2, 1.2, 7.2]
      ];
      obCoords.forEach(function(oc) {
        var obGeo = applyNoiseDisplacement(new THREE.ConeGeometry(oc[3], oc[4], 6), { amplitude: 0.15, frequency: 1.2 });
        var obMesh = new THREE.Mesh(obGeo, matAccentGlow('#e879f9', 1.4));
        obMesh.position.set(oc[0], oc[1], oc[2]);
        group.add(obMesh);
      });

      // 2 Floating Resonant Energy Rings
      var r1Geo = new THREE.TorusGeometry(4.0, 0.15, 16, 48);
      var r1 = new THREE.Mesh(r1Geo, matAccentGlow('#38bdf8', 1.6));
      r1.position.set(-8, 10, -10);
      r1.rotation.set(0.4, 0.6, 0.2);
      group.add(r1);

      var r2Geo = new THREE.TorusGeometry(3.2, 0.12, 16, 48);
      var r2 = new THREE.Mesh(r2Geo, matAccentGlow('#c084fc', 1.5));
      r2.position.set(10, 12, -8);
      r2.rotation.set(-0.3, 0.8, -0.4);
      group.add(r2);

      // Focal Centerpiece: Stepped Crystalline Dais & Colossal Monolith Spire
      var daisGeo = new THREE.CylinderGeometry(4.0, 4.8, 0.8, 8);
      var daisMesh = new THREE.Mesh(daisGeo, matGold);
      daisMesh.position.y = 0.4;
      group.add(daisMesh);

      var spireGeo = applyNoiseDisplacement(new THREE.ConeGeometry(1.8, 9.0, 6), { amplitude: 0.2, frequency: 1.5 });
      var spireMesh = new THREE.Mesh(spireGeo, matAccentGlow('#f472b6', 2.0));
      spireMesh.position.set(0, 5.0, 0);
      group.add(spireMesh);

      // Orbiting Golden / Prismatic Satellites
      for (var s = 0; s < 8; s++) {
        var sTheta = s * GOLDEN_ANGLE;
        var sRadius = 3.2 + (s * 0.2);
        var sGeo = new THREE.OctahedronGeometry(0.4, 0);
        var sMesh = new THREE.Mesh(sGeo, matAccentGlow('#c084fc', 1.8));
        sMesh.position.set(Math.cos(sTheta) * sRadius, 2.0 + s * 0.6, Math.sin(sTheta) * sRadius);
        sMesh.rotation.set(s * 0.3, s * 0.5, s * 0.2);
        group.add(sMesh);
      }
    }

    // -------------------------------------------------------------------------
    // 2. SUNKEN CYBER ATLANTIS TRENCH WITH BIOLUMINESCENT REEFS
    // -------------------------------------------------------------------------
    else if (preset.id === 'sunken_cyber_atlantis') {
      // Abyssal trench seabed floor
      var oceanGeo = new THREE.PlaneGeometry(60, 60, 24, 24);
      applyNoiseDisplacement(oceanGeo, { amplitude: 0.4, frequency: 0.3 });
      var oceanMat = new THREE.MeshStandardMaterial({
        color: 0x041c2c,
        roughness: 0.2,
        metalness: 0.85,
        emissive: 0x042f2e,
        emissiveIntensity: 0.35
      });
      var oceanFloor = new THREE.Mesh(oceanGeo, oceanMat);
      oceanFloor.rotation.x = -Math.PI / 2;
      group.add(oceanFloor);

      // 4 Hydrothermal Vent Chimneys with thermal emissions
      var ventCoords = [
        [-14, 3, -14],
        [16, 3.5, -12],
        [-15, 2.5, 10],
        [12, 3, 15]
      ];
      ventCoords.forEach(function(vc) {
        var vGeo = applyNoiseDisplacement(new THREE.CylinderGeometry(0.8, 1.4, 6.0, 12), { amplitude: 0.2 });
        var vMesh = new THREE.Mesh(vGeo, matPrimary);
        vMesh.position.set(vc[0], vc[1], vc[2]);
        group.add(vMesh);

        var rimGeo = new THREE.TorusGeometry(0.9, 0.15, 8, 16);
        var rimMesh = new THREE.Mesh(rimGeo, matAccentGlow('#00f0ff', 2.0));
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.set(vc[0], vc[1] + 3.0, vc[2]);
        group.add(rimMesh);
      });

      // 6 Bioluminescent Coral Reef Formations
      var coralCoords = [
        [-10, 1.8, -8, 2.2],
        [9, 2.2, -6, 2.6],
        [-8, 1.5, 8, 2.0],
        [8, 1.8, 7, 2.2],
        [-18, 2.0, 0, 2.5],
        [18, 2.0, -2, 2.4]
      ];
      coralCoords.forEach(function(cc) {
        var cGeo = new THREE.TorusKnotGeometry(cc[3] * 0.6, 0.25, 64, 16, 2, 5);
        applyNoiseDisplacement(cGeo, { amplitude: 0.12, frequency: 1.8 });
        var cMesh = new THREE.Mesh(cGeo, matAccentGlow('#2dd4bf', 1.8));
        cMesh.position.set(cc[0], cc[1], cc[2]);
        group.add(cMesh);
      });

      // 4 Nanotech Subaquatic Pylons
      var pylonCoords = [
        [-10, 4, -18],
        [10, 4, -18],
        [-16, 4, 6],
        [16, 4, 6]
      ];
      pylonCoords.forEach(function(pc) {
        var pGeo = new THREE.CylinderGeometry(0.5, 0.7, 8, 6);
        var pMesh = new THREE.Mesh(pGeo, matGold);
        pMesh.position.set(pc[0], pc[1], pc[2]);
        group.add(pMesh);

        var ringG = new THREE.TorusGeometry(0.8, 0.08, 8, 24);
        var rM = new THREE.Mesh(ringG, matAccentGlow('#a7f3d0', 1.5));
        rM.rotation.x = Math.PI / 2;
        rM.position.set(pc[0], pc[1] + 2, pc[2]);
        group.add(rM);
      });

      // Centerpiece: Sunken Cyber-Atlantis Stepped Nanotech Pyramid Temple
      var tier1 = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 8), matPrimary);
      tier1.position.y = 0.6;
      group.add(tier1);

      var tier2 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.2, 5.5), matGold);
      tier2.position.y = 1.8;
      group.add(tier2);

      var tier3 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.2, 3.2), matPrimary);
      tier3.position.y = 3.0;
      group.add(tier3);

      // Pulsing Abyssal Core Vortex Dome & Energy Eye
      var domeGeo = new THREE.SphereGeometry(1.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      var domeMesh = new THREE.Mesh(domeGeo, matGlass);
      domeMesh.position.y = 3.6;
      group.add(domeMesh);

      var eyeGeo = new THREE.OctahedronGeometry(0.9, 0);
      var eyeMesh = new THREE.Mesh(eyeGeo, matAccentGlow('#00f0ff', 2.2));
      eyeMesh.position.y = 4.2;
      group.add(eyeMesh);
    }

    // -------------------------------------------------------------------------
    // 3. VOLCANIC FORGE WITH MOLTEN MAGMA STREAMS
    // -------------------------------------------------------------------------
    else if (preset.id === 'volcanic_magma_forge') {
      // Cracked basalt caldera floor
      var calderaGeo = new THREE.PlaneGeometry(60, 60, 24, 24);
      applyNoiseDisplacement(calderaGeo, { amplitude: 0.5, frequency: 0.5 });
      var calderaMat = new THREE.MeshStandardMaterial({
        color: 0x1f0a0a,
        roughness: 0.5,
        metalness: 0.6,
        emissive: 0x450a0a,
        emissiveIntensity: 0.4
      });
      var calderaFloor = new THREE.Mesh(calderaGeo, calderaMat);
      calderaFloor.rotation.x = -Math.PI / 2;
      group.add(calderaFloor);

      // 4 Molten Magma River Stream Canals
      var magmaMat = matAccentGlow('#ff4400', 2.6);
      var m1 = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.08, 28), magmaMat);
      m1.position.set(-6, 0.04, 0);
      m1.rotation.y = 0.2;
      group.add(m1);

      var m2 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.08, 26), magmaMat);
      m2.position.set(6, 0.04, 0);
      m2.rotation.y = -0.3;
      group.add(m2);

      var mCross = new THREE.Mesh(new THREE.BoxGeometry(24, 0.08, 3.5), magmaMat);
      mCross.position.set(0, 0.04, 6);
      group.add(mCross);

      // 8 Caldera Obsidian Mountain Crags forming perimeter crater
      for (var cr = 0; cr < 8; cr++) {
        var crAngle = (Math.PI * 2 / 8) * cr;
        var crRadius = 18 + (cr % 3) * 2;
        var crHeight = 7.0 + (cr % 4) * 2.0;
        var crGeo = applyNoiseDisplacement(new THREE.ConeGeometry(2.5, crHeight, 5), { amplitude: 0.4, frequency: 1.0 });
        var crMesh = new THREE.Mesh(crGeo, matPrimary);
        crMesh.position.set(Math.cos(crAngle) * crRadius, crHeight / 2, Math.sin(crAngle) * crRadius);
        group.add(crMesh);
      }

      // 3 Geothermal Energy Extraction Pylons with heat radiators
      var geoCoords = [
        [-16, 5, -10],
        [16, 5, -10],
        [0, 6, -18]
      ];
      geoCoords.forEach(function(gc) {
        var gPylonGeo = new THREE.BoxGeometry(2.0, 10.0, 2.0);
        var gPylon = new THREE.Mesh(gPylonGeo, matGold);
        gPylon.position.set(gc[0], gc[1], gc[2]);
        group.add(gPylon);

        var radGeo = new THREE.TorusGeometry(1.6, 0.2, 8, 16);
        var radMesh = new THREE.Mesh(radGeo, matAccentGlow('#fbbf24', 1.8));
        radMesh.rotation.x = Math.PI / 2;
        radMesh.position.set(gc[0], gc[1] + 3.0, gc[2]);
        group.add(radMesh);
      });

      // Molten Obsidian Lava Arch
      var archGeo = new THREE.TorusGeometry(12, 0.8, 12, 32, Math.PI);
      applyNoiseDisplacement(archGeo, { amplitude: 0.3, frequency: 0.8 });
      var archMesh = new THREE.Mesh(archGeo, matPrimary);
      archMesh.position.set(0, 4, -14);
      archMesh.rotation.z = Math.PI;
      group.add(archMesh);

      // Centerpiece: Monumental Magma Foundry Core Crucible
      var crucibleGeo = new THREE.CylinderGeometry(4.5, 5.0, 1.8, 16);
      var crucibleMesh = new THREE.Mesh(crucibleGeo, matPrimary);
      crucibleMesh.position.y = 0.9;
      group.add(crucibleMesh);

      var lavaBathGeo = new THREE.CylinderGeometry(4.0, 4.0, 0.2, 16);
      var lavaBath = new THREE.Mesh(lavaBathGeo, matAccentGlow('#ff4400', 2.8));
      lavaBath.position.y = 1.85;
      group.add(lavaBath);

      // Floating Thermal Containment Rings
      var cRing1 = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.18, 16, 48), matGold);
      cRing1.position.y = 2.4;
      cRing1.rotation.x = 0.3;
      group.add(cRing1);

      var cRing2 = new THREE.Mesh(new THREE.TorusGeometry(4.8, 0.15, 16, 48), matAccentGlow('#fbbf24', 1.6));
      cRing2.position.y = 2.8;
      cRing2.rotation.y = 0.5;
      group.add(cRing2);

      // Superheated Plasma Core Sphere
      var magmaCoreGeo = applyNoiseDisplacement(new THREE.IcosahedronGeometry(1.6, 3), { amplitude: 0.15, frequency: 2.0 });
      var magmaCore = new THREE.Mesh(magmaCoreGeo, matAccentGlow('#ff2200', 3.0));
      magmaCore.position.y = 3.8;
      group.add(magmaCore);
    }

    // -------------------------------------------------------------------------
    // 4. CYBERPUNK MEGACITY PLAZA
    // -------------------------------------------------------------------------
    else if (preset.id === 'cyberpunk_megacity') {
      var groundGeo = new THREE.PlaneGeometry(60, 60, 20, 20);
      var groundMat = new THREE.MeshStandardMaterial({ color: 0x050b14, roughness: 0.1, metalness: 0.9 });
      var ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      group.add(ground);

      // Single-Draw-Call InstancedMesh Cluster (64+ backdrop megacity skyscrapers)
      if (THREE.InstancedMesh) {
        var instancedSkyline = createInstancedBackdropCluster('cyberpunk_skyscrapers', 64, {
          material: new THREE.MeshStandardMaterial({
            color: 0x0a101d,
            roughness: 0.25,
            metalness: 0.85
          })
        }, THREE);
        group.add(instancedSkyline);
      }

      var towerCoords = [
        [-14, 9, -16, 4, 18, 4, '#00f0ff'],
        [16, 12, -18, 5, 24, 5, '#ec4899'],
        [-18, 7, 10, 3.5, 14, 3.5, '#34d399'],
        [18, 10, 12, 4.5, 20, 4.5, '#fbbf24'],
        [-8, 14, -20, 6, 28, 6, '#00f0ff'],
        [8, 15, -22, 5.5, 30, 5.5, '#c084fc']
      ];
      towerCoords.forEach(function(tc) {
        var tGeo = new THREE.BoxGeometry(tc[3], tc[4], tc[5]);
        var tMat = new THREE.MeshStandardMaterial({
          color: 0x0a101d,
          roughness: 0.3,
          metalness: 0.8,
          emissive: new THREE.Color(tc[6]),
          emissiveIntensity: 0.5
        });
        var tMesh = new THREE.Mesh(tGeo, tMat);
        tMesh.position.set(tc[0], tc[1], tc[2]);
        group.add(tMesh);
      });

      var monoGeo = applyNoiseDisplacement(new THREE.CylinderGeometry(0.8, 1.4, 6, 8), { amplitude: 0.1 });
      var monoMesh = new THREE.Mesh(monoGeo, matAccentGlow('#00f0ff', 1.8));
      monoMesh.position.set(0, 3, 0);
      group.add(monoMesh);

      var cRingGeo = new THREE.TorusGeometry(8, 0.15, 16, 64);
      var cRingMesh = new THREE.Mesh(cRingGeo, matPrimary);
      cRingMesh.rotation.x = Math.PI / 2;
      cRingMesh.position.y = 4;
      group.add(cRingMesh);
    }

    // -------------------------------------------------------------------------
    // 5. DEEP SPACE NEBULA OBSERVATORY
    // -------------------------------------------------------------------------
    else if (preset.id === 'deep_space_station') {
      var sTorusGeo = new THREE.TorusGeometry(8, 0.9, 24, 64);
      var sTorusMesh = new THREE.Mesh(sTorusGeo, matPrimary);
      group.add(sTorusMesh);

      // Single-Draw-Call InstancedMesh Cluster (240+ orbital asteroid belt)
      if (THREE.InstancedMesh) {
        var instancedBelt = createInstancedBackdropCluster('deep_space_asteroids', 240, {
          material: matPrimary
        }, THREE);
        group.add(instancedBelt);
      }

      for (var sw = -1; sw <= 1; sw += 2) {
        var wingGeo = new THREE.BoxGeometry(10, 0.08, 2.5);
        var wingMesh = new THREE.Mesh(wingGeo, matGold);
        wingMesh.position.set(sw * 9, 0, 0);
        group.add(wingMesh);
      }

      var pSphereGeo = new THREE.IcosahedronGeometry(2.5, 3);
      var pSphereMesh = new THREE.Mesh(pSphereGeo, matAccentGlow('#c084fc', 2.2));
      group.add(pSphereMesh);

      for (var ast = 0; ast < 24; ast++) {
        var aAngle = (Math.PI * 2 / 24) * ast;
        var aRadius = 14 + (ast % 5) * 1.5;
        var aGeo = applyNoiseDisplacement(new THREE.DodecahedronGeometry(0.6 + (ast % 3) * 0.3, 1), { amplitude: 0.25 });
        var aMesh = new THREE.Mesh(aGeo, matPrimary);
        aMesh.position.set(Math.cos(aAngle) * aRadius, (Math.sin(ast) * 3), Math.sin(aAngle) * aRadius);
        group.add(aMesh);
      }
    }

    // -------------------------------------------------------------------------
    // 6. SACRED ALCHEMICAL SANCTUM
    // -------------------------------------------------------------------------
    else if (preset.id === 'alchemical_sanctum') {
      var fGeo = new THREE.CylinderGeometry(15, 15, 0.4, 32);
      var fMesh = new THREE.Mesh(fGeo, matPrimary);
      fMesh.position.y = -0.2;
      group.add(fMesh);

      for (var ob = 0; ob < 6; ob++) {
        var obAngle = (Math.PI / 3) * ob;
        var obGeo = applyNoiseDisplacement(new THREE.ConeGeometry(0.8, 5, 4), { amplitude: 0.1 });
        var obMesh = new THREE.Mesh(obGeo, matGold);
        obMesh.position.set(Math.cos(obAngle) * 9, 2.5, Math.sin(obAngle) * 9);
        group.add(obMesh);
      }

      var altarGeo = new THREE.CylinderGeometry(2.5, 3.0, 1.2, 12);
      var altarMesh = new THREE.Mesh(altarGeo, matGold);
      altarMesh.position.y = 0.6;
      group.add(altarMesh);

      var merkaGeo = new THREE.OctahedronGeometry(1.4, 0);
      var merkaMesh = new THREE.Mesh(merkaGeo, matAccentGlow('#fbbf24', 2.0));
      merkaMesh.position.y = 2.6;
      group.add(merkaMesh);
    }

    // -------------------------------------------------------------------------
    // 7. QUANTUM MATRIX HOLODECK
    // -------------------------------------------------------------------------
    else if (preset.id === 'matrix_holodeck') {
      var mGridGeo = new THREE.PlaneGeometry(60, 60, 20, 20);
      var mGridMat = new THREE.MeshStandardMaterial({ color: 0x061a0d, roughness: 0.15, metalness: 0.8 });
      var mGrid = new THREE.Mesh(mGridGeo, mGridMat);
      mGrid.rotation.x = -Math.PI / 2;
      group.add(mGrid);

      // Single-Draw-Call InstancedMesh Data Nodes (64+ matrix data pillars)
      if (THREE.InstancedMesh) {
        var instancedDataNodes = createInstancedBackdropCluster('matrix_data_nodes', 64, {}, THREE);
        group.add(instancedDataNodes);
      }

      for (var dp = 0; dp < 8; dp++) {
        var dpAngle = (Math.PI / 4) * dp;
        var dpGeo = new THREE.CylinderGeometry(0.6, 0.6, 8, 8);
        var dpMesh = new THREE.Mesh(dpGeo, matAccentGlow('#34d399', 1.5));
        dpMesh.position.set(Math.cos(dpAngle) * 12, 4, Math.sin(dpAngle) * 12);
        group.add(dpMesh);
      }

      var holoGeo = create4DTesseractGeometry(2.4, 0.5);
      var holoLines = new THREE.LineSegments(holoGeo, new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2.0 }));
      holoLines.position.y = 2.5;
      group.add(holoLines);

      var holoCore = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), matGlass);
      holoCore.position.y = 2.5;
      group.add(holoCore);
    }

    // -------------------------------------------------------------------------
    // 8. SCI-FI MECH HANGAR BAY
    // -------------------------------------------------------------------------
    else if (preset.id === 'scifi_hangar_bay') {
      var hDeckGeo = new THREE.BoxGeometry(55, 0.4, 55);
      var hDeck = new THREE.Mesh(hDeckGeo, matPrimary);
      hDeck.position.y = -0.2;
      group.add(hDeck);

      var gantryGeo = new THREE.TorusGeometry(10, 0.3, 8, 4);
      var gantryMesh = new THREE.Mesh(gantryGeo, matGold);
      gantryMesh.rotation.z = Math.PI / 4;
      gantryMesh.position.y = 6;
      group.add(gantryMesh);

      for (var lb = 0; lb < 4; lb++) {
        var lba = (Math.PI / 2) * lb + Math.PI / 4;
        var beaconGeo = new THREE.CylinderGeometry(0.3, 0.5, 1.2, 8);
        var beaconMesh = new THREE.Mesh(beaconGeo, matAccentGlow('#ef4444', 2.0));
        beaconMesh.position.set(Math.cos(lba) * 8, 0.6, Math.sin(lba) * 8);
        group.add(beaconMesh);
      }

      var stgGeo = new THREE.CylinderGeometry(4, 4.5, 0.8, 16);
      var stgMesh = new THREE.Mesh(stgGeo, matGold);
      stgMesh.position.y = 0.4;
      group.add(stgMesh);
    }

    // -------------------------------------------------------------------------
    // 9. FLOATING CELESTIAL CRYSTAL ISLANDS
    // -------------------------------------------------------------------------
    else {
      var islGeo = applyNoiseDisplacement(new THREE.ConeGeometry(8, 6, 8), { amplitude: 0.6, frequency: 0.5 });
      var islMesh = new THREE.Mesh(islGeo, matPrimary);
      islMesh.rotation.x = Math.PI;
      islMesh.position.y = 0;
      group.add(islMesh);

      // Single-Draw-Call InstancedMesh Crystal Spires (64+ crystal spires)
      if (THREE.InstancedMesh) {
        var instancedSpires = createInstancedBackdropCluster('crystal_spires', 64, {}, THREE);
        group.add(instancedSpires);
      }

      for (var cg = 0; cg < 7; cg++) {
        var cAngle = (Math.PI * 2 / 7) * cg;
        var spGeo = applyNoiseDisplacement(new THREE.ConeGeometry(0.5 + (cg % 2) * 0.3, 3 + cg * 0.4, 6), { amplitude: 0.15 });
        var spMesh = new THREE.Mesh(spGeo, matAccentGlow('#38bdf8', 1.8));
        spMesh.position.set(Math.cos(cAngle) * (2 + cg * 0.5), 1.8 + cg * 0.2, Math.sin(cAngle) * (2 + cg * 0.5));
        group.add(spMesh);
      }

      for (var mi = 0; mi < 3; mi++) {
        var mAngle = (Math.PI * 2 / 3) * mi + 0.5;
        var mGeo = applyNoiseDisplacement(new THREE.DodecahedronGeometry(2.0, 1), { amplitude: 0.4 });
        var mMesh = new THREE.Mesh(mGeo, matPrimary);
        mMesh.position.set(Math.cos(mAngle) * 14, -1 + mi, Math.sin(mAngle) * 14);
        group.add(mMesh);
      }
    }

    return group;
  }

  // =========================================================================
  // 6. MASTER PROMPT-TO-GEOMETRY & 3D SCENE COMPOSITE BUILDER
  // =========================================================================

  function synthesizeFromPrompt(promptText, options) {
    options = options || {};
    var p = (promptText || '').toLowerCase().trim();
    var group = new THREE.Group();
    group.name = 'ProceduralEntity_' + Date.now();

    // -----------------------------------------------------------------------
    // A. FULL 3D ENVIRONMENTAL SCENE GRAPH SYNTHESIS
    // -----------------------------------------------------------------------
    var isScene = p.includes('scene') || p.includes('city') || p.includes('street') || 
                  p.includes('plaza') || p.includes('station') || p.includes('temple') || 
                  p.includes('sanctum') || p.includes('hangar') || p.includes('holodeck') || 
                  p.includes('islands') || p.includes('landscape') || p.includes('environment') ||
                  p.includes('desert') || p.includes('atlantis') || p.includes('trench') ||
                  p.includes('volcano') || p.includes('forge') || p.includes('magma') ||
                  p.includes('caldera');

    if (isScene) {
      if (p.includes('desert') || p.includes('moon') || p.includes('dune') || p.includes('alien')) {
        return synthesizeScenePreset('alien_crystalline_desert', options);
      } else if (p.includes('atlantis') || p.includes('trench') || p.includes('reef') || p.includes('sunken') || p.includes('subsea') || p.includes('underwater') || p.includes('ocean')) {
        return synthesizeScenePreset('sunken_cyber_atlantis', options);
      } else if (p.includes('volcan') || p.includes('magma') || p.includes('forge') || p.includes('lava') || p.includes('caldera') || p.includes('basalt') || p.includes('molten')) {
        return synthesizeScenePreset('volcanic_magma_forge', options);
      } else if (p.includes('city') || p.includes('cyberpunk') || p.includes('street') || p.includes('plaza') || p.includes('skyscraper')) {
        return synthesizeScenePreset('cyberpunk_megacity', options);
      } else if (p.includes('space') || p.includes('station') || p.includes('nebula') || p.includes('cosmos') || p.includes('asteroid') || p.includes('orbit')) {
        return synthesizeScenePreset('deep_space_station', options);
      } else if (p.includes('temple') || p.includes('sanctum') || p.includes('sacred') || p.includes('shrine') || p.includes('alchemical')) {
        return synthesizeScenePreset('alchemical_sanctum', options);
      } else if (p.includes('matrix') || p.includes('holodeck') || p.includes('cyber grid')) {
        return synthesizeScenePreset('matrix_holodeck', options);
      } else if (p.includes('hangar') || p.includes('launch') || p.includes('mech') || p.includes('deck')) {
        return synthesizeScenePreset('scifi_hangar_bay', options);
      } else if (p.includes('island') || p.includes('forest') || p.includes('spire') || p.includes('sky')) {
        return synthesizeScenePreset('crystal_sky_islands', options);
      } else {
        return synthesizeScenePreset('cyberpunk_megacity', options);
      }
    }

    // Determine Theme & Accent Colors for Individual Objects
    var themeColor = '#00f0ff'; // Cyan default
    var secColor = '#e8c872';   // Gold
    var style = 'cyber-circuit';

    if (p.includes('carbon') || p.includes('fiber') || p.includes('weave') || p.includes('kevlar')) {
      themeColor = '#00f0ff';
      secColor = '#38bdf8';
      style = 'carbon-fiber';
    } else if (p.includes('titanium') || p.includes('brush') || p.includes('alloy') || (p.includes('steel') && !p.includes('damascus'))) {
      themeColor = '#38bdf8';
      secColor = '#94a3b8';
      style = 'brushed-titanium';
    } else if (p.includes('holo') || p.includes('iridescent') || p.includes('rainbow') || p.includes('prism') || p.includes('chroma') || p.includes('space') || p.includes('nebula') || p.includes('purple') || p.includes('void') || p.includes('argon')) {
      themeColor = '#c084fc';
      secColor = '#38bdf8';
      style = 'iridescent-hologram';
    } else if (p.includes('matrix') || p.includes('acid') || p.includes('bio') || p.includes('organic') || p.includes('alien') || p.includes('cell') || p.includes('vein') || p.includes('green') || p.includes('draco') || p.includes('voronoi')) {
      themeColor = '#34d399';
      secColor = '#10b981';
      style = 'bio-organic';
    } else if (p.includes('damascus') || p.includes('valyrian') || p.includes('folded') || p.includes('blade') || p.includes('sword') || p.includes('katana') || p.includes('gold') || p.includes('solar') || p.includes('solon') || p.includes('temple') || p.includes('sacred')) {
      themeColor = '#e8c872';
      secColor = '#f59e0b';
      style = 'damascus-steel';
    } else if (p.includes('fire') || p.includes('ignis') || p.includes('red') || p.includes('laser') || p.includes('hangar') || p.includes('circuit') || p.includes('cyber') || p.includes('tech') || p.includes('quantum') || p.includes('reactor')) {
      themeColor = p.includes('fire') || p.includes('red') || p.includes('ignis') ? '#ff3366' : '#00f0ff';
      secColor = '#f59e0b';
      style = 'cyber-circuit';
    }

    var pbrMaps = createProceduralPBRTextures({ themeColor: themeColor, style: style, size: options.textureSize || 512 });

    var baseRough = style === 'carbon-fiber' ? 0.35 : style === 'brushed-titanium' ? 0.25 : style === 'iridescent-hologram' ? 0.08 : style === 'bio-organic' ? 0.30 : style === 'damascus-steel' ? 0.20 : 0.25;
    var baseMetal = style === 'carbon-fiber' ? 0.50 : style === 'brushed-titanium' ? 0.95 : style === 'iridescent-hologram' ? 0.90 : style === 'bio-organic' ? 0.05 : style === 'damascus-steel' ? 0.92 : 0.85;

    var matPrimary = new THREE.MeshStandardMaterial({
      color: style === 'iridescent-hologram' || style === 'damascus-steel' || style === 'brushed-titanium' ? 0xffffff : 0x111827,
      roughness: baseRough,
      metalness: baseMetal,
      map: pbrMaps.map,
      normalMap: pbrMaps.normalMap,
      roughnessMap: pbrMaps.roughnessMap,
      metalnessMap: pbrMaps.metalnessMap,
      emissiveMap: pbrMaps.emissiveMap,
      emissive: new THREE.Color(themeColor),
      emissiveIntensity: style === 'cyber-circuit' || style === 'bio-organic' ? 0.9 : style === 'iridescent-hologram' ? 0.6 : 0.3
    });

    var matAccentGlow = new THREE.MeshStandardMaterial({
      color: new THREE.Color(themeColor),
      roughness: 0.1,
      metalness: 0.9,
      emissive: new THREE.Color(themeColor),
      emissiveIntensity: 1.8,
      wireframe: p.includes('wireframe')
    });

    var matGold = new THREE.MeshStandardMaterial({
      color: new THREE.Color(secColor),
      roughness: 0.2,
      metalness: 0.95,
      emissive: new THREE.Color(secColor),
      emissiveIntensity: 0.4
    });

    var matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 1.0,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      emissive: new THREE.Color(themeColor),
      emissiveIntensity: 0.2
    });

    // -----------------------------------------------------------------------
    // B. EXACT INDIVIDUAL OBJECT / MODEL SYNTHESIS
    // -----------------------------------------------------------------------

    // 1. WEAPONS: SWORDS, KATANAS, PLASMA RIFLES, SHIELDS
    if (p.includes('sword') || p.includes('katana') || p.includes('blade') || p.includes('dagger')) {
      // Long Glowing Blade
      var bladeGeo = new THREE.BoxGeometry(0.12, 5.0, 0.4);
      var bladeMesh = new THREE.Mesh(bladeGeo, matAccentGlow);
      bladeMesh.position.y = 2.0;
      group.add(bladeMesh);

      // Tsuba / Guard
      var guardGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.15, 16);
      var guardMesh = new THREE.Mesh(guardGeo, matGold);
      guardMesh.position.y = -0.5;
      group.add(guardMesh);

      // Cyber Grip Hilt
      var hiltGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.8, 12);
      var hiltMesh = new THREE.Mesh(hiltGeo, matPrimary);
      hiltMesh.position.y = -1.4;
      group.add(hiltMesh);

      // Pommel Energy Node
      var pommelGeo = new THREE.SphereGeometry(0.35, 12, 12);
      var pommelMesh = new THREE.Mesh(pommelGeo, matAccentGlow);
      pommelMesh.position.y = -2.4;
      group.add(pommelMesh);
    }
    else if (p.includes('rifle') || p.includes('gun') || p.includes('cannon') || p.includes('blaster') || p.includes('railgun')) {
      // Gun Chassis Body
      var bodyGeo = new THREE.BoxGeometry(0.6, 0.9, 4.0);
      var bodyMesh = new THREE.Mesh(bodyGeo, matPrimary);
      group.add(bodyMesh);

      // Twin Barrel Assembly
      for (var b = -1; b <= 1; b += 2) {
        var bGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 16);
        var bMesh = new THREE.Mesh(bGeo, matGold);
        bMesh.rotation.x = Math.PI / 2;
        bMesh.position.set(b * 0.18, 0.15, 2.6);
        group.add(bMesh);
      }

      // Energy Plasma Chamber
      var plasGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.4, 16);
      var plasMesh = new THREE.Mesh(plasGeo, matAccentGlow);
      plasMesh.rotation.x = Math.PI / 2;
      plasMesh.position.set(0, 0.1, 0.2);
      group.add(plasMesh);

      // Ergonomic Grip & Stock
      var gripGeo = new THREE.BoxGeometry(0.4, 1.4, 0.5);
      var gripMesh = new THREE.Mesh(gripGeo, matPrimary);
      gripMesh.rotation.x = 0.3;
      gripMesh.position.set(0, -0.9, -0.8);
      group.add(gripMesh);
    }
    // 2. VEHICLES: STARFIGHTERS, SPEEDERS, MECHS, DRONES
    else if (p.includes('ship') || p.includes('fighter') || p.includes('speeder') || p.includes('drone') || p.includes('starship')) {
      // Aerodynamic Fuselage
      var fuseGeo = applyNoiseDisplacement(new THREE.ConeGeometry(1.0, 5.0, 6), { amplitude: 0.1 });
      var fuseMesh = new THREE.Mesh(fuseGeo, matPrimary);
      fuseMesh.rotation.x = Math.PI / 2;
      group.add(fuseMesh);

      // Swept Delta Wings
      for (var w = -1; w <= 1; w += 2) {
        var wGeo = new THREE.BoxGeometry(2.8, 0.08, 2.0);
        var wMesh = new THREE.Mesh(wGeo, matGold);
        wMesh.position.set(w * 2.2, 0, -0.6);
        wMesh.rotation.y = -w * 0.3;
        group.add(wMesh);
      }

      // Twin Thruster Nozzles
      for (var th = -1; th <= 1; th += 2) {
        var thGeo = new THREE.CylinderGeometry(0.35, 0.45, 1.2, 16);
        var thMesh = new THREE.Mesh(thGeo, matAccentGlow);
        thMesh.rotation.x = Math.PI / 2;
        thMesh.position.set(th * 0.8, 0.2, -2.6);
        group.add(thMesh);
      }

      // Cockpit Hologram Canopy
      var canGeo = new THREE.SphereGeometry(0.55, 16, 12);
      var canMesh = new THREE.Mesh(canGeo, matGlass);
      canMesh.scale.set(0.9, 0.7, 1.8);
      canMesh.position.set(0, 0.5, 0.4);
      group.add(canMesh);
    }
    // 3. QUANTUM REACTOR / SHIELD GENERATOR / MECH CORE
    else if (p.includes('reactor') || p.includes('core') || p.includes('plasma') || p.includes('generator') || p.includes('shield')) {
      var coreGeo = applyNoiseDisplacement(new THREE.IcosahedronGeometry(1.6, 4), { amplitude: 0.18, frequency: 1.2 });
      var coreMesh = new THREE.Mesh(coreGeo, matAccentGlow);
      group.add(coreMesh);

      var shellGeo = new THREE.IcosahedronGeometry(2.4, 1);
      var shellMesh = new THREE.Mesh(shellGeo, matGlass);
      group.add(shellMesh);

      for (var r = 0; r < 3; r++) {
        var ringGeo = new THREE.TorusGeometry(3.0 + r * 0.4, 0.08, 16, 64);
        var ringMesh = new THREE.Mesh(ringGeo, matPrimary);
        ringMesh.rotation.x = (Math.PI / 3) * r;
        ringMesh.rotation.y = (Math.PI / 4) * r;
        group.add(ringMesh);
      }

      for (var f = 0; f < 6; f++) {
        var finAngle = (Math.PI / 3) * f;
        var finGeo = new THREE.BoxGeometry(0.12, 1.8, 0.8);
        var finMesh = new THREE.Mesh(finGeo, matGold);
        finMesh.position.set(Math.cos(finAngle) * 3.4, 0, Math.sin(finAngle) * 3.4);
        finMesh.rotation.y = -finAngle;
        group.add(finMesh);
      }
    }
    // 4. PORTAL / GATEWAY / OMNIVERSE WARP RING
    else if (p.includes('portal') || p.includes('gate') || p.includes('warp') || p.includes('ring') || p.includes('nexus')) {
      var portalGeo = new THREE.TorusGeometry(3.8, 0.45, 24, 64);
      var portalMesh = new THREE.Mesh(portalGeo, matPrimary);
      group.add(portalMesh);

      var discGeo = applyNoiseDisplacement(new THREE.CylinderGeometry(3.3, 3.3, 0.05, 48), { amplitude: 0.15, frequency: 2.0 });
      var discMesh = new THREE.Mesh(discGeo, matGlass);
      discMesh.rotation.x = Math.PI / 2;
      group.add(discMesh);

      for (var g = 0; g < 8; g++) {
        var a = (Math.PI / 4) * g;
        var pylonGeo = new THREE.CylinderGeometry(0.12, 0.25, 1.2, 8);
        var pylonMesh = new THREE.Mesh(pylonGeo, matAccentGlow);
        pylonMesh.position.set(Math.cos(a) * 4.2, Math.sin(a) * 4.2, 0);
        pylonMesh.rotation.z = a - Math.PI / 2;
        group.add(pylonMesh);
      }
    }
    // 5. 4D TESSERACT / HYPERCUBE / METATRON
    else if (p.includes('tesseract') || p.includes('hypercube') || p.includes('4d') || p.includes('metatron') || p.includes('dimension')) {
      var tessGeo = create4DTesseractGeometry(2.4, 0.5);
      var tessLines = new THREE.LineSegments(tessGeo, new THREE.LineBasicMaterial({
        color: new THREE.Color(themeColor),
        linewidth: 2.0
      }));
      group.add(tessLines);

      var inCubeGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
      var inCubeMesh = new THREE.Mesh(inCubeGeo, matGlass);
      group.add(inCubeMesh);

      var tessPos = tessGeo.attributes.position;
      for (var vi = 0; vi < Math.min(16, tessPos.count); vi++) {
        var sphereGeo = new THREE.SphereGeometry(0.12, 12, 12);
        var sMesh = new THREE.Mesh(sphereGeo, matAccentGlow);
        sMesh.position.set(tessPos.getX(vi), tessPos.getY(vi), tessPos.getZ(vi));
        group.add(sMesh);
      }
    }
    // 6. MECHANICAL CYBER GEAR / SPROCKET MECHANISM
    else if (p.includes('gear') || p.includes('sprocket') || p.includes('mechanism') || p.includes('cog') || p.includes('mechanical')) {
      var mainGearGeo = createInvoluteGearGeometry({ numTeeth: 20, pitchRadius: 2.2, thickness: 0.45, boreRadius: 0.55, keyway: true });
      var mainGearMesh = new THREE.Mesh(mainGearGeo, matPrimary);
      group.add(mainGearMesh);

      var axleGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.2, 24);
      var axleMesh = new THREE.Mesh(axleGeo, matGold);
      axleMesh.rotation.x = Math.PI / 2;
      group.add(axleMesh);

      var satelliteCount = 3;
      for (var s = 0; s < satelliteCount; s++) {
        var satAngle = (Math.PI * 2 / satelliteCount) * s;
        var satDist = 3.3;
        var satGearGeo = createInvoluteGearGeometry({ numTeeth: 10, pitchRadius: 1.1, thickness: 0.35, boreRadius: 0.3, keyway: false });
        var satGearMesh = new THREE.Mesh(satGearGeo, matGold);
        satGearMesh.position.set(Math.cos(satAngle) * satDist, Math.sin(satAngle) * satDist, 0);
        satGearMesh.rotation.z = -satAngle * 2;
        group.add(satGearMesh);

        var satPinGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 16);
        var satPinMesh = new THREE.Mesh(satPinGeo, matAccentGlow);
        satPinMesh.rotation.x = Math.PI / 2;
        satPinMesh.position.set(Math.cos(satAngle) * satDist, Math.sin(satAngle) * satDist, 0);
        group.add(satPinMesh);
      }

      var ringGeo = new THREE.TorusGeometry(4.7, 0.18, 16, 64);
      var ringMesh = new THREE.Mesh(ringGeo, matAccentGlow);
      group.add(ringMesh);
    }
    // 7. SUPERQUADRIC MONOLITH / MATHEMATICAL SOLID
    else if (p.includes('superquadric') || p.includes('superellipsoid')) {
      var sqMonoGeo = createSuperquadricGeometry({ s1: 0.22, s2: 0.22, radiusX: 1.1, radiusY: 3.2, radiusZ: 1.1, pinch: 0.15, taper: -0.2, bend: 0.0 });
      var sqMonoMesh = new THREE.Mesh(sqMonoGeo, matPrimary);
      sqMonoMesh.position.y = 1.0;
      group.add(sqMonoMesh);

      for (var r = 0; r < 4; r++) {
        var rAngle = (Math.PI / 2) * r + Math.PI / 4;
        var shardGeo = createSuperquadricGeometry({ s1: 0.4, s2: 0.4, radiusX: 0.3, radiusY: 0.8, radiusZ: 0.3, pinch: 0.3, taper: 0.3, bend: 0.2 });
        var shardMesh = new THREE.Mesh(shardGeo, matAccentGlow);
        shardMesh.position.set(Math.cos(rAngle) * 2.5, 1.0 + Math.sin(r * 1.5) * 0.6, Math.sin(rAngle) * 2.5);
        shardMesh.rotation.set(0.3 * r, rAngle, 0.2);
        group.add(shardMesh);
      }

      var basePedGeo = createSuperquadricGeometry({ s1: 0.15, s2: 0.15, radiusX: 2.4, radiusY: 0.35, radiusZ: 2.4 });
      var basePedMesh = new THREE.Mesh(basePedGeo, matGold);
      basePedMesh.position.y = -1.8;
      group.add(basePedMesh);
    }
    // 8. CALABI-YAU 6D MANIFOLD PROJECTION
    else if (p.includes('calabi') || p.includes('manifold') || p.includes('string theory') || p.includes('threefold') || p.includes('6d')) {
      var cyGeo = createCalabiYauGeometry({ n: 5, kMax: 4, radius: 2.2, segmentsU: 36, segmentsV: 36 });
      var cyMesh = new THREE.Mesh(cyGeo, matGlass);
      group.add(cyMesh);

      var coreGeo2 = new THREE.IcosahedronGeometry(0.8, 3);
      var coreMesh2 = new THREE.Mesh(coreGeo2, matAccentGlow);
      group.add(coreMesh2);

      var wireMat2 = new THREE.MeshBasicMaterial({ color: new THREE.Color(secColor), wireframe: true, transparent: true, opacity: 0.35 });
      var wireMesh2 = new THREE.Mesh(cyGeo.clone(), wireMat2);
      wireMesh2.scale.set(1.02, 1.02, 1.02);
      group.add(wireMesh2);

      for (var ax = 0; ax < 3; ax++) {
        var aRingGeo = new THREE.TorusGeometry(3.0 + ax * 0.3, 0.04, 12, 64);
        var aRingMesh = new THREE.Mesh(aRingGeo, matAccentGlow);
        aRingMesh.rotation.set(ax * (Math.PI / 3), ax * (Math.PI / 4), 0);
        group.add(aRingMesh);
      }
    }
    // 9. PROCEDURAL INTERLOCKING CYBER ARMOR PLATES
    else if (p.includes('armor') || p.includes('plate') || p.includes('plates') || p.includes('shielding') || p.includes('interlocking')) {
      var isDiamond = p.includes('diamond');
      var armorGeo = createCyberArmorPlateGeometry({
        pattern: isDiamond ? 'diamond' : 'hexagonal',
        rows: 4,
        cols: 4,
        plateRadius: 0.7,
        thickness: 0.22,
        bevelSize: 0.07,
        gap: 0.06,
        curvature: 4.5
      });
      var armorMesh = new THREE.Mesh(armorGeo, matPrimary);
      group.add(armorMesh);

      var subGeo = applyNoiseDisplacement(new THREE.BoxGeometry(4.5, 4.5, 0.1), { amplitude: 0.1 });
      var subMesh = new THREE.Mesh(subGeo, matAccentGlow);
      subMesh.position.z = -0.25;
      group.add(subMesh);

      for (var f = -1; f <= 1; f += 2) {
        var strutGeo = new THREE.BoxGeometry(0.35, 4.8, 0.4);
        var strutMesh = new THREE.Mesh(strutGeo, matGold);
        strutMesh.position.set(f * 2.4, 0, -0.05);
        group.add(strutMesh);
      }
    }
    // 10. KLEIN BOTTLE DIFFERENTIAL GEOMETRY
    else if (p.includes('klein')) {
      var kleinGeo = createKleinBottleGeometry({ radius: 1.8, tubeRadius: 0.65, segmentsU: 48, segmentsV: 48 });
      var kleinMesh = new THREE.Mesh(kleinGeo, matGlass);
      group.add(kleinMesh);

      var kleinWire = new THREE.Mesh(kleinGeo.clone(), new THREE.MeshBasicMaterial({ color: new THREE.Color(themeColor), wireframe: true, transparent: true, opacity: 0.45 }));
      group.add(kleinWire);

      var nodeGeo = new THREE.SphereGeometry(0.4, 16, 16);
      var nodeMesh = new THREE.Mesh(nodeGeo, matAccentGlow);
      group.add(nodeMesh);
    }
    // 11. MOBIUS STRIP PARAMETRIC DIFFERENTIAL GEOMETRY
    else if (p.includes('mobius')) {
      var mobiusGeo = createMobiusStripGeometry({ radius: 2.2, width: 0.9, thickness: 0.08, twists: 1, segmentsU: 64, segmentsV: 16 });
      var mobiusMesh = new THREE.Mesh(mobiusGeo, matPrimary);
      group.add(mobiusMesh);

      var edgeWire = new THREE.Mesh(mobiusGeo.clone(), new THREE.MeshBasicMaterial({ color: new THREE.Color(secColor), wireframe: true, transparent: true, opacity: 0.5 }));
      group.add(edgeWire);

      var mobiusPoints = createMobiusStripGeometry({ radius: 2.2, width: 0.9, thickness: 0.12, twists: 1, segmentsU: 24, segmentsV: 4 });
      var ptMat = new THREE.PointsMaterial({ color: new THREE.Color(themeColor), size: 0.1 });
      var ptMesh = new THREE.Points(mobiusPoints, ptMat);
      group.add(ptMesh);
    }
    // 12. CRYSTAL SPIRE / MONOLITH / OBELISK
    else if (p.includes('crystal') || p.includes('spire') || p.includes('monolith') || p.includes('obelisk') || p.includes('pyramid')) {
      var spireGeo = applyNoiseDisplacement(new THREE.ConeGeometry(1.4, 5.5, 6), { amplitude: 0.12, frequency: 1.5 });
      var spireMesh = new THREE.Mesh(spireGeo, matPrimary);
      spireMesh.position.y = 2.0;
      group.add(spireMesh);

      for (var cs = 0; cs < 12; cs++) {
        var cTheta = cs * GOLDEN_ANGLE;
        var cRadius = 2.2 + (cs * 0.1);
        var shardGeo = new THREE.OctahedronGeometry(0.35 + (cs % 3) * 0.1, 0);
        var shardMesh = new THREE.Mesh(shardGeo, matAccentGlow);
        shardMesh.position.set(Math.cos(cTheta) * cRadius, 0.5 + cs * 0.35, Math.sin(cTheta) * cRadius);
        shardMesh.rotation.set(cs * 0.4, cs * 0.6, cs * 0.2);
        group.add(shardMesh);
      }

      var baseGeo = new THREE.CylinderGeometry(2.8, 3.2, 0.4, 8);
      var baseMesh = new THREE.Mesh(baseGeo, matGold);
      baseMesh.position.y = -0.6;
      group.add(baseMesh);
    }
    // 13. TORUS KNOT / TOPOLOGICAL MANIFOLD / DNA HELIX
    else if (p.includes('knot') || p.includes('torus') || p.includes('helix') || p.includes('dna')) {
      var pVal = p.includes('helix') ? 2 : 3;
      var qVal = p.includes('helix') ? 7 : 5;
      var knotGeo = new THREE.TorusKnotGeometry(2.2, 0.45, 128, 32, pVal, qVal);
      applyNoiseDisplacement(knotGeo, { amplitude: 0.08, frequency: 2.0 });
      var knotMesh = new THREE.Mesh(knotGeo, matPrimary);
      group.add(knotMesh);

      var wireMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(secColor),
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      var wireMesh = new THREE.Mesh(knotGeo.clone(), wireMat);
      wireMesh.scale.set(1.04, 1.04, 1.04);
      group.add(wireMesh);
    }
    // 14. DEFAULT DYNAMIC ENTITY: SACRED GOLDEN DODECAHEDRON MATRIX
    else {
      var icosaGeo = applyNoiseDisplacement(new THREE.DodecahedronGeometry(2.2, 1), { amplitude: 0.14, frequency: 1.0 });
      var icosaMesh = new THREE.Mesh(icosaGeo, matPrimary);
      group.add(icosaMesh);

      var outerGeo = new THREE.IcosahedronGeometry(3.0, 1);
      var outerLines = new THREE.LineSegments(
        new THREE.WireframeGeometry(outerGeo),
        new THREE.LineBasicMaterial({ color: new THREE.Color(themeColor), linewidth: 1.5 })
      );
      group.add(outerLines);

      var fibPoints = createFibonacciPhyllotaxisGeometry(150, 3.8);
      var pMat = new THREE.PointsMaterial({
        color: new THREE.Color(secColor),
        size: 0.08,
        transparent: true,
        opacity: 0.8
      });
      var pSystem = new THREE.Points(fibPoints, pMat);
      group.add(pSystem);
    }

    return group;
  }

  // =========================================================================
  // 6. EXPORT UTILITIES & MESH MANIFOLD VALIDATION (GLTF, OBJ, STL)
  // =========================================================================

  /**
   * 🔍 Mesh Manifold & 3D Print Slicing Integrity Validator
   * Checks for non-manifold edges, open boundaries, degenerate triangles,
   * normal orientation consistency, Euler characteristic, volume & surface area.
   */
  function validateMeshManifold(object3D, options) {
    options = options || {};
    var precision = options.precision || 5;
    var mult = Math.pow(10, precision);

    if (object3D && typeof object3D.updateMatrixWorld === 'function') {
      object3D.updateMatrixWorld(true);
    }

    var vertexMap = new Map();
    var uniqueVertices = [];
    var vertexCounter = 0;

    function getVertexIndex(v) {
      var kx = Math.round(v.x * mult) / mult;
      var ky = Math.round(v.y * mult) / mult;
      var kz = Math.round(v.z * mult) / mult;
      var key = kx + ',' + ky + ',' + kz;
      if (vertexMap.has(key)) {
        return vertexMap.get(key);
      }
      var idx = vertexCounter++;
      vertexMap.set(key, idx);
      uniqueVertices.push(new THREE.Vector3(kx, ky, kz));
      return idx;
    }

    var triangles = [];
    var degenerateFacesCount = 0;
    var minBounds = new THREE.Vector3(Infinity, Infinity, Infinity);
    var maxBounds = new THREE.Vector3(-Infinity, -Infinity, -Infinity);

    object3D.traverse(function (child) {
      if (child.isMesh && child.geometry) {
        var geo = child.geometry.isBufferGeometry ? child.geometry : new THREE.BufferGeometry().fromGeometry(child.geometry);
        var pos = geo.attributes.position;
        if (!pos) return;

        var count = geo.index ? geo.index.count : pos.count;
        for (var i = 0; i < count; i += 3) {
          var iA = geo.index ? geo.index.getX(i) : i;
          var iB = geo.index ? geo.index.getX(i + 1) : i + 1;
          var iC = geo.index ? geo.index.getX(i + 2) : i + 2;

          var vA = new THREE.Vector3().fromBufferAttribute(pos, iA).applyMatrix4(child.matrixWorld);
          var vB = new THREE.Vector3().fromBufferAttribute(pos, iB).applyMatrix4(child.matrixWorld);
          var vC = new THREE.Vector3().fromBufferAttribute(pos, iC).applyMatrix4(child.matrixWorld);

          minBounds.min(vA).min(vB).min(vC);
          maxBounds.max(vA).max(vB).max(vC);

          var idxA = getVertexIndex(vA);
          var idxB = getVertexIndex(vB);
          var idxC = getVertexIndex(vC);

          // Check for collapsed or degenerate triangle
          if (idxA === idxB || idxB === idxC || idxA === idxC) {
            degenerateFacesCount++;
            continue;
          }

          var ab = new THREE.Vector3().subVectors(vB, vA);
          var ac = new THREE.Vector3().subVectors(vC, vA);
          var cross = new THREE.Vector3().crossVectors(ab, ac);
          var area2 = cross.length();
          if (area2 < 1e-10) {
            degenerateFacesCount++;
            continue;
          }

          triangles.push({
            indices: [idxA, idxB, idxC],
            verts: [vA, vB, vC],
            area: area2 * 0.5
          });
        }
      }
    });

    var edgeMap = new Map();
    var directedHalfEdges = new Map();

    for (var t = 0; t < triangles.length; t++) {
      var tri = triangles[t].indices;
      var triEdges = [
        [tri[0], tri[1]],
        [tri[1], tri[2]],
        [tri[2], tri[0]]
      ];

      for (var e = 0; e < 3; e++) {
        var u = triEdges[e][0];
        var v = triEdges[e][1];
        var edgeKey = u < v ? u + '_' + v : v + '_' + u;
        var directedKey = u + '->' + v;

        edgeMap.set(edgeKey, (edgeMap.get(edgeKey) || 0) + 1);
        directedHalfEdges.set(directedKey, (directedHalfEdges.get(directedKey) || 0) + 1);
      }
    }

    var boundaryEdgesCount = 0;
    var manifoldEdgesCount = 0;
    var nonManifoldEdgesCount = 0;

    edgeMap.forEach(function (count) {
      if (count === 1) boundaryEdgesCount++;
      else if (count === 2) manifoldEdgesCount++;
      else if (count > 2) nonManifoldEdgesCount++;
    });

    // Normal consistency check
    var inconsistentNormalsCount = 0;
    directedHalfEdges.forEach(function (count) {
      if (count > 1) {
        inconsistentNormalsCount += (count - 1);
      }
    });

    // Signed volume & Surface Area
    var signedVolume = 0;
    var surfaceArea = 0;
    for (var st = 0; st < triangles.length; st++) {
      var vPts = triangles[st].verts;
      surfaceArea += triangles[st].area;
      // Volume contribution: 1/6 * vA . (vB x vC)
      var cV = new THREE.Vector3().crossVectors(vPts[1], vPts[2]);
      signedVolume += vPts[0].dot(cV) / 6.0;
    }

    var V = uniqueVertices.length;
    var E = edgeMap.size;
    var F = triangles.length;
    var eulerCharacteristic = V - E + F;
    var genus = Math.max(0, Math.round(1 - eulerCharacteristic / 2));

    var isManifold = (nonManifoldEdgesCount === 0);
    var isWatertight = isManifold && (boundaryEdgesCount === 0);
    var validFor3DPrinting = isWatertight && (degenerateFacesCount === 0) && (nonManifoldEdgesCount === 0);

    var errors = [];
    var warnings = [];

    if (nonManifoldEdgesCount > 0) {
      errors.push('Found ' + nonManifoldEdgesCount + ' non-manifold edges (shared by >2 faces). Mesh cannot be 3D printed.');
    }
    if (boundaryEdgesCount > 0) {
      warnings.push('Found ' + boundaryEdgesCount + ' boundary/open edges. Mesh is not watertight.');
    }
    if (degenerateFacesCount > 0) {
      warnings.push('Found ' + degenerateFacesCount + ' degenerate/zero-area faces.');
    }
    if (inconsistentNormalsCount > 0) {
      warnings.push('Found ' + inconsistentNormalsCount + ' opposing half-edge normal inconsistencies.');
    }

    return {
      isManifold: isManifold,
      isWatertight: isWatertight,
      validFor3DPrinting: validFor3DPrinting,
      totalVertices: V,
      totalEdges: E,
      totalTriangles: F,
      boundaryEdgesCount: boundaryEdgesCount,
      manifoldEdgesCount: manifoldEdgesCount,
      nonManifoldEdgesCount: nonManifoldEdgesCount,
      degenerateFacesCount: degenerateFacesCount,
      inconsistentNormalsCount: inconsistentNormalsCount,
      eulerCharacteristic: eulerCharacteristic,
      genus: genus,
      volume: Math.abs(signedVolume),
      surfaceArea: surfaceArea,
      boundingBox: {
        min: { x: minBounds.x, y: minBounds.y, z: minBounds.z },
        max: { x: maxBounds.x, y: maxBounds.y, z: maxBounds.z },
        size: {
          width: Math.max(0, maxBounds.x - minBounds.x),
          height: Math.max(0, maxBounds.y - minBounds.y),
          depth: Math.max(0, maxBounds.z - minBounds.z)
        }
      },
      errors: errors,
      warnings: warnings
    };
  }

  /**
   * 📦 Wavefront OBJ Exporter
   * Compliant with Wavefront OBJ 3.0 specification:
   * - Object naming (`o`) and group naming (`g`)
   * - World-space vertex coordinates (`v`)
   * - Vertex texture coordinates (`vt`)
   * - Transformed vertex normals (`vn`)
   * - Multi-index face topology (`f v/vt/vn` or `f v//vn`)
   */
  function exportToOBJ(object3D, options) {
    options = options || {};
    var includeNormals = options.includeNormals !== false;
    var includeUVs = options.includeUVs !== false;
    var includeGroups = options.includeGroups !== false;

    if (object3D && typeof object3D.updateMatrixWorld === 'function') {
      object3D.updateMatrixWorld(true);
    }

    var output = '# Zoth Nexus 3D Algorithmic Model Export\n';
    output += '# Engine: Nexus 3D Generator ' + VERSION + '\n';
    output += '# Format: Wavefront OBJ (CAD & DCC Compatible)\n\n';

    var vertOffset = 1;
    var uvOffset = 1;
    var normOffset = 1;

    object3D.traverse(function (child) {
      if (child.isMesh && child.geometry) {
        var geo = child.geometry.isBufferGeometry ? child.geometry : new THREE.BufferGeometry().fromGeometry(child.geometry);
        var pos = geo.attributes.position;
        if (!pos) return;

        var norm = geo.attributes.normal;
        if (!norm && includeNormals) {
          geo.computeVertexNormals();
          norm = geo.attributes.normal;
        }
        var uv = geo.attributes.uv;

        var normalMatrix = new THREE.Matrix3().getNormalMatrix(child.matrixWorld);

        var partName = child.name || ('MeshPart_' + vertOffset);
        output += 'o ' + partName + '\n';
        if (includeGroups) {
          output += 'g ' + partName + '\n';
        }

        // Positions
        for (var i = 0; i < pos.count; i++) {
          var v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(child.matrixWorld);
          output += 'v ' + v.x.toFixed(5) + ' ' + v.y.toFixed(5) + ' ' + v.z.toFixed(5) + '\n';
        }

        // UVs
        var hasUVs = false;
        if (uv && includeUVs) {
          hasUVs = true;
          for (var u = 0; u < uv.count; u++) {
            output += 'vt ' + uv.getX(u).toFixed(5) + ' ' + uv.getY(u).toFixed(5) + '\n';
          }
        }

        // Normals
        var hasNormals = false;
        if (norm && includeNormals) {
          hasNormals = true;
          for (var nIdx = 0; nIdx < norm.count; nIdx++) {
            var n = new THREE.Vector3(norm.getX(nIdx), norm.getY(nIdx), norm.getZ(nIdx)).applyMatrix3(normalMatrix).normalize();
            output += 'vn ' + n.x.toFixed(5) + ' ' + n.y.toFixed(5) + ' ' + n.z.toFixed(5) + '\n';
          }
        }

        // Faces
        var count = geo.index ? geo.index.count : pos.count;
        for (var f = 0; f < count; f += 3) {
          var iA = geo.index ? geo.index.getX(f) : f;
          var iB = geo.index ? geo.index.getX(f + 1) : f + 1;
          var iC = geo.index ? geo.index.getX(f + 2) : f + 2;

          var vA = iA + vertOffset;
          var vB = iB + vertOffset;
          var vC = iC + vertOffset;

          if (hasUVs && hasNormals) {
            var vtA = iA + uvOffset, vtB = iB + uvOffset, vtC = iC + uvOffset;
            var vnA = iA + normOffset, vnB = iB + normOffset, vnC = iC + normOffset;
            output += 'f ' + vA + '/' + vtA + '/' + vnA + ' ' + vB + '/' + vtB + '/' + vnB + ' ' + vC + '/' + vtC + '/' + vnC + '\n';
          } else if (hasNormals) {
            var vnA2 = iA + normOffset, vnB2 = iB + normOffset, vnC2 = iC + normOffset;
            output += 'f ' + vA + '//' + vnA2 + ' ' + vB + '//' + vnB2 + ' ' + vC + '//' + vnC2 + '\n';
          } else if (hasUVs) {
            var vtA2 = iA + uvOffset, vtB2 = iB + uvOffset, vtC2 = iC + uvOffset;
            output += 'f ' + vA + '/' + vtA2 + ' ' + vB + '/' + vtB2 + ' ' + vC + '/' + vtC2 + '\n';
          } else {
            output += 'f ' + vA + ' ' + vB + ' ' + vC + '\n';
          }
        }

        vertOffset += pos.count;
        if (hasUVs) uvOffset += uv.count;
        if (hasNormals) normOffset += norm.count;
      }
    });

    return output;
  }

  /**
   * 📐 Stereolithography (STL) Exporter (ASCII & Binary)
   * Calculates true facet normal vectors (vB - vA) x (vC - vA) for slicers & 3D printers.
   * Supports binary 80-byte header + uint32 triangle count + 50-byte facet stride.
   */
  function exportToSTL(object3D, options) {
    if (typeof options === 'boolean') options = { binary: options };
    options = options || {};
    var binary = Boolean(options.binary);
    var solidName = options.name || 'ZothNexus3D';

    if (object3D && typeof object3D.updateMatrixWorld === 'function') {
      object3D.updateMatrixWorld(true);
    }

    if (options.validateManifold) {
      var audit = validateMeshManifold(object3D);
      if (!audit.isManifold || !audit.isWatertight) {
        console.warn('⚠️ Nexus 3D STL Manifold Warning:', audit.errors.concat(audit.warnings).join('; '));
      }
    }

    var triangles = [];
    var ab = new THREE.Vector3();
    var cb = new THREE.Vector3();
    var normal = new THREE.Vector3();

    object3D.traverse(function (child) {
      if (child.isMesh && child.geometry) {
        var geo = child.geometry.isBufferGeometry ? child.geometry : new THREE.BufferGeometry().fromGeometry(child.geometry);
        var pos = geo.attributes.position;
        if (!pos) return;

        var count = geo.index ? geo.index.count : pos.count;
        for (var i = 0; i < count; i += 3) {
          var iA = geo.index ? geo.index.getX(i) : i;
          var iB = geo.index ? geo.index.getX(i + 1) : i + 1;
          var iC = geo.index ? geo.index.getX(i + 2) : i + 2;

          var vA = new THREE.Vector3().fromBufferAttribute(pos, iA).applyMatrix4(child.matrixWorld);
          var vB = new THREE.Vector3().fromBufferAttribute(pos, iB).applyMatrix4(child.matrixWorld);
          var vC = new THREE.Vector3().fromBufferAttribute(pos, iC).applyMatrix4(child.matrixWorld);

          // Facet Normal: (vB - vA) x (vC - vA)
          ab.subVectors(vB, vA);
          cb.subVectors(vC, vA);
          normal.crossVectors(ab, cb);
          var len = normal.length();
          if (len > 1e-7) {
            normal.divideScalar(len);
          } else {
            normal.set(0, 0, 0);
          }

          triangles.push({
            normal: normal.clone(),
            a: vA,
            b: vB,
            c: vC
          });
        }
      }
    });

    if (!binary) {
      var output = 'solid ' + solidName + '\n';
      for (var t = 0; t < triangles.length; t++) {
        var tri = triangles[t];
        output += '  facet normal ' + tri.normal.x.toFixed(6) + ' ' + tri.normal.y.toFixed(6) + ' ' + tri.normal.z.toFixed(6) + '\n';
        output += '    outer loop\n';
        output += '      vertex ' + tri.a.x.toFixed(6) + ' ' + tri.a.y.toFixed(6) + ' ' + tri.a.z.toFixed(6) + '\n';
        output += '      vertex ' + tri.b.x.toFixed(6) + ' ' + tri.b.y.toFixed(6) + ' ' + tri.b.z.toFixed(6) + '\n';
        output += '      vertex ' + tri.c.x.toFixed(6) + ' ' + tri.c.y.toFixed(6) + ' ' + tri.c.z.toFixed(6) + '\n';
        output += '    endloop\n';
        output += '  endfacet\n';
      }
      output += 'endsolid ' + solidName + '\n';
      return output;
    }

    // Binary STL (84 + triangles.length * 50 bytes)
    var bufferLength = 84 + triangles.length * 50;
    var arrayBuffer = new ArrayBuffer(bufferLength);
    var view = new DataView(arrayBuffer);

    var headerStr = 'Zoth Nexus 3D Omniverse Binary STL Exporter (3D Print CAD Ready)';
    for (var h = 0; h < 80; h++) {
      view.setUint8(h, h < headerStr.length ? headerStr.charCodeAt(h) : 0);
    }
    view.setUint32(80, triangles.length, true);

    var offset = 84;
    for (var tb = 0; tb < triangles.length; tb++) {
      var triB = triangles[tb];
      // Normal
      view.setFloat32(offset, triB.normal.x, true); offset += 4;
      view.setFloat32(offset, triB.normal.y, true); offset += 4;
      view.setFloat32(offset, triB.normal.z, true); offset += 4;
      // Vertex 1
      view.setFloat32(offset, triB.a.x, true); offset += 4;
      view.setFloat32(offset, triB.a.y, true); offset += 4;
      view.setFloat32(offset, triB.a.z, true); offset += 4;
      // Vertex 2
      view.setFloat32(offset, triB.b.x, true); offset += 4;
      view.setFloat32(offset, triB.b.y, true); offset += 4;
      view.setFloat32(offset, triB.b.z, true); offset += 4;
      // Vertex 3
      view.setFloat32(offset, triB.c.x, true); offset += 4;
      view.setFloat32(offset, triB.c.y, true); offset += 4;
      view.setFloat32(offset, triB.c.z, true); offset += 4;
      // Attribute byte count
      view.setUint16(offset, 0, true); offset += 2;
    }

    return new Uint8Array(arrayBuffer);
  }

  /**
   * 💾 GLTF 2.0 / GLB Exporter
   * Generates standard glTF 2.0 with embedded PBR materials, buffers, and node hierarchy.
   */
  function exportSceneGLTF(object3D, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options = options || {};
    var binary = Boolean(options.binary);

    if (typeof THREE.GLTFExporter === 'function') {
      var exporter = new THREE.GLTFExporter();
      return exporter.parse(object3D, callback || function () {}, options);
    }

    if (object3D && typeof object3D.updateMatrixWorld === 'function') {
      object3D.updateMatrixWorld(true);
    }

    var gltf = {
      asset: {
        version: '2.0',
        generator: 'Zoth Nexus 3D Omniverse GLTF Synthesizer ' + VERSION
      },
      scene: 0,
      scenes: [{ nodes: [] }],
      nodes: [],
      meshes: [],
      materials: [],
      accessors: [],
      bufferViews: [],
      buffers: []
    };

    var bufferData = [];
    var byteOffset = 0;

    function addBufferData(typedArray, target) {
      var uint8 = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
      bufferData.push(uint8);
      var viewIdx = gltf.bufferViews.length;
      gltf.bufferViews.push({
        buffer: 0,
        byteOffset: byteOffset,
        byteLength: typedArray.byteLength,
        target: target
      });
      var padding = (4 - (typedArray.byteLength % 4)) % 4;
      byteOffset += typedArray.byteLength + padding;
      if (padding > 0) {
        bufferData.push(new Uint8Array(padding));
      }
      return viewIdx;
    }

    var matCounter = 0;
    function processMaterial(mat) {
      if (!mat) return undefined;
      var matIdx = gltf.materials.length;
      var pbr = {};
      if (mat.color) {
        pbr.baseColorFactor = [mat.color.r, mat.color.g, mat.color.b, mat.opacity !== undefined ? mat.opacity : 1.0];
      }
      pbr.metallicFactor = mat.metalness !== undefined ? mat.metalness : 0.5;
      pbr.roughnessFactor = mat.roughness !== undefined ? mat.roughness : 0.5;

      var gltfMat = {
        name: mat.name || ('Material_' + matCounter++),
        pbrMetallicRoughness: pbr
      };
      if (mat.emissive) {
        gltfMat.emissiveFactor = [mat.emissive.r, mat.emissive.g, mat.emissive.b];
      }
      if (mat.transparent) {
        gltfMat.alphaMode = 'BLEND';
      }
      gltf.materials.push(gltfMat);
      return matIdx;
    }

    function processNode(obj) {
      var nodeIdx = gltf.nodes.length;
      var node = {
        name: obj.name || ('Node_' + nodeIdx),
        translation: [obj.position.x, obj.position.y, obj.position.z],
        rotation: [obj.quaternion.x, obj.quaternion.y, obj.quaternion.z, obj.quaternion.w],
        scale: [obj.scale.x, obj.scale.y, obj.scale.z]
      };
      gltf.nodes.push(node);

      if (obj.isMesh && obj.geometry) {
        var geo = obj.geometry.isBufferGeometry ? obj.geometry : new THREE.BufferGeometry().fromGeometry(obj.geometry);
        var pos = geo.attributes.position;
        if (pos) {
          var meshIdx = gltf.meshes.length;
          var primitive = { attributes: {} };

          var posMin = [Infinity, Infinity, Infinity];
          var posMax = [-Infinity, -Infinity, -Infinity];
          for (var pI = 0; pI < pos.count; pI++) {
            posMin[0] = Math.min(posMin[0], pos.getX(pI));
            posMin[1] = Math.min(posMin[1], pos.getY(pI));
            posMin[2] = Math.min(posMin[2], pos.getZ(pI));
            posMax[0] = Math.max(posMax[0], pos.getX(pI));
            posMax[1] = Math.max(posMax[1], pos.getY(pI));
            posMax[2] = Math.max(posMax[2], pos.getZ(pI));
          }
          var posView = addBufferData(new Float32Array(pos.array), 34962);
          var posAccIdx = gltf.accessors.length;
          gltf.accessors.push({
            bufferView: posView,
            componentType: 5126,
            count: pos.count,
            type: 'VEC3',
            min: posMin,
            max: posMax
          });
          primitive.attributes.POSITION = posAccIdx;

          if (geo.attributes.normal) {
            var norm = geo.attributes.normal;
            var normView = addBufferData(new Float32Array(norm.array), 34962);
            var normAccIdx = gltf.accessors.length;
            gltf.accessors.push({
              bufferView: normView,
              componentType: 5126,
              count: norm.count,
              type: 'VEC3'
            });
            primitive.attributes.NORMAL = normAccIdx;
          }

          if (geo.attributes.uv) {
            var uv = geo.attributes.uv;
            var uvView = addBufferData(new Float32Array(uv.array), 34962);
            var uvAccIdx = gltf.accessors.length;
            gltf.accessors.push({
              bufferView: uvView,
              componentType: 5126,
              count: uv.count,
              type: 'VEC2'
            });
            primitive.attributes.TEXCOORD_0 = uvAccIdx;
          }

          if (geo.index) {
            var idxArr = geo.index.array;
            var isUint32 = (geo.index.array instanceof Uint32Array);
            var indicesView = addBufferData(idxArr, 34963);
            var idxAccIdx = gltf.accessors.length;
            gltf.accessors.push({
              bufferView: indicesView,
              componentType: isUint32 ? 5125 : 5123,
              count: geo.index.count,
              type: 'SCALAR'
            });
            primitive.indices = idxAccIdx;
          }

          if (obj.material) {
            primitive.material = processMaterial(obj.material);
          }

          gltf.meshes.push({
            name: (obj.name || 'Mesh') + '_Geometry',
            primitives: [primitive]
          });
          node.mesh = meshIdx;
        }
      }

      if (obj.children && obj.children.length > 0) {
        node.children = [];
        for (var c = 0; c < obj.children.length; c++) {
          var childIdx = processNode(obj.children[c]);
          node.children.push(childIdx);
        }
      }

      return nodeIdx;
    }

    var rootNodes = (object3D.children && object3D.children.length > 0) ? object3D.children : [object3D];
    for (var r = 0; r < rootNodes.length; r++) {
      var rootIdx = processNode(rootNodes[r]);
      gltf.scenes[0].nodes.push(rootIdx);
    }

    var totalLength = byteOffset;
    var combinedBuffer = new Uint8Array(totalLength);
    var curOffset = 0;
    for (var b = 0; b < bufferData.length; b++) {
      var chunk = bufferData[b];
      combinedBuffer.set(chunk, curOffset);
      curOffset += chunk.byteLength;
    }

    if (binary) {
      var jsonText = JSON.stringify(gltf);
      var jsonEnc = (typeof TextEncoder !== 'undefined') ? new TextEncoder().encode(jsonText) : (function (s) {
        var u = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
        return u;
      })(jsonText);

      var jsonPadding = (4 - (jsonEnc.length % 4)) % 4;
      var jsonChunkLength = jsonEnc.length + jsonPadding;

      var binPadding = (4 - (combinedBuffer.byteLength % 4)) % 4;
      var binChunkLength = combinedBuffer.byteLength + binPadding;

      var totalGLBLength = 12 + 8 + jsonChunkLength + 8 + binChunkLength;
      var outBuf = new ArrayBuffer(totalGLBLength);
      var glbView = new DataView(outBuf);
      var outBytes = new Uint8Array(outBuf);

      glbView.setUint32(0, 0x46546C67, true); // 'glTF'
      glbView.setUint32(4, 2, true);
      glbView.setUint32(8, totalGLBLength, true);

      var wOff = 12;
      glbView.setUint32(wOff, jsonChunkLength, true); wOff += 4;
      glbView.setUint32(wOff, 0x4E4F534A, true); wOff += 4; // 'JSON'
      outBytes.set(jsonEnc, wOff); wOff += jsonEnc.length;
      for (var p0 = 0; p0 < jsonPadding; p0++) { outBytes[wOff++] = 0x20; }

      glbView.setUint32(wOff, binChunkLength, true); wOff += 4;
      glbView.setUint32(wOff, 0x004E4942, true); wOff += 4; // 'BIN\0'
      outBytes.set(combinedBuffer, wOff); wOff += combinedBuffer.byteLength;
      for (var p1 = 0; p1 < binPadding; p1++) { outBytes[wOff++] = 0x00; }

      if (callback) callback(outBytes);
      return outBytes;
    } else {
      var base64 = (typeof Buffer !== 'undefined')
        ? Buffer.from(combinedBuffer.buffer, combinedBuffer.byteOffset, combinedBuffer.byteLength).toString('base64')
        : (function (u8) {
            var binStr = '';
            for (var i = 0; i < u8.byteLength; i++) binStr += String.fromCharCode(u8[i]);
            return btoa(binStr);
          })(combinedBuffer);

      gltf.buffers.push({
        byteLength: totalLength,
        uri: 'data:application/octet-stream;base64,' + base64
      });

      if (callback) callback(gltf);
      return gltf;
    }
  }

  // =========================================================================
  // 7.B 1-CLICK USDZ EXPORTER (Apple AR QuickLook & Universal Scene Description)
  // =========================================================================

  function exportToUSDZ(object3D, options) {
    options = options || {};
    if (!object3D) return null;

    if (object3D && typeof object3D.updateMatrixWorld === 'function') {
      object3D.updateMatrixWorld(true);
    }

    var meshes = [];
    object3D.traverse(function (child) {
      if (child.isMesh && child.geometry) {
        meshes.push(child);
      }
    });

    if (meshes.length === 0) {
      return null;
    }

    var usdaLines = [
      '#usda 1.0',
      '(',
      '    defaultPrim = "Root"',
      '    metersPerUnit = 1.0',
      '    upAxis = "Y"',
      ')',
      '',
      'def Xform "Root"',
      '{',
      '    def Scope "Materials"',
      '    {'
    ];

    // Materials Scope
    for (var mI = 0; mI < meshes.length; mI++) {
      var mat = meshes[mI].material;
      var matName = 'Material_' + mI;
      var colorR = 0.0, colorG = 0.94, colorB = 1.0;
      var metal = 0.5, rough = 0.5, emissiveR = 0.0, emissiveG = 0.0, emissiveB = 0.0;
      if (mat) {
        if (mat.color) {
          colorR = Number(mat.color.r.toFixed(4));
          colorG = Number(mat.color.g.toFixed(4));
          colorB = Number(mat.color.b.toFixed(4));
        }
        if (mat.metalness !== undefined) metal = Number(mat.metalness.toFixed(3));
        if (mat.roughness !== undefined) rough = Number(mat.roughness.toFixed(3));
        if (mat.emissive) {
          emissiveR = Number(mat.emissive.r.toFixed(4));
          emissiveG = Number(mat.emissive.g.toFixed(4));
          emissiveB = Number(mat.emissive.b.toFixed(4));
        }
      }

      usdaLines.push('        def Material "' + matName + '"');
      usdaLines.push('        {');
      usdaLines.push('            token outputs:surface.connect = </Root/Materials/' + matName + '/PBRShader.outputs:surface>');
      usdaLines.push('            def Shader "PBRShader"');
      usdaLines.push('            {');
      usdaLines.push('                uniform token info:id = "UsdPreviewSurface"');
      usdaLines.push('                color3f inputs:diffuseColor = (' + colorR + ', ' + colorG + ', ' + colorB + ')');
      if (emissiveR > 0 || emissiveG > 0 || emissiveB > 0) {
        usdaLines.push('                color3f inputs:emissiveColor = (' + emissiveR + ', ' + emissiveG + ', ' + emissiveB + ')');
      }
      usdaLines.push('                float inputs:metallic = ' + metal);
      usdaLines.push('                float inputs:roughness = ' + rough);
      usdaLines.push('                token outputs:surface');
      usdaLines.push('            }');
      usdaLines.push('        }');
    }
    usdaLines.push('    }');
    usdaLines.push('');

    // Meshes Scope
    for (var meshIdx = 0; meshIdx < meshes.length; meshIdx++) {
      var mesh = meshes[meshIdx];
      var geo = mesh.geometry.isBufferGeometry ? mesh.geometry : new THREE.BufferGeometry().fromGeometry(mesh.geometry);
      var posAttr = geo.attributes.position;
      if (!posAttr) continue;

      var normAttr = geo.attributes.normal;
      var uvAttr = geo.attributes.uv;
      var indexAttr = geo.index;

      var meshName = 'Mesh_' + meshIdx;
      var points = [];
      for (var pI = 0; pI < posAttr.count; pI++) {
        var vx = Number(posAttr.getX(pI).toFixed(4));
        var vy = Number(posAttr.getY(pI).toFixed(4));
        var vz = Number(posAttr.getZ(pI).toFixed(4));
        points.push('(' + vx + ', ' + vy + ', ' + vz + ')');
      }

      var faceVertexCounts = [];
      var faceVertexIndices = [];
      if (indexAttr) {
        var numFaces = Math.floor(indexAttr.count / 3);
        for (var f = 0; f < numFaces; f++) {
          faceVertexCounts.push('3');
          faceVertexIndices.push(indexAttr.getX(f * 3));
          faceVertexIndices.push(indexAttr.getX(f * 3 + 1));
          faceVertexIndices.push(indexAttr.getX(f * 3 + 2));
        }
      } else {
        var numFacesDirect = Math.floor(posAttr.count / 3);
        for (var fd = 0; fd < numFacesDirect; fd++) {
          faceVertexCounts.push('3');
          faceVertexIndices.push(fd * 3);
          faceVertexIndices.push(fd * 3 + 1);
          faceVertexIndices.push(fd * 3 + 2);
        }
      }

      usdaLines.push('    def Mesh "' + meshName + '"');
      usdaLines.push('    {');
      usdaLines.push('        rel material:binding = </Root/Materials/Material_' + meshIdx + '>');
      usdaLines.push('        int[] faceVertexCounts = [' + faceVertexCounts.join(', ') + ']');
      usdaLines.push('        int[] faceVertexIndices = [' + faceVertexIndices.join(', ') + ']');
      usdaLines.push('        point3f[] points = [' + points.join(', ') + ']');

      if (normAttr) {
        var normals = [];
        for (var nI = 0; nI < normAttr.count; nI++) {
          normals.push('(' + Number(normAttr.getX(nI).toFixed(4)) + ', ' + Number(normAttr.getY(nI).toFixed(4)) + ', ' + Number(normAttr.getZ(nI).toFixed(4)) + ')');
        }
        usdaLines.push('        normal3f[] normals = [' + normals.join(', ') + '] (interpolation = "vertex")');
      }

      if (uvAttr) {
        var uvs = [];
        for (var uI = 0; uI < uvAttr.count; uI++) {
          uvs.push('(' + Number(uvAttr.getX(uI).toFixed(4)) + ', ' + Number((1.0 - uvAttr.getY(uI)).toFixed(4)) + ')');
        }
        usdaLines.push('        texCoord2f[] primvars:st = [' + uvs.join(', ') + '] (interpolation = "vertex")');
      }

      usdaLines.push('        uniform token subdivisionScheme = "none"');
      usdaLines.push('    }');
    }

    usdaLines.push('}');
    var usdaText = usdaLines.join('\n');

    if (options.textOnly) {
      if (options.callback) options.callback(usdaText);
      return usdaText;
    }

    // Build uncompressed 64-byte aligned USDZ zip package
    var encText = (typeof TextEncoder !== 'undefined') ? new TextEncoder().encode(usdaText) : (function (s) {
      var u = new Uint8Array(s.length);
      for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
      return u;
    })(usdaText);

    var fileName = 'model.usda';
    var fileNameBytes = (typeof TextEncoder !== 'undefined') ? new TextEncoder().encode(fileName) : (function (s) {
      var u = new Uint8Array(s.length);
      for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
      return u;
    })(fileName);

    // CRC32 calculation
    var crcTable = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      crcTable[n] = c >>> 0;
    }
    function calcCrc32(buf) {
      var crc = 0 ^ (-1);
      for (var i = 0; i < buf.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
      }
      return (crc ^ (-1)) >>> 0;
    }
    var fileCrc = calcCrc32(encText);

    // USDZ requires file data to be aligned on a 64-byte boundary
    var localHeaderSize = 30 + fileNameBytes.length;
    var extraPadding = (64 - (localHeaderSize % 64)) % 64;
    var totalLocalHeaderSize = localHeaderSize + extraPadding;

    var fileDataOffset = totalLocalHeaderSize;
    var centralDirOffset = fileDataOffset + encText.length;
    var centralDirSize = 46 + fileNameBytes.length;
    var totalZipSize = centralDirOffset + centralDirSize + 22;

    var zipBuf = new ArrayBuffer(totalZipSize);
    var zipView = new DataView(zipBuf);
    var zipBytes = new Uint8Array(zipBuf);

    // 1. Local File Header
    zipView.setUint32(0, 0x04034B50, true); // signature
    zipView.setUint16(4, 20, true);         // version needed
    zipView.setUint16(6, 0, true);          // flags
    zipView.setUint16(8, 0, true);          // compression (0 = uncompressed)
    zipView.setUint16(10, 0, true);         // mod time
    zipView.setUint16(12, 0, true);         // mod date
    zipView.setUint32(14, fileCrc, true);   // crc-32
    zipView.setUint32(18, encText.length, true); // compressed size
    zipView.setUint32(22, encText.length, true); // uncompressed size
    zipView.setUint16(26, fileNameBytes.length, true); // filename len
    zipView.setUint16(28, extraPadding, true);         // extra field len
    zipBytes.set(fileNameBytes, 30);

    // 2. File Data
    zipBytes.set(encText, fileDataOffset);

    // 3. Central Directory Record
    var cdOff = centralDirOffset;
    zipView.setUint32(cdOff + 0, 0x02014B50, true); // signature
    zipView.setUint16(cdOff + 4, 20, true);         // version made by
    zipView.setUint16(cdOff + 6, 20, true);         // version needed
    zipView.setUint16(cdOff + 8, 0, true);          // flags
    zipView.setUint16(cdOff + 10, 0, true);         // compression (0)
    zipView.setUint16(cdOff + 12, 0, true);         // mod time
    zipView.setUint16(cdOff + 14, 0, true);         // mod date
    zipView.setUint32(cdOff + 16, fileCrc, true);   // crc-32
    zipView.setUint32(cdOff + 20, encText.length, true); // compressed size
    zipView.setUint32(cdOff + 24, encText.length, true); // uncompressed size
    zipView.setUint16(cdOff + 28, fileNameBytes.length, true); // filename len
    zipView.setUint16(cdOff + 30, 0, true);         // extra field len
    zipView.setUint16(cdOff + 32, 0, true);         // comment len
    zipView.setUint16(cdOff + 34, 0, true);         // disk start
    zipView.setUint16(cdOff + 36, 0, true);         // internal attrs
    zipView.setUint32(cdOff + 38, 0, true);         // external attrs
    zipView.setUint32(cdOff + 42, 0, true);         // relative offset of local header
    zipBytes.set(fileNameBytes, cdOff + 46);

    // 4. End of Central Directory
    var eocdOff = centralDirOffset + centralDirSize;
    zipView.setUint32(eocdOff + 0, 0x06054B50, true); // signature
    zipView.setUint16(eocdOff + 4, 0, true);          // disk number
    zipView.setUint16(eocdOff + 6, 0, true);          // disk with central dir
    zipView.setUint16(eocdOff + 8, 1, true);          // num entries this disk
    zipView.setUint16(eocdOff + 10, 1, true);         // total num entries
    zipView.setUint32(eocdOff + 12, centralDirSize, true); // central dir size
    zipView.setUint32(eocdOff + 16, centralDirOffset, true); // central dir offset
    zipView.setUint16(eocdOff + 20, 0, true);         // comment len

    if (options.callback) options.callback(zipBytes);
    return zipBytes;
  }

  // =========================================================================
  // 7.C PROCEDURAL SHADER & MATERIAL FACTORY
  // =========================================================================

  function createProceduralShaderMaterial(preset, options) {
    options = options || {};
    var themeColor = options.themeColor || '#00f0ff';
    var pbrTex = createProceduralPBRTextures({ style: preset, themeColor: themeColor, size: options.size || 512 });

    if (!THREE || !THREE.MeshStandardMaterial) {
      return { preset: preset, options: options, textures: pbrTex };
    }

    var mat = new THREE.MeshStandardMaterial({
      map: pbrTex.map,
      normalMap: pbrTex.normalMap,
      roughnessMap: pbrTex.roughnessMap,
      metalnessMap: pbrTex.metalnessMap,
      emissiveMap: pbrTex.emissiveMap,
      color: new THREE.Color(preset === 'azoth-gold' ? 0xfbbf24 : preset === 'obsidian-matte' ? 0x11141a : 0xffffff),
      roughness: preset === 'azoth-gold' ? 0.12 : preset === 'obsidian-matte' ? 0.38 : preset === 'hologram-grid' ? 0.15 : 0.2,
      metalness: preset === 'azoth-gold' ? 0.95 : preset === 'obsidian-matte' ? 0.15 : preset === 'hologram-grid' ? 0.85 : 0.8,
      emissive: new THREE.Color(preset === 'neon-wireframe' ? themeColor : preset === 'bioluminescent-pulse' ? 0x34d399 : 0x000000),
      wireframe: preset === 'neon-wireframe' ? (options.wireframe !== undefined ? options.wireframe : false) : false
    });

    mat.userData = {
      preset: preset,
      pbrTextures: pbrTex,
      pulseSpeed: options.pulseSpeed || 1.0,
      baseColor: themeColor
    };

    return mat;
  }

  // =========================================================================
  // 7.D HIGH-RES 4K/1080p CANVAS SCREENSHOT & 360° TURNAROUND FRAME RECORDER
  // =========================================================================

  function createTurnaroundCaptureEngine(renderer, scene, camera, options) {
    options = options || {};
    var resolution = options.resolution || '1080p'; // '1080p' (1920x1080), '4k' (3840x2160), 'square' (1080x1080)
    var frameCount = options.frameCount || 120; // 120 frames = 4s at 30fps
    var fps = options.fps || 30;
    var radius = options.radius || 4.5;
    var height = options.height || 2.2;
    var targetCenter = options.target || { x: 0, y: 1.5, z: 0 };
    var onProgress = options.onProgress || function () {};
    var onComplete = options.onComplete || function () {};

    var targetW = 1920, targetH = 1080;
    if (resolution === '4k' || resolution === '4K') {
      targetW = 3840; targetH = 2160;
    } else if (resolution === 'square') {
      targetW = 1080; targetH = 1080;
    }

    function captureSnapshot(scale) {
      if (!renderer || !scene || !camera) return null;
      scale = scale || 1.0;
      var origW = renderer.domElement.width;
      var origH = renderer.domElement.height;
      var origAspect = camera.aspect;

      renderer.setSize(targetW * scale, targetH * scale, false);
      camera.aspect = targetW / targetH;
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);
      var dataUrl = renderer.domElement.toDataURL('image/png');

      renderer.setSize(origW, origH, false);
      camera.aspect = origAspect;
      camera.updateProjectionMatrix();
      return dataUrl;
    }

    function startRecording() {
      if (!renderer || !scene || !camera) {
        onComplete({ blob: null, url: null, error: 'Renderer not available' });
        return;
      }

      var origPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
      var origAspect = camera.aspect;
      var canvas = renderer.domElement;

      var stream = canvas.captureStream ? canvas.captureStream(fps) : null;
      var recordedChunks = [];
      var mediaRecorder = null;

      if (stream && typeof MediaRecorder !== 'undefined') {
        var mimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm;codecs=vp8';
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
        try {
          mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });
          mediaRecorder.ondataavailable = function (e) {
            if (e.data && e.data.size > 0) recordedChunks.push(e.data);
          };
          mediaRecorder.start();
        } catch (eRecorder) {
          mediaRecorder = null;
        }
      }

      var currentFrame = 0;
      function renderNextFrame() {
        if (currentFrame >= frameCount) {
          if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.onstop = function () {
              var blob = new Blob(recordedChunks, { type: 'video/webm' });
              var videoUrl = (typeof URL !== 'undefined') ? URL.createObjectURL(blob) : null;
              camera.position.set(origPos.x, origPos.y, origPos.z);
              camera.aspect = origAspect;
              camera.updateProjectionMatrix();
              onComplete({ blob: blob, url: videoUrl, frameCount: frameCount, resolution: resolution });
            };
            mediaRecorder.stop();
          } else {
            camera.position.set(origPos.x, origPos.y, origPos.z);
            camera.aspect = origAspect;
            camera.updateProjectionMatrix();
            onComplete({ blob: null, url: null, frameCount: frameCount, resolution: resolution });
          }
          return;
        }

        var angle = (currentFrame / frameCount) * Math.PI * 2.0;
        camera.position.x = targetCenter.x + Math.sin(angle) * radius;
        camera.position.z = targetCenter.z + Math.cos(angle) * radius;
        camera.position.y = targetCenter.y + height + Math.sin(angle * 2.0) * 0.3;
        camera.lookAt(targetCenter.x, targetCenter.y, targetCenter.z);

        renderer.render(scene, camera);
        currentFrame++;
        onProgress((currentFrame / frameCount) * 100, currentFrame, frameCount);

        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(renderNextFrame);
        } else {
          setTimeout(renderNextFrame, 1000 / fps);
        }
      }

      renderNextFrame();
    }

    return {
      captureSnapshot: captureSnapshot,
      startRecording: startRecording,
      resolution: resolution,
      targetWidth: targetW,
      targetHeight: targetH
    };
  }

  // =========================================================================
  // 8. CINEMATIC VOLUMETRIC LIGHTING & POSTPROCESSING PIPELINE
  // =========================================================================

  var VolumetricGodraysShader = {
    uniforms: {
      tDiffuse: { value: null },
      lightPositionOnScreen: { value: (THREE && THREE.Vector2) ? new THREE.Vector2(0.5, 0.5) : { x: 0.5, y: 0.5 } },
      exposure: { value: 0.65 },
      decay: { value: 0.96 },
      density: { value: 0.92 },
      weight: { value: 0.38 },
      intensity: { value: 0.75 },
      lightColor: { value: (THREE && THREE.Color) ? new THREE.Color(0x00f0ff) : { r: 0.0, g: 0.94, b: 1.0 } }
    },
    vertexShader: [
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = uv;',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'varying vec2 vUv;',
      'uniform sampler2D tDiffuse;',
      'uniform vec2 lightPositionOnScreen;',
      'uniform float exposure;',
      'uniform float decay;',
      'uniform float density;',
      'uniform float weight;',
      'uniform float intensity;',
      'uniform vec3 lightColor;',
      '',
      'void main() {',
      '  vec2 deltaTextCoord = (vUv - lightPositionOnScreen);',
      '  deltaTextCoord *= (1.0 / 32.0) * density;',
      '  vec2 textCoo = vUv;',
      '  float illuminationDecay = 1.0;',
      '  vec4 origColor = texture2D(tDiffuse, vUv);',
      '  vec3 raysColor = vec3(0.0);',
      '',
      '  for (int i = 0; i < 32; i++) {',
      '    textCoo -= deltaTextCoord;',
      '    vec4 s = texture2D(tDiffuse, textCoo);',
      '    float luma = dot(s.rgb, vec3(0.299, 0.587, 0.114));',
      '    vec3 highlight = s.rgb * smoothstep(0.35, 0.85, luma);',
      '    raysColor += highlight * illuminationDecay * weight;',
      '    illuminationDecay *= decay;',
      '  }',
      '',
      '  raysColor *= exposure * lightColor;',
      '  vec3 finalColor = origColor.rgb + raysColor * intensity;',
      '  gl_FragColor = vec4(finalColor, origColor.a);',
      '}'
    ].join('\n')
  };

  var SSAOShader = {
    uniforms: {
      tDiffuse: { value: null },
      resolution: { value: (THREE && THREE.Vector2) ? new THREE.Vector2(512, 512) : { x: 512, y: 512 } },
      cameraNear: { value: 0.1 },
      cameraFar: { value: 1000.0 },
      radius: { value: 8.0 },
      intensity: { value: 0.85 },
      bias: { value: 0.04 },
      power: { value: 2.0 },
      aoColor: { value: (THREE && THREE.Color) ? new THREE.Color(0x05070d) : { r: 0.02, g: 0.03, b: 0.05 } },
      onlyAO: { value: false }
    },
    vertexShader: [
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = uv;',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'varying vec2 vUv;',
      'uniform sampler2D tDiffuse;',
      'uniform vec2 resolution;',
      'uniform float radius;',
      'uniform float intensity;',
      'uniform float bias;',
      'uniform float power;',
      'uniform vec3 aoColor;',
      'uniform bool onlyAO;',
      '',
      'float hash(vec2 p) {',
      '  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);',
      '}',
      '',
      'void main() {',
      '  vec4 centerTex = texture2D(tDiffuse, vUv);',
      '  float centerLum = dot(centerTex.rgb, vec3(0.299, 0.587, 0.114));',
      '  vec2 texel = 1.0 / resolution;',
      '  float occlusion = 0.0;',
      '  float totalWeight = 0.0;',
      '  float angleOffset = hash(vUv) * 6.2831853;',
      '',
      '  const int SAMPLES = 16;',
      '  for (int i = 0; i < SAMPLES; i++) {',
      '    float fi = float(i);',
      '    float r = (fi + 0.5) / float(SAMPLES);',
      '    float theta = fi * 2.3999632 + angleOffset;',
      '    vec2 offset = vec2(cos(theta), sin(theta)) * r * radius * texel;',
      '    vec4 sampleTex = texture2D(tDiffuse, vUv + offset);',
      '    float sampleLum = dot(sampleTex.rgb, vec3(0.299, 0.587, 0.114));',
      '    float diff = max(0.0, centerLum - sampleLum - bias);',
      '    float w = 1.0 - r;',
      '    occlusion += diff * w;',
      '    totalWeight += w;',
      '  }',
      '',
      '  occlusion = totalWeight > 0.0 ? (occlusion / totalWeight) * 4.0 : 0.0;',
      '  occlusion = clamp(pow(occlusion, power) * intensity, 0.0, 0.95);',
      '  float aoFactor = 1.0 - occlusion;',
      '',
      '  if (onlyAO) {',
      '    gl_FragColor = vec4(vec3(aoFactor), 1.0);',
      '  } else {',
      '    vec3 shaded = mix(centerTex.rgb * aoColor, centerTex.rgb, aoFactor);',
      '    gl_FragColor = vec4(shaded, centerTex.a);',
      '  }',
      '}'
    ].join('\n')
  };

  var ChromaticAberrationShader = {
    uniforms: {
      tDiffuse: { value: null },
      resolution: { value: (THREE && THREE.Vector2) ? new THREE.Vector2(512, 512) : { x: 512, y: 512 } },
      distortion: { value: 0.08 },
      aberrationOffset: { value: 0.006 },
      fringingPower: { value: 1.8 },
      vignetteStrength: { value: 0.35 },
      vignetteRadius: { value: 0.82 }
    },
    vertexShader: [
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = uv;',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'varying vec2 vUv;',
      'uniform sampler2D tDiffuse;',
      'uniform vec2 resolution;',
      'uniform float distortion;',
      'uniform float aberrationOffset;',
      'uniform float fringingPower;',
      'uniform float vignetteStrength;',
      'uniform float vignetteRadius;',
      '',
      'void main() {',
      '  vec2 coord = (vUv - 0.5) * 2.0;',
      '  float r2 = dot(coord, coord);',
      '  vec2 distortedUv = 0.5 + coord * (1.0 + distortion * r2 * 0.5) * 0.5;',
      '',
      '  vec2 radialDir = normalize(coord + vec2(0.0001));',
      '  float fringing = pow(r2, fringingPower * 0.5) * aberrationOffset;',
      '  vec2 redUv = distortedUv + radialDir * fringing;',
      '  vec2 greenUv = distortedUv;',
      '  vec2 blueUv = distortedUv - radialDir * fringing;',
      '',
      '  float r = texture2D(tDiffuse, clamp(redUv, 0.0, 1.0)).r;',
      '  float g = texture2D(tDiffuse, clamp(greenUv, 0.0, 1.0)).g;',
      '  float b = texture2D(tDiffuse, clamp(blueUv, 0.0, 1.0)).b;',
      '  float a = texture2D(tDiffuse, clamp(greenUv, 0.0, 1.0)).a;',
      '',
      '  float vigDist = length(coord);',
      '  float vig = smoothstep(vignetteRadius + 0.4, vignetteRadius - 0.2, vigDist);',
      '  vec3 finalRgb = mix(vec3(r, g, b) * (1.0 - vignetteStrength * 0.7), vec3(r, g, b), vig);',
      '',
      '  gl_FragColor = vec4(finalRgb, a);',
      '}'
    ].join('\n')
  };

  function cloneUniforms(uniformsObj) {
    var cloned = {};
    if (!uniformsObj) return cloned;
    for (var k in uniformsObj) {
      if (uniformsObj.hasOwnProperty(k)) {
        var val = uniformsObj[k].value;
        if (val && typeof val === 'object' && typeof val.clone === 'function') {
          cloned[k] = { value: val.clone() };
        } else if (val && typeof val === 'object') {
          cloned[k] = { value: Object.assign({}, val) };
        } else {
          cloned[k] = { value: val };
        }
      }
    }
    return cloned;
  }

  function createGodraysPass(threeInstance, options) {
    var T = threeInstance || THREE;
    options = options || {};
    var pass;
    if (T && T.ShaderPass) {
      pass = new T.ShaderPass(VolumetricGodraysShader);
    } else {
      pass = {
        name: 'GodraysPass',
        uniforms: cloneUniforms(VolumetricGodraysShader.uniforms),
        enabled: true
      };
    }
    if (options.intensity !== undefined && pass.uniforms.intensity) pass.uniforms.intensity.value = options.intensity;
    if (options.decay !== undefined && pass.uniforms.decay) pass.uniforms.decay.value = options.decay;
    if (options.exposure !== undefined && pass.uniforms.exposure) pass.uniforms.exposure.value = options.exposure;
    if (options.density !== undefined && pass.uniforms.density) pass.uniforms.density.value = options.density;
    if (options.weight !== undefined && pass.uniforms.weight) pass.uniforms.weight.value = options.weight;
    if (options.lightColor !== undefined && pass.uniforms.lightColor) {
      if (pass.uniforms.lightColor.value && pass.uniforms.lightColor.value.set) {
        pass.uniforms.lightColor.value.set(options.lightColor);
      } else {
        pass.uniforms.lightColor.value = options.lightColor;
      }
    }
    pass.enabled = options.enabled !== undefined ? options.enabled : true;
    return pass;
  }

  function createSSAOPass(threeInstance, options) {
    var T = threeInstance || THREE;
    options = options || {};
    var pass;
    if (T && T.ShaderPass) {
      pass = new T.ShaderPass(SSAOShader);
    } else {
      pass = {
        name: 'SSAOPass',
        uniforms: cloneUniforms(SSAOShader.uniforms),
        enabled: true
      };
    }
    if (options.radius !== undefined && pass.uniforms.radius) pass.uniforms.radius.value = options.radius;
    if (options.intensity !== undefined && pass.uniforms.intensity) pass.uniforms.intensity.value = options.intensity;
    if (options.bias !== undefined && pass.uniforms.bias) pass.uniforms.bias.value = options.bias;
    if (options.power !== undefined && pass.uniforms.power) pass.uniforms.power.value = options.power;
    if (options.onlyAO !== undefined && pass.uniforms.onlyAO) pass.uniforms.onlyAO.value = options.onlyAO;
    pass.enabled = options.enabled !== undefined ? options.enabled : true;
    return pass;
  }

  function createChromaticAberrationPass(threeInstance, options) {
    var T = threeInstance || THREE;
    options = options || {};
    var pass;
    if (T && T.ShaderPass) {
      pass = new T.ShaderPass(ChromaticAberrationShader);
    } else {
      pass = {
        name: 'ChromaticAberrationPass',
        uniforms: cloneUniforms(ChromaticAberrationShader.uniforms),
        enabled: true
      };
    }
    if (options.distortion !== undefined && pass.uniforms.distortion) pass.uniforms.distortion.value = options.distortion;
    if (options.aberrationOffset !== undefined && pass.uniforms.aberrationOffset) pass.uniforms.aberrationOffset.value = options.aberrationOffset;
    if (options.vignetteStrength !== undefined && pass.uniforms.vignetteStrength) pass.uniforms.vignetteStrength.value = options.vignetteStrength;
    if (options.vignetteRadius !== undefined && pass.uniforms.vignetteRadius) pass.uniforms.vignetteRadius.value = options.vignetteRadius;
    pass.enabled = options.enabled !== undefined ? options.enabled : true;
    return pass;
  }

  function createAdaptiveResolutionScaler(options) {
    options = options || {};
    var targetFPS = options.targetFPS || 60;
    var targetFrameTimeMs = 1000 / targetFPS;
    var minScale = options.minScale || 0.65;
    var maxScale = options.maxScale || 1.0;
    var currentScale = options.initialScale || 1.0;
    var smoothing = options.smoothing || 0.15;
    var emaFrameTime = targetFrameTimeMs;
    var frameCount = 0;
    var historyLength = 30;
    var frameTimes = [];
    var throttleCount = 0;
    var recoveryCount = 0;
    var isEnabled = options.enabled !== undefined ? options.enabled : true;

    var isLowPowerDevice = false;
    if (typeof navigator !== 'undefined') {
      var cores = navigator.hardwareConcurrency || 4;
      var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
      if (cores <= 4 || isMobile) {
        isLowPowerDevice = true;
      }
    }

    function update(deltaMs) {
      if (!isEnabled) {
        return {
          scaleChanged: false,
          resolutionScale: currentScale,
          fps: targetFPS,
          frameTimeMs: Math.round(targetFrameTimeMs * 10) / 10,
          scalePercent: Math.round(currentScale * 100),
          isThrottled: false,
          tier: isLowPowerDevice ? 'low-power' : 'high-performance'
        };
      }

      frameCount++;
      frameTimes.push(deltaMs);
      if (frameTimes.length > historyLength) frameTimes.shift();

      emaFrameTime = emaFrameTime * (1 - smoothing) + deltaMs * smoothing;
      var currentFPS = deltaMs > 0 ? (1000 / deltaMs) : targetFPS;
      var avgFPS = emaFrameTime > 0 ? (1000 / emaFrameTime) : targetFPS;

      var prevScale = currentScale;
      var scaleChanged = false;

      // Throttle if avg frame time > 18.5ms (FPS < 54) consistently
      if (emaFrameTime > 18.5) {
        throttleCount++;
        recoveryCount = 0;
        if (throttleCount >= 3 && currentScale > minScale) {
          currentScale = Math.max(minScale, Math.round((currentScale - 0.10) * 100) / 100);
          scaleChanged = (currentScale !== prevScale);
          throttleCount = 0;
        }
      }
      // Recover scale if avg frame time < 14.5ms (FPS > 69) consistently
      else if (emaFrameTime < 14.5 && currentScale < maxScale) {
        recoveryCount++;
        throttleCount = 0;
        if (recoveryCount >= 5) {
          currentScale = Math.min(maxScale, Math.round((currentScale + 0.05) * 100) / 100);
          scaleChanged = (currentScale !== prevScale);
          recoveryCount = 0;
        }
      } else {
        throttleCount = Math.max(0, throttleCount - 1);
        recoveryCount = Math.max(0, recoveryCount - 1);
      }

      return {
        scaleChanged: scaleChanged,
        resolutionScale: currentScale,
        fps: Math.round(avgFPS),
        frameTimeMs: Math.round(emaFrameTime * 10) / 10,
        scalePercent: Math.round(currentScale * 100),
        isThrottled: currentScale < maxScale,
        tier: isLowPowerDevice ? 'low-power' : 'high-performance'
      };
    }

    function setEnabled(val) {
      isEnabled = !!val;
      if (!isEnabled) currentScale = maxScale;
    }

    function setScale(scale) {
      currentScale = Math.max(minScale, Math.min(maxScale, scale));
    }

    function getMetrics() {
      var avgFPS = emaFrameTime > 0 ? (1000 / emaFrameTime) : targetFPS;
      return {
        fps: Math.round(avgFPS),
        frameTimeMs: Math.round(emaFrameTime * 10) / 10,
        resolutionScale: currentScale,
        scalePercent: Math.round(currentScale * 100),
        isThrottled: currentScale < maxScale,
        enabled: isEnabled,
        tier: isLowPowerDevice ? 'low-power' : 'high-performance'
      };
    }

    function reset() {
      currentScale = maxScale;
      emaFrameTime = targetFrameTimeMs;
      frameTimes = [];
      throttleCount = 0;
      recoveryCount = 0;
    }

    return {
      update: update,
      setEnabled: setEnabled,
      setScale: setScale,
      getMetrics: getMetrics,
      reset: reset,
      get targetFPS() { return targetFPS; },
      get minScale() { return minScale; },
      get maxScale() { return maxScale; },
      get currentScale() { return currentScale; },
      get isLowPowerDevice() { return isLowPowerDevice; }
    };
  }

  function createCinematicPipeline(threeInstance, renderer, scene, camera, options) {
    var T = threeInstance || THREE;
    options = options || {};
    var width = options.width || (renderer && renderer.domElement ? renderer.domElement.clientWidth : 512);
    var height = options.height || (renderer && renderer.domElement ? renderer.domElement.clientHeight : 512);

    var composer = null;
    var renderPass = null;
    var bloomPass = null;
    var godraysPass = null;
    var ssaoPass = null;
    var chromaticAberrationPass = null;
    var scaler = createAdaptiveResolutionScaler(options.scalerOptions);

    if (T && T.EffectComposer && renderer && scene && camera) {
      composer = new T.EffectComposer(renderer);
      renderPass = new T.RenderPass(scene, camera);
      composer.addPass(renderPass);

      if (T.UnrealBloomPass) {
        bloomPass = new T.UnrealBloomPass(
          new T.Vector2(width, height),
          options.bloomStrength !== undefined ? options.bloomStrength : 1.25,
          options.bloomRadius !== undefined ? options.bloomRadius : 0.4,
          options.bloomThreshold !== undefined ? options.bloomThreshold : 0.85
        );
        bloomPass.enabled = options.bloomEnabled !== undefined ? options.bloomEnabled : true;
        composer.addPass(bloomPass);
      }

      ssaoPass = createSSAOPass(T, {
        enabled: options.ssaoEnabled !== undefined ? options.ssaoEnabled : true,
        intensity: options.ssaoIntensity !== undefined ? options.ssaoIntensity : 0.85,
        radius: options.ssaoRadius !== undefined ? options.ssaoRadius : 8.0
      });
      if (ssaoPass.uniforms && ssaoPass.uniforms.resolution && ssaoPass.uniforms.resolution.value.set) {
        ssaoPass.uniforms.resolution.value.set(width, height);
      }
      composer.addPass(ssaoPass);

      godraysPass = createGodraysPass(T, {
        enabled: options.godraysEnabled !== undefined ? options.godraysEnabled : true,
        intensity: options.godraysIntensity !== undefined ? options.godraysIntensity : 0.75,
        decay: options.godraysDecay !== undefined ? options.godraysDecay : 0.96,
        exposure: options.godraysExposure !== undefined ? options.godraysExposure : 0.65
      });
      composer.addPass(godraysPass);

      chromaticAberrationPass = createChromaticAberrationPass(T, {
        enabled: options.chromaticEnabled !== undefined ? options.chromaticEnabled : true,
        distortion: options.distortion !== undefined ? options.distortion : 0.08,
        aberrationOffset: options.aberrationOffset !== undefined ? options.aberrationOffset : 0.006,
        vignetteStrength: options.vignetteStrength !== undefined ? options.vignetteStrength : 0.35
      });
      if (chromaticAberrationPass.uniforms && chromaticAberrationPass.uniforms.resolution && chromaticAberrationPass.uniforms.resolution.value.set) {
        chromaticAberrationPass.uniforms.resolution.value.set(width, height);
      }
      composer.addPass(chromaticAberrationPass);
    }

    function updateLightPosition(lightWorldPos) {
      if (!godraysPass || !godraysPass.uniforms || !camera) return;
      var pos = lightWorldPos || (scene ? scene.position : null);
      if (!pos) return;
      var v = (T && T.Vector3) ? new T.Vector3().copy(pos) : { x: pos.x, y: pos.y, z: pos.z };
      if (v.project) {
        v.project(camera);
        var screenX = (v.x + 1) * 0.5;
        var screenY = (v.y + 1) * 0.5;
        if (godraysPass.uniforms.lightPositionOnScreen.value.set) {
          godraysPass.uniforms.lightPositionOnScreen.value.set(screenX, screenY);
        }
      }
    }

    function setSize(w, h) {
      width = w;
      height = h;
      if (composer) composer.setSize(w, h);
      if (ssaoPass && ssaoPass.uniforms && ssaoPass.uniforms.resolution && ssaoPass.uniforms.resolution.value.set) {
        ssaoPass.uniforms.resolution.value.set(w, h);
      }
      if (chromaticAberrationPass && chromaticAberrationPass.uniforms && chromaticAberrationPass.uniforms.resolution && chromaticAberrationPass.uniforms.resolution.value.set) {
        chromaticAberrationPass.uniforms.resolution.value.set(w, h);
      }
    }

    function render(deltaMs, lightPos) {
      if (lightPos) updateLightPosition(lightPos);
      var scaleInfo = scaler.update(deltaMs || 16.67);
      if (scaleInfo.scaleChanged && renderer) {
        var currentW = width * scaleInfo.resolutionScale;
        var currentH = height * scaleInfo.resolutionScale;
        if (composer) composer.setSize(currentW, currentH);
      }
      if (composer) {
        composer.render();
      } else if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
      return scaleInfo;
    }

    return {
      composer: composer,
      renderPass: renderPass,
      bloomPass: bloomPass,
      godraysPass: godraysPass,
      ssaoPass: ssaoPass,
      chromaticAberrationPass: chromaticAberrationPass,
      scaler: scaler,
      setSize: setSize,
      updateLightPosition: updateLightPosition,
      render: render
    };
  }

  // =========================================================================
  // 9. INSTANCEDMESH & BATCHEDMESH PROCEDURAL BACKDROP CLUSTER ENGINE
  // =========================================================================

  /**
   * Creates single-draw-call THREE.InstancedMesh clusters for dense environmental backdrops
   */
  function createInstancedBackdropCluster(type, count, options, THREE_LIB) {
    var T = THREE_LIB || (typeof THREE !== 'undefined' ? THREE : null);
    if (!T || !T.InstancedMesh) {
      throw new Error('THREE.InstancedMesh is required for createInstancedBackdropCluster');
    }
    options = options || {};
    var dummy = new T.Object3D();

    if (type === 'cyberpunk_skyscrapers') {
      var numTowers = count || 64;
      var towerGeo = new T.BoxGeometry(1, 1, 1);
      var towerMat = options.material || new T.MeshStandardMaterial({
        color: 0x0a101d,
        roughness: 0.25,
        metalness: 0.85
      });
      var instancedMesh = new T.InstancedMesh(towerGeo, towerMat, numTowers);
      instancedMesh.name = 'InstancedCyberpunkSkyscrapers';
      instancedMesh.userData = { clusterType: 'cyberpunk_skyscrapers', instanceCount: numTowers };

      var neonPalette = [0x00f0ff, 0xec4899, 0xfbbf24, 0x34d399, 0xc084fc, 0xf43f5e, 0x38bdf8];

      for (var i = 0; i < numTowers; i++) {
        var angle = (i / numTowers) * Math.PI * 2 + ((i % 5) * 0.15);
        var dist = 18.0 + ((i * 17) % 32);
        var px = Math.cos(angle) * dist;
        var pz = Math.sin(angle) * dist;

        var sx = 2.5 + ((i * 7) % 4) * 0.8;
        var sz = 2.5 + ((i * 11) % 4) * 0.8;
        var sy = 12.0 + ((i * 13) % 28) + ((i % 3) * 6.0);
        var py = sy / 2.0;

        dummy.position.set(px, py, pz);
        dummy.rotation.set(0, ((i % 4) * (Math.PI / 4)), 0);
        dummy.scale.set(sx, sy, sz);
        dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, dummy.matrix);
        if (instancedMesh.setColorAt) {
          var col = new T.Color(neonPalette[i % neonPalette.length]);
          instancedMesh.setColorAt(i, col);
        }
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
      return instancedMesh;
    }

    else if (type === 'deep_space_asteroids') {
      var numAsteroids = count || 240;
      var aGeo = applyNoiseDisplacement(new T.DodecahedronGeometry(1.0, 1), { amplitude: 0.25 });
      var aMat = options.material || new T.MeshStandardMaterial({
        color: 0x1e1b2e,
        roughness: 0.85,
        metalness: 0.35,
        emissive: 0x0f0b1e,
        emissiveIntensity: 0.2
      });
      var instAsteroids = new T.InstancedMesh(aGeo, aMat, numAsteroids);
      instAsteroids.name = 'InstancedDeepSpaceAsteroidBelt';
      instAsteroids.userData = { clusterType: 'deep_space_asteroids', instanceCount: numAsteroids };

      for (var a = 0; a < numAsteroids; a++) {
        var theta = (a / numAsteroids) * Math.PI * 2 + (Math.sin(a * 1.7) * 0.2);
        var rad = 14.0 + ((a * 23) % 24) * 1.0;
        var ax = Math.cos(theta) * rad;
        var az = Math.sin(theta) * rad;
        var ay = (Math.sin(a * 2.3) * 6.5) + ((a % 7) - 3) * 0.8;

        var s = 0.4 + ((a * 13) % 15) * 0.12;
        dummy.position.set(ax, ay, az);
        dummy.rotation.set(a * 0.4, a * 0.7, a * 0.3);
        dummy.scale.set(s * (0.8 + ((a % 3) * 0.2)), s, s * (0.8 + ((a % 4) * 0.15)));
        dummy.updateMatrix();

        instAsteroids.setMatrixAt(a, dummy.matrix);
        if (instAsteroids.setColorAt) {
          var cTone = ((a * 31) % 3);
          var col = cTone === 0 ? new T.Color(0x38bdf8) : (cTone === 1 ? new T.Color(0xa855f7) : new T.Color(0x64748b));
          instAsteroids.setColorAt(a, col);
        }
      }

      instAsteroids.instanceMatrix.needsUpdate = true;
      if (instAsteroids.instanceColor) instAsteroids.instanceColor.needsUpdate = true;
      return instAsteroids;
    }

    else if (type === 'crystal_spires') {
      var numSpires = count || 64;
      var cGeo = applyNoiseDisplacement(new T.ConeGeometry(0.8, 5.0, 6), { amplitude: 0.15 });
      var cMat = options.material || new T.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.15,
        metalness: 0.9,
        emissive: 0x0284c7,
        emissiveIntensity: 1.8
      });
      var instCrystals = new T.InstancedMesh(cGeo, cMat, numSpires);
      instCrystals.name = 'InstancedCrystalSpires';
      instCrystals.userData = { clusterType: 'crystal_spires', instanceCount: numSpires };

      var crystalColors = [0x38bdf8, 0xc084fc, 0xf472b6, 0x67e8f9, 0xe879f9, 0xa7f3d0];

      for (var c = 0; c < numSpires; c++) {
        var cTheta = (c / numSpires) * Math.PI * 2 + ((c % 7) * 0.2);
        var cDist = 6.0 + ((c * 19) % 28);
        var cx = Math.cos(cTheta) * cDist;
        var cz = Math.sin(cTheta) * cDist;
        var cy = 1.0 + ((c * 7) % 5) * 0.5;

        var hScale = 0.6 + ((c * 11) % 10) * 0.2;
        var rScale = 0.5 + ((c * 5) % 6) * 0.15;

        dummy.position.set(cx, cy + (hScale * 2.5), cz);
        dummy.rotation.set((Math.sin(c) * 0.2), c * 0.5, (Math.cos(c) * 0.2));
        dummy.scale.set(rScale, hScale, rScale);
        dummy.updateMatrix();

        instCrystals.setMatrixAt(c, dummy.matrix);
        if (instCrystals.setColorAt) {
          instCrystals.setColorAt(c, new T.Color(crystalColors[c % crystalColors.length]));
        }
      }

      instCrystals.instanceMatrix.needsUpdate = true;
      if (instCrystals.instanceColor) instCrystals.instanceColor.needsUpdate = true;
      return instCrystals;
    }

    else if (type === 'matrix_data_nodes') {
      var numNodes = count || 64;
      var nodeGeo = new T.CylinderGeometry(0.4, 0.4, 8.0, 8);
      var nodeMat = options.material || new T.MeshStandardMaterial({
        color: 0x061a0d,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x34d399,
        emissiveIntensity: 1.5
      });
      var instNodes = new T.InstancedMesh(nodeGeo, nodeMat, numNodes);
      instNodes.name = 'InstancedMatrixDataNodes';
      instNodes.userData = { clusterType: 'matrix_data_nodes', instanceCount: numNodes };

      for (var n = 0; n < numNodes; n++) {
        var nTheta = (n / numNodes) * Math.PI * 2;
        var nDist = 10.0 + ((n * 13) % 22);
        var nx = Math.cos(nTheta) * nDist;
        var nz = Math.sin(nTheta) * nDist;
        var ny = 4.0 + (n % 4) * 1.5;

        dummy.position.set(nx, ny, nz);
        dummy.scale.set(1.0, 1.0 + (n % 3) * 0.5, 1.0);
        dummy.updateMatrix();
        instNodes.setMatrixAt(n, dummy.matrix);
      }
      instNodes.instanceMatrix.needsUpdate = true;
      return instNodes;
    }

    else {
      var numCols = count || 64;
      var colGeo = new T.CylinderGeometry(1.2, 1.4, 6.0, 6);
      var colMat = options.material || new T.MeshStandardMaterial({
        color: 0x1f0a0a,
        roughness: 0.6,
        metalness: 0.5,
        emissive: 0xff4400,
        emissiveIntensity: 0.5
      });
      var instCols = new T.InstancedMesh(colGeo, colMat, numCols);
      instCols.name = 'InstancedBasaltCrags';
      instCols.userData = { clusterType: 'volcanic_basalt_columns', instanceCount: numCols };

      for (var b = 0; b < numCols; b++) {
        var bTheta = (b / numCols) * Math.PI * 2;
        var bDist = 16.0 + ((b * 11) % 20);
        var bx = Math.cos(bTheta) * bDist;
        var bz = Math.sin(bTheta) * bDist;
        var by = 3.0 + ((b * 7) % 6) * 0.8;

        dummy.position.set(bx, by, bz);
        dummy.scale.set(1.0, 0.8 + (b % 4) * 0.4, 1.0);
        dummy.updateMatrix();
        instCols.setMatrixAt(b, dummy.matrix);
      }
      instCols.instanceMatrix.needsUpdate = true;
      return instCols;
    }
  }

  /**
   * Benchmarks draw call reduction and frame time optimization using InstancedMesh
   */
  function benchmarkInstancing(threeInstance) {
    var T = threeInstance || (typeof THREE !== 'undefined' ? THREE : null);
    if (!T) throw new Error('Three.js required for benchmarkInstancing');

    var skyscraperCount = 64;
    var asteroidCount = 240;
    var crystalCount = 64;
    var totalTraditionalObjects = skyscraperCount + asteroidCount + crystalCount;
    var totalInstancedDrawCalls = 3;

    var t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    var instancedSky = createInstancedBackdropCluster('cyberpunk_skyscrapers', skyscraperCount, {}, T);
    var instancedAst = createInstancedBackdropCluster('deep_space_asteroids', asteroidCount, {}, T);
    var instancedCrys = createInstancedBackdropCluster('crystal_spires', crystalCount, {}, T);
    var t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();

    var instancedScene = new T.Scene();
    instancedScene.add(instancedSky);
    instancedScene.add(instancedAst);
    instancedScene.add(instancedCrys);

    var travT0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    var instancedNodeCount = 0;
    instancedScene.traverse(function () { instancedNodeCount++; });
    var travT1 = typeof performance !== 'undefined' ? performance.now() : Date.now();

    var drawCallReductionPercent = ((1 - (totalInstancedDrawCalls / totalTraditionalObjects)) * 100);

    return {
      status: 'OPTIMIZED',
      traditionalDrawCalls: totalTraditionalObjects,
      instancedDrawCalls: totalInstancedDrawCalls,
      drawCallReductionPercent: parseFloat(drawCallReductionPercent.toFixed(2)),
      breakdown: {
        cyberpunkSkyscrapers: { count: skyscraperCount, drawCalls: 1 },
        deepSpaceAsteroids: { count: asteroidCount, drawCalls: 1 },
        crystalSpires: { count: crystalCount, drawCalls: 1 }
      },
      timing: {
        instancedClusterCreationMs: parseFloat((t1 - t0).toFixed(2)),
        instancedSceneTraversalMs: parseFloat((travT1 - travT0).toFixed(3))
      },
      telemetry: {
        totalInstances: totalTraditionalObjects,
        activeInstancedClusters: totalInstancedDrawCalls,
        sceneGraphNodes: instancedNodeCount
      }
    };
  }

  // =========================================================================
  // 10. PUBLIC API ENVELOPE
  // =========================================================================
  return {
    VERSION: VERSION,
    PHI: PHI,
    GOLDEN_ANGLE: GOLDEN_ANGLE,
    PBR_STYLES: PBR_STYLES,
    SCENE_PRESETS: SCENE_PRESETS,
    getScenePresets: getScenePresets,
    synthesizeScenePreset: synthesizeScenePreset,
    createInstancedBackdropCluster: createInstancedBackdropCluster,
    benchmarkInstancing: benchmarkInstancing,
    noise: simplexNoise3D,
    applyNoiseDisplacement: applyNoiseDisplacement,
    generatePBRBuffers: generatePBRBuffers,
    createProceduralPBRTextures: createProceduralPBRTextures,
    create4DTesseractGeometry: create4DTesseractGeometry,
    createFibonacciPhyllotaxisGeometry: createFibonacciPhyllotaxisGeometry,
    createSuperquadricGeometry: createSuperquadricGeometry,
    createCalabiYauGeometry: createCalabiYauGeometry,
    createInvoluteGearGeometry: createInvoluteGearGeometry,
    createCyberArmorPlateGeometry: createCyberArmorPlateGeometry,
    createKleinBottleGeometry: createKleinBottleGeometry,
    createMobiusStripGeometry: createMobiusStripGeometry,
    synthesizeFromPrompt: synthesizeFromPrompt,
    validateMeshManifold: validateMeshManifold,
    exportToOBJ: exportToOBJ,
    exportToSTL: exportToSTL,
    exportSceneGLTF: exportSceneGLTF,
    exportToUSDZ: exportToUSDZ,
    createProceduralShaderMaterial: createProceduralShaderMaterial,
    createTurnaroundCaptureEngine: createTurnaroundCaptureEngine,
    VolumetricGodraysShader: VolumetricGodraysShader,
    SSAOShader: SSAOShader,
    ChromaticAberrationShader: ChromaticAberrationShader,
    createAdaptiveResolutionScaler: createAdaptiveResolutionScaler,
    createGodraysPass: createGodraysPass,
    createSSAOPass: createSSAOPass,
    createChromaticAberrationPass: createChromaticAberrationPass,
    createCinematicPipeline: createCinematicPipeline
  };
});

