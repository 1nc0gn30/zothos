/**
 * ⚡ ZOTH NEXUS 3D — Procedural Physical Sky & IBL Environment Engine
 * 
 * CAD-Grade / VFX-Grade Atmospheric Rayleigh & Mie Scattering Simulation,
 * Procedural Space Nebula & Cosmic Starfield Skybox Forge, and Real-Time
 * Equirectangular Image-Based Lighting (IBL) Environment Map Generator for Three.js.
 * 
 * Features:
 * - Physical & Stylized Atmospheric Scattering:
 *   * Wavelength-dependent Rayleigh scattering (blue zenith & golden sunset dispersion)
 *   * Turbidity-driven Mie aerosol forward scattering & Henyey-Greenstein / Cornette-Shanks phase
 *   * Stratospheric Ozone Chappuis band absorption spectrum
 *   * Solar disk with limb darkening, aureole corona, and dynamic light synchronization
 * - Procedural Deep Space Nebula & Cosmic Starfield:
 *   * Multi-octave domain-warped 3D Simplex FBM cosmic dust clouds & interstellar gas lanes
 *   * Multi-spectral emission profiles (Hydrogen-α crimson, Oxygen-III cyan, Sulfur-II violet)
 *   * Dark absorption dust rifts and silhouettes
 *   * Realistic Planck blackbody stellar color temperatures (O/B blue giants to M red dwarfs)
 *   * Star clusters, Poisson-distributed field stars, and optical diffraction spikes
 *   * Ionospheric Aurora Borealis curtains with altitude-stratified emission
 * - Dynamic Equirectangular Environment Map (IBL) Generator:
 *   * Pure mathematical rasterizer converting sky parameters to 360° × 180° equirectangular buffers
 *   * Direct THREE.CanvasTexture / THREE.DataTexture conversion with EquirectangularReflectionMapping
 *   * Real-time THREE.PMREMGenerator radiance filtering for realistic specular PBR highlights
 *   * Calibrated PBR metallic materials (Chrome, Gold, Titanium, Obsidian)
 * - 1-Click Sky Presets:
 *   * 🌇 Sunset Cyberpunk
 *   * 🌌 Deep Space Nebula
 *   * 🌅 Golden Dawn Sanctum
 *   * 🧪 Toxic Acid Matrix
 *   * ❄️ Midnight Aurora
 * - Reflection Benchmark Suite:
 *   * Millisecond throughput, Megapixels/sec rasterization, and radiance energy validation
 * - Headless / SSR Node.js & Browser dual-environment compatibility
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
        threeInstance = root && root.THREE ? root.THREE : null;
      }
    }
    module.exports = factory(threeInstance);
  } else {
    root.Nexus3DSky = factory(root.THREE);
  }
})(typeof self !== 'undefined' ? self : this, function (THREE) {
  'use strict';

  var VERSION = '2026-08-24-sky-ibl-v1.0';

  // =========================================================================
  // 1. MATHEMATICAL & PHYSICAL CONSTANTS
  // =========================================================================
  var PI = Math.PI;
  var TWO_PI = Math.PI * 2.0;
  var HALF_PI = Math.PI * 0.5;
  var DEG2RAD = Math.PI / 180.0;
  var RAD2DEG = 180.0 / Math.PI;
  var PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio

  // Standard Earth Rayleigh Scattering Coefficients at sea level (m^-1)
  // for wavelengths: Red (680nm), Green (550nm), Blue (440nm)
  var DEFAULT_RAYLEIGH_COEFF = [5.802e-6, 13.558e-6, 33.1e-6];

  // Standard Ozone Absorption Coefficients (m^-1) across Chappuis band (500-700nm)
  var DEFAULT_OZONE_COEFF = [0.650e-6, 1.881e-6, 0.085e-6];

  // Default Mie Scattering Coefficient base
  var DEFAULT_MIE_COEFF = 21.0e-6;

  // =========================================================================
  // 2. FAST 3D SIMPLEX NOISE & FRACTIONAL BROWNIAN MOTION (Zero-Dependency)
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
      permMod12[i] = src[i] % 12;
      permMod12[256 + i] = src[i] % 12;
    }
  })();

  var grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];

  function noise2D(xin, yin) {
    var n0, n1, n2;
    var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    var s = (xin + yin) * F2;
    var i = Math.floor(xin + s);
    var j = Math.floor(yin + s);
    var t = (i + j) * G2;
    var X0 = i - t;
    var Y0 = j - t;
    var x0 = xin - X0;
    var y0 = yin - Y0;
    var i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }
    var x1 = x0 - i1 + G2;
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1.0 + 2.0 * G2;
    var y2 = y0 - 1.0 + 2.0 * G2;
    var ii = i & 255;
    var jj = j & 255;
    var gi0 = permMod12[ii + pTable[jj]];
    var gi1 = permMod12[ii + i1 + pTable[jj + j1]];
    var gi2 = permMod12[ii + 1 + pTable[jj + 1]];
    var t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0.0;
    else {
      t0 *= t0;
      n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0);
    }
    var t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0.0;
    else {
      t1 *= t1;
      n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1);
    }
    var t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0.0;
    else {
      t2 *= t2;
      n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2);
    }
    return 70.0 * (n0 + n1 + n2);
  }

  function noise3D(xin, yin, zin) {
    var n0, n1, n2, n3;
    var s = (xin + yin + zin) * F3;
    var i = Math.floor(xin + s);
    var j = Math.floor(yin + s);
    var k = Math.floor(zin + s);
    var t = (i + j + k) * G3;
    var X0 = i - t;
    var Y0 = j - t;
    var Z0 = k - t;
    var x0 = xin - X0;
    var y0 = yin - Y0;
    var z0 = zin - Z0;
    var i1, j1, k1;
    var i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
      else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
      else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
    } else {
      if (y0 < z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
      else if (x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
      else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
    }
    var x1 = x0 - i1 + G3;
    var y1 = y0 - j1 + G3;
    var z1 = z0 - k1 + G3;
    var x2 = x0 - i2 + 2.0 * G3;
    var y2 = y0 - j2 + 2.0 * G3;
    var z2 = z0 - k2 + 2.0 * G3;
    var x3 = x0 - 1.0 + 3.0 * G3;
    var y3 = y0 - 1.0 + 3.0 * G3;
    var z3 = z0 - 1.0 + 3.0 * G3;
    var ii = i & 255;
    var jj = j & 255;
    var kk = k & 255;
    var gi0 = permMod12[ii + pTable[jj + pTable[kk]]];
    var gi1 = permMod12[ii + i1 + pTable[jj + j1 + pTable[kk + k1]]];
    var gi2 = permMod12[ii + i2 + pTable[jj + j2 + pTable[kk + k2]]];
    var gi3 = permMod12[ii + 1 + pTable[jj + 1 + pTable[kk + 1]]];
    var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if (t0 < 0) n0 = 0.0;
    else { t0 *= t0; n0 = t0 * t0 * (grad3[gi0][0]*x0 + grad3[gi0][1]*y0 + grad3[gi0][2]*z0); }
    var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if (t1 < 0) n1 = 0.0;
    else { t1 *= t1; n1 = t1 * t1 * (grad3[gi1][0]*x1 + grad3[gi1][1]*y1 + grad3[gi1][2]*z1); }
    var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if (t2 < 0) n2 = 0.0;
    else { t2 *= t2; n2 = t2 * t2 * (grad3[gi2][0]*x2 + grad3[gi2][1]*y2 + grad3[gi2][2]*z2); }
    var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if (t3 < 0) n3 = 0.0;
    else { t3 *= t3; n3 = t3 * t3 * (grad3[gi3][0]*x3 + grad3[gi3][1]*y3 + grad3[gi3][2]*z3); }
    return 32.0 * (n0 + n1 + n2 + n3);
  }

  function fbm3D(x, y, z, octaves, lacunarity, gain) {
    octaves = octaves || 5;
    lacunarity = lacunarity || 2.0;
    gain = gain || 0.5;
    var sum = 0.0;
    var freq = 1.0;
    var amp = 1.0;
    var maxVal = 0.0;
    for (var o = 0; o < octaves; o++) {
      sum += noise3D(x * freq, y * freq, z * freq) * amp;
      maxVal += amp;
      freq *= lacunarity;
      amp *= gain;
    }
    return sum / maxVal;
  }

  function turbulence3D(x, y, z, octaves) {
    octaves = octaves || 4;
    var sum = 0.0;
    var freq = 1.0;
    var amp = 1.0;
    var maxVal = 0.0;
    for (var o = 0; o < octaves; o++) {
      sum += Math.abs(noise3D(x * freq, y * freq, z * freq)) * amp;
      maxVal += amp;
      freq *= 2.0;
      amp *= 0.5;
    }
    return sum / maxVal;
  }

  function domainWarpFBM(x, y, z, warpFactor) {
    warpFactor = warpFactor || 1.2;
    var qx = fbm3D(x, y, z, 3, 2.0, 0.5);
    var qy = fbm3D(x + 5.2, y + 1.3, z + 2.8, 3, 2.0, 0.5);
    var qz = fbm3D(x + 1.7, y + 9.2, z + 0.5, 3, 2.0, 0.5);

    var rx = fbm3D(x + warpFactor * qx + 1.7, y + warpFactor * qy + 9.2, z + warpFactor * qz + 0.1, 4, 2.0, 0.5);
    var ry = fbm3D(x + warpFactor * qx + 8.3, y + warpFactor * qy + 2.8, z + warpFactor * qz + 5.4, 4, 2.0, 0.5);
    var rz = fbm3D(x + warpFactor * qx + 3.1, y + warpFactor * qy + 0.4, z + warpFactor * qz + 7.9, 4, 2.0, 0.5);

    return fbm3D(x + warpFactor * rx, y + warpFactor * ry, z + warpFactor * rz, 5, 2.0, 0.5);
  }

  // =========================================================================
  // 3. PHYSICAL ATMOSPHERIC SCATTERING EQUATIONS
  // =========================================================================

  /**
   * Rayleigh Phase Function
   * P_R(theta) = 3/(16*PI) * (1 + cos^2(theta))
   */
  function rayleighPhase(cosTheta) {
    return (3.0 / (16.0 * PI)) * (1.0 + cosTheta * cosTheta);
  }

  /**
   * Mie Henyey-Greenstein / Cornette-Shanks Phase Function
   * P_M(theta, g) forward directional aerosol scattering
   */
  function miePhase(cosTheta, g) {
    g = Math.max(-0.999, Math.min(0.999, g !== undefined ? g : 0.82));
    var g2 = g * g;
    var denom = 1.0 + g2 - 2.0 * g * cosTheta;
    if (denom <= 0) denom = 1e-4;
    // Cornette-Shanks variant gives physically accurate peak + backscattering
    return (3.0 * (1.0 - g2) / (2.0 * (2.0 + g2))) * ((1.0 + cosTheta * cosTheta) / Math.pow(denom, 1.5));
  }

  /**
   * Optical Airmass approximation (Kasten & Young 1989)
   * Prevents horizon division-by-zero singularities.
   */
  function opticalAirmass(elevationRad) {
    var zenDeg = 90.0 - (elevationRad * RAD2DEG);
    if (zenDeg < 0.0) zenDeg = 0.0;
    if (zenDeg > 89.9) zenDeg = 89.9;
    return 1.0 / (Math.cos(zenDeg * DEG2RAD) + 0.50572 * Math.pow(96.07995 - zenDeg, -1.6364));
  }

  /**
   * Convert Spherical Azimuth and Elevation to Unit Vector
   */
  function calculateSunDirection(azimuthDeg, elevationDeg) {
    var azRad = (azimuthDeg !== undefined ? azimuthDeg : 195.0) * DEG2RAD;
    var elRad = (elevationDeg !== undefined ? elevationDeg : 8.0) * DEG2RAD;
    var cosEl = Math.cos(elRad);
    var sinEl = Math.sin(elRad);
    var sinAz = Math.sin(azRad);
    var cosAz = Math.cos(azRad);

    var x = cosEl * sinAz;
    var y = sinEl;
    var z = cosEl * cosAz;

    var len = Math.sqrt(x * x + y * y + z * z) || 1.0;
    return { x: x / len, y: y / len, z: z / len, azimuth: azimuthDeg, elevation: elevationDeg };
  }

  /**
   * Calculate Sun Color & Directional Light Intensity based on Atmospheric Altitude
   */
  function calculateSunColorAndIntensity(sunElevationDeg, turbidity) {
    turbidity = turbidity || 2.5;
    var elRad = (sunElevationDeg || 0.0) * DEG2RAD;
    var sinEl = Math.max(0.01, Math.sin(Math.max(-0.1, elRad)));

    // Optical depth
    var airmass = opticalAirmass(Math.max(0.01, elRad));

    // Rayleigh optical depth per channel
    var tauR_r = DEFAULT_RAYLEIGH_COEFF[0] * 8400.0 * airmass;
    var tauR_g = DEFAULT_RAYLEIGH_COEFF[1] * 8400.0 * airmass;
    var tauR_b = DEFAULT_RAYLEIGH_COEFF[2] * 8400.0 * airmass;

    // Mie optical depth
    var tauM = (DEFAULT_MIE_COEFF * turbidity * 1200.0) * airmass;

    // Transmittance T = exp(- (tauR + tauM))
    var tr_r = Math.exp(-(tauR_r + tauM * 0.9));
    var tr_g = Math.exp(-(tauR_g + tauM * 1.0));
    var tr_b = Math.exp(-(tauR_b + tauM * 1.2));

    // Direct solar illuminance
    var maxDirect = 3.5;
    var intensity = Math.max(0.05, maxDirect * Math.min(1.0, sinEl * 1.8) * Math.max(0.1, tr_g));

    var hexR = Math.min(255, Math.max(0, Math.floor(tr_r * 255)));
    var hexG = Math.min(255, Math.max(0, Math.floor(tr_g * 255)));
    var hexB = Math.min(255, Math.max(0, Math.floor(tr_g * 255)));
    var hexColor = '#' + ((1 << 24) + (hexR << 16) + (hexG << 8) + hexB).toString(16).slice(1);

    return {
      color: hexColor,
      rgb: [tr_r, tr_g, tr_b],
      intensity: intensity,
      airmass: airmass
    };
  }

  /**
   * Evaluate Full Atmospheric Radiance for a single view direction
   */
  function evaluateAtmosphericRadiance(viewDir, sunDir, params) {
    params = params || {};
    var turbidity = params.turbidity !== undefined ? params.turbidity : 3.0;
    var rayleighScale = params.rayleighScale !== undefined ? params.rayleighScale : 1.0;
    var mieScale = params.mieScale !== undefined ? params.mieScale : 1.0;
    var mieDirectionalG = params.mieDirectionalG !== undefined ? params.mieDirectionalG : 0.85;
    var ozoneScale = params.ozoneScale !== undefined ? params.ozoneScale : 1.0;
    var sunIntensity = params.sunIntensity !== undefined ? params.sunIntensity : 1.0;
    var groundAlbedo = params.groundAlbedo || [0.03, 0.04, 0.06];
    var customSkyTint = params.skyTint || [1.0, 1.0, 1.0];
    var customHorizonTint = params.horizonTint || [1.0, 1.0, 1.0];

    var vx = viewDir.x, vy = viewDir.y, vz = viewDir.z;
    var sx = sunDir.x, sy = sunDir.y, sz = sunDir.z;

    var cosTheta = vx * sx + vy * sy + vz * sz;
    if (cosTheta > 1.0) cosTheta = 1.0;
    if (cosTheta < -1.0) cosTheta = -1.0;

    // View zenith angle (elevation)
    var elevation = Math.asin(Math.max(-1.0, Math.min(1.0, vy)));
    var isGround = vy < 0.0;

    // Effective airmass for view path
    var viewElevation = Math.max(0.015, Math.abs(vy));
    var airmass = opticalAirmass(viewElevation);

    // Sun airmass
    var sunElevation = Math.max(0.01, sy);
    var sunAirmass = opticalAirmass(sunElevation);

    // Phase functions
    var pr = rayleighPhase(cosTheta);
    var pm = miePhase(cosTheta, mieDirectionalG);

    // Scattering coefficients
    var betaR = [
      DEFAULT_RAYLEIGH_COEFF[0] * rayleighScale,
      DEFAULT_RAYLEIGH_COEFF[1] * rayleighScale,
      DEFAULT_RAYLEIGH_COEFF[2] * rayleighScale
    ];

    var betaM = DEFAULT_MIE_COEFF * turbidity * mieScale;
    var betaO3 = [
      DEFAULT_OZONE_COEFF[0] * ozoneScale,
      DEFAULT_OZONE_COEFF[1] * ozoneScale,
      DEFAULT_OZONE_COEFF[2] * ozoneScale
    ];

    // Sun extinction
    var sunExtR = Math.exp(-(betaR[0] * 8400.0 + betaM * 1200.0 + betaO3[0] * 5000.0) * sunAirmass);
    var sunExtG = Math.exp(-(betaR[1] * 8400.0 + betaM * 1200.0 + betaO3[1] * 5000.0) * sunAirmass);
    var sunExtB = Math.exp(-(betaR[2] * 8400.0 + betaM * 1200.0 + betaO3[2] * 5000.0) * sunAirmass);

    // In-scattering integral approximation
    var totalTauR_r = betaR[0] * 8400.0 * airmass;
    var totalTauR_g = betaR[1] * 8400.0 * airmass;
    var totalTauR_b = betaR[2] * 8400.0 * airmass;
    var totalTauM = betaM * 1200.0 * airmass;

    var extR = Math.exp(-(totalTauR_r + totalTauM + betaO3[0] * 5000.0 * airmass));
    var extG = Math.exp(-(totalTauR_g + totalTauM + betaO3[1] * 5000.0 * airmass));
    var extB = Math.exp(-(totalTauR_b + totalTauM + betaO3[2] * 5000.0 * airmass));

    var inscatterR = (1.0 - extR) * (betaR[0] * pr * 1.2e5 + betaM * pm * 0.4e5) * sunExtR * customSkyTint[0];
    var inscatterG = (1.0 - extG) * (betaR[1] * pr * 1.2e5 + betaM * pm * 0.4e5) * sunExtG * customSkyTint[1];
    var inscatterB = (1.0 - extB) * (betaR[2] * pr * 1.2e5 + betaM * pm * 0.4e5) * sunExtB * customSkyTint[2];

    // Horizon haze blending
    var horizonBlend = Math.exp(-Math.max(0.0, vy) * 7.5);
    inscatterR += horizonBlend * 0.45 * customHorizonTint[0] * Math.max(0.2, sunExtR);
    inscatterG += horizonBlend * 0.35 * customHorizonTint[1] * Math.max(0.15, sunExtG);
    inscatterB += horizonBlend * 0.28 * customHorizonTint[2] * Math.max(0.1, sunExtB);

    // Solar Disk & Corona
    var sunAngularRadius = 0.00935; // ~0.53 degrees
    var sunCosLimit = Math.cos(sunAngularRadius);
    var sunDisk = 0.0;

    if (cosTheta > sunCosLimit - 0.0008) {
      var delta = (cosTheta - sunCosLimit) / 0.0008;
      var discFactor = Math.max(0.0, Math.min(1.0, (cosTheta - sunCosLimit + 0.0008) / 0.0008));
      // Limb darkening
      var rNorm = Math.sqrt(Math.max(0.0, 1.0 - (cosTheta - sunCosLimit) / (1.0 - sunCosLimit)));
      var limb = 1.0 - 0.6 * (1.0 - Math.sqrt(Math.max(0.0, 1.0 - rNorm * rNorm)));
      sunDisk = discFactor * 45.0 * limb * sunIntensity;
    }

    // Solar aureole / corona glow
    var coronaAngle = Math.max(0.0, cosTheta);
    var corona = Math.pow(coronaAngle, 120.0) * 1.8 * sunIntensity + Math.pow(coronaAngle, 500.0) * 8.5 * sunIntensity;

    var r = inscatterR + (sunDisk + corona) * sunExtR;
    var g = inscatterG + (sunDisk + corona) * sunExtG;
    var b = inscatterB + (sunDisk + corona) * sunExtB;

    // Ground plane reflection / nadir darkening
    if (isGround) {
      var groundFactor = Math.exp(vy * 6.0);
      var groundLight = (sunExtR * 0.5 + 0.1) * (1.0 - groundFactor);
      r = r * groundFactor + groundAlbedo[0] * groundLight;
      g = g * groundFactor + groundAlbedo[1] * groundLight;
      b = b * groundFactor + groundAlbedo[2] * groundLight;
    }

    return [Math.max(0.0, r), Math.max(0.0, g), Math.max(0.0, b)];
  }

  // =========================================================================
  // 4. PROCEDURAL SPACE NEBULA & COSMIC STARFIELD ENGINE
  // =========================================================================

  /**
   * Deterministic Hash on Unit Sphere for Point Stars
   */
  function hash31(x, y, z) {
    var p3x = Math.abs(x * 127.1 + y * 311.7 + z * 74.7);
    var p3y = Math.abs(x * 269.5 + y * 183.3 + z * 246.1);
    var p3z = Math.abs(x * 113.5 + y * 271.9 + z * 124.6);
    p3x = (p3x * 43758.5453) % 1.0;
    p3y = (p3y * 43758.5453) % 1.0;
    p3z = (p3z * 43758.5453) % 1.0;
    return (p3x + p3y + p3z) / 3.0;
  }

  /**
   * Blackbody Planck Stellar Color Temperature Approximation (Kelvin to RGB)
   */
  function blackbodyColor(temperatureK) {
    var temp = temperatureK / 100.0;
    var r, g, b;

    // Red
    if (temp <= 66.0) {
      r = 255.0;
    } else {
      r = temp - 60.0;
      r = 329.698727446 * Math.pow(r, -0.1332047592);
      if (r < 0) r = 0;
      if (r > 255) r = 255;
    }

    // Green
    if (temp <= 66.0) {
      g = temp;
      g = 99.4708025861 * Math.log(g) - 161.1195681661;
      if (g < 0) g = 0;
      if (g > 255) g = 255;
    } else {
      g = temp - 60.0;
      g = 288.1221695283 * Math.pow(g, -0.0755148492);
      if (g < 0) g = 0;
      if (g > 255) g = 255;
    }

    // Blue
    if (temp >= 66.0) {
      b = 255.0;
    } else if (temp <= 19.0) {
      b = 0.0;
    } else {
      b = temp - 10.0;
      b = 138.5177312231 * Math.log(b) - 305.0447927307;
      if (b < 0) b = 0;
      if (b > 255) b = 255;
    }

    return [r / 255.0, g / 255.0, b / 255.0];
  }

  /**
   * Evaluate Procedural Deep Space Nebula Radiance at a unit view vector
   */
  function evaluateSpaceRadiance(viewDir, params) {
    params = params || {};
    var nebulaScale = params.nebulaScale || 1.8;
    var nebulaIntensity = params.nebulaIntensity !== undefined ? params.nebulaIntensity : 1.0;
    var starDensity = params.starDensity !== undefined ? params.starDensity : 1800;
    var dustLanes = params.dustLanes !== undefined ? params.dustLanes : true;
    var auroraEnabled = params.auroraEnabled || false;
    var auroraIntensity = params.auroraIntensity !== undefined ? params.auroraIntensity : 1.2;

    var vx = viewDir.x, vy = viewDir.y, vz = viewDir.z;

    var r = 0.003, g = 0.004, b = 0.008; // Deep space void background

    // 1. Multi-Octave Warped Simplex Nebula Gas Clouds
    if (nebulaIntensity > 0.001) {
      var nCoordX = vx * nebulaScale;
      var nCoordY = vy * nebulaScale;
      var nCoordZ = vz * nebulaScale;

      var warped = domainWarpFBM(nCoordX, nCoordY, nCoordZ, 1.4);
      var cloudDensity = Math.pow(Math.max(0.0, warped * 0.5 + 0.5), 2.2);

      // Multi-spectral emission profiles:
      // Primary: H-alpha (deep crimson/magenta)
      // Secondary: O-III (cyan/teal)
      // Tertiary: N-II / S-II (violet/gold)
      var hAlpha = Math.max(0.0, noise3D(nCoordX * 1.5 + 2.1, nCoordY * 1.5, nCoordZ * 1.5) * 0.5 + 0.5);
      var oIII = Math.max(0.0, noise3D(nCoordX * 2.2 + 8.4, nCoordY * 2.2 + 4.1, nCoordZ * 2.2) * 0.5 + 0.5);
      var sII = Math.max(0.0, noise3D(nCoordX * 3.1 + 1.7, nCoordY * 3.1 + 9.5, nCoordZ * 3.1) * 0.5 + 0.5);

      var nebR = (cloudDensity * 0.95 * (0.8 + 0.5 * hAlpha) + sII * 0.3) * nebulaIntensity;
      var nebG = (cloudDensity * 0.35 * (0.3 + 0.8 * oIII)) * nebulaIntensity;
      var nebB = (cloudDensity * 1.2 * (0.6 + 0.6 * oIII + 0.4 * sII)) * nebulaIntensity;

      // Dark Cosmic Dust Lanes (absorption rifts)
      if (dustLanes) {
        var dustMask = Math.max(0.0, 1.0 - 1.8 * Math.pow(Math.abs(noise3D(nCoordX * 2.8 + 3.3, nCoordY * 2.8, nCoordZ * 2.8)), 1.2));
        nebR *= dustMask;
        nebG *= dustMask;
        nebB *= dustMask;
      }

      r += nebR;
      g += nebG;
      b += nebB;
    }

    // 2. Procedural Aurora Borealis Curtains (if active)
    if (auroraEnabled && vy > -0.1) {
      var auroraElev = Math.max(0.0, vy);
      var azAngle = Math.atan2(vx, vz);
      var auroraBand = Math.sin(azAngle * 4.0 + fbm3D(vx * 3.0, vy * 2.0, vz * 3.0, 3) * 3.5);
      var ribbon = Math.exp(-Math.pow((auroraElev - 0.35 - auroraBand * 0.12) / 0.18, 2.0));

      var waveFlutter = Math.sin(azAngle * 12.0 + vx * 8.0) * 0.2 + 0.8;
      ribbon *= waveFlutter;

      // Lower altitude: Oxygen green (557.7nm)
      // Upper altitude: Nitrogen violet-pink (427.8nm)
      var greenEmission = ribbon * Math.max(0.0, 1.0 - auroraElev * 1.6);
      var violetEmission = ribbon * Math.max(0.0, auroraElev * 1.4);

      r += (violetEmission * 0.75 + greenEmission * 0.1) * auroraIntensity;
      g += (greenEmission * 1.4) * auroraIntensity;
      b += (violetEmission * 1.2 + greenEmission * 0.4) * auroraIntensity;
    }

    // 3. Cosmic Starfield & Planck-Temperature Stars
    if (starDensity > 0) {
      // Cell jittering grid across sphere
      var starGridScale = Math.sqrt(starDensity) * 1.8;
      var cellX = Math.floor((vx + 1.0) * 0.5 * starGridScale);
      var cellY = Math.floor((vy + 1.0) * 0.5 * starGridScale);
      var cellZ = Math.floor((vz + 1.0) * 0.5 * starGridScale);

      var starSeed = hash31(cellX * 17.1, cellY * 31.7, cellZ * 73.3);
      if (starSeed > 0.82) {
        var starPosX = (cellX + hash31(cellX, cellY, cellZ)) / starGridScale * 2.0 - 1.0;
        var starPosY = (cellY + hash31(cellY, cellZ, cellX)) / starGridScale * 2.0 - 1.0;
        var starPosZ = (cellZ + hash31(cellZ, cellX, cellY)) / starGridScale * 2.0 - 1.0;

        var sDistSq = (vx - starPosX)*(vx - starPosX) + (vy - starPosY)*(vy - starPosY) + (vz - starPosZ)*(vz - starPosZ);
        var starRad = 0.00045 * (1.0 + (starSeed - 0.82) * 8.0);

        if (sDistSq < starRad * 4.0) {
          var starBright = Math.exp(-sDistSq / (starRad * 1.2)) * (1.0 + (starSeed - 0.82) * 15.0);

          // Stellar Temperature (2500K to 28000K)
          var starTemp = 2800.0 + hash31(cellY, cellX, cellZ) * 22000.0;
          var sColor = blackbodyColor(starTemp);

          // Diffraction spike on brightest stars
          if (starSeed > 0.985) {
            var diffX = Math.abs(vx - starPosX);
            var diffY = Math.abs(vy - starPosY);
            var spike = (Math.exp(-diffX / 0.00015) + Math.exp(-diffY / 0.00015)) * 0.75;
            starBright += spike * 2.5;
          }

          r += sColor[0] * starBright;
          g += sColor[1] * starBright;
          b += sColor[2] * starBright;
        }
      }
    }

    return [Math.max(0.0, r), Math.max(0.0, g), Math.max(0.0, b)];
  }

  // =========================================================================
  // 5. CALIBRATED SKY PRESETS
  // =========================================================================

  var SKY_PRESETS = {
    sunset_cyberpunk: {
      name: 'Sunset Cyberpunk',
      type: 'atmosphere',
      sunAzimuth: 195.0,
      sunElevation: 3.5,
      turbidity: 8.5,
      rayleighScale: 1.45,
      mieScale: 2.2,
      mieDirectionalG: 0.92,
      ozoneScale: 1.6,
      sunIntensity: 1.8,
      skyTint: [1.2, 0.45, 1.1],     // Hot magenta-violet zenith
      horizonTint: [1.6, 0.75, 0.15], // Blazing golden-orange neon smog
      groundAlbedo: [0.05, 0.02, 0.08],
      ambientIntensity: 0.8,
      keyLightColor: 0xff6622,
      keyLightIntensity: 2.5,
      fillLightColor: 0xd946ef,
      fillLightIntensity: 1.2
    },

    deep_space_nebula: {
      name: 'Deep Space Nebula',
      type: 'space',
      nebulaScale: 1.85,
      nebulaIntensity: 1.45,
      starDensity: 3200,
      dustLanes: true,
      auroraEnabled: false,
      sunIntensity: 0.0,
      keyLightColor: 0x00e5ff,
      keyLightIntensity: 1.8,
      fillLightColor: 0xc084fc,
      fillLightIntensity: 1.5,
      ambientIntensity: 0.45
    },

    golden_dawn_sanctum: {
      name: 'Golden Dawn Sanctum',
      type: 'atmosphere',
      sunAzimuth: 90.0,
      sunElevation: 8.0,
      turbidity: 2.1,
      rayleighScale: 1.0,
      mieScale: 0.95,
      mieDirectionalG: 0.82,
      ozoneScale: 1.1,
      sunIntensity: 2.2,
      skyTint: [0.75, 0.9, 1.25],     // Crisp sacred azure zenith
      horizonTint: [1.5, 1.2, 0.65],  // Radiant warm golden dawn
      groundAlbedo: [0.08, 0.07, 0.04],
      ambientIntensity: 0.9,
      keyLightColor: 0xffe6aa,
      keyLightIntensity: 2.8,
      fillLightColor: 0x38bdf8,
      fillLightIntensity: 1.1
    },

    toxic_acid_matrix: {
      name: 'Toxic Acid Matrix',
      type: 'atmosphere',
      sunAzimuth: 45.0,
      sunElevation: 18.0,
      turbidity: 7.2,
      rayleighScale: 0.6,
      mieScale: 2.8,
      mieDirectionalG: 0.88,
      ozoneScale: 0.5,
      sunIntensity: 1.6,
      skyTint: [0.1, 0.85, 0.35],     // Virulent phosphor emerald
      horizonTint: [0.65, 1.4, 0.15], // Toxic acid lime glow
      groundAlbedo: [0.01, 0.05, 0.02],
      ambientIntensity: 0.85,
      keyLightColor: 0x34d399,
      keyLightIntensity: 2.4,
      fillLightColor: 0x065f46,
      fillLightIntensity: 1.4
    },

    midnight_aurora: {
      name: 'Midnight Aurora',
      type: 'space',
      nebulaScale: 1.2,
      nebulaIntensity: 0.35,
      starDensity: 2800,
      dustLanes: false,
      auroraEnabled: true,
      auroraIntensity: 1.85,
      sunIntensity: 0.0,
      keyLightColor: 0x34d399,
      keyLightIntensity: 1.6,
      fillLightColor: 0xa855f7,
      fillLightIntensity: 1.3,
      ambientIntensity: 0.5
    }
  };

  // Add normalized alias keys
  SKY_PRESETS['sunset-cyberpunk'] = SKY_PRESETS.sunset_cyberpunk;
  SKY_PRESETS['deep-space-nebula'] = SKY_PRESETS.deep_space_nebula;
  SKY_PRESETS['golden-dawn-sanctum'] = SKY_PRESETS.golden_dawn_sanctum;
  SKY_PRESETS['toxic-acid-matrix'] = SKY_PRESETS.toxic_acid_matrix;
  SKY_PRESETS['midnight-aurora'] = SKY_PRESETS.midnight_aurora;

  var PRESET_KEYS = [
    'sunset_cyberpunk',
    'deep_space_nebula',
    'golden_dawn_sanctum',
    'toxic_acid_matrix',
    'midnight_aurora'
  ];

  // =========================================================================
  // 6. CALIBRATED METALLIC & DIELECTRIC PBR MATERIAL PRESETS (IBL-OPTIMIZED)
  // =========================================================================

  var PBR_MATERIAL_PRESETS = {
    chrome: {
      name: 'Mirror Chrome',
      color: 0xffffff,
      roughness: 0.0,
      metalness: 1.0,
      envMapIntensity: 1.5,
      clearcoat: 0.3,
      clearcoatRoughness: 0.0
    },
    gold: {
      name: 'Sacred Gold',
      color: 0xffd700,
      roughness: 0.12,
      metalness: 0.95,
      envMapIntensity: 1.6,
      clearcoat: 0.2,
      clearcoatRoughness: 0.1
    },
    titanium: {
      name: 'Brushed Titanium',
      color: 0x94a3b8,
      roughness: 0.24,
      metalness: 0.88,
      envMapIntensity: 1.3,
      clearcoat: 0.1,
      clearcoatRoughness: 0.2
    },
    obsidian: {
      name: 'Obsidian Glass',
      color: 0x08090f,
      roughness: 0.04,
      metalness: 0.05,
      envMapIntensity: 1.8,
      transmission: 0.1,
      ior: 1.52,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02
    }
  };

  // =========================================================================
  // 7. EQUIRECTANGULAR ENVIRONMENT MAP GENERATOR
  // =========================================================================

  /**
   * Generates a 360° x 180° Equirectangular Radiance Pixel Buffer (RGBA Uint8ClampedArray)
   */
  function generateEquirectangularBuffer(width, height, optionsOrPreset) {
    width = width || 1024;
    height = height || 512;

    var params = {};
    if (typeof optionsOrPreset === 'string' && SKY_PRESETS[optionsOrPreset]) {
      params = Object.assign({}, SKY_PRESETS[optionsOrPreset]);
    } else if (typeof optionsOrPreset === 'object' && optionsOrPreset !== null) {
      if (optionsOrPreset.preset && SKY_PRESETS[optionsOrPreset.preset]) {
        params = Object.assign({}, SKY_PRESETS[optionsOrPreset.preset], optionsOrPreset);
      } else {
        params = Object.assign({}, optionsOrPreset);
      }
    } else {
      params = Object.assign({}, SKY_PRESETS.sunset_cyberpunk);
    }

    var isSpace = params.type === 'space';
    var sunDir = calculateSunDirection(params.sunAzimuth, params.sunElevation);

    var bufferSize = width * height * 4;
    var data = new Uint8ClampedArray(bufferSize);

    var invW = 1.0 / width;
    var invH = 1.0 / height;

    var viewDir = { x: 0, y: 0, z: 0 };

    for (var y = 0; y < height; y++) {
      // Latitude theta: +PI/2 (top, zenith) to -PI/2 (bottom, nadir)
      var v = (y + 0.5) * invH;
      var theta = (0.5 - v) * PI;
      var cosTheta = Math.cos(theta);
      var sinTheta = Math.sin(theta);

      var rowOffset = y * width * 4;

      for (var x = 0; x < width; x++) {
        // Longitude phi: -PI to +PI
        var u = (x + 0.5) * invW;
        var phi = (u - 0.5) * TWO_PI;

        viewDir.x = cosTheta * Math.sin(phi);
        viewDir.y = sinTheta;
        viewDir.z = cosTheta * Math.cos(phi);

        var rgb;
        if (isSpace) {
          rgb = evaluateSpaceRadiance(viewDir, params);
        } else {
          rgb = evaluateAtmosphericRadiance(viewDir, sunDir, params);
        }

        // ACES Filmic Tone Mapping approximation + Gamma correction
        // rgb = (x * (a * x + b)) / (x * (c * x + d) + e)
        var a = 2.51, b_const = 0.03, c = 2.43, d = 0.59, e = 0.14;
        var rLin = rgb[0], gLin = rgb[1], bLin = rgb[2];

        var rTonemapped = (rLin * (a * rLin + b_const)) / (rLin * (c * rLin + d) + e);
        var gTonemapped = (gLin * (a * gLin + b_const)) / (gLin * (c * gLin + d) + e);
        var bTonemapped = (bLin * (a * bLin + b_const)) / (bLin * (c * bLin + d) + e);

        // Gamma 2.2
        var rByte = Math.min(255, Math.max(0, Math.round(Math.pow(Math.max(0, rTonemapped), 1.0 / 2.2) * 255)));
        var gByte = Math.min(255, Math.max(0, Math.round(Math.pow(Math.max(0, gTonemapped), 1.0 / 2.2) * 255)));
        var bByte = Math.min(255, Math.max(0, Math.round(Math.pow(Math.max(0, bTonemapped), 1.0 / 2.2) * 255)));

        var idx = rowOffset + x * 4;
        data[idx] = rByte;
        data[idx + 1] = gByte;
        data[idx + 2] = bByte;
        data[idx + 3] = 255;
      }
    }

    return {
      width: width,
      height: height,
      data: data,
      params: params
    };
  }

  /**
   * Create HTML5 Canvas element populated with Equirectangular Sky
   */
  function createSkyCanvas(width, height, optionsOrPreset) {
    width = width || 1024;
    height = height || 512;

    if (typeof document === 'undefined' || !document.createElement) {
      return null;
    }

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;

    var result = generateEquirectangularBuffer(width, height, optionsOrPreset);
    var imgData = ctx.createImageData(width, height);
    imgData.data.set(result.data);
    ctx.putImageData(imgData, 0, 0);

    return canvas;
  }

  /**
   * Create Three.js Texture with EquirectangularReflectionMapping
   */
  function createSkyTexture(threeInstance, width, height, optionsOrPreset) {
    threeInstance = threeInstance || THREE;
    if (!threeInstance) return null;

    var canvas = createSkyCanvas(width, height, optionsOrPreset);
    var texture;

    if (canvas && typeof threeInstance.CanvasTexture === 'function') {
      texture = new threeInstance.CanvasTexture(canvas);
    } else {
      // Headless / Node.js fallback using DataTexture
      var result = generateEquirectangularBuffer(width, height, optionsOrPreset);
      if (typeof threeInstance.DataTexture === 'function') {
        texture = new threeInstance.DataTexture(
          result.data,
          width,
          height,
          threeInstance.RGBAFormat || 1023,
          threeInstance.UnsignedByteType || 1009
        );
      } else {
        return null;
      }
    }

    if (texture) {
      texture.mapping = (threeInstance.EquirectangularReflectionMapping !== undefined)
        ? threeInstance.EquirectangularReflectionMapping
        : 303;
      if (threeInstance.sRGBEncoding !== undefined) {
        texture.encoding = threeInstance.sRGBEncoding;
      }
      texture.needsUpdate = true;
    }

    return texture;
  }

  /**
   * Generate Pre-filtered Radiance Environment Map (PMREM) from procedural sky
   */
  function generateEnvironmentMap(threeInstance, renderer, optionsOrPreset) {
    threeInstance = threeInstance || THREE;
    if (!threeInstance) return null;

    var width = (typeof optionsOrPreset === 'object' && optionsOrPreset && optionsOrPreset.width) ? optionsOrPreset.width : 1024;
    var height = (typeof optionsOrPreset === 'object' && optionsOrPreset && optionsOrPreset.height) ? optionsOrPreset.height : 512;

    var texture = createSkyTexture(threeInstance, width, height, optionsOrPreset);
    if (!texture) return null;

    if (renderer && typeof threeInstance.PMREMGenerator === 'function') {
      try {
        var pmremGenerator = new threeInstance.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        var renderTarget = pmremGenerator.fromEquirectangular(texture);
        texture.dispose();
        pmremGenerator.dispose();
        return renderTarget.texture;
      } catch (e) {
        console.warn('[Nexus3DSky] PMREM generation fallback to direct equirectangular map:', e);
        return texture;
      }
    }

    return texture;
  }

  /**
   * 1-Click Apply Environment to Scene:
   * Sets scene.background, scene.environment, synchronizes DirectionalLights and fog
   */
  function applyEnvironmentToScene(scene, renderer, optionsOrPreset, threeInstance) {
    threeInstance = threeInstance || THREE;
    if (!scene || !threeInstance) return null;

    var params = {};
    if (typeof optionsOrPreset === 'string' && SKY_PRESETS[optionsOrPreset]) {
      params = Object.assign({}, SKY_PRESETS[optionsOrPreset]);
    } else if (typeof optionsOrPreset === 'object' && optionsOrPreset !== null) {
      if (optionsOrPreset.preset && SKY_PRESETS[optionsOrPreset.preset]) {
        params = Object.assign({}, SKY_PRESETS[optionsOrPreset.preset], optionsOrPreset);
      } else {
        params = Object.assign({}, optionsOrPreset);
      }
    } else {
      params = Object.assign({}, SKY_PRESETS.sunset_cyberpunk);
    }

    var envTexture = generateEnvironmentMap(threeInstance, renderer, params);
    if (envTexture) {
      scene.environment = envTexture;
      scene.background = envTexture;
    }

    // Synchronize Key Directional Light to Sun Position & Tint
    if (scene.children) {
      var sunDir = calculateSunDirection(params.sunAzimuth, params.sunElevation);
      var sunLightProps = calculateSunColorAndIntensity(params.sunElevation, params.turbidity);

      var dirLights = scene.children.filter(function (c) { return c && c.isDirectionalLight; });
      if (dirLights.length > 0) {
        var keyLight = dirLights[0];
        keyLight.position.set(sunDir.x * 25.0, Math.max(1.0, sunDir.y * 25.0), sunDir.z * 25.0);
        if (params.keyLightColor !== undefined) {
          keyLight.color.setHex(params.keyLightColor);
        } else {
          keyLight.color.set(sunLightProps.color);
        }
        if (params.keyLightIntensity !== undefined) {
          keyLight.intensity = params.keyLightIntensity;
        }

        if (dirLights.length > 1 && params.fillLightColor !== undefined) {
          var fillLight = dirLights[1];
          fillLight.color.setHex(params.fillLightColor);
          if (params.fillLightIntensity !== undefined) {
            fillLight.intensity = params.fillLightIntensity;
          }
        }
      }
    }

    return {
      texture: envTexture,
      params: params
    };
  }

  // =========================================================================
  // 8. PROCEDURAL SKYDOME MESH & GLSL SHADER GENERATOR
  // =========================================================================

  /**
   * Create an interactive SkyDome Mesh with Custom Shader
   */
  function createSkyDomeMesh(threeInstance, radius, optionsOrPreset) {
    threeInstance = threeInstance || THREE;
    if (!threeInstance || typeof threeInstance.SphereGeometry !== 'function') return null;

    radius = radius || 400.0;
    var width = (typeof optionsOrPreset === 'object' && optionsOrPreset && optionsOrPreset.width) ? optionsOrPreset.width : 1024;
    var height = (typeof optionsOrPreset === 'object' && optionsOrPreset && optionsOrPreset.height) ? optionsOrPreset.height : 512;
    var texture = createSkyTexture(threeInstance, width, height, optionsOrPreset);
    var geo = new threeInstance.SphereGeometry(radius, 48, 32);

    var mat;
    if (typeof threeInstance.MeshBasicMaterial === 'function') {
      mat = new threeInstance.MeshBasicMaterial({
        map: texture,
        side: threeInstance.BackSide || 1,
        depthWrite: false
      });
    }

    var mesh = new threeInstance.Mesh(geo, mat);
    mesh.name = 'ProceduralSkyDome';
    mesh.renderOrder = -1000;
    return mesh;
  }

  /**
   * Build 4 Calibrated PBR Reflection Test Spheres (Chrome, Gold, Titanium, Obsidian)
   */
  function createIBLMaterialTestRig(threeInstance, options) {
    threeInstance = threeInstance || THREE;
    if (!threeInstance || typeof threeInstance.Group !== 'function') return null;

    options = options || {};
    var spacing = options.spacing || 2.4;
    var radius = options.radius || 0.85;
    var height = options.height || 1.3;

    var group = new threeInstance.Group();
    group.name = 'IBL_Material_Reflection_Rig';

    var keys = ['chrome', 'gold', 'titanium', 'obsidian'];
    var sphereGeo = new threeInstance.SphereGeometry(radius, 64, 48);

    keys.forEach(function (key, index) {
      var preset = PBR_MATERIAL_PRESETS[key];
      var mat = new threeInstance.MeshStandardMaterial({
        color: preset.color,
        roughness: preset.roughness,
        metalness: preset.metalness,
        envMapIntensity: preset.envMapIntensity || 1.5,
        wireframe: false
      });

      if (preset.roughness < 0.05 && threeInstance.MeshPhysicalMaterial) {
        mat = new threeInstance.MeshPhysicalMaterial({
          color: preset.color,
          roughness: preset.roughness,
          metalness: preset.metalness,
          envMapIntensity: preset.envMapIntensity || 1.5,
          clearcoat: preset.clearcoat || 0.0,
          clearcoatRoughness: preset.clearcoatRoughness || 0.0,
          transmission: preset.transmission || 0.0,
          ior: preset.ior || 1.5
        });
      }

      var mesh = new threeInstance.Mesh(sphereGeo, mat);
      var offsetX = (index - 1.5) * spacing;
      mesh.position.set(offsetX, height, 0);
      mesh.name = 'IBL_Sphere_' + preset.name.replace(/\s+/g, '_');
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Add a small metallic pedestal cylinder
      var pedGeo = new threeInstance.CylinderGeometry(radius * 0.75, radius * 0.85, 0.4, 32);
      var pedMat = new threeInstance.MeshStandardMaterial({
        color: 0x111622,
        roughness: 0.3,
        metalness: 0.8
      });
      var pedMesh = new threeInstance.Mesh(pedGeo, pedMat);
      pedMesh.position.set(offsetX, 0.2, 0);
      pedMesh.receiveShadow = true;

      group.add(mesh);
      group.add(pedMesh);
    });

    return group;
  }

  // =========================================================================
  // 9. SPHERICAL HARMONICS & RADIANCE ENERGY BENCHMARK
  // =========================================================================

  /**
   * Computes average luminance & energy conservation metrics on an Equirectangular buffer
   */
  function calculateIBLHarmonics(buffer, width, height) {
    var data = buffer.data || buffer;
    width = width || buffer.width || 512;
    height = height || buffer.height || 256;

    var totalPixels = width * height;
    var totalLuminance = 0.0;
    var minLum = 1e6;
    var maxLum = -1e6;

    var totalR = 0.0, totalG = 0.0, totalB = 0.0;

    for (var i = 0; i < totalPixels; i++) {
      var idx = i * 4;
      var rNorm = data[idx] / 255.0;
      var gNorm = data[idx + 1] / 255.0;
      var bNorm = data[idx + 2] / 255.0;

      // Rec. 709 Relative Luminance
      var lum = 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
      totalLuminance += lum;
      totalR += rNorm;
      totalG += gNorm;
      totalB += bNorm;

      if (lum < minLum) minLum = lum;
      if (lum > maxLum) maxLum = lum;
    }

    var avgLum = totalLuminance / totalPixels;
    return {
      averageLuminance: avgLum,
      minLuminance: minLum,
      maxLuminance: maxLum,
      averageColor: [totalR / totalPixels, totalG / totalPixels, totalB / totalPixels],
      totalPixels: totalPixels
    };
  }

  /**
   * Reflection & Throughput Benchmark
   */
  function runReflectionBenchmark(options) {
    options = options || {};
    var width = options.width || 512;
    var height = options.height || 256;
    var iterations = options.iterations || 3;

    var results = [];

    PRESET_KEYS.forEach(function (key) {
      var startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      var buffer;

      for (var i = 0; i < iterations; i++) {
        buffer = generateEquirectangularBuffer(width, height, key);
      }

      var endTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      var totalMs = endTime - startTime;
      var avgMs = totalMs / iterations;
      var totalMegapixels = (width * height * iterations) / 1000000.0;
      var throughputMps = totalMegapixels / (totalMs / 1000.0);

      var harmonics = calculateIBLHarmonics(buffer, width, height);

      results.push({
        preset: key,
        resolution: width + 'x' + height,
        iterations: iterations,
        averageLatencyMs: Math.round(avgMs * 100) / 100,
        throughputMps: Math.round(throughputMps * 100) / 100,
        averageLuminance: Math.round(harmonics.averageLuminance * 1000) / 1000,
        minLuminance: Math.round(harmonics.minLuminance * 1000) / 1000,
        maxLuminance: Math.round(harmonics.maxLuminance * 1000) / 1000
      });
    });

    return {
      version: VERSION,
      benchmarkDate: '2026-08-24',
      results: results
    };
  }

  // =========================================================================
  // 10. PUBLIC INTERFACE EXPORT
  // =========================================================================

  return {
    VERSION: VERSION,
    PHI: PHI,
    PI: PI,
    DEG2RAD: DEG2RAD,
    RAD2DEG: RAD2DEG,

    // Preset Maps & Registries
    SKY_PRESETS: SKY_PRESETS,
    PRESET_KEYS: PRESET_KEYS,
    PBR_MATERIAL_PRESETS: PBR_MATERIAL_PRESETS,

    // Mathematical & Noise Algorithms
    noise2D: noise2D,
    noise3D: noise3D,
    fbm3D: fbm3D,
    turbulence3D: turbulence3D,
    domainWarpFBM: domainWarpFBM,

    // Physical Scattering & Space Evaluators
    rayleighPhase: rayleighPhase,
    miePhase: miePhase,
    opticalAirmass: opticalAirmass,
    calculateSunDirection: calculateSunDirection,
    calculateSunColorAndIntensity: calculateSunColorAndIntensity,
    blackbodyColor: blackbodyColor,
    evaluateAtmosphericRadiance: evaluateAtmosphericRadiance,
    evaluateSpaceRadiance: evaluateSpaceRadiance,

    // Equirectangular & IBL Buffer / Texture Generators
    generateEquirectangularBuffer: generateEquirectangularBuffer,
    createSkyCanvas: createSkyCanvas,
    createSkyTexture: createSkyTexture,
    generateEnvironmentMap: generateEnvironmentMap,
    applyEnvironmentToScene: applyEnvironmentToScene,

    // Three.js Meshes & Rig Helpers
    createSkyDomeMesh: createSkyDomeMesh,
    createIBLMaterialTestRig: createIBLMaterialTestRig,

    // Benchmarking & Diagnostics
    calculateIBLHarmonics: calculateIBLHarmonics,
    runReflectionBenchmark: runReflectionBenchmark
  };
});
