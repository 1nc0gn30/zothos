/**
 * ⚡ ZOTH NEXUS 3D — Procedural 3D Typography & Rune Engine
 * 
 * Generates CAD-grade 3D beveled typography, cyberpunk & hermetic glyph monograms,
 * multi-material edge-glowing letterforms, and procedural mathematical vertex deformations
 * with ZERO heavy font files or GPU/VRAM prerequisites.
 * 
 * Capabilities:
 * 1. Procedural 2D Vector Glyph Outlines & Stroke Synthesis (A-Z, a-z, 0-9, Symbols)
 * 2. Multi-Style Typographic Themes:
 *    - 'cyber-block'     (Chiseled futuristic sci-fi chamfered blockforms)
 *    - 'alchemical-serif' (Sacred Roman geometric serif with golden ratio proportions)
 *    - 'neo-tokyo'       (Industrial mech stencil with precision cutout breaks)
 *    - 'runic-futurism'  (Scandinavian Nordic Elder Futhark angular geometry)
 *    - 'matrix-hex'      (60° isometric digital grid matrix glyphs)
 *    - 'minimal-sans'    (Balanced modern architectural sans-serif)
 * 3. Sacred Hermetic, Planetary, Elder Rune & Cyber Monogram Library:
 *    - Tria Prima: Sulfur (🜍), Mercury (☿), Salt (🜔)
 *    - Planetary: Sun (☉), Moon (☽), Mars (♂), Venus (♀), Jupiter (♃), Saturn (♄), Uranus (♅), Neptune (♆), Pluto (♇), Ouroboros, Philosopher's Stone
 *    - Elder Futhark: All 24 Runes (Fehu to Othala) + Aegishjalmur (Helm of Awe), Vegvisir (Runic Compass), Valknut
 *    - Binary Matrix & Cyberpunk: Binary Block, Matrix Hex, Quantum Gate, Glitch Sigil, Cyber Oni, Neural Core, HUD Reticle, Crypto Shield
 * 4. Procedural Chamfer & Bevel 3D Extrusion Engine (Multi-Group Topology)
 * 5. Multi-Material Assignment:
 *    - Front/Back Faces: Obsidian Glass, Brushed Titanium, Sacred Gold, Damascus Steel, Cyber Carbon, Pearl Chrome, Weathered Copper, Crystal Glass
 *    - Extruded Edges: Neon Cyan, Neon Amber, Neon Crimson, Neon Purple, Neon Emerald, Plasma White, Holographic Sheen
 * 6. Procedural 3D Text & Vertex Deformations:
 *    - 'curve-arc'       (Circular Ribbon / Cylindrical Arc Bend)
 *    - 'wave-ripple'     (Sinusoidal Dual-Axis Harmonic Wave)
 *    - 'cylinder-wrap'   (Full 360° or partial radial cylinder wrapping)
 *    - 'spiral-twist'    (Helical vortex twist along X or Y axis)
 *    - 'sphere-bulge'    (Convex lens / 3D spherical inflation)
 *    - 'wedge-taper'     (Perspective sci-fi crawl & angular wedge scale)
 * 7. Composite Procedural 3D Logo Monogram Synthesizer
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
    root.Nexus3DTypography = factory(root.THREE);
  }
})(typeof self !== 'undefined' ? self : this, function (THREE) {
  'use strict';

  var VERSION = '2026-08-24-typo-v3.2';
  var PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio Φ ≈ 1.6180339887

  // =========================================================================
  // 1. VECTOR SHAPE UTILITIES & CONTOUR GENERATOR
  // =========================================================================

  /**
   * Builds a THREE.Shape from an array of 2D polygon vertices and optional hole arrays.
   */
  function buildShapeFromPoints(outerPoints, holesPoints) {
    var shape = new THREE.Shape();
    if (!outerPoints || outerPoints.length < 3) return shape;

    shape.moveTo(outerPoints[0][0], outerPoints[0][1]);
    for (var i = 1; i < outerPoints.length; i++) {
      shape.lineTo(outerPoints[i][0], outerPoints[i][1]);
    }
    shape.closePath();

    if (holesPoints && holesPoints.length > 0) {
      for (var h = 0; h < holesPoints.length; h++) {
        var hPts = holesPoints[h];
        if (hPts && hPts.length >= 3) {
          var hole = new THREE.Path();
          hole.moveTo(hPts[0][0], hPts[0][1]);
          for (var j = 1; j < hPts.length; j++) {
            hole.lineTo(hPts[j][0], hPts[j][1]);
          }
          hole.closePath();
          shape.holes.push(hole);
        }
      }
    }
    return shape;
  }

  /**
   * Generates a thickened rectangular stroke shape between two points.
   */
  function createStrokeShape(x1, y1, x2, y2, strokeWidth) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var len = Math.hypot(dx, dy);
    if (len < 1e-6) return null;

    var halfW = (strokeWidth || 0.1) * 0.5;
    var nx = (-dy / len) * halfW;
    var ny = (dx / len) * halfW;

    var shape = new THREE.Shape();
    shape.moveTo(x1 - nx, y1 - ny);
    shape.lineTo(x1 + nx, y1 + ny);
    shape.lineTo(x2 + nx, y2 + ny);
    shape.lineTo(x2 - nx, y2 - ny);
    shape.closePath();
    return shape;
  }

  /**
   * Generates a continuous polyline shape array with mitered/beveled stroke joints.
   */
  function createPolylineShapes(points, strokeWidth, closed) {
    var shapes = [];
    if (!points || points.length < 2) return shapes;

    for (var i = 0; i < points.length - 1; i++) {
      var s = createStrokeShape(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], strokeWidth);
      if (s) shapes.push(s);
    }
    if (closed && points.length > 2) {
      var sc = createStrokeShape(points[points.length - 1][0], points[points.length - 1][1], points[0][0], points[0][1], strokeWidth);
      if (sc) shapes.push(sc);
    }
    return shapes;
  }

  /**
   * Generates a concentric ring shape (hollow circle) with an inner cutout hole.
   */
  function createRingShape(cx, cy, outerRadius, innerRadius, segments) {
    segments = segments || 32;
    var shape = new THREE.Shape();
    for (var i = 0; i <= segments; i++) {
      var th = (i / segments) * Math.PI * 2;
      var x = cx + Math.cos(th) * outerRadius;
      var y = cy + Math.sin(th) * outerRadius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    if (innerRadius > 0.001) {
      var hole = new THREE.Path();
      for (var j = 0; j <= segments; j++) {
        var thHole = (j / segments) * Math.PI * 2;
        var hx = cx + Math.cos(thHole) * innerRadius;
        var hy = cy + Math.sin(thHole) * innerRadius;
        if (j === 0) hole.moveTo(hx, hy);
        else hole.lineTo(hx, hy);
      }
      hole.closePath();
      shape.holes.push(hole);
    }
    return shape;
  }

  /**
   * Generates an arc ribbon shape between startAngle and endAngle.
   */
  function createArcRibbonShape(cx, cy, outerRadius, innerRadius, startAngle, endAngle, segments) {
    segments = segments || 24;
    var shape = new THREE.Shape();
    var span = endAngle - startAngle;

    // Outer arc
    for (var i = 0; i <= segments; i++) {
      var t = i / segments;
      var th = startAngle + t * span;
      var x = cx + Math.cos(th) * outerRadius;
      var y = cy + Math.sin(th) * outerRadius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }

    // Inner arc in reverse
    for (var j = segments; j >= 0; j--) {
      var tj = j / segments;
      var thj = startAngle + tj * span;
      var hx = cx + Math.cos(thj) * innerRadius;
      var hy = cy + Math.sin(thj) * innerRadius;
      shape.lineTo(hx, hy);
    }
    shape.closePath();
    return shape;
  }

  /**
   * Generates a regular N-sided polygon shape (e.g. Triangle, Hexagon, Octagon) with optional inner hole.
   */
  function createRegularPolygonShape(cx, cy, radius, sides, innerRadius, rotationAngle) {
    sides = Math.max(3, sides || 6);
    rotationAngle = rotationAngle || 0;
    var shape = new THREE.Shape();

    for (var i = 0; i <= sides; i++) {
      var th = rotationAngle + (i / sides) * Math.PI * 2;
      var x = cx + Math.cos(th) * radius;
      var y = cy + Math.sin(th) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    if (innerRadius && innerRadius > 0.001) {
      var hole = new THREE.Path();
      for (var j = 0; j <= sides; j++) {
        var thj = rotationAngle + (j / sides) * Math.PI * 2;
        var hx = cx + Math.cos(thj) * innerRadius;
        var hy = cy + Math.sin(thj) * innerRadius;
        if (j === 0) hole.moveTo(hx, hy);
        else hole.lineTo(hx, hy);
      }
      hole.closePath();
      shape.holes.push(hole);
    }
    return shape;
  }

  // =========================================================================
  // 2. PROCEDURAL 2D VECTOR FONT GLYPH DEFINITIONS
  // =========================================================================

  // Stroke Skeleton definition mapping for universal alphanumeric and punctuation
  var BASE_GLYPH_STROKES = {
    // Uppercase Letters
    'A': [ [[0.1, 0], [0.5, 1.0]], [[0.9, 0], [0.5, 1.0]], [[0.26, 0.38], [0.74, 0.38]] ],
    'B': [ [[0.15, 0], [0.15, 1.0]], [[0.15, 1.0], [0.7, 1.0], [0.85, 0.78], [0.7, 0.54], [0.15, 0.54]], [[0.15, 0.54], [0.75, 0.54], [0.88, 0.28], [0.75, 0], [0.15, 0]] ],
    'C': [ [[0.85, 0.82], [0.5, 1.0], [0.18, 0.8], [0.12, 0.5], [0.18, 0.2], [0.5, 0], [0.85, 0.18]] ],
    'D': [ [[0.15, 0], [0.15, 1.0]], [[0.15, 1.0], [0.65, 1.0], [0.88, 0.5], [0.65, 0], [0.15, 0]] ],
    'E': [ [[0.15, 0], [0.15, 1.0]], [[0.15, 1.0], [0.85, 1.0]], [[0.15, 0.52], [0.68, 0.52]], [[0.15, 0], [0.85, 0]] ],
    'F': [ [[0.15, 0], [0.15, 1.0]], [[0.15, 1.0], [0.85, 1.0]], [[0.15, 0.52], [0.68, 0.52]] ],
    'G': [ [[0.85, 0.82], [0.5, 1.0], [0.18, 0.8], [0.12, 0.5], [0.18, 0.2], [0.5, 0], [0.85, 0.18], [0.85, 0.5], [0.52, 0.5]] ],
    'H': [ [[0.15, 0], [0.15, 1.0]], [[0.85, 0], [0.85, 1.0]], [[0.15, 0.5], [0.85, 0.5]] ],
    'I': [ [[0.5, 0], [0.5, 1.0]], [[0.2, 1.0], [0.8, 1.0]], [[0.2, 0], [0.8, 0]] ],
    'J': [ [[0.8, 1.0], [0.8, 0.3], [0.65, 0.05], [0.35, 0.05], [0.15, 0.25], [0.15, 0.45]], [[0.55, 1.0], [0.95, 1.0]] ],
    'K': [ [[0.15, 0], [0.15, 1.0]], [[0.15, 0.45], [0.85, 1.0]], [[0.42, 0.64], [0.85, 0]] ],
    'L': [ [[0.15, 1.0], [0.15, 0], [0.85, 0]] ],
    'M': [ [[0.12, 0], [0.12, 1.0], [0.5, 0.4], [0.88, 1.0], [0.88, 0]] ],
    'N': [ [[0.15, 0], [0.15, 1.0], [0.85, 0], [0.85, 1.0]] ],
    'O': [ [[0.5, 1.0], [0.85, 0.8], [0.9, 0.5], [0.85, 0.2], [0.5, 0], [0.15, 0.2], [0.1, 0.5], [0.15, 0.8], [0.5, 1.0]] ],
    'P': [ [[0.15, 0], [0.15, 1.0]], [[0.15, 1.0], [0.75, 1.0], [0.88, 0.76], [0.75, 0.52], [0.15, 0.52]] ],
    'Q': [ [[0.5, 1.0], [0.85, 0.8], [0.9, 0.5], [0.85, 0.2], [0.5, 0], [0.15, 0.2], [0.1, 0.5], [0.15, 0.8], [0.5, 1.0]], [[0.6, 0.25], [0.95, -0.15]] ],
    'R': [ [[0.15, 0], [0.15, 1.0]], [[0.15, 1.0], [0.75, 1.0], [0.88, 0.76], [0.75, 0.52], [0.15, 0.52]], [[0.5, 0.52], [0.88, 0]] ],
    'S': [ [[0.85, 0.85], [0.55, 1.0], [0.2, 0.85], [0.18, 0.65], [0.82, 0.38], [0.82, 0.15], [0.45, 0], [0.15, 0.15]] ],
    'T': [ [[0.1, 1.0], [0.9, 1.0]], [[0.5, 1.0], [0.5, 0]] ],
    'U': [ [[0.15, 1.0], [0.15, 0.3], [0.35, 0], [0.65, 0], [0.85, 0.3], [0.85, 1.0]] ],
    'V': [ [[0.1, 1.0], [0.5, 0], [0.9, 1.0]] ],
    'W': [ [[0.1, 1.0], [0.3, 0], [0.5, 0.62], [0.7, 0], [0.9, 1.0]] ],
    'X': [ [[0.15, 0], [0.85, 1.0]], [[0.15, 1.0], [0.85, 0]] ],
    'Y': [ [[0.15, 1.0], [0.5, 0.5]], [[0.85, 1.0], [0.5, 0.5]], [[0.5, 0.5], [0.5, 0]] ],
    'Z': [ [[0.15, 1.0], [0.85, 1.0], [0.15, 0], [0.85, 0]] ],

    // Numerals
    '0': [ [[0.5, 1.0], [0.85, 0.8], [0.9, 0.5], [0.85, 0.2], [0.5, 0], [0.15, 0.2], [0.1, 0.5], [0.15, 0.8], [0.5, 1.0]], [[0.8, 0.8], [0.2, 0.2]] ],
    '1': [ [[0.28, 0.78], [0.5, 1.0], [0.5, 0]], [[0.2, 0], [0.8, 0]] ],
    '2': [ [[0.15, 0.8], [0.35, 1.0], [0.75, 1.0], [0.88, 0.78], [0.85, 0.55], [0.15, 0], [0.88, 0]] ],
    '3': [ [[0.15, 0.9], [0.85, 0.9], [0.48, 0.55], [0.75, 0.55], [0.88, 0.32], [0.75, 0.05], [0.2, 0.05]] ],
    '4': [ [[0.75, 0], [0.75, 1.0], [0.15, 0.32], [0.9, 0.32]] ],
    '5': [ [[0.85, 1.0], [0.15, 1.0], [0.15, 0.58], [0.65, 0.58], [0.88, 0.38], [0.85, 0.15], [0.5, 0], [0.15, 0.1]] ],
    '6': [ [[0.8, 0.9], [0.45, 1.0], [0.15, 0.7], [0.15, 0.3], [0.4, 0], [0.75, 0.05], [0.88, 0.3], [0.75, 0.55], [0.15, 0.55]] ],
    '7': [ [[0.15, 1.0], [0.88, 1.0], [0.4, 0]] ],
    '8': [ [[0.5, 0.5], [0.22, 0.75], [0.5, 1.0], [0.78, 0.75], [0.5, 0.5], [0.18, 0.25], [0.5, 0], [0.82, 0.25], [0.5, 0.5]] ],
    '9': [ [[0.85, 0.45], [0.25, 0.45], [0.12, 0.7], [0.25, 0.95], [0.55, 1.0], [0.85, 0.7], [0.85, 0.3], [0.55, 0], [0.2, 0.1]] ],

    // Punctuation & Special Symbols
    ' ': [],
    '!': [ [[0.5, 1.0], [0.5, 0.32]], [[0.5, 0.12], [0.5, 0.0]] ],
    '?': [ [[0.18, 0.8], [0.35, 1.0], [0.75, 1.0], [0.85, 0.8], [0.82, 0.58], [0.5, 0.42], [0.5, 0.28]], [[0.5, 0.12], [0.5, 0.0]] ],
    '.': [ [[0.5, 0.14], [0.5, 0.0]] ],
    ',': [ [[0.5, 0.2], [0.5, 0.06], [0.35, -0.15]] ],
    ':': [ [[0.5, 0.7], [0.5, 0.56]], [[0.5, 0.24], [0.5, 0.1]] ],
    ';': [ [[0.5, 0.7], [0.5, 0.56]], [[0.5, 0.2], [0.5, 0.06], [0.35, -0.15]] ],
    '-': [ [[0.18, 0.5], [0.82, 0.5]] ],
    '+': [ [[0.18, 0.5], [0.82, 0.5]], [[0.5, 0.18], [0.5, 0.82]] ],
    '=': [ [[0.18, 0.65], [0.82, 0.65]], [[0.18, 0.35], [0.82, 0.35]] ],
    '*': [ [[0.2, 0.5], [0.8, 0.5]], [[0.3, 0.2], [0.7, 0.8]], [[0.3, 0.8], [0.7, 0.2]] ],
    '/': [ [[0.15, 0], [0.85, 1.0]] ],
    '\\': [ [[0.15, 1.0], [0.85, 0]] ],
    '|': [ [[0.5, 0], [0.5, 1.0]] ],
    '_': [ [[0.05, -0.05], [0.95, -0.05]] ],
    '#': [ [[0.32, 0], [0.32, 1.0]], [[0.68, 0], [0.68, 1.0]], [[0.1, 0.68], [0.9, 0.68]], [[0.1, 0.32], [0.9, 0.32]] ],
    '@': [ [[0.5, 0.5], [0.68, 0.5], [0.68, 0.3], [0.5, 0.3], [0.35, 0.45], [0.5, 0.65], [0.78, 0.65], [0.88, 0.4], [0.8, 0.1], [0.5, 0.02], [0.15, 0.2], [0.1, 0.5], [0.2, 0.85], [0.5, 0.98], [0.82, 0.85]] ],
    '$': [ [[0.85, 0.85], [0.55, 1.0], [0.2, 0.85], [0.18, 0.65], [0.82, 0.38], [0.82, 0.15], [0.45, 0], [0.15, 0.15]], [[0.5, 1.12], [0.5, -0.12]] ],
    '%': [ [[0.15, 0], [0.85, 1.0]], [[0.3, 0.8], [0.32, 0.8]], [[0.68, 0.2], [0.7, 0.2]] ],
    '&': [ [[0.85, 0], [0.3, 0.6], [0.3, 0.85], [0.5, 1.0], [0.65, 0.85], [0.65, 0.65], [0.15, 0.2], [0.35, 0], [0.7, 0.3], [0.85, 0.1]] ],
    '^': [ [[0.2, 0.4], [0.5, 0.9], [0.8, 0.4]] ],
    '~': [ [[0.1, 0.45], [0.3, 0.65], [0.5, 0.5], [0.7, 0.35], [0.9, 0.55]] ],
    '<': [ [[0.85, 0.9], [0.15, 0.5], [0.85, 0.1]] ],
    '>': [ [[0.15, 0.9], [0.85, 0.5], [0.15, 0.1]] ],
    '(': [ [[0.7, 1.0], [0.3, 0.5], [0.7, 0]] ],
    ')': [ [[0.3, 1.0], [0.7, 0.5], [0.3, 0]] ],
    '[': [ [[0.75, 1.0], [0.25, 1.0], [0.25, 0], [0.75, 0]] ],
    ']': [ [[0.25, 1.0], [0.75, 1.0], [0.75, 0], [0.25, 0]] ],
    '{': [ [[0.75, 1.0], [0.45, 1.0], [0.45, 0.6], [0.2, 0.5], [0.45, 0.4], [0.45, 0], [0.75, 0]] ],
    '}': [ [[0.25, 1.0], [0.55, 1.0], [0.55, 0.6], [0.8, 0.5], [0.55, 0.4], [0.55, 0], [0.25, 0]] ],
    '\'': [ [[0.5, 1.0], [0.45, 0.72]] ],
    '"': [ [[0.35, 1.0], [0.32, 0.72]], [[0.65, 1.0], [0.62, 0.72]] ]
  };

  /**
   * Generates procedural shapes for a character in a specified font style.
   */
  function generateGlyphShapes(char, fontStyle, width, height, strokeWidth) {
    fontStyle = fontStyle || 'cyber-block';
    width = width || 1.0;
    height = height || 1.2;
    strokeWidth = strokeWidth || 0.12;

    var uppercaseChar = char.toUpperCase();
    var strokes = BASE_GLYPH_STROKES[uppercaseChar] || BASE_GLYPH_STROKES[char];

    // Fallback for missing characters
    if (!strokes) {
      if (char >= 'a' && char <= 'z') {
        // Lowercase render as small-caps with adjusted vertical scale
        return generateGlyphShapes(char.toUpperCase(), fontStyle, width * 0.85, height * 0.78, strokeWidth * 0.95);
      }
      strokes = BASE_GLYPH_STROKES['?'];
    }

    if (strokes.length === 0) {
      // Space or empty
      return [];
    }

    var shapes = [];

    // Apply font style modifications
    if (fontStyle === 'cyber-block') {
      // Chiseled heavy block style
      var sw = strokeWidth * 1.35;
      for (var i = 0; i < strokes.length; i++) {
        var pts = strokes[i];
        var scaledPts = pts.map(function (p) {
          return [p[0] * width, p[1] * height];
        });
        var strokeShapes = createPolylineShapes(scaledPts, sw, false);
        for (var k = 0; k < strokeShapes.length; k++) {
          shapes.push(strokeShapes[k]);
        }
      }
    } else if (fontStyle === 'alchemical-serif') {
      // Classical sacred serif with delicate terminals
      var swSerif = strokeWidth * 0.9;
      for (var s = 0; s < strokes.length; s++) {
        var ptsS = strokes[s];
        var scaledPtsS = ptsS.map(function (p) {
          return [p[0] * width, p[1] * height];
        });
        var sShapes = createPolylineShapes(scaledPtsS, swSerif, false);
        for (var ks = 0; ks < sShapes.length; ks++) {
          shapes.push(sShapes[ks]);
        }
        // Add subtle classical serif bracket caps at horizontal ends
        if (ptsS.length >= 2) {
          var first = scaledPtsS[0];
          var last = scaledPtsS[scaledPtsS.length - 1];
          if (first[1] < 0.05 || first[1] > height * 0.95) {
            var serif1 = createStrokeShape(first[0] - width * 0.08, first[1], first[0] + width * 0.08, first[1], swSerif * 0.6);
            if (serif1) shapes.push(serif1);
          }
          if (last[1] < 0.05 || last[1] > height * 0.95) {
            var serif2 = createStrokeShape(last[0] - width * 0.08, last[1], last[0] + width * 0.08, last[1], swSerif * 0.6);
            if (serif2) shapes.push(serif2);
          }
        }
      }
    } else if (fontStyle === 'neo-tokyo') {
      // Industrial stencil style with gaps
      var swTokyo = strokeWidth * 1.15;
      for (var nt = 0; nt < strokes.length; nt++) {
        var ptsNT = strokes[nt];
        var scaledPtsNT = ptsNT.map(function (p) {
          return [p[0] * width, p[1] * height];
        });
        // Stencil segment split
        for (var pIdx = 0; pIdx < scaledPtsNT.length - 1; pIdx++) {
          var p1 = scaledPtsNT[pIdx];
          var p2 = scaledPtsNT[pIdx + 1];
          var midX = (p1[0] + p2[0]) * 0.5;
          var midY = (p1[1] + p2[1]) * 0.5;
          // Shorten each segment to create stencil gap
          var gapFrac = 0.06;
          var p1Cut = [p1[0] + (midX - p1[0]) * (1 - gapFrac), p1[1] + (midY - p1[1]) * (1 - gapFrac)];
          var p2Cut = [p2[0] + (midX - p2[0]) * (1 - gapFrac), p2[1] + (midY - p2[1]) * (1 - gapFrac)];
          var sA = createStrokeShape(p1[0], p1[1], p1Cut[0], p1Cut[1], swTokyo);
          var sB = createStrokeShape(p2Cut[0], p2Cut[1], p2[0], p2[1], swTokyo);
          if (sA) shapes.push(sA);
          if (sB) shapes.push(sB);
        }
      }
    } else if (fontStyle === 'runic-futurism') {
      // Nordic angular runic styling
      var swRunic = strokeWidth * 1.1;
      for (var rf = 0; rf < strokes.length; rf++) {
        var ptsRF = strokes[rf];
        var scaledPtsRF = ptsRF.map(function (p) {
          var x = p[0] * width;
          var y = p[1] * height;
          return [x, y];
        });
        var rShapes = createPolylineShapes(scaledPtsRF, swRunic, false);
        for (var kr = 0; kr < rShapes.length; kr++) {
          shapes.push(rShapes[kr]);
        }
      }
    } else if (fontStyle === 'matrix-hex') {
      // 60-degree digital hexagonal style
      var swHex = strokeWidth * 1.05;
      for (var mh = 0; mh < strokes.length; mh++) {
        var ptsMH = strokes[mh];
        var scaledPtsMH = ptsMH.map(function (p) {
          return [p[0] * width, p[1] * height];
        });
        var hShapes = createPolylineShapes(scaledPtsMH, swHex, false);
        for (var kh = 0; kh < hShapes.length; kh++) {
          shapes.push(hShapes[kh]);
        }
      }
    } else {
      // Default / minimal-sans clean styling
      var swClean = strokeWidth * 1.0;
      for (var c = 0; c < strokes.length; c++) {
        var ptsC = strokes[c];
        var scaledPtsC = ptsC.map(function (p) {
          return [p[0] * width, p[1] * height];
        });
        var cShapes = createPolylineShapes(scaledPtsC, swClean, false);
        for (var kc = 0; kc < cShapes.length; kc++) {
          shapes.push(cShapes[kc]);
        }
      }
    }

    return shapes;
  }

  // =========================================================================
  // 3. HERMETIC ALCHEMICAL, PLANETARY & ELDER RUNES MONOGRAM CATALOG
  // =========================================================================

  var RUNE_DESCRIPTORS = {
    'fehu':     { unicode: 'ᚠ', name: 'Fehu', meaning: 'Wealth & Creative Power', strokes: [ [[0.2, 0], [0.2, 1.0]], [[0.2, 0.88], [0.85, 1.0]], [[0.2, 0.55], [0.85, 0.68]] ] },
    'uruz':     { unicode: 'ᚢ', name: 'Uruz', meaning: 'Strength & Vital Force', strokes: [ [[0.2, 0], [0.2, 1.0], [0.8, 0.75], [0.8, 0]] ] },
    'thurisaz': { unicode: 'ᚦ', name: 'Thurisaz', meaning: 'Thorn & Defense Gateway', strokes: [ [[0.2, 0], [0.2, 1.0]], [[0.2, 0.75], [0.85, 0.5], [0.2, 0.25]] ] },
    'ansuz':    { unicode: 'ᚨ', name: 'Ansuz', meaning: 'Divine Inspiration & Breath', strokes: [ [[0.2, 0], [0.2, 1.0]], [[0.2, 0.9], [0.85, 0.6]], [[0.2, 0.58], [0.85, 0.28]] ] },
    'raidho':   { unicode: 'ᚱ', name: 'Raidho', meaning: 'Journey & Celestial Wheel', strokes: [ [[0.2, 0], [0.2, 1.0]], [[0.2, 1.0], [0.78, 0.75], [0.2, 0.5]], [[0.2, 0.5], [0.85, 0]] ] },
    'kenaz':    { unicode: 'ᚲ', name: 'Kenaz', meaning: 'Torch & Inner Fire', strokes: [ [[0.85, 0.9], [0.18, 0.5], [0.85, 0.1]] ] },
    'gebo':     { unicode: 'ᚷ', name: 'Gebo', meaning: 'Sacred Gift & Harmony', strokes: [ [[0.18, 0.08], [0.82, 0.92]], [[0.18, 0.92], [0.82, 0.08]] ] },
    'wunjo':    { unicode: 'ᚹ', name: 'Wunjo', meaning: 'Joy & Golden Fellowship', strokes: [ [[0.2, 0], [0.2, 1.0]], [[0.2, 1.0], [0.82, 0.75], [0.2, 0.5]] ] },
    'hagalaz':  { unicode: 'ᚺ', name: 'Hagalaz', meaning: 'Hail & Cosmic Evolution', strokes: [ [[0.2, 0], [0.2, 1.0]], [[0.8, 0], [0.8, 1.0]], [[0.2, 0.65], [0.8, 0.35]] ] },
    'nauthiz':  { unicode: 'ᚾ', name: 'Nauthiz', meaning: 'Need & Self-Mastery', strokes: [ [[0.5, 0], [0.5, 1.0]], [[0.18, 0.72], [0.82, 0.28]] ] },
    'isa':      { unicode: 'ᛁ', name: 'Isa', meaning: 'Ice & Crystalline Stillness', strokes: [ [[0.5, 0], [0.5, 1.0]] ] },
    'jera':     { unicode: 'ᛃ', name: 'Jera', meaning: 'Harvest & Cosmic Cycle', strokes: [ [[0.5, 0.95], [0.85, 0.7], [0.5, 0.45]], [[0.5, 0.55], [0.15, 0.3], [0.5, 0.05]] ] },
    'eihwaz':   { unicode: 'ᛇ', name: 'Eihwaz', meaning: 'Yew Tree & Axis Mundi', strokes: [ [[0.5, 0.15], [0.5, 0.85]], [[0.5, 0.85], [0.85, 1.0]], [[0.5, 0.15], [0.15, 0]] ] },
    'perthro':  { unicode: 'ᛈ', name: 'Perthro', meaning: 'Matrix of Fate & Void', strokes: [ [[0.2, 0], [0.2, 1.0]], [[0.2, 1.0], [0.7, 0.75], [0.2, 0.5]], [[0.2, 0.5], [0.7, 0.25], [0.2, 0]] ] },
    'algiz':    { unicode: 'ᛉ', name: 'Algiz', meaning: 'Sacred Elk & Higher Protection', strokes: [ [[0.5, 0], [0.5, 1.0]], [[0.5, 0.5], [0.12, 0.9]], [[0.5, 0.5], [0.88, 0.9]] ] },
    'sowilo':   { unicode: 'ᛋ', name: 'Sowilo', meaning: 'Sun & Victorious Light', strokes: [ [[0.78, 1.0], [0.22, 0.62], [0.78, 0.38], [0.22, 0]] ] },
    'tiwaz':    { unicode: 'ᛏ', name: 'Tiwaz', meaning: 'Tyr & Celestial Spear', strokes: [ [[0.5, 0], [0.5, 1.0]], [[0.5, 1.0], [0.12, 0.7]], [[0.5, 1.0], [0.88, 0.7]] ] },
    'berkano':  { unicode: 'ᛒ', name: 'Berkano', meaning: 'Birch & Continuous Rebirth', strokes: [ [[0.2, 0], [0.2, 1.0]], [[0.2, 1.0], [0.78, 0.75], [0.2, 0.5]], [[0.2, 0.5], [0.78, 0.25], [0.2, 0]] ] },
    'ehwaz':    { unicode: 'ᛖ', name: 'Ehwaz', meaning: 'Sacred Steed & Synergy', strokes: [ [[0.2, 0], [0.2, 1.0]], [[0.8, 0], [0.8, 1.0]], [[0.2, 1.0], [0.5, 0.62], [0.8, 1.0]] ] },
    'mannaz':   { unicode: 'ᛗ', name: 'Mannaz', meaning: 'Mankind & Divine Mind', strokes: [ [[0.2, 0], [0.2, 1.0]], [[0.8, 0], [0.8, 1.0]], [[0.2, 1.0], [0.8, 0.45]], [[0.8, 1.0], [0.2, 0.45]] ] },
    'laguz':    { unicode: 'ᛚ', name: 'Laguz', meaning: 'Water & Fluid Intuition', strokes: [ [[0.2, 0], [0.2, 1.0], [0.82, 0.65]] ] },
    'ingwaz':   { unicode: 'ᛜ', name: 'Ingwaz', meaning: 'Cosmic Seed & Potential', strokes: [ [[0.5, 1.0], [0.88, 0.5], [0.5, 0], [0.12, 0.5], [0.5, 1.0]] ] },
    'dagaz':    { unicode: 'ᛞ', name: 'Dagaz', meaning: 'Dawn & Infinite Awakening', strokes: [ [[0.2, 0], [0.2, 1.0], [0.8, 0], [0.8, 1.0], [0.2, 0]] ] },
    'othala':   { unicode: 'ᛟ', name: 'Othala', meaning: 'Ancestral Domain & Heritage', strokes: [ [[0.5, 1.0], [0.82, 0.62], [0.5, 0.25], [0.18, 0.62], [0.5, 1.0]], [[0.5, 0.25], [0.85, 0]], [[0.5, 0.25], [0.15, 0]] ] }
  };

  /**
   * Generates procedural shapes for alchemical symbols and complex monograms.
   */
  function generateSpecialMonogramShapes(key, width, height, strokeWidth) {
    width = width || 2.0;
    height = height || 2.0;
    strokeWidth = strokeWidth || 0.12;

    var cx = width * 0.5;
    var cy = height * 0.5;
    var r = Math.min(width, height) * 0.42;
    var sw = strokeWidth;
    var shapes = [];

    switch (key.toLowerCase()) {
      // --- TRIA PRIMA (Three Hermetic Primes) ---
      case 'sulfur':
        // Upward Fire Triangle + Foundation Equal Cross
        var triH = r * 1.1;
        var triPts = [
          [cx, cy + triH * 0.5],
          [cx + r * 0.9, cy - triH * 0.4],
          [cx - r * 0.9, cy - triH * 0.4],
          [cx, cy + triH * 0.5]
        ];
        var sTri = createPolylineShapes(triPts, sw, true);
        shapes.push.apply(shapes, sTri);
        // Vertical Cross Stem below
        var sStem = createStrokeShape(cx, cy - triH * 0.4, cx, cy - r * 1.05, sw);
        var sCross = createStrokeShape(cx - r * 0.45, cy - r * 0.72, cx + r * 0.45, cy - r * 0.72, sw);
        if (sStem) shapes.push(sStem);
        if (sCross) shapes.push(sCross);
        break;

      case 'mercury':
        // Upper Horned Crescent + Central Solar Circle + Bottom Cross
        var crR = r * 0.42;
        var crArc = createArcRibbonShape(cx, cy + r * 0.55, crR, crR - sw, Math.PI * 0.15, Math.PI * 0.85, 16);
        var cCircle = createRingShape(cx, cy + r * 0.05, crR, crR - sw, 24);
        var mStem = createStrokeShape(cx, cy - r * 0.37, cx, cy - r * 1.0, sw);
        var mCross = createStrokeShape(cx - r * 0.38, cy - r * 0.68, cx + r * 0.38, cy - r * 0.68, sw);
        shapes.push(crArc, cCircle, mStem, mCross);
        break;

      case 'salt':
        // Circle bisected with horizontal diameter bar
        var saltRing = createRingShape(cx, cy, r * 0.85, r * 0.85 - sw, 32);
        var saltBar = createStrokeShape(cx - r * 0.85, cy, cx + r * 0.85, cy, sw);
        shapes.push(saltRing, saltBar);
        break;

      // --- PLANETARY & HERMETIC SYMBOLS ---
      case 'sun':
      case 'sol':
        var sunRing = createRingShape(cx, cy, r * 0.88, r * 0.88 - sw, 32);
        var sunHub = createRingShape(cx, cy, r * 0.25, 0.001, 16);
        shapes.push(sunRing, sunHub);
        // 8 Solar Ray Spikes
        for (var sIdx = 0; sIdx < 8; sIdx++) {
          var sTh = (sIdx / 8) * Math.PI * 2;
          var x1 = cx + Math.cos(sTh) * (r * 0.92);
          var y1 = cy + Math.sin(sTh) * (r * 0.92);
          var x2 = cx + Math.cos(sTh) * (r * 1.15);
          var y2 = cy + Math.sin(sTh) * (r * 1.15);
          var sRay = createStrokeShape(x1, y1, x2, y2, sw * 0.85);
          if (sRay) shapes.push(sRay);
        }
        break;

      case 'moon':
      case 'luna':
        var moonOuter = createRingShape(cx, cy, r * 0.85, 0.001, 32);
        // Crescent cutout hole using a shifted circle
        var moonCutout = new THREE.Path();
        var cutR = r * 0.82;
        var cutCx = cx + r * 0.45;
        var cutCy = cy;
        for (var mi = 0; mi <= 32; mi++) {
          var mTh = (mi / 32) * Math.PI * 2;
          var mx = cutCx + Math.cos(mTh) * cutR;
          var my = cutCy + Math.sin(mTh) * cutR;
          if (mi === 0) moonCutout.moveTo(mx, my);
          else moonCutout.lineTo(mx, my);
        }
        moonCutout.closePath();
        moonOuter.holes.push(moonCutout);
        shapes.push(moonOuter);
        break;

      case 'mars':
      case 'iron':
        var marsR = r * 0.58;
        var marsRing = createRingShape(cx - r * 0.22, cy - r * 0.22, marsR, marsR - sw, 24);
        var marsShaft = createStrokeShape(cx + r * 0.12, cy + r * 0.12, cx + r * 0.78, cy + r * 0.78, sw);
        var marsBarb1 = createStrokeShape(cx + r * 0.38, cy + r * 0.78, cx + r * 0.78, cy + r * 0.78, sw);
        var marsBarb2 = createStrokeShape(cx + r * 0.78, cy + r * 0.38, cx + r * 0.78, cy + r * 0.78, sw);
        shapes.push(marsRing, marsShaft, marsBarb1, marsBarb2);
        break;

      case 'venus':
      case 'copper':
        var venusR = r * 0.55;
        var venusRing = createRingShape(cx, cy + r * 0.32, venusR, venusR - sw, 24);
        var venusStem = createStrokeShape(cx, cy - r * 0.23, cx, cy - r * 0.95, sw);
        var venusCross = createStrokeShape(cx - r * 0.35, cy - r * 0.58, cx + r * 0.35, cy - r * 0.58, sw);
        shapes.push(venusRing, venusStem, venusCross);
        break;

      case 'jupiter':
      case 'tin':
        var jupCrossH = createStrokeShape(cx - r * 0.45, cy + r * 0.3, cx + r * 0.75, cy + r * 0.3, sw);
        var jupCrossV = createStrokeShape(cx + r * 0.25, cy + r * 0.75, cx + r * 0.25, cy - r * 0.85, sw);
        var jupArc = createArcRibbonShape(cx - r * 0.25, cy + r * 0.3, r * 0.5, r * 0.5 - sw, Math.PI * 0.5, Math.PI * 1.5, 16);
        shapes.push(jupCrossH, jupCrossV, jupArc);
        break;

      case 'saturn':
      case 'lead':
        var satCrossV = createStrokeShape(cx - r * 0.2, cy + r * 0.9, cx - r * 0.2, cy - r * 0.15, sw);
        var satCrossH = createStrokeShape(cx - r * 0.55, cy + r * 0.55, cx + r * 0.15, cy + r * 0.55, sw);
        var satSickle = createPolylineShapes([
          [cx - r * 0.2, cy - r * 0.15],
          [cx + r * 0.45, cy - r * 0.15],
          [cx + r * 0.65, cy - r * 0.55],
          [cx + r * 0.35, cy - r * 0.9],
          [cx - r * 0.1, cy - r * 0.75]
        ], sw, false);
        shapes.push(satCrossV, satCrossH);
        shapes.push.apply(shapes, satSickle);
        break;

      case 'neptune':
        // Trident on Cross
        var nepStem = createStrokeShape(cx, cy + r * 0.95, cx, cy - r * 0.95, sw);
        var nepCross = createStrokeShape(cx - r * 0.45, cy - r * 0.35, cx + r * 0.45, cy - r * 0.35, sw);
        var nepCup = createPolylineShapes([
          [cx - r * 0.65, cy + r * 0.85],
          [cx - r * 0.65, cy + r * 0.35],
          [cx + r * 0.65, cy + r * 0.35],
          [cx + r * 0.65, cy + r * 0.85]
        ], sw, false);
        shapes.push(nepStem, nepCross);
        shapes.push.apply(shapes, nepCup);
        break;

      case 'uranus':
        var urRing = createRingShape(cx, cy - r * 0.15, r * 0.45, r * 0.45 - sw, 20);
        var urStem = createStrokeShape(cx, cy + r * 0.3, cx, cy + r * 0.95, sw);
        var urH = createStrokeShape(cx - r * 0.5, cy + r * 0.65, cx + r * 0.5, cy + r * 0.65, sw);
        var urL1 = createStrokeShape(cx - r * 0.5, cy + r * 0.35, cx - r * 0.5, cy + r * 0.95, sw);
        var urL2 = createStrokeShape(cx + r * 0.5, cy + r * 0.35, cx + r * 0.5, cy + r * 0.95, sw);
        shapes.push(urRing, urStem, urH, urL1, urL2);
        break;

      case 'pluto':
        var plutoStem = createStrokeShape(cx - r * 0.25, cy + r * 0.85, cx - r * 0.25, cy - r * 0.85, sw);
        var plutoLoop = createPolylineShapes([
          [cx - r * 0.25, cy + r * 0.85],
          [cx + r * 0.45, cy + r * 0.85],
          [cx + r * 0.65, cy + r * 0.45],
          [cx + r * 0.45, cy + r * 0.05],
          [cx - r * 0.25, cy + r * 0.05]
        ], sw, false);
        var plutoBase = createStrokeShape(cx - r * 0.65, cy - r * 0.85, cx + r * 0.45, cy - r * 0.85, sw);
        shapes.push(plutoStem, plutoBase);
        shapes.push.apply(shapes, plutoLoop);
        break;

      case 'ouroboros':
        // Double concentric ouroboros serpent ring with segment teeth
        var oRing = createRingShape(cx, cy, r * 0.95, r * 0.65, 36);
        shapes.push(oRing);
        // Interlocking teeth notches
        for (var ot = 0; ot < 12; ot++) {
          var oTh = (ot / 12) * Math.PI * 2;
          var otX = cx + Math.cos(oTh) * (r * 0.8);
          var otY = cy + Math.sin(oTh) * (r * 0.8);
          var otShape = createStrokeShape(otX, otY, otX + Math.cos(oTh + 0.4) * (r * 0.15), otY + Math.sin(oTh + 0.4) * (r * 0.15), sw * 0.8);
          if (otShape) shapes.push(otShape);
        }
        break;

      case 'philosophers_stone':
        // Circle enclosing Triangle enclosing Square enclosing Inner Circle
        var psOuter = createRingShape(cx, cy, r * 1.0, r * 1.0 - sw, 36);
        var psTri = createRegularPolygonShape(cx, cy, r * 0.96, 3, r * 0.96 - sw, -Math.PI / 2);
        var psSquare = createRegularPolygonShape(cx, cy - r * 0.15, r * 0.48, 4, r * 0.48 - sw, Math.PI / 4);
        var psInner = createRingShape(cx, cy - r * 0.15, r * 0.25, 0.001, 24);
        shapes.push(psOuter, psTri, psSquare, psInner);
        break;

      // --- SACRED RUNIC STAVES ---
      case 'aegishjalmur':
        // Helm of Awe - 8-pointed radial protection ward
        var aegCore = createRingShape(cx, cy, r * 0.18, 0.001, 16);
        shapes.push(aegCore);
        for (var a = 0; a < 8; a++) {
          var aTh = (a / 8) * Math.PI * 2;
          var cosA = Math.cos(aTh), sinA = Math.sin(aTh);
          var ax1 = cx + cosA * (r * 0.18);
          var ay1 = cy + sinA * (r * 0.18);
          var ax2 = cx + cosA * (r * 1.0);
          var ay2 = cy + sinA * (r * 1.0);
          var arm = createStrokeShape(ax1, ay1, ax2, ay2, sw * 0.85);
          if (arm) shapes.push(arm);
          // 3 Crossbar Trident Tines along arm
          for (var t = 1; t <= 3; t++) {
            var frac = 0.35 + t * 0.18;
            var tx = cx + cosA * (r * frac);
            var ty = cy + sinA * (r * frac);
            var perpX = -sinA * (r * 0.12 * (t * 0.4 + 0.6));
            var perpY = cosA * (r * 0.12 * (t * 0.4 + 0.6));
            var tine = createStrokeShape(tx - perpX, ty - perpY, tx + perpX, ty + perpY, sw * 0.7);
            if (tine) shapes.push(tine);
          }
        }
        break;

      case 'vegvisir':
        // Icelandic Runic Compass - 8 unique mystic staves
        var vegCore = createRingShape(cx, cy, r * 0.12, 0.001, 16);
        var vegOuter = createRingShape(cx, cy, r * 1.0, r * 1.0 - sw * 0.6, 36);
        shapes.push(vegCore, vegOuter);
        for (var v = 0; v < 8; v++) {
          var vTh = (v / 8) * Math.PI * 2;
          var vCos = Math.cos(vTh), vSin = Math.sin(vTh);
          var vArm = createStrokeShape(cx + vCos * (r * 0.12), cy + vSin * (r * 0.12), cx + vCos * (r * 0.95), cy + vSin * (r * 0.95), sw * 0.75);
          if (vArm) shapes.push(vArm);
          // Stave specific cross hashmarks
          var vFrac = 0.55;
          var vx = cx + vCos * (r * vFrac);
          var vy = cy + vSin * (r * vFrac);
          var vPerpX = -vSin * (r * 0.1);
          var vPerpY = vCos * (r * 0.1);
          var vTine = createStrokeShape(vx - vPerpX, vy - vPerpY, vx + vPerpX, vy + vPerpY, sw * 0.65);
          if (vTine) shapes.push(vTine);
        }
        break;

      case 'valknut':
        // Three interlocking triangles
        var vTri1 = createRegularPolygonShape(cx, cy + r * 0.35, r * 0.65, 3, r * 0.65 - sw, -Math.PI / 2);
        var vTri2 = createRegularPolygonShape(cx - r * 0.3, cy - r * 0.25, r * 0.65, 3, r * 0.65 - sw, -Math.PI / 2);
        var vTri3 = createRegularPolygonShape(cx + r * 0.3, cy - r * 0.25, r * 0.65, 3, r * 0.65 - sw, -Math.PI / 2);
        shapes.push(vTri1, vTri2, vTri3);
        break;

      // --- CYBERPUNK & BINARY MATRIX MONOGRAMS ---
      case 'matrix_hex':
        // Beveled Cyber Hexagon with internal energy lines and core
        var hexOuter = createRegularPolygonShape(cx, cy, r * 1.0, 6, r * 1.0 - sw * 1.5, 0);
        var hexMid = createRegularPolygonShape(cx, cy, r * 0.65, 6, r * 0.65 - sw, Math.PI / 6);
        var hexCore = createRegularPolygonShape(cx, cy, r * 0.3, 6, 0.001, 0);
        shapes.push(hexOuter, hexMid, hexCore);
        for (var hi = 0; hi < 6; hi++) {
          var hAngle = (hi / 6) * Math.PI * 2;
          var hx1 = cx + Math.cos(hAngle) * (r * 0.32);
          var hy1 = cy + Math.sin(hAngle) * (r * 0.32);
          var hx2 = cx + Math.cos(hAngle) * (r * 0.95);
          var hy2 = cy + Math.sin(hAngle) * (r * 0.95);
          var spoke = createStrokeShape(hx1, hy1, hx2, hy2, sw * 0.7);
          if (spoke) shapes.push(spoke);
        }
        break;

      case 'binary_block':
        // 3D Data block silhouette with etched 0/1 binary glyph grid
        var bbBox = createRegularPolygonShape(cx, cy, r * 0.95, 4, r * 0.95 - sw * 1.4, Math.PI / 4);
        shapes.push(bbBox);
        // Circuit track lines inside
        var bTrk1 = createStrokeShape(cx - r * 0.5, cy + r * 0.3, cx + r * 0.5, cy + r * 0.3, sw * 0.7);
        var bTrk2 = createStrokeShape(cx - r * 0.5, cy - r * 0.3, cx + r * 0.5, cy - r * 0.3, sw * 0.7);
        var bDot1 = createRingShape(cx - r * 0.25, cy, r * 0.12, 0.001, 12);
        var bDot2 = createRingShape(cx + r * 0.25, cy, r * 0.12, 0.001, 12);
        shapes.push(bTrk1, bTrk2, bDot1, bDot2);
        break;

      case 'quantum_gate':
        // Concentric quantum orbital rings with 4 satellite nodes
        var qRing1 = createRingShape(cx, cy, r * 0.95, r * 0.95 - sw * 0.8, 32);
        var qRing2 = createRingShape(cx, cy, r * 0.62, r * 0.62 - sw * 0.8, 24);
        var qHub = createRingShape(cx, cy, r * 0.22, 0.001, 16);
        shapes.push(qRing1, qRing2, qHub);
        for (var q = 0; q < 4; q++) {
          var qTh = (q / 4) * Math.PI * 2 + Math.PI / 4;
          var qx = cx + Math.cos(qTh) * (r * 0.78);
          var qy = cy + Math.sin(qTh) * (r * 0.78);
          var qNode = createRingShape(qx, qy, r * 0.1, 0.001, 12);
          shapes.push(qNode);
        }
        break;

      case 'glitch_sigil':
        // Futuristic sliced Cyberpunk emblem
        var gShape1 = createPolylineShapes([
          [cx - r * 0.8, cy + r * 0.8],
          [cx + r * 0.3, cy + r * 0.8],
          [cx + r * 0.6, cy + r * 0.4],
          [cx - r * 0.5, cy + r * 0.4]
        ], sw * 1.3, true);
        var gShape2 = createPolylineShapes([
          [cx - r * 0.4, cy + r * 0.2],
          [cx + r * 0.8, cy + r * 0.2],
          [cx + r * 0.5, cy - r * 0.2],
          [cx - r * 0.7, cy - r * 0.2]
        ], sw * 1.3, true);
        var gShape3 = createPolylineShapes([
          [cx - r * 0.6, cy - r * 0.4],
          [cx + r * 0.5, cy - r * 0.4],
          [cx + r * 0.2, cy - r * 0.8],
          [cx - r * 0.8, cy - r * 0.8]
        ], sw * 1.3, true);
        shapes.push.apply(shapes, gShape1);
        shapes.push.apply(shapes, gShape2);
        shapes.push.apply(shapes, gShape3);
        break;

      case 'cyber_oni':
        // Angular low-poly cyber crest / horn mask
        var oniOutline = createPolylineShapes([
          [cx, cy - r * 0.9],
          [cx + r * 0.7, cy - r * 0.3],
          [cx + r * 0.85, cy + r * 0.85],
          [cx + r * 0.35, cy + r * 0.45],
          [cx, cy + r * 0.7],
          [cx - r * 0.35, cy + r * 0.45],
          [cx - r * 0.85, cy + r * 0.85],
          [cx - r * 0.7, cy - r * 0.3],
          [cx, cy - r * 0.9]
        ], sw * 1.1, true);
        // Slit eye apertures
        var eyeR = createStrokeShape(cx + r * 0.15, cy + r * 0.05, cx + r * 0.48, cy + r * 0.18, sw * 0.8);
        var eyeL = createStrokeShape(cx - r * 0.15, cy + r * 0.05, cx - r * 0.48, cy + r * 0.18, sw * 0.8);
        shapes.push.apply(shapes, oniOutline);
        if (eyeR) shapes.push(eyeR);
        if (eyeL) shapes.push(eyeL);
        break;

      case 'neural_core':
        // Multi-node neural cluster with interconnect dendrites
        var nCenter = createRingShape(cx, cy, r * 0.25, 0.001, 16);
        shapes.push(nCenter);
        for (var ni = 0; ni < 6; ni++) {
          var nAngle = (ni / 6) * Math.PI * 2;
          var nx = cx + Math.cos(nAngle) * (r * 0.8);
          var ny = cy + Math.sin(nAngle) * (r * 0.8);
          var nSatellite = createRingShape(nx, ny, r * 0.12, 0.001, 12);
          var nAxon = createStrokeShape(cx, cy, nx, ny, sw * 0.6);
          shapes.push(nSatellite);
          if (nAxon) shapes.push(nAxon);
        }
        break;

      case 'hud_reticle':
        // Tactical targeting crosshair
        var reticleRing = createRingShape(cx, cy, r * 0.88, r * 0.88 - sw * 0.7, 32);
        var reticleDot = createRingShape(cx, cy, r * 0.08, 0.001, 12);
        shapes.push(reticleRing, reticleDot);
        // Crosshair ticks
        var tN = createStrokeShape(cx, cy + r * 0.45, cx, cy + r * 0.95, sw * 0.7);
        var tS = createStrokeShape(cx, cy - r * 0.45, cx, cy - r * 0.95, sw * 0.7);
        var tE = createStrokeShape(cx + r * 0.45, cy, cx + r * 0.95, cy, sw * 0.7);
        var tW = createStrokeShape(cx - r * 0.45, cy, cx - r * 0.95, cy, sw * 0.7);
        shapes.push(tN, tS, tE, tW);
        break;

      case 'crypto_shield':
        // Faceted security shield crest
        var shieldOuter = createPolylineShapes([
          [cx, cy + r * 0.95],
          [cx + r * 0.8, cy + r * 0.6],
          [cx + r * 0.7, cy - r * 0.4],
          [cx, cy - r * 0.95],
          [cx - r * 0.7, cy - r * 0.4],
          [cx - r * 0.8, cy + r * 0.6],
          [cx, cy + r * 0.95]
        ], sw * 1.2, true);
        var keySlot = createStrokeShape(cx, cy + r * 0.25, cx, cy - r * 0.35, sw * 1.5);
        shapes.push.apply(shapes, shieldOuter);
        if (keySlot) shapes.push(keySlot);
        break;

      default:
        // Check if key is a rune name
        if (RUNE_DESCRIPTORS[key.toLowerCase()]) {
          var rune = RUNE_DESCRIPTORS[key.toLowerCase()];
          for (var rIdx = 0; rIdx < rune.strokes.length; rIdx++) {
            var rPts = rune.strokes[rIdx].map(function (p) {
              return [cx - r + p[0] * (r * 2), cy - r + p[1] * (r * 2)];
            });
            var rStk = createPolylineShapes(rPts, sw, false);
            shapes.push.apply(shapes, rStk);
          }
        } else {
          // Default to Mercury symbol
          return generateSpecialMonogramShapes('mercury', width, height, strokeWidth);
        }
        break;
    }

    return shapes;
  }

  // =========================================================================
  // 4. PROCEDURAL 3D EXTRUSION & MULTI-MATERIAL ASSIGNMENT
  // =========================================================================

  var MATERIAL_PRESETS = {
    // Front/Back Face Materials
    'obsidian': {
      color: 0x07080b,
      roughness: 0.08,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    },
    'brushed-titanium': {
      color: 0x828b9c,
      roughness: 0.32,
      metalness: 0.92
    },
    'sacred-gold': {
      color: 0xd4af37,
      roughness: 0.18,
      metalness: 0.98
    },
    'damascus-steel': {
      color: 0x2c3542,
      roughness: 0.28,
      metalness: 0.90
    },
    'cyber-carbon': {
      color: 0x14161b,
      roughness: 0.42,
      metalness: 0.85
    },
    'pearl-chrome': {
      color: 0xe2e8f0,
      roughness: 0.04,
      metalness: 1.0
    },
    'weathered-copper': {
      color: 0xb87333,
      roughness: 0.45,
      metalness: 0.88
    },
    'crystal-glass': {
      color: 0xdbeafe,
      roughness: 0.1,
      transmission: 0.88,
      ior: 1.52,
      transparent: true,
      opacity: 0.92
    },

    // Edge/Contour Emissive Materials
    'neon-cyan': {
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.8
    },
    'neon-amber': {
      color: 0xfbbf24,
      emissive: 0xfbbf24,
      emissiveIntensity: 1.6,
      roughness: 0.25,
      metalness: 0.85
    },
    'neon-crimson': {
      color: 0xf43f5e,
      emissive: 0xf43f5e,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.8
    },
    'neon-purple': {
      color: 0xc084fc,
      emissive: 0xc084fc,
      emissiveIntensity: 1.7,
      roughness: 0.2,
      metalness: 0.8
    },
    'neon-emerald': {
      color: 0x34d399,
      emissive: 0x34d399,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.8
    },
    'plasma-white': {
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 2.0,
      roughness: 0.1,
      metalness: 0.9
    },
    'holographic': {
      color: 0x00e5ff,
      emissive: 0x8b5cf6,
      emissiveIntensity: 1.5,
      roughness: 0.15,
      metalness: 0.9
    }
  };

  /**
   * Creates a pair of materials [frontFaceMaterial, edgeMaterial] for extruded typography.
   */
  function createTypographyMaterials(options) {
    options = options || {};
    var frontKey = options.frontMaterial || 'obsidian';
    var edgeKey = options.edgeMaterial || 'neon-cyan';

    var frontDef = MATERIAL_PRESETS[frontKey] || MATERIAL_PRESETS['obsidian'];
    var edgeDef = MATERIAL_PRESETS[edgeKey] || MATERIAL_PRESETS['neon-cyan'];

    var frontMat = new THREE.MeshStandardMaterial({
      color: frontDef.color !== undefined ? frontDef.color : 0x0a0c10,
      roughness: frontDef.roughness !== undefined ? frontDef.roughness : 0.1,
      metalness: frontDef.metalness !== undefined ? frontDef.metalness : 0.9,
      transparent: !!frontDef.transparent,
      opacity: frontDef.opacity !== undefined ? frontDef.opacity : 1.0
    });

    var edgeMat = new THREE.MeshStandardMaterial({
      color: edgeDef.color !== undefined ? edgeDef.color : 0x00f0ff,
      emissive: edgeDef.emissive !== undefined ? edgeDef.emissive : 0x00f0ff,
      emissiveIntensity: edgeDef.emissiveIntensity !== undefined ? edgeDef.emissiveIntensity : 1.8,
      roughness: edgeDef.roughness !== undefined ? edgeDef.roughness : 0.2,
      metalness: edgeDef.metalness !== undefined ? edgeDef.metalness : 0.8
    });

    return [frontMat, edgeMat];
  }

  // =========================================================================
  // 5. PROCEDURAL 3D TEXT & VERTEX DEFORMATIONS
  // =========================================================================

  /**
   * Deforms a THREE.BufferGeometry using mathematical procedural operators.
   */
  function applyDeformation(geometry, deformationType, options) {
    if (!geometry || !geometry.attributes || !geometry.attributes.position) return geometry;
    if (!deformationType || deformationType === 'none') return geometry;

    options = options || {};
    var pos = geometry.attributes.position;
    geometry.computeBoundingBox();
    var bbox = geometry.boundingBox;
    var minX = bbox.min.x, maxX = bbox.max.x;
    var minY = bbox.min.y, maxY = bbox.max.y;
    var minZ = bbox.min.z, maxZ = bbox.max.z;

    var width = Math.max(0.001, maxX - minX);
    var height = Math.max(0.001, maxY - minY);
    var depth = Math.max(0.001, maxZ - minZ);
    var midX = (minX + maxX) * 0.5;
    var midY = (minY + maxY) * 0.5;

    for (var i = 0; i < pos.count; i++) {
      var x = pos.getX(i);
      var y = pos.getY(i);
      var z = pos.getZ(i);

      var newX = x;
      var newY = y;
      var newZ = z;

      switch (deformationType) {
        case 'curve-arc':
          // Bend along circular arc in X-Z plane
          var radius = options.radius || Math.max(width * 1.2, 4.0);
          var theta = (x - midX) / radius;
          newX = Math.sin(theta) * (radius + z);
          newZ = Math.cos(theta) * (radius + z) - radius;
          break;

        case 'wave-ripple':
          // Sinusoidal harmonic wave ripple
          var freqX = options.frequency || 2.5;
          var ampZ = options.amplitude !== undefined ? options.amplitude : 0.22;
          var freqY = options.frequencyY || 1.2;
          var ampY = options.amplitudeY !== undefined ? options.amplitudeY : 0.08;
          var phase = options.phase || 0.0;
          newZ = z + Math.sin(((x - minX) / width) * Math.PI * freqX + phase) * ampZ;
          newY = y + Math.cos(((x - minX) / width) * Math.PI * freqY + phase) * ampY;
          break;

        case 'cylinder-wrap':
          // Wraps full width around cylinder of radius R
          var cylR = options.radius || (width / (Math.PI * 1.5));
          var angleSpan = options.angleSpan || Math.PI * 1.2;
          var cylTheta = ((x - minX) / width - 0.5) * angleSpan;
          newX = Math.sin(cylTheta) * (cylR + z);
          newZ = Math.cos(cylTheta) * (cylR + z) - cylR;
          break;

        case 'spiral-twist':
          // Helical vortex twist along X axis
          var twistRate = options.twistRate !== undefined ? options.twistRate : 0.6;
          var twistAngle = ((x - midX) / width) * Math.PI * twistRate;
          var relY = y - midY;
          newY = midY + relY * Math.cos(twistAngle) - z * Math.sin(twistAngle);
          newZ = relY * Math.sin(twistAngle) + z * Math.cos(twistAngle);
          break;

        case 'sphere-bulge':
          // 3D spherical lens bulging from center
          var bulgeStrength = options.strength !== undefined ? options.strength : 0.45;
          var normX = (x - midX) / (width * 0.5);
          var normY = (y - midY) / (height * 0.5);
          var distSq = normX * normX + normY * normY;
          var bulge = Math.max(0, 1.0 - distSq);
          newZ = z + Math.sqrt(bulge) * bulgeStrength;
          break;

        case 'wedge-taper':
          // Sci-fi perspective taper / wedge scale
          var taperX = options.taperX !== undefined ? options.taperX : 0.5;
          var taperFrac = ((x - minX) / width);
          var scale = 1.0 + (taperFrac - 0.5) * taperX;
          newY = midY + (y - midY) * scale;
          newZ = z * scale;
          break;
      }

      pos.setXYZ(i, newX, newY, newZ);
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return geometry;
  }

  // =========================================================================
  // 6. 3D TYPOGRAPHY STRING & PARAGRAPH GEOMETRY BUILDER
  // =========================================================================

  /**
   * Generates extruded 3D geometry for an entire text string with kerning and multi-line support.
   */
  function generateTextGeometry(text, options) {
    text = (text !== undefined && text !== null) ? String(text) : 'NEXUS 3D';
    options = options || {};

    var fontStyle = options.fontStyle || 'cyber-block';
    var fontSize = options.size || 1.0;
    var depth = options.depth !== undefined ? options.depth : 0.25;
    var bevelEnabled = options.bevelEnabled !== false;
    var bevelThickness = options.bevelThickness !== undefined ? options.bevelThickness : 0.03;
    var bevelSize = options.bevelSize !== undefined ? options.bevelSize : 0.03;
    var bevelSegments = options.bevelSegments !== undefined ? options.bevelSegments : 2;
    var letterSpacing = options.letterSpacing !== undefined ? options.letterSpacing : 0.18;
    var lineHeight = options.lineHeight !== undefined ? options.lineHeight : 1.45;
    var align = options.align || 'center'; // 'center', 'left', 'right'
    var deformation = options.deformation || 'none';
    var deformationOptions = options.deformationOptions || {};

    var lines = text.split('\n');
    var charBaseW = 0.9 * fontSize;
    var charBaseH = 1.2 * fontSize;
    var sw = 0.11 * fontSize;

    var allShapes = [];
    var totalHeight = lines.length * charBaseH * lineHeight;

    for (var l = 0; l < lines.length; l++) {
      var line = lines[l];
      var lineChars = line.split('');
      var lineWidth = lineChars.length * (charBaseW + letterSpacing * fontSize) - (letterSpacing * fontSize);

      var startX = 0;
      if (align === 'center') {
        startX = -lineWidth * 0.5;
      } else if (align === 'right') {
        startX = -lineWidth;
      }

      var lineY = ((lines.length - 1) * 0.5 - l) * (charBaseH * lineHeight);

      var curX = startX;
      for (var c = 0; c < lineChars.length; c++) {
        var ch = lineChars[c];
        if (ch === ' ') {
          curX += charBaseW * 0.7 + letterSpacing * fontSize;
          continue;
        }

        var glyphShapes = generateGlyphShapes(ch, fontStyle, charBaseW, charBaseH, sw);
        // Translate glyph shapes to position
        for (var g = 0; g < glyphShapes.length; g++) {
          var srcShape = glyphShapes[g];
          var translatedShape = new THREE.Shape();

          // Translate outer curve
          var curves = srcShape.curves;
          for (var cv = 0; cv < curves.length; cv++) {
            var cCurve = curves[cv];
            if (cv === 0) {
              translatedShape.moveTo(cCurve.v1.x + curX, cCurve.v1.y + lineY);
            }
            translatedShape.lineTo(cCurve.v2.x + curX, cCurve.v2.y + lineY);
          }
          translatedShape.closePath();

          // Translate holes
          if (srcShape.holes && srcShape.holes.length > 0) {
            for (var h = 0; h < srcShape.holes.length; h++) {
              var sHole = srcShape.holes[h];
              var tHole = new THREE.Path();
              var hCurves = sHole.curves;
              for (var hc = 0; hc < hCurves.length; hc++) {
                var hCurve = hCurves[hc];
                if (hc === 0) {
                  tHole.moveTo(hCurve.v1.x + curX, hCurve.v1.y + lineY);
                }
                tHole.lineTo(hCurve.v2.x + curX, hCurve.v2.y + lineY);
              }
              tHole.closePath();
              translatedShape.holes.push(tHole);
            }
          }
          allShapes.push(translatedShape);
        }
        curX += charBaseW + letterSpacing * fontSize;
      }
    }

    if (allShapes.length === 0) {
      // Fallback dummy geometry if empty string
      var box = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      return box;
    }

    var extrudeSettings = {
      depth: depth,
      bevelEnabled: bevelEnabled,
      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
      bevelOffset: 0,
      bevelSegments: bevelSegments
    };

    var geometry = new THREE.ExtrudeGeometry(allShapes, extrudeSettings);

    // Apply procedural deformation
    if (deformation !== 'none') {
      geometry = applyDeformation(geometry, deformation, deformationOptions);
    }

    if (options.center !== false) {
      geometry.center();
    }

    return geometry;
  }

  /**
   * Creates a THREE.Mesh with multi-material assignment for 3D Typography.
   */
  function createTextMesh(text, options) {
    options = options || {};
    var geometry = generateTextGeometry(text, options);
    var materials = createTypographyMaterials(options);

    var mesh = new THREE.Mesh(geometry, materials);
    mesh.name = 'Procedural3DText_' + String(text).replace(/[^a-zA-Z0-9]/g, '_').slice(0, 16);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
      isTypography: true,
      text: text,
      fontStyle: options.fontStyle || 'cyber-block',
      deformation: options.deformation || 'none',
      depth: options.depth !== undefined ? options.depth : 0.25
    };
    return mesh;
  }

  // =========================================================================
  // 7. SACRED MONOGRAM & LOGO GENERATOR
  // =========================================================================

  /**
   * Generates extruded 3D geometry for a sacred or cyberpunk monogram.
   */
  function createMonogramGeometry(symbolKey, options) {
    symbolKey = symbolKey || 'sulfur';
    options = options || {};

    var width = options.size || 2.0;
    var height = options.size || 2.0;
    var depth = options.depth !== undefined ? options.depth : 0.3;
    var bevelThickness = options.bevelThickness !== undefined ? options.bevelThickness : 0.04;
    var bevelSize = options.bevelSize !== undefined ? options.bevelSize : 0.03;
    var bevelSegments = options.bevelSegments !== undefined ? options.bevelSegments : 2;
    var sw = options.strokeWidth || 0.12;

    var shapes = generateSpecialMonogramShapes(symbolKey, width, height, sw);
    if (shapes.length === 0) {
      return new THREE.BoxGeometry(0.5, 0.5, 0.5);
    }

    var extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
      bevelSegments: bevelSegments
    };

    var geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
    geometry.center();
    return geometry;
  }

  /**
   * Creates a THREE.Mesh with multi-material assignment for a sacred/cyber monogram.
   */
  function createMonogramMesh(symbolKey, options) {
    options = options || {};
    var geometry = createMonogramGeometry(symbolKey, options);
    var materials = createTypographyMaterials(options);

    var mesh = new THREE.Mesh(geometry, materials);
    mesh.name = 'Monogram_' + String(symbolKey);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
      isMonogram: true,
      symbolKey: symbolKey,
      category: 'SacredMonogram'
    };
    return mesh;
  }

  /**
   * Synthesizes a full procedural 3D Logo Monogram composite (Monogram + Curved Arc Typography + Chassis Frame).
   */
  function createProceduralLogo(config) {
    config = config || {};
    var symbolKey = config.symbol || 'mercury';
    var brandTextTop = config.topText || 'ZOTH';
    var brandTextBottom = config.bottomText || 'OMNIVERSE';
    var fontStyle = config.fontStyle || 'cyber-block';
    var frontMaterial = config.frontMaterial || 'obsidian';
    var edgeMaterial = config.edgeMaterial || 'neon-cyan';
    var chassisStyle = config.chassis || 'hex'; // 'hex', 'ring', 'shield', 'none'
    var radius = config.radius || 2.8;

    var logoGroup = new THREE.Group();
    logoGroup.name = 'Procedural3DLogo_' + symbolKey + '_' + brandTextTop;

    // 1. Central Core Monogram
    var monogramMesh = createMonogramMesh(symbolKey, {
      size: radius * 0.9,
      depth: 0.35,
      frontMaterial: frontMaterial,
      edgeMaterial: edgeMaterial
    });
    monogramMesh.position.set(0, 0, 0.05);
    logoGroup.add(monogramMesh);

    // 2. Top Curved Typography
    if (brandTextTop) {
      var topTextGeo = generateTextGeometry(brandTextTop, {
        fontStyle: fontStyle,
        size: radius * 0.22,
        depth: 0.2,
        letterSpacing: 0.22,
        deformation: 'curve-arc',
        deformationOptions: { radius: radius * 1.15 }
      });
      var topMaterials = createTypographyMaterials({ frontMaterial: frontMaterial, edgeMaterial: edgeMaterial });
      var topMesh = new THREE.Mesh(topTextGeo, topMaterials);
      topMesh.position.set(0, radius * 0.95, 0.08);
      logoGroup.add(topMesh);
    }

    // 3. Bottom Curved Typography (Inverted arc)
    if (brandTextBottom) {
      var botTextGeo = generateTextGeometry(brandTextBottom, {
        fontStyle: fontStyle,
        size: radius * 0.18,
        depth: 0.2,
        letterSpacing: 0.25,
        deformation: 'curve-arc',
        deformationOptions: { radius: -radius * 1.15 }
      });
      var botMaterials = createTypographyMaterials({ frontMaterial: frontMaterial, edgeMaterial: edgeMaterial });
      var botMesh = new THREE.Mesh(botTextGeo, botMaterials);
      botMesh.position.set(0, -radius * 0.95, 0.08);
      logoGroup.add(botMesh);
    }

    // 4. Outer Containment Chassis Frame
    if (chassisStyle !== 'none') {
      var chassisShapes = [];
      if (chassisStyle === 'hex') {
        var outerHex = createRegularPolygonShape(0, 0, radius * 1.32, 6, radius * 1.32 - 0.14, Math.PI / 6);
        chassisShapes.push(outerHex);
      } else if (chassisStyle === 'shield') {
        var shield = createSpecialShieldChassis(radius * 1.35, 0.14);
        chassisShapes.push(shield);
      } else {
        // 'ring'
        var ring = createRingShape(0, 0, radius * 1.3, radius * 1.3 - 0.12, 48);
        chassisShapes.push(ring);
      }

      var chassisGeo = new THREE.ExtrudeGeometry(chassisShapes, {
        depth: 0.25,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.03,
        bevelSegments: 2
      });
      chassisGeo.center();

      var chassisMats = createTypographyMaterials({
        frontMaterial: 'brushed-titanium',
        edgeMaterial: edgeMaterial
      });
      var chassisMesh = new THREE.Mesh(chassisGeo, chassisMats);
      chassisMesh.position.set(0, 0, -0.05);
      logoGroup.add(chassisMesh);
    }

    // 5. User Data & Metadata
    logoGroup.userData = {
      isProceduralLogo: true,
      symbolKey: symbolKey,
      topText: brandTextTop,
      bottomText: brandTextBottom,
      fontStyle: fontStyle
    };

    return logoGroup;
  }

  function createSpecialShieldChassis(radius, thickness) {
    var r = radius;
    var th = thickness;
    var shape = new THREE.Shape();
    shape.moveTo(0, r * 1.05);
    shape.lineTo(r * 0.85, r * 0.7);
    shape.lineTo(r * 0.75, -r * 0.45);
    shape.lineTo(0, -r * 1.05);
    shape.lineTo(-r * 0.75, -r * 0.45);
    shape.lineTo(-r * 0.85, r * 0.7);
    shape.closePath();

    var hole = new THREE.Path();
    var hr = r - th;
    hole.moveTo(0, hr * 1.05);
    hole.lineTo(hr * 0.85, hr * 0.7);
    hole.lineTo(hr * 0.75, -hr * 0.45);
    hole.lineTo(0, -hr * 1.05);
    hole.lineTo(-hr * 0.75, -hr * 0.45);
    hole.lineTo(-hr * 0.85, hr * 0.7);
    hole.closePath();
    shape.holes.push(hole);
    return shape;
  }

  // =========================================================================
  // 8. METADATA & CATALOG INSPECTION API
  // =========================================================================

  var FONT_STYLES = [
    'cyber-block',
    'alchemical-serif',
    'neo-tokyo',
    'runic-futurism',
    'matrix-hex',
    'minimal-sans'
  ];

  var DEFORMATION_MODES = [
    'none',
    'curve-arc',
    'wave-ripple',
    'cylinder-wrap',
    'spiral-twist',
    'sphere-bulge',
    'wedge-taper'
  ];

  var ALCHEMICAL_SYMBOLS = [
    { key: 'sulfur', name: 'Sulfur (🜍)', category: 'Tria Prima', description: 'Soul & Fiery Principle' },
    { key: 'mercury', name: 'Mercury (☿)', category: 'Tria Prima', description: 'Spirit & Fluid Mind' },
    { key: 'salt', name: 'Salt (🜔)', category: 'Tria Prima', description: 'Body & Physical Matrix' },
    { key: 'sun', name: 'Sun / Sol (☉)', category: 'Planetary', description: 'Radiant Solar Consciousness' },
    { key: 'moon', name: 'Moon / Luna (☽)', category: 'Planetary', description: 'Intuitive Lunar Flow' },
    { key: 'mars', name: 'Mars / Iron (♂)', category: 'Planetary', description: 'Kinetic Drive & Spear' },
    { key: 'venus', name: 'Venus / Copper (♀)', category: 'Planetary', description: 'Magnetic Affinity & Harmony' },
    { key: 'jupiter', name: 'Jupiter / Tin (♃)', category: 'Planetary', description: 'Expansion & Sovereignty' },
    { key: 'saturn', name: 'Saturn / Lead (♄)', category: 'Planetary', description: 'Structure, Time & Discipline' },
    { key: 'uranus', name: 'Uranus (♅)', category: 'Planetary', description: 'Cosmic Innovation & Sky' },
    { key: 'neptune', name: 'Neptune (♆)', category: 'Planetary', description: 'Mystic Depths & Ocean Trident' },
    { key: 'pluto', name: 'Pluto (♇)', category: 'Planetary', description: 'Underworld Metamorphosis' },
    { key: 'ouroboros', name: 'Ouroboros', category: 'Hermetic', description: 'Infinite Cyclic Rebirth' },
    { key: 'philosophers_stone', name: 'Philosopher\'s Stone', category: 'Hermetic', description: 'Squaring the Circle (Magnum Opus)' },
    { key: 'aegishjalmur', name: 'Helm of Awe', category: 'Sacred Staves', description: '8-Fold Inviolable Protection' },
    { key: 'vegvisir', name: 'Vegvisir Compass', category: 'Sacred Staves', description: 'Runic Wayfinder' },
    { key: 'valknut', name: 'Valknut Triad', category: 'Sacred Staves', description: 'Slain Warrior Knot' }
  ];

  var CYBER_MONOGRAMS = [
    { key: 'matrix_hex', name: 'Matrix Hex', category: 'Cyberpunk', description: 'Hexagonal Cyber Conduit Shield' },
    { key: 'binary_block', name: 'Binary Block', category: 'Cyberpunk', description: 'Etched 3D Silicon Data Monolith' },
    { key: 'quantum_gate', name: 'Quantum Gate', category: 'Cyberpunk', description: 'Multi-Orbital Entanglement Node' },
    { key: 'glitch_sigil', name: 'Glitch Sigil', category: 'Cyberpunk', description: 'Displaced Step Monogram' },
    { key: 'cyber_oni', name: 'Cyber Oni', category: 'Cyberpunk', description: 'Low-Poly Armored Horn Crest' },
    { key: 'neural_core', name: 'Neural Core', category: 'Cyberpunk', description: 'Synaptic Interconnect Cluster' },
    { key: 'hud_reticle', name: 'HUD Reticle', category: 'Cyberpunk', description: 'Tactical Precision Crosshair' },
    { key: 'crypto_shield', name: 'Crypto Shield', category: 'Cyberpunk', description: 'Encrypted Security Vault Crest' }
  ];

  function getAvailableRunes() {
    return Object.keys(RUNE_DESCRIPTORS).map(function (k) {
      return {
        key: k,
        unicode: RUNE_DESCRIPTORS[k].unicode,
        name: RUNE_DESCRIPTORS[k].name,
        meaning: RUNE_DESCRIPTORS[k].meaning
      };
    });
  }

  function getAvailableAlchemicalSymbols() {
    return ALCHEMICAL_SYMBOLS.slice();
  }

  function getAvailableCyberMonograms() {
    return CYBER_MONOGRAMS.slice();
  }

  function getFontStyles() {
    return FONT_STYLES.slice();
  }

  function getDeformationModes() {
    return DEFORMATION_MODES.slice();
  }

  function getMaterialPresets() {
    return Object.keys(MATERIAL_PRESETS);
  }

  // =========================================================================
  // 9. PUBLIC ENGINE EXPORTS
  // =========================================================================

  return {
    VERSION: VERSION,
    PHI: PHI,

    // Core 3D Typography API
    generateTextGeometry: generateTextGeometry,
    createTextMesh: createTextMesh,
    generateGlyphShapes: generateGlyphShapes,

    // Sacred & Cyber Monograms
    createMonogramGeometry: createMonogramGeometry,
    createMonogramMesh: createMonogramMesh,
    generateSpecialMonogramShapes: generateSpecialMonogramShapes,
    createProceduralLogo: createProceduralLogo,

    // Mathematical Deformations
    applyDeformation: applyDeformation,

    // Materials & Shaders
    createTypographyMaterials: createTypographyMaterials,
    MATERIAL_PRESETS: MATERIAL_PRESETS,

    // Vector Shape Utilities
    buildShapeFromPoints: buildShapeFromPoints,
    createStrokeShape: createStrokeShape,
    createPolylineShapes: createPolylineShapes,
    createRingShape: createRingShape,
    createArcRibbonShape: createArcRibbonShape,
    createRegularPolygonShape: createRegularPolygonShape,

    // Metadata & Catalogs
    getAvailableRunes: getAvailableRunes,
    getAvailableAlchemicalSymbols: getAvailableAlchemicalSymbols,
    getAvailableCyberMonograms: getAvailableCyberMonograms,
    getFontStyles: getFontStyles,
    getDeformationModes: getDeformationModes,
    getMaterialPresets: getMaterialPresets,

    // Raw Dictionaries
    RUNE_DESCRIPTORS: RUNE_DESCRIPTORS,
    BASE_GLYPH_STROKES: BASE_GLYPH_STROKES
  };
});
