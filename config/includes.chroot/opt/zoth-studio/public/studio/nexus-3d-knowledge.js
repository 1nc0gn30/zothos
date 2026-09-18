/**
 * ⚡ ZOTH NEXUS 3D — Semantic Prompt Knowledge & CAD Retrieval Vault Engine
 * 
 * High-performance, zero-dependency, client-side semantic feature matching and
 * prompt-to-geometry knowledge retrieval engine for CAD-grade 3D procedural modeling.
 * 
 * Features:
 * - Natural Language Tokenizer, Porter-Inspired Morphological Stemmer & N-Gram Extractor
 * - Comprehensive Archetype Knowledge Taxonomy (Weapons, Vehicles, Mechs, Gadgets, Architecture, Creatures, Sacred Math, Scenes)
 * - Dynamic Feature Weighting: Cosine Similarity, Jaccard Token Overlap & TF-IDF Feature Vectors
 * - Intelligent Archetype Decomposition: Extracts components, dimensional proportions, and PBR shader recipes
 * - Real-Time Prompt Autocomplete & Semantic Query Expander
 * - Continuous Prompt Learning & Local Recipe Vault (Zero-cloud local persistence, History Tracking, Bookmarks, JSON Export/Import)
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
    root.Nexus3DKnowledge = factory(root.THREE);
  }
})(typeof self !== 'undefined' ? self : this, function (THREE) {
  'use strict';

  var VERSION = '2026-08-24-vault-v1.0';

  // Sacred Mathematical Proportions & Constants
  var PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio Φ ≈ 1.6180339887
  var GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // Golden Angle ≈ 137.5077°
  var TAU = Math.PI * 2;

  // In-Memory Storage Fallback for Node.js / Headless environments
  var memoryStorage = {
    recipes: [],
    history: []
  };

  // Safe LocalStorage Wrapper
  var Storage = {
    isAvailable: function () {
      try {
        return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && window.localStorage !== null;
      } catch (e) {
        return false;
      }
    },
    getItem: function (key) {
      if (this.isAvailable()) {
        try {
          return window.localStorage.getItem(key);
        } catch (e) {
          return null;
        }
      }
      if (key === 'zoth_nexus3d_recipes_vault') return memoryStorage.recipes && memoryStorage.recipes.length ? JSON.stringify(memoryStorage.recipes) : null;
      if (key === 'zoth_nexus3d_gen_history') return memoryStorage.history && memoryStorage.history.length ? JSON.stringify(memoryStorage.history) : null;
      return null;
    },
    setItem: function (key, value) {
      if (this.isAvailable()) {
        try {
          window.localStorage.setItem(key, value);
          return true;
        } catch (e) {
          // fall through to memory
        }
      }
      try {
        var parsed = JSON.parse(value);
        if (key === 'zoth_nexus3d_recipes_vault') memoryStorage.recipes = parsed;
        if (key === 'zoth_nexus3d_gen_history') memoryStorage.history = parsed;
      } catch (e) {}
      return true;
    },
    removeItem: function (key) {
      if (this.isAvailable()) {
        try { window.localStorage.removeItem(key); } catch (e) {}
      }
      if (key === 'zoth_nexus3d_recipes_vault') memoryStorage.recipes = [];
      if (key === 'zoth_nexus3d_gen_history') memoryStorage.history = [];
    }
  };

  // =========================================================================
  // 1. NATURAL LANGUAGE TOKENIZER & MORPHOLOGICAL STEMMER ENGINE
  // =========================================================================

  var STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
    'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
    'below', 'between', 'both', 'but', 'by', 'can', 'cant', 'cannot', 'could',
    'did', 'do', 'does', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
    'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers',
    'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it',
    'its', 'itself', 'just', 'make', 'me', 'more', 'most', 'my', 'myself', 'no',
    'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought',
    'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'should', 'so',
    'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
    'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
    'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
    'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours',
    'yourself', 'yourselves', 'synthesize', 'generate', 'create', 'make', 'build',
    'render', 'model', 'please', 'like', 'give'
  ]);

  // Irregular CAD / 3D terms stem overrides
  var IRREGULAR_STEMS = {
    'matrices': 'matrix',
    'vertices': 'vertex',
    'indices': 'index',
    'chassis': 'chassis',
    'axes': 'axis',
    'radii': 'radius',
    'helices': 'helix',
    'polyhedra': 'polyhedron',
    'dodecahedra': 'dodecahedron',
    'icosahedra': 'icosahedron',
    'octahedra': 'octahedron',
    'tetrahedra': 'tetrahedron',
    'spaceships': 'spaceship',
    'starfighters': 'starfighter',
    'rifles': 'rifle',
    'cannons': 'cannon',
    'blasters': 'blaster',
    'swords': 'sword',
    'katanas': 'katana',
    'crystals': 'crystal',
    'lasers': 'laser',
    'thrusters': 'thruster',
    'nozzles': 'nozzle',
    'turbines': 'turbine',
    'shields': 'shield',
    'monoliths': 'monolith',
    'obelisks': 'obelisk',
    'spires': 'spire',
    'tesseracts': 'tesseract',
    'hypercubes': 'hypercube',
    'manifolds': 'manifold',
    'superquadrics': 'superquadric',
    'gears': 'gear',
    'sprockets': 'sprocket',
    'drones': 'drone',
    'mechs': 'mech',
    'exoskeletons': 'exoskeleton',
    'islands': 'island',
    'skyscrapers': 'skyscraper',
    'temples': 'temple',
    'sanctums': 'sanctum',
    'hangars': 'hangar',
    'holodecks': 'holodeck',
    'corridors': 'corridor',
    'citadels': 'citadel',
    'calderas': 'caldera',
    'trenches': 'trench',
    'dragons': 'dragon',
    'organoids': 'organoid',
    'metaballs': 'metaball',
    'cylindrical': 'cylinder'
  };

  /**
   * Morphological stemmer tailored for CAD, 3D geometry & sci-fi vocabulary
   */
  function stem(token) {
    if (!token || typeof token !== 'string') return '';
    token = token.toLowerCase().trim();
    if (token.length <= 3) return token;

    if (IRREGULAR_STEMS[token]) {
      return IRREGULAR_STEMS[token];
    }

    // Step 1: Plurals & Verb endings
    if (token.endsWith('sses')) token = token.slice(0, -2);
    else if (token.endsWith('ies')) token = token.slice(0, -3) + 'y';
    else if (token.endsWith('ss')) { /* keep */ }
    else if (token.endsWith('s') && !token.endsWith('us') && !token.endsWith('is')) token = token.slice(0, -1);

    // Step 2: Suffix stripping
    if (token.endsWith('eed')) {
      if (token.length > 5) token = token.slice(0, -1);
    } else if (token.endsWith('ated') && token.length > 5) {
      token = token.slice(0, -2); // 'accelerated' -> 'accelerat'
    } else if (token.endsWith('ed') && token.length > 4) {
      token = token.slice(0, -2);
      if (token.endsWith('ll') || token.endsWith('tt') || token.endsWith('pp') || token.endsWith('nn')) {
        token = token.slice(0, -1);
      }
    } else if (token.endsWith('ing') && token.length > 5) {
      token = token.slice(0, -3);
      if (token.endsWith('ll') || token.endsWith('tt') || token.endsWith('pp') || token.endsWith('nn')) {
        token = token.slice(0, -1);
      }
    }

    // Step 3: Derivational suffixes
    if (token.endsWith('ational')) token = token.slice(0, -5) + 'e';
    else if (token.endsWith('tional')) token = token.slice(0, -4);
    else if (token.endsWith('ization')) token = token.slice(0, -5);
    else if (token.endsWith('ation')) token = token.slice(0, -3);
    else if (token.endsWith('ator')) token = token.slice(0, -2); // 'accelerator' -> 'accelerat'
    else if (token.endsWith('alism')) token = token.slice(0, -3);
    else if (token.endsWith('ivity')) token = token.slice(0, -3);
    else if (token.endsWith('ement')) token = token.slice(0, -5);
    else if (token.endsWith('ment')) token = token.slice(0, -4);
    else if (token.endsWith('ness')) token = token.slice(0, -4);
    else if (token.endsWith('ical')) token = token.slice(0, -2);
    else if (token.endsWith('ance')) token = token.slice(0, -4);
    else if (token.endsWith('ence')) token = token.slice(0, -4);
    else if (token.endsWith('able')) token = token.slice(0, -4);
    else if (token.endsWith('ible')) token = token.slice(0, -4);

    return token;
  }

  /**
   * Tokenize natural language text into clean normalized tokens
   */
  function tokenize(text, options) {
    options = options || {};
    if (!text || typeof text !== 'string') return [];
    var removeStopWords = options.removeStopWords !== false;
    var doStem = options.stem !== false;

    // Normalize unicode, hyphens, and slashes
    var clean = text
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[\/\\]/g, ' ')
      .replace(/[^a-z0-9_\-\.\s]/g, ' ');

    var rawTokens = clean.split(/\s+/).filter(Boolean);
    var tokens = [];

    for (var i = 0; i < rawTokens.length; i++) {
      var t = rawTokens[i].replace(/^[-_.]+|[-_.]+$/g, '');
      if (!t || t.length < 2) continue;

      // Check if compound word with hyphen (e.g. 'carbon-fiber', 't-1000')
      if (t.includes('-')) {
        var subParts = t.split('-').filter(Boolean);
        if (subParts.length > 1) {
          if (!removeStopWords || !STOP_WORDS.has(t)) {
            tokens.push(doStem ? stem(t) : t);
          }
          for (var s = 0; s < subParts.length; s++) {
            var sp = subParts[s];
            if (sp.length >= 2 && (!removeStopWords || !STOP_WORDS.has(sp))) {
              tokens.push(doStem ? stem(sp) : sp);
            }
          }
          continue;
        }
      }

      if (removeStopWords && STOP_WORDS.has(t)) {
        continue;
      }

      var stemmed = doStem ? stem(t) : t;
      if (stemmed && stemmed.length >= 2) {
        tokens.push(stemmed);
      }
    }

    return tokens;
  }

  /**
   * Extract N-Grams (unigrams, bigrams, trigrams)
   */
  function extractNGrams(tokens, maxN) {
    maxN = maxN || 2;
    var nGrams = [];
    if (!tokens || !tokens.length) return nGrams;

    for (var n = 1; n <= maxN; n++) {
      for (var i = 0; i <= tokens.length - n; i++) {
        var gram = tokens.slice(i, i + n).join('_');
        nGrams.push(gram);
      }
    }
    return nGrams;
  }

  /**
   * Extract Numerical & Parametric Attributes from Prompt
   */
  function extractDimensions(text) {
    if (!text || typeof text !== 'string') return {};
    var lower = text.toLowerCase();
    var dims = {
      scale: 1.0,
      radius: null,
      length: null,
      width: null,
      height: null,
      count: null,
      twist: null,
      frequency: null,
      amplitude: null,
      symmetry: null,
      wireframe: false,
      goldenRatio: false
    };

    if (lower.includes('phi') || lower.includes('golden ratio') || lower.includes('fibonacci')) {
      dims.goldenRatio = true;
      dims.scale = PHI;
    }

    if (lower.includes('wireframe') || lower.includes('wire') || lower.includes('hologrid') || lower.includes('meshgrid')) {
      dims.wireframe = true;
    }

    // Number extraction for counts (twin/dual=2, triple=3, quad=4, penta=5, hexa=6, octa=8)
    if (lower.includes('twin') || lower.includes('dual') || lower.includes('double') || lower.includes('2x')) dims.count = 2;
    else if (lower.includes('triple') || lower.includes('tri-') || lower.includes('3x')) dims.count = 3;
    else if (lower.includes('quad') || lower.includes('four-') || lower.includes('4x')) dims.count = 4;
    else if (lower.includes('penta') || lower.includes('5x')) dims.count = 5;
    else if (lower.includes('hexa') || lower.includes('6x')) dims.count = 6;
    else if (lower.includes('octa') || lower.includes('8x')) dims.count = 8;
    else if (lower.includes('dodeca') || lower.includes('12x')) dims.count = 12;

    // Regex numeric extraction (e.g. "5m", "120mm", "2.5x", "radius 3.2", "40 teeth")
    var countMatch = lower.match(/(\d+)\s*(teeth|cogs|rings|shards|blades|barrels|nozzles|legs|columns|facets|steps)/);
    if (countMatch) dims.count = parseInt(countMatch[1], 10);

    var scaleMatch = lower.match(/scale\s*([0-9\.]+)|([0-9\.]+)x/);
    if (scaleMatch) dims.scale = parseFloat(scaleMatch[1] || scaleMatch[2]);

    var radMatch = lower.match(/radius\s*([0-9\.]+)|([0-9\.]+)\s*(?:m|cm|mm)?\s*radius/);
    if (radMatch) dims.radius = parseFloat(radMatch[1] || radMatch[2]);

    var lenMatch = lower.match(/length\s*([0-9\.]+)|([0-9\.]+)\s*(?:m|cm|mm)?\s*long/);
    if (lenMatch) dims.length = parseFloat(lenMatch[1] || lenMatch[2]);

    return dims;
  }

  /**
   * Extract Material & Color Shader Recipes from Prompt
   */
  function extractMaterialsAndColors(text) {
    if (!text || typeof text !== 'string') {
      return {
        themeColor: '#00f0ff',
        secColor: '#e8c872',
        accentColor: '#38bdf8',
        pbrStyle: 'cyber-circuit',
        roughness: 0.25,
        metalness: 0.85,
        emissiveIntensity: 0.9,
        transmission: 0.0,
        ior: 1.5,
        isTransparent: false
      };
    }
    var p = text.toLowerCase();

    var themeColor = '#00f0ff';
    var secColor = '#e8c872';
    var accentColor = '#38bdf8';
    var pbrStyle = 'cyber-circuit';
    var roughness = 0.25;
    var metalness = 0.85;
    var emissiveIntensity = 0.9;
    var transmission = 0.0;
    var ior = 1.5;
    var isTransparent = false;

    // Style & Color Detection
    if (p.includes('carbon') || p.includes('fiber') || p.includes('weave') || p.includes('kevlar') || p.includes('composite')) {
      themeColor = '#00f0ff';
      secColor = '#38bdf8';
      accentColor = '#0284c7';
      pbrStyle = 'carbon-fiber';
      roughness = 0.35;
      metalness = 0.50;
      emissiveIntensity = 0.4;
    } else if (p.includes('titanium') || p.includes('brush') || p.includes('alloy') || p.includes('machined') || (p.includes('steel') && !p.includes('damascus'))) {
      themeColor = '#38bdf8';
      secColor = '#94a3b8';
      accentColor = '#cbd5e1';
      pbrStyle = 'brushed-titanium';
      roughness = 0.25;
      metalness = 0.95;
      emissiveIntensity = 0.3;
    } else if (p.includes('holo') || p.includes('iridescent') || p.includes('rainbow') || p.includes('prism') || p.includes('chroma') || p.includes('space') || p.includes('nebula') || p.includes('purple') || p.includes('void') || p.includes('argon')) {
      themeColor = '#c084fc';
      secColor = '#38bdf8';
      accentColor = '#f472b6';
      pbrStyle = 'iridescent-hologram';
      roughness = 0.08;
      metalness = 0.90;
      emissiveIntensity = 0.6;
    } else if (p.includes('matrix') || p.includes('acid') || p.includes('bio') || p.includes('organic') || p.includes('alien') || p.includes('cell') || p.includes('vein') || p.includes('green') || p.includes('draco') || p.includes('voronoi')) {
      themeColor = '#34d399';
      secColor = '#10b981';
      accentColor = '#059669';
      pbrStyle = 'bio-organic';
      roughness = 0.30;
      metalness = 0.05;
      emissiveIntensity = 0.9;
    } else if (p.includes('damascus') || p.includes('valyrian') || p.includes('folded') || p.includes('blade') || p.includes('sword') || p.includes('katana') || p.includes('gold') || p.includes('solar') || p.includes('solon') || p.includes('temple') || p.includes('sacred')) {
      themeColor = '#e8c872';
      secColor = '#f59e0b';
      accentColor = '#d97706';
      pbrStyle = 'damascus-steel';
      roughness = 0.20;
      metalness = 0.92;
      emissiveIntensity = 0.4;
    } else if (p.includes('fire') || p.includes('ignis') || p.includes('red') || p.includes('crimson') || p.includes('ruby') || p.includes('laser') || p.includes('magma') || p.includes('lava') || p.includes('volcan')) {
      themeColor = '#ff3366';
      secColor = '#f59e0b';
      accentColor = '#dc2626';
      pbrStyle = 'cyber-circuit';
      roughness = 0.25;
      metalness = 0.85;
      emissiveIntensity = 1.2;
    }

    // Glass & Transparency Modifier
    if (p.includes('glass') || p.includes('crystal') || p.includes('translucent') || p.includes('transparent') || p.includes('refract') || p.includes('optics') || p.includes('prism')) {
      isTransparent = true;
      transmission = 0.88;
      roughness = 0.05;
      ior = 1.52;
    }

    return {
      themeColor: themeColor,
      secColor: secColor,
      accentColor: accentColor,
      pbrStyle: pbrStyle,
      roughness: roughness,
      metalness: metalness,
      emissiveIntensity: emissiveIntensity,
      transmission: transmission,
      ior: ior,
      isTransparent: isTransparent
    };
  }

  // =========================================================================
  // 2. COMPREHENSIVE CAD & SCENIC ARCHETYPE TAXONOMY (KNOWLEDGE VAULT)
  // =========================================================================

  var ARCHETYPE_CATEGORIES = [
    'Weapons',
    'Vehicles',
    'Mechs',
    'Gadgets',
    'Architecture',
    'Creatures',
    'Sacred Math',
    'Scenes'
  ];

  var TEMPLATE_VAULT = [
    // -----------------------------------------------------------------------
    // CATEGORY: WEAPONS
    // -----------------------------------------------------------------------
    {
      id: 'plasma_sniper_rifle',
      name: 'Heavy Plasma Sniper Rifle',
      category: 'Weapons',
      description: 'Long-range energy firearm featuring magnetic accelerator coils, cooling barrel shroud, ergonomic stock, and digital optic HUD scope.',
      keywords: ['rifle', 'sniper', 'gun', 'blaster', 'railgun', 'cannon', 'plasma', 'coil', 'barrel', 'stock', 'scope', 'muzzle', 'firearm', 'heatsink', 'optic'],
      primaryComponent: 'Chassis Body & Accelerator Coils',
      components: ['barrel_shroud', 'accelerator_coils', 'optic_scope', 'tactical_stock', 'plasma_chamber', 'grip', 'muzzle_brake'],
      defaultDimensions: { length: 4.8, height: 1.2, width: 0.6, coilCount: 8, barrelLength: 3.4 },
      defaultPBRStyle: 'carbon-fiber',
      defaultThemeColor: '#00f0ff',
      defaultSecColor: '#38bdf8',
      tags: ['weapon', 'ranged', 'plasma', 'energy', 'tactical', 'precision'],
      samplePrompts: [
        'Plasma sniper rifle with glowing energy coils and carbon stock',
        'Heavy railgun with magnetic accelerator coils and titanium barrel shroud',
        'Cyberpunk ion blaster rifle with holographic scope'
      ]
    },
    {
      id: 'damascus_energy_katana',
      name: 'Damascus Monomolecular Katana',
      category: 'Weapons',
      description: 'High-frequency folded Damascus steel sword with illuminated energy hamon edge, gold tsuba guard, and cyber braided hilt.',
      keywords: ['katana', 'sword', 'blade', 'dagger', 'saber', 'damascus', 'folded', 'edge', 'tsuba', 'hilt', 'pommel', 'melee', 'sheath', 'scabbard'],
      primaryComponent: 'Folded Damascus Edge',
      components: ['damascus_blade', 'tsuba_guard', 'braided_hilt', 'pommel_core', 'hamon_glow', 'scabbard'],
      defaultDimensions: { length: 5.2, curve: 0.15, hiltLength: 1.6, guardRadius: 0.8 },
      defaultPBRStyle: 'damascus-steel',
      defaultThemeColor: '#e8c872',
      defaultSecColor: '#f59e0b',
      tags: ['weapon', 'melee', 'katana', 'sword', 'damascus', 'sharp'],
      samplePrompts: [
        'Ancient damascus steel katana blade with folded wave pattern',
        'Cyberpunk plasma katana with glowing energy edge and gold tsuba',
        'High-frequency mono-molecular energy sword with braided hilt'
      ]
    },
    {
      id: 'heavy_plasma_cannon',
      name: 'Heavy Rotary Plasma Cannon',
      category: 'Weapons',
      description: 'Heavy multi-barrel rotary autocannon with circular heatsink fins, high-yield power capacitor, and gimbal mounting yoke.',
      keywords: ['cannon', 'gatling', 'rotary', 'minigun', 'turret', 'heavy', 'autocannon', 'barrels', 'hopper', 'ammo', 'plasma'],
      primaryComponent: 'Multi-Barrel Rotary Cluster',
      components: ['rotating_barrel_bundle', 'cooling_fins', 'capacitor_core', 'feed_chute', 'mounting_yoke'],
      defaultDimensions: { length: 5.5, diameter: 1.8, barrelCount: 6, finCount: 12 },
      defaultPBRStyle: 'brushed-titanium',
      defaultThemeColor: '#38bdf8',
      defaultSecColor: '#cbd5e1',
      tags: ['weapon', 'heavy', 'rotary', 'turret', 'military'],
      samplePrompts: [
        'Heavy rotary plasma cannon with twin cooling heatsinks and capacitor pack',
        'Titanium Gatling autocannon with multi-barrel cluster'
      ]
    },
    {
      id: 'energy_shield_aegis',
      name: 'Hexagonal Aegis Forcefield Shield',
      category: 'Weapons',
      description: 'Deployable tactical barrier featuring interlocking hexagonal kinetic armor plates, central radiant power gem, and structural harness.',
      keywords: ['shield', 'aegis', 'barrier', 'forcefield', 'deflector', 'buckler', 'hexagonal', 'armor', 'defense', 'protection'],
      primaryComponent: 'Interlocking Hex Armor Plates',
      components: ['hex_barrier_plates', 'emitter_core', 'handle_armature', 'perimeter_force_ring'],
      defaultDimensions: { width: 3.2, height: 4.2, thickness: 0.35, hexRows: 4 },
      defaultPBRStyle: 'iridescent-hologram',
      defaultThemeColor: '#c084fc',
      defaultSecColor: '#38bdf8',
      tags: ['weapon', 'defense', 'shield', 'armor', 'forcefield'],
      samplePrompts: [
        'Deployable energy shield aegis with interlocking hexagonal barrier plates',
        'Iridescent hologram deflector shield with glowing emitter core'
      ]
    },

    // -----------------------------------------------------------------------
    // CATEGORY: VEHICLES
    // -----------------------------------------------------------------------
    {
      id: 'supersonic_starfighter',
      name: 'Valkyrie Supersonic Starfighter',
      category: 'Vehicles',
      description: 'High-agility aerospace craft with needle fuselage, swept delta wings, vectoring twin afterburners, and tinted glass canopy.',
      keywords: ['ship', 'starfighter', 'fighter', 'starship', 'craft', 'spaceship', 'aircraft', 'jet', 'wings', 'thruster', 'canopy', 'cockpit', 'aerodynamic'],
      primaryComponent: 'Needle Fuselage & Delta Wings',
      components: ['needle_fuselage', 'swept_delta_wings', 'twin_afterburners', 'bubble_canopy', 'rcs_thrusters', 'intake_cowlings'],
      defaultDimensions: { length: 6.2, wingspan: 5.8, height: 1.6, thrusterCount: 2 },
      defaultPBRStyle: 'brushed-titanium',
      defaultThemeColor: '#38bdf8',
      defaultSecColor: '#94a3b8',
      tags: ['vehicle', 'space', 'starfighter', 'speed', 'aerospace'],
      samplePrompts: [
        'Supersonic starfighter ship with twin thruster nozzles and swept wings',
        'Valkyrie deep space interceptor with carbon fiber fuselage and gold canards',
        'High-speed racing spacecraft with iridescent hologram canopy'
      ]
    },
    {
      id: 'cyberpunk_hover_speeder',
      name: 'Kusanagi Anti-Grav Hover Speeder',
      category: 'Vehicles',
      description: 'Sleek urban anti-gravity speeder bike with low-slung monocoque chassis, lateral repulsor cowlings, and digital instrument HUD.',
      keywords: ['speeder', 'hoverbike', 'bike', 'hover', 'motorcycle', 'repulsor', 'antigrav', 'racer', 'monocoque'],
      primaryComponent: 'Low-Slung Monocoque Chassis',
      components: ['chassis_fairing', 'repulsor_magnets', 'cockpit_hud', 'twin_exhausts', 'fork_suspension'],
      defaultDimensions: { length: 4.2, width: 1.4, height: 1.1, clearance: 0.4 },
      defaultPBRStyle: 'carbon-fiber',
      defaultThemeColor: '#00f0ff',
      defaultSecColor: '#38bdf8',
      tags: ['vehicle', 'ground', 'hover', 'cyberpunk', 'racing'],
      samplePrompts: [
        'Cyberpunk hover speeder with carbon fiber chassis and twin repulsor coils',
        'High-speed anti-gravity hoverbike with glowing neon trim'
      ]
    },
    {
      id: 'deep_space_freighter',
      name: 'Titan Modular Heavy Space Freighter',
      category: 'Vehicles',
      description: 'Long-haul interstellar cargo freighter with central structural truss, pressurized command bridge, and 6 hexagonal cargo pods.',
      keywords: ['freighter', 'cargo', 'transport', 'carrier', 'cruiser', 'modular', 'truss', 'containers', 'bridge', 'engine'],
      primaryComponent: 'Spinal Structural Truss',
      components: ['spinal_truss', 'command_bridge', 'cargo_containers', 'fusion_engine_block', 'radiator_panels'],
      defaultDimensions: { length: 12.0, width: 4.5, height: 3.8, containerCount: 6 },
      defaultPBRStyle: 'brushed-titanium',
      defaultThemeColor: '#38bdf8',
      defaultSecColor: '#cbd5e1',
      tags: ['vehicle', 'space', 'heavy', 'freighter', 'industrial'],
      samplePrompts: [
        'Deep space modular heavy freighter with spinal truss and cargo pods',
        'Industrial mining starship with fusion thruster block'
      ]
    },
    {
      id: 'orbital_dropship',
      name: 'Vanguard Orbital Dropship',
      category: 'Vehicles',
      description: 'Armored atmospheric assault dropship with quad tilt-rotor VTOL thruster nacelles, reinforced troop bay, and heavy landing gear.',
      keywords: ['dropship', 'vtol', 'assault', 'transporter', 'landing', 'nacelles', 'armored', 'troop', 'bay'],
      primaryComponent: 'Armored Cabin & Tilt VTOL Nacelles',
      components: ['armored_cabin', 'vtol_nacelles', 'troop_ramp', 'shock_landing_gear', 'cockpit_armor'],
      defaultDimensions: { length: 7.5, width: 6.0, height: 2.8, nacelleCount: 4 },
      defaultPBRStyle: 'brushed-titanium',
      defaultThemeColor: '#38bdf8',
      defaultSecColor: '#94a3b8',
      tags: ['vehicle', 'military', 'dropship', 'vtol', 'heavy'],
      samplePrompts: [
        'Armored orbital dropship with quad VTOL tilt nacelles and heavy landing gear',
        'Tactical deployment shuttle with reinforced carbon armor'
      ]
    },

    // -----------------------------------------------------------------------
    // CATEGORY: MECHS & ROBOTICS
    // -----------------------------------------------------------------------
    {
      id: 'titan_assault_mech',
      name: 'Goliath Titan Assault Mech',
      category: 'Mechs',
      description: 'Heavy bipedal armored battle mech featuring hydraulic reverse-joint legs, cockpit torso, shoulder missile pods, and arm cannon hardpoints.',
      keywords: ['mech', 'robot', 'bipedal', 'walker', 'titan', 'goliath', 'armor', 'missile', 'hardpoint', 'hydraulic', 'joints', 'cockpit'],
      primaryComponent: 'Cockpit Torso & Bipedal Legs',
      components: ['torso_cockpit', 'hip_joints', 'reverse_joint_legs', 'shoulder_missile_pod', 'arm_hardpoints', 'stabilizer_toes'],
      defaultDimensions: { height: 6.5, width: 4.8, depth: 3.2, legScale: 1.2 },
      defaultPBRStyle: 'brushed-titanium',
      defaultThemeColor: '#38bdf8',
      defaultSecColor: '#94a3b8',
      tags: ['mech', 'robot', 'heavy', 'bipedal', 'combat'],
      samplePrompts: [
        'Heavy titan mech chassis with brushed titanium plating and shoulder missile pods',
        'Bipedal combat walker with hydraulic legs and plasma cannon arms',
        'Cyberpunk battle mech with glowing neon armor seams'
      ]
    },
    {
      id: 'hexapod_spider_drone',
      name: 'Arachnid Hexapod Cyber Drone',
      category: 'Mechs',
      description: 'Autonomous multi-legged reconnaissance drone with 6 articulated segmented legs, panoramic sensor dome, and utility pincers.',
      keywords: ['spider', 'drone', 'hexapod', 'legs', 'arachnid', 'robot', 'sensor', 'dome', 'multiped', 'manipulator'],
      primaryComponent: 'Sensor Dome & 6-Leg Cluster',
      components: ['sensor_dome', 'chassis_hub', 'articulated_legs', 'pincer_claws', 'battery_pack'],
      defaultDimensions: { radius: 2.8, height: 1.4, legCount: 6, segmentsPerLeg: 3 },
      defaultPBRStyle: 'cyber-circuit',
      defaultThemeColor: '#00f0ff',
      defaultSecColor: '#f59e0b',
      tags: ['mech', 'drone', 'spider', 'hexapod', 'recon'],
      samplePrompts: [
        'Cybernetic spider drone with 6 articulated legs and central sensor dome',
        'Autonomous hexapod recon robot with glowing optical eye'
      ]
    },
    {
      id: 'android_cyber_exoskeleton',
      name: 'Synapse Biomechanical Exoskeleton',
      category: 'Mechs',
      description: 'Humanoid powered exoskeleton with segmented vertebrae spine, thoracic rib cage harness, and limb servo actuator braces.',
      keywords: ['exoskeleton', 'android', 'cyborg', 'humanoid', 'vertebrae', 'spine', 'ribcage', 'servos', 'brace', 'biomechanical'],
      primaryComponent: 'Vertebrae Spine & Rib Harness',
      components: ['spinal_column', 'rib_harness', 'servo_actuators', 'limb_braces', 'power_core'],
      defaultDimensions: { height: 4.5, width: 1.8, depth: 1.2, vertebraeCount: 16 },
      defaultPBRStyle: 'carbon-fiber',
      defaultThemeColor: '#00f0ff',
      defaultSecColor: '#38bdf8',
      tags: ['mech', 'exoskeleton', 'cyborg', 'humanoid', 'biotech'],
      samplePrompts: [
        'Biomechanical cyber exoskeleton with spinal column vertebrae and carbon fiber braces',
        'Android power suit with glowing neural servo conduits'
      ]
    },
    {
      id: 'sentry_autoturret',
      name: 'Phalanx Automated Sentry Turret',
      category: 'Mechs',
      description: 'Perimeter defensive turret platform with tripod base, 360-degree motorized azimuth ring, dual autocannons, and radar dome.',
      keywords: ['turret', 'sentry', 'autoturret', 'tripod', 'defense', 'azimuth', 'radar', 'optics', 'tracking', 'perimetral'],
      primaryComponent: 'Motorized Azimuth Turret Ring',
      components: ['tripod_base', 'azimuth_ring', 'dual_autocannons', 'radar_dome', 'ammo_feed'],
      defaultDimensions: { height: 3.2, radius: 2.2, barrelLength: 2.4, legCount: 3 },
      defaultPBRStyle: 'brushed-titanium',
      defaultThemeColor: '#38bdf8',
      defaultSecColor: '#cbd5e1',
      tags: ['mech', 'turret', 'defense', 'automated', 'weapon'],
      samplePrompts: [
        'Automated sentry turret on tripod base with dual cannons and radar dish',
        'Perimeter defense tracking platform with glowing targeting optics'
      ]
    },

    // -----------------------------------------------------------------------
    // CATEGORY: GADGETS & ENERGY SYSTEMS
    // -----------------------------------------------------------------------
    {
      id: 'quantum_reactor_core',
      name: 'Tokamak Quantum Fusion Reactor Core',
      category: 'Gadgets',
      description: 'Zero-point magnetic confinement reactor featuring pulsing Simplex noise plasma sphere, outer glass shell, 3 orthogonal torus rings, and 6 cooling pylons.',
      keywords: ['reactor', 'core', 'plasma', 'generator', 'tokamak', 'fusion', 'quantum', 'magnetic', 'accelerator', 'rings', 'pylons', 'energy'],
      primaryComponent: 'Magnetic Accelerator Torus Rings',
      components: ['pulsing_plasma_core', 'glass_shell', 'magnetic_torus_rings', 'cooling_fins', 'conduit_pipes'],
      defaultDimensions: { coreRadius: 1.6, shellRadius: 2.4, ringCount: 3, finCount: 6 },
      defaultPBRStyle: 'cyber-circuit',
      defaultThemeColor: '#00f0ff',
      defaultSecColor: '#e8c872',
      tags: ['gadget', 'energy', 'reactor', 'quantum', 'plasma', 'power'],
      samplePrompts: [
        'Synthesize a glowing quantum reactor core with magnetic accelerator rings and iridescent refraction',
        'Fusion tokamak energy generator with triple magnetic containment rings',
        'Quantum reactor core with pulsing plasma orb and cooling heatsinks'
      ]
    },
    {
      id: 'omniverse_warp_gate',
      name: 'Omniverse Stargate Warp Portal',
      category: 'Gadgets',
      description: 'Interdimensional transport gateway featuring heavy conduit torus ring, liquid event horizon displacement disc, and 8 inscribed perimeter emitter pylons.',
      keywords: ['portal', 'gate', 'warp', 'ring', 'stargate', 'gateway', 'event horizon', 'singularity', 'teleport', 'dimension', 'wormhole'],
      primaryComponent: 'Conduit Torus Ring & Event Horizon Disc',
      components: ['outer_torus_ring', 'event_horizon_disc', 'emitter_pylons', 'glyph_nodes', 'power_conduits'],
      defaultDimensions: { outerRadius: 3.8, tubeRadius: 0.45, discRadius: 3.3, pylonCount: 8 },
      defaultPBRStyle: 'iridescent-hologram',
      defaultThemeColor: '#c084fc',
      defaultSecColor: '#38bdf8',
      tags: ['gadget', 'portal', 'warp', 'stargate', 'space', 'sci-fi'],
      samplePrompts: [
        'Ancient alchemical warp portal gate with outer gold glyphs and event horizon disc',
        'Iridescent hologram warp gate portal with 8 glowing emitter pylons',
        'Interdimensional wormhole stargate with liquid displacement horizon'
      ]
    },
    {
      id: 'holographic_quantum_cube',
      name: 'Holocron Holographic Quantum Data Cube',
      category: 'Gadgets',
      description: 'Quantum data storage matrix featuring nested beveled outer hyper-cube, floating inner dodecahedron core, and laser glyph etchings.',
      keywords: ['holocron', 'cube', 'data', 'cube', 'matrix', 'glyph', 'quantum', 'hologram', 'nested', 'beveled'],
      primaryComponent: 'Nested Beveled Hypercube Frames',
      components: ['outer_beveled_cube', 'inner_dodecahedron_core', 'glyph_lattice', 'corner_brackets'],
      defaultDimensions: { size: 2.2, innerScale: 0.6, cornerBevel: 0.15 },
      defaultPBRStyle: 'iridescent-hologram',
      defaultThemeColor: '#c084fc',
      defaultSecColor: '#38bdf8',
      tags: ['gadget', 'cube', 'holocron', 'data', 'quantum', 'sacred'],
      samplePrompts: [
        'Ancient holographic quantum data cube with nested floating core',
        'Cyberpunk holocron matrix with etched laser glyph lattices'
      ]
    },
    {
      id: 'emp_resonance_coil',
      name: 'Tesla EMP Resonance Pulse Coil',
      category: 'Gadgets',
      description: 'High-voltage electromagnetic pulse weapon featuring tiered coaxial induction helix coils, spark gap chamber, and parabolic horn.',
      keywords: ['emp', 'tesla', 'coil', 'resonance', 'pulse', 'induction', 'spark', 'capacitor', 'horn', 'electricity'],
      primaryComponent: 'Coaxial Induction Helix Coils',
      components: ['induction_coils', 'spark_gap_chamber', 'capacitor_base', 'parabolic_horn', 'grounding_rods'],
      defaultDimensions: { height: 4.8, radius: 1.8, coilTurns: 12, capacitorUnits: 4 },
      defaultPBRStyle: 'cyber-circuit',
      defaultThemeColor: '#00f0ff',
      defaultSecColor: '#f59e0b',
      tags: ['gadget', 'emp', 'tesla', 'coil', 'energy'],
      samplePrompts: [
        'High-energy EMP pulse generator with coaxial induction coils and capacitor bank',
        'Tesla resonance coil with glowing spark discharge chamber'
      ]
    },

    // -----------------------------------------------------------------------
    // CATEGORY: ARCHITECTURE & MONUMENTAL STRUCTURES
    // -----------------------------------------------------------------------
    {
      id: 'cyberpunk_skyscraper',
      name: 'Neo-Shinjuku Modular Megatower',
      category: 'Architecture',
      description: 'Tiered cyberpunk megastructure featuring stepped modular floors, external elevator shafts, cantilevered advertising trusses, and rooftop spire.',
      keywords: ['skyscraper', 'megastructure', 'tower', 'building', 'megacity', 'architecture', 'elevator', 'spire', 'billboard', 'neon', 'city'],
      primaryComponent: 'Stepped Modular Tower Blocks',
      components: ['tower_tiers', 'elevator_conduits', 'holographic_billboards', 'rooftop_spire', 'podium_base'],
      defaultDimensions: { height: 14.0, baseWidth: 4.5, topWidth: 2.0, tierCount: 5 },
      defaultPBRStyle: 'cyber-circuit',
      defaultThemeColor: '#00f0ff',
      defaultSecColor: '#f59e0b',
      tags: ['architecture', 'city', 'skyscraper', 'cyberpunk', 'megastructure'],
      samplePrompts: [
        'Cyberpunk skyscraper with stepped modular floors and neon advertising platforms',
        'Futuristic megacity tower with external elevator shafts and communications spire'
      ]
    },
    {
      id: 'alchemical_sanctum_temple',
      name: 'Hermetic Temple of the Golden Dawn',
      category: 'Architecture',
      description: 'Sacred classical temple with raised marble stylobate, 8 fluted Solomonic columns, triangular pediment, golden dome, and MerKaBa altar.',
      keywords: ['temple', 'sanctum', 'altar', 'shrine', 'columns', 'pediment', 'dome', 'stylobate', 'marble', 'gold', 'sacred', 'hermetic'],
      primaryComponent: 'Solomonic Column Portico & Dome',
      components: ['stylobate_platform', 'fluted_columns', 'pediment_frieze', 'golden_dome', 'merkaba_altar'],
      defaultDimensions: { width: 8.0, depth: 10.0, height: 6.5, columnCount: 8 },
      defaultPBRStyle: 'damascus-steel',
      defaultThemeColor: '#e8c872',
      defaultSecColor: '#f59e0b',
      tags: ['architecture', 'temple', 'sacred', 'sanctum', 'classical', 'gold'],
      samplePrompts: [
        'Sacred Alchemical Sanctum temple scene with golden marble floor, floating obelisks, and MerKaBa altar',
        'Hermetic temple with 8 Solomonic columns and golden ratio dome'
      ]
    },
    {
      id: 'sacred_crystal_spire',
      name: 'Aetheric Resonance Crystal Spire',
      category: 'Architecture',
      description: 'Monolithic crystal obelisk with noise displacement, 12 orbiting Fibonacci satellite shards, and stepped octagonal dais.',
      keywords: ['crystal', 'spire', 'monolith', 'obelisk', 'shard', 'fibonacci', 'orbit', 'dais', 'aether', 'pedestal'],
      primaryComponent: 'Faceted Hex Obelisk & Shard Cluster',
      components: ['central_obelisk', 'orbiting_shards', 'octagonal_dais', 'rune_inscriptions'],
      defaultDimensions: { height: 7.5, radius: 1.4, shardCount: 12, daisRadius: 3.2 },
      defaultPBRStyle: 'damascus-steel',
      defaultThemeColor: '#e8c872',
      defaultSecColor: '#34d399',
      tags: ['architecture', 'crystal', 'monolith', 'spire', 'sacred', 'fibonacci'],
      samplePrompts: [
        'Faceted crystal spire monolith with orbiting Fibonacci shards and noise displacement',
        'Sacred gold crystal spire with stepped pedestal and floating crystal satellites'
      ]
    },
    {
      id: 'orbital_bastion_citadel',
      name: 'Brutalist Orbital Bastion Citadel',
      category: 'Architecture',
      description: 'Heavy geometric space station fortress with angular cantilever bastions, central docking hub, and communications array.',
      keywords: ['citadel', 'bastion', 'fortress', 'station', 'orbital', 'brutalist', 'hangar', 'docking', 'cantilever'],
      primaryComponent: 'Central Docking Hub & Bastions',
      components: ['docking_hub', 'cantilever_bastions', 'hangar_bays', 'comm_array', 'solar_radiators'],
      defaultDimensions: { width: 9.0, depth: 9.0, height: 5.5, bastionCount: 4 },
      defaultPBRStyle: 'brushed-titanium',
      defaultThemeColor: '#38bdf8',
      defaultSecColor: '#cbd5e1',
      tags: ['architecture', 'station', 'citadel', 'bastion', 'space', 'military'],
      samplePrompts: [
        'Brutalist orbital citadel with heavy angular cantilevers and docking bays',
        'Space fortress station with communications mast and solar radiators'
      ]
    },

    // -----------------------------------------------------------------------
    // CATEGORY: CREATURES & BIO-CYBER ORGANOIDS
    // -----------------------------------------------------------------------
    {
      id: 'cyber_dragon_wyrm',
      name: 'Ouroboros Cybernetic Dragon Wyrm',
      category: 'Creatures',
      description: 'Mythic cybernetic serpentine beast featuring multi-segmented articulating spine, mechanical horned skull, cyber wings, and plasma maw.',
      keywords: ['dragon', 'wyrm', 'draco', 'beast', 'creature', 'monster', 'wings', 'horns', 'spine', 'maw', 'serpent', 'tail'],
      primaryComponent: 'Articulating Segmented Spine & Skull',
      components: ['skull_horns', 'segmented_spine', 'cyber_wings', 'plasma_maw', 'talon_limbs', 'tail_rudder'],
      defaultDimensions: { length: 8.5, wingspan: 7.0, segmentCount: 16, skullScale: 1.0 },
      defaultPBRStyle: 'bio-organic',
      defaultThemeColor: '#34d399',
      defaultSecColor: '#10b981',
      tags: ['creature', 'dragon', 'cybernetic', 'monster', 'organic'],
      samplePrompts: [
        'Cybernetic dragon with segmented serpentine spine and glowing plasma breath maw',
        'Draco wyrm mech with mechanical wings and horned skull'
      ]
    },
    {
      id: 'bio_organic_organoid',
      name: 'Xenomorphic Metaball Organoid',
      category: 'Creatures',
      description: 'Living cellular tissue entity constructed via multi-charge Marching Cubes metaball potential fields, organic vein textures, and pulsing core.',
      keywords: ['organoid', 'bio', 'organic', 'cellular', 'metaball', 'tissue', 'xenomorph', 'veins', 'blob', 'plasma', 'creature', 'organism'],
      primaryComponent: 'Marching Cubes Metaball Potential Field',
      components: ['metaball_charge_centers', 'cellular_membrane', 'vascular_veins', 'bioluminescent_nodes'],
      defaultDimensions: { blobCount: 6, resolution: 36, noiseOctaves: 3, isolationRadius: 2.5 },
      defaultPBRStyle: 'bio-organic',
      defaultThemeColor: '#34d399',
      defaultSecColor: '#10b981',
      tags: ['creature', 'bio', 'organic', 'metaball', 'cellular', 'alien'],
      samplePrompts: [
        'Alien bio-organic cellular entity with glowing veins',
        'Metaball bio-tissue organoid with multi-octave cellular turbulence',
        'Pulsing bio-luminescent organism with organic tendrils'
      ]
    },
    {
      id: 'cyber_wolf_stalker',
      name: 'Fenrir Cyber Wolf Stalker',
      category: 'Creatures',
      description: 'Quadruped mechanical predator featuring armored vertebrae chassis, multi-joint hydraulic limbs, predatory optic visor, and sensor tail.',
      keywords: ['wolf', 'hound', 'dog', 'stalker', 'fenrir', 'predator', 'quadruped', 'limbs', 'canine', 'paws', 'visor'],
      primaryComponent: 'Armored Quadruped Chassis',
      components: ['optic_head', 'armored_torso', 'hydraulic_paws', 'sensor_tail', 'carapace_plates'],
      defaultDimensions: { length: 4.8, height: 2.4, width: 1.6, legScale: 1.0 },
      defaultPBRStyle: 'carbon-fiber',
      defaultThemeColor: '#00f0ff',
      defaultSecColor: '#38bdf8',
      tags: ['creature', 'wolf', 'quadruped', 'predator', 'cybernetic'],
      samplePrompts: [
        'Cyber wolf predator with carbon fiber armor plates and glowing optic visor',
        'Mechanical robotic hound with hydraulic limbs and sensor antenna'
      ]
    },

    // -----------------------------------------------------------------------
    // CATEGORY: SACRED MATH & HIGH-DIMENSIONAL TOPOLOGY
    // -----------------------------------------------------------------------
    {
      id: 'tesseract_4d_hypercube',
      name: '4D Tesseract Stereographic Hypercube',
      category: 'Sacred Math',
      description: 'Higher-dimensional spatial projection solid featuring 16 4D vertices, 32 connecting edges in stereographic 3D projection, inner glass cube, and energy nodes.',
      keywords: ['tesseract', 'hypercube', '4d', 'dimension', 'stereographic', 'cube', 'vertices', 'edges', 'higher dimensional', 'projection'],
      primaryComponent: '4D Stereographic Edge Frame',
      components: ['4d_edge_segments', 'inner_glass_cube', '16_vertex_nodes', 'rotating_coordinate_rings'],
      defaultDimensions: { size: 2.4, projectionDistance: 0.5, innerScale: 0.65, nodeRadius: 0.12 },
      defaultPBRStyle: 'iridescent-hologram',
      defaultThemeColor: '#c084fc',
      defaultSecColor: '#38bdf8',
      tags: ['math', '4d', 'tesseract', 'hypercube', 'sacred', 'geometry'],
      samplePrompts: [
        '4D Tesseract hypercube matrix with rotating stereographic 4D projection and glass refraction',
        'Higher-dimensional 4D cube with 16 vertex energy nodes'
      ]
    },
    {
      id: 'calabi_yau_manifold',
      name: 'Calabi-Yau 6D String Theory Manifold',
      category: 'Sacred Math',
      description: 'Differential Riemannian geometric cross-section of 6-dimensional compactified space in superstring theory featuring multi-sheet complex parametric topology.',
      keywords: ['calabi', 'yau', 'manifold', 'string theory', 'quantum', '6d', 'threefold', 'riemannian', 'complex', 'singularity'],
      primaryComponent: 'Multi-Sheet Complex Cross-Section',
      components: ['complex_sheet_mesh', 'wireframe_lattice', 'singularity_core', 'coordinate_axis_rings'],
      defaultDimensions: { n: 5, kMax: 4, radius: 2.2, segments: 36 },
      defaultPBRStyle: 'iridescent-hologram',
      defaultThemeColor: '#c084fc',
      defaultSecColor: '#e8c872',
      tags: ['math', 'calabi-yau', 'manifold', 'string theory', 'quantum', 'geometry'],
      samplePrompts: [
        'calabi-yau manifold 6D quantum string theory cross-section',
        'Parametric Calabi-Yau threefold with complex differential sheets'
      ]
    },
    {
      id: 'involute_planetary_gear',
      name: 'Involute Planetary Gear Mechanism',
      category: 'Sacred Math',
      description: 'Precision mechanical CAD power transmission system with 20-tooth central sun gear with keyway bore, 3 planetary satellite pinions, and outer ring.',
      keywords: ['gear', 'sprocket', 'mechanism', 'cog', 'involute', 'planetary', 'transmission', 'teeth', 'axle', 'bore', 'keyway'],
      primaryComponent: '20-Tooth Involute Sun Gear',
      components: ['sun_gear', 'satellite_gears', 'central_axle', 'pinion_pins', 'outer_timing_ring'],
      defaultDimensions: { numTeeth: 20, pitchRadius: 2.2, thickness: 0.45, boreRadius: 0.55, satelliteCount: 3 },
      defaultPBRStyle: 'brushed-titanium',
      defaultThemeColor: '#38bdf8',
      defaultSecColor: '#e8c872',
      tags: ['math', 'cad', 'gear', 'mechanism', 'engineering', 'precision'],
      samplePrompts: [
        'mechanical cyber gear mechanism with planetary cogs',
        'Parametric involute gear system with central axle and planetary cogs',
        'Precision CAD gear train with keyed bore and satellite pinions'
      ]
    },
    {
      id: 'superquadric_monolith',
      name: 'Pinched Superquadric Monolith',
      category: 'Sacred Math',
      description: 'Non-linear mathematical solid generated via superellipsoid parametric formulas featuring pinched waist, taper gradient, and orbital shards.',
      keywords: ['superquadric', 'superellipsoid', 'pinch', 'taper', 'bend', 'solid', 'monolith', 'parametric', 'harmonic'],
      primaryComponent: 'Pinched Superquadric Pillar',
      components: ['pinched_pillar', 'orbiting_satellite_shards', 'superquadric_dais'],
      defaultDimensions: { s1: 0.22, s2: 0.22, radiusX: 1.1, radiusY: 3.2, radiusZ: 1.1, pinch: 0.15, taper: -0.2 },
      defaultPBRStyle: 'damascus-steel',
      defaultThemeColor: '#e8c872',
      defaultSecColor: '#38bdf8',
      tags: ['math', 'superquadric', 'monolith', 'parametric', 'geometry'],
      samplePrompts: [
        'futuristic superquadric monolith mathematical solid',
        'Superellipsoid pillar with pinched waist and satellite shards'
      ]
    },
    {
      id: 'klein_bottle_topology',
      name: 'Non-Orientable Klein Bottle Immersion',
      category: 'Sacred Math',
      description: 'Differential geometry surface of a non-orientable 2-manifold self-intersecting in 3D Euclidean space with continuous inner/outer surface flow.',
      keywords: ['klein', 'bottle', 'topology', 'non-orientable', 'immersion', 'differential', 'manifold', 'surface', 'self-intersecting'],
      primaryComponent: 'Self-Intersecting Klein Funnel',
      components: ['klein_surface', 'topological_wireframe', 'core_node'],
      defaultDimensions: { radius: 1.8, tubeRadius: 0.65, segmentsU: 48, segmentsV: 48 },
      defaultPBRStyle: 'iridescent-hologram',
      defaultThemeColor: '#c084fc',
      defaultSecColor: '#00f0ff',
      tags: ['math', 'klein', 'topology', 'differential', 'non-orientable'],
      samplePrompts: [
        '4D klein bottle differential immersion surface',
        'Parametric Klein bottle topological surface with glass refraction'
      ]
    },
    {
      id: 'mobius_strip_ribbon',
      name: 'Chiral Mobius Strip Ribbon',
      category: 'Sacred Math',
      description: 'One-sided continuous non-orientable topological ribbon with 180-degree half-twist, finite thickness, and Fibonacci point cloud constellation.',
      keywords: ['mobius', 'strip', 'ribbon', 'chiral', 'twist', 'topology', 'one-sided', 'fibonacci', 'strip'],
      primaryComponent: 'Twisted Parametric Ribbon',
      components: ['mobius_ribbon', 'edge_wireframe', 'fibonacci_point_cloud'],
      defaultDimensions: { radius: 2.2, width: 0.9, thickness: 0.08, twists: 1, segments: 64 },
      defaultPBRStyle: 'damascus-steel',
      defaultThemeColor: '#e8c872',
      defaultSecColor: '#f59e0b',
      tags: ['math', 'mobius', 'ribbon', 'topology', 'chiral'],
      samplePrompts: [
        'mobius strip topology ribbon with chiral twist',
        'Parametric Mobius strip with gold edging and Fibonacci point cloud'
      ]
    },
    {
      id: 'fibonacci_metatron_matrix',
      name: 'Sacred Fibonacci Phyllotaxis & Metatron Matrix',
      category: 'Sacred Math',
      description: 'Sacred geometric constellation combining 150-point Fibonacci golden spiral phyllotaxis, central dodecahedron, and icosahedron cage.',
      keywords: ['metatron', 'fibonacci', 'phyllotaxis', 'golden ratio', 'spiral', 'dodecahedron', 'icosahedron', 'sacred', 'geometry', 'platonic'],
      primaryComponent: 'Fibonacci Phyllotaxis Golden Spiral',
      components: ['dodecahedron_core', 'icosahedron_wireframe', 'fibonacci_point_cloud'],
      defaultDimensions: { pointCount: 150, radius: 3.8, coreRadius: 2.2 },
      defaultPBRStyle: 'damascus-steel',
      defaultThemeColor: '#fbbf24',
      defaultSecColor: '#f59e0b',
      tags: ['math', 'sacred', 'fibonacci', 'metatron', 'golden ratio', 'platonic'],
      samplePrompts: [
        'Sacred Metatron cube with golden ratio phyllotaxis spiral constellation',
        'Fibonacci phyllotaxis lattice with sacred gold dodecahedron'
      ]
    },
    {
      id: 'torus_knot_dna',
      name: 'Topological Torus Knot & DNA Double Helix',
      category: 'Sacred Math',
      description: 'Continuous trefoil or toroidal knot intertwining in harmonic 3D loops with Voronoi cellular displacement and concentric wireframe shell.',
      keywords: ['knot', 'torus', 'helix', 'dna', 'trefoil', 'cellular', 'voronoi', 'topological', 'harmonic'],
      primaryComponent: 'Harmonic Torus Knot Tube',
      components: ['torus_knot_mesh', 'concentric_wireframe_shell', 'cellular_displacement'],
      defaultDimensions: { radius: 2.2, tube: 0.45, p: 3, q: 5, tubularSegments: 128 },
      defaultPBRStyle: 'cyber-circuit',
      defaultThemeColor: '#ff3366',
      defaultSecColor: '#e8c872',
      tags: ['math', 'torus', 'knot', 'dna', 'helix', 'topology'],
      samplePrompts: [
        'Topological torus knot DNA double helix with cellular voronoi mesh and inner wireframe',
        'Trefoil torus knot with pulsing cyber circuit emissive veins'
      ]
    },

    // -----------------------------------------------------------------------
    // CATEGORY: FULL 3D ENVIRONMENTAL SCENES
    // -----------------------------------------------------------------------
    {
      id: 'cyberpunk_megacity',
      name: 'Cyberpunk Megacity Plaza',
      category: 'Scenes',
      description: 'Complete 3D environmental scene featuring wet reflective asphalt ground, 5 towering skyscrapers with holographic billboards, neon monument, and street beacons.',
      keywords: ['scene', 'city', 'megacity', 'cyberpunk', 'street', 'plaza', 'skyscraper', 'billboard', 'neon', 'urban', 'asphalt'],
      primaryComponent: 'Plaza Ground & 5 Skyscraper Array',
      components: ['reflective_ground', 'skyscrapers', 'holographic_monument', 'street_beacons', 'neon_accents'],
      defaultDimensions: { groundSize: 40.0, towerCount: 5, maxHeight: 18.0 },
      defaultPBRStyle: 'cyber-circuit',
      defaultThemeColor: '#00f0ff',
      defaultSecColor: '#f43f5e',
      tags: ['scene', 'cyberpunk', 'city', 'megacity', 'environment'],
      samplePrompts: [
        'Cyberpunk city plaza scene with skyscrapers and neon ground',
        'Cyberpunk Megacity Plaza scene with neon skyscrapers, reflective asphalt, and holographic monument'
      ]
    },
    {
      id: 'deep_space_station',
      name: 'Deep Space Nebula Observatory Station',
      category: 'Scenes',
      description: 'Full 3D cosmos scene with central rotating orbital torus station, dual solar array wings, pulsing fusion core, and 24 orbiting asteroids.',
      keywords: ['scene', 'space', 'station', 'nebula', 'cosmos', 'asteroid', 'orbit', 'solar', 'torus', 'deep space', 'observatory'],
      primaryComponent: 'Orbital Torus Station & Asteroid Belt',
      components: ['orbital_torus_station', 'solar_array_wings', 'pulsing_fusion_core', '24_orbiting_asteroids'],
      defaultDimensions: { torusRadius: 6.0, asteroidCount: 24, beltRadius: 16.0 },
      defaultPBRStyle: 'brushed-titanium',
      defaultThemeColor: '#38bdf8',
      defaultSecColor: '#c084fc',
      tags: ['scene', 'space', 'station', 'asteroids', 'cosmos'],
      samplePrompts: [
        'Deep space station scene with asteroid belt and solar arrays',
        'Deep space nebula space station scene with asteroid belt and orbital torus'
      ]
    },
    {
      id: 'alien_crystalline_desert',
      name: 'Alien Crystalline Desert & Dual Moons',
      category: 'Scenes',
      description: 'Extraterrestrial dune expanse with Simplex noise undulating sand, phosphorescent crystal obelisks, and orbiting twin celestial moons.',
      keywords: ['scene', 'desert', 'alien', 'moon', 'dune', 'crystal', 'obelisk', 'sand', 'extraterrestrial', 'moons'],
      primaryComponent: 'Dune Terrain & Crystal Obelisks',
      components: ['noise_dune_terrain', 'crystal_obelisks', 'twin_celestial_moons', 'satellite_shards'],
      defaultDimensions: { terrainSize: 45.0, obeliskCount: 7, moonCount: 2 },
      defaultPBRStyle: 'damascus-steel',
      defaultThemeColor: '#e8c872',
      defaultSecColor: '#c084fc',
      tags: ['scene', 'alien', 'desert', 'crystal', 'moons', 'environment'],
      samplePrompts: [
        'Alien Crystalline Desert with Dual Moons scene with phosphorescent obelisks and dunes',
        'Alien crystalline desert scene with sand dunes and crystal spires'
      ]
    },
    {
      id: 'sunken_cyber_atlantis',
      name: 'Sunken Cyber Atlantis Trench',
      category: 'Scenes',
      description: 'Abyssal ocean floor landscape with hydrothermal smoking vents, bioluminescent coral polyps, and submerged ancient alchemical ruins.',
      keywords: ['scene', 'atlantis', 'trench', 'reef', 'sunken', 'subsea', 'underwater', 'ocean', 'vents', 'hydrothermal', 'coral', 'abyss'],
      primaryComponent: 'Abyssal Trench & Hydrothermal Vents',
      components: ['abyssal_trench_floor', 'hydrothermal_vents', 'bioluminescent_corals', 'submerged_ruins'],
      defaultDimensions: { floorSize: 40.0, ventCount: 4, coralCount: 12 },
      defaultPBRStyle: 'bio-organic',
      defaultThemeColor: '#34d399',
      defaultSecColor: '#00f0ff',
      tags: ['scene', 'atlantis', 'underwater', 'ocean', 'trench', 'bio'],
      samplePrompts: [
        'Sunken Cyber Atlantis Trench with Bioluminescent Reefs and hydrothermal vents',
        'Underwater abyssal trench scene with glowing coral and sunken ruins'
      ]
    },
    {
      id: 'volcanic_magma_forge',
      name: 'Volcanic Magma Forge & Basalt Caldera',
      category: 'Scenes',
      description: 'Volcanic geothermal environment featuring fractured basalt caldera, glowing molten lava rivers, and geothermal extraction pylons.',
      keywords: ['scene', 'volcano', 'magma', 'forge', 'lava', 'caldera', 'basalt', 'molten', 'geothermal', 'pylons'],
      primaryComponent: 'Basalt Caldera & Molten Magma Streams',
      components: ['basalt_caldera', 'molten_lava_streams', 'geothermal_pylons', 'forge_altar'],
      defaultDimensions: { calderaRadius: 20.0, pylonCount: 6, riverCount: 3 },
      defaultPBRStyle: 'cyber-circuit',
      defaultThemeColor: '#ff3366',
      defaultSecColor: '#f59e0b',
      tags: ['scene', 'volcano', 'magma', 'forge', 'lava', 'fire'],
      samplePrompts: [
        'Volcanic Forge with Molten Magma Streams scene and geothermal pylons',
        'Basalt caldera volcano scene with glowing lava rivers'
      ]
    },
    {
      id: 'matrix_holodeck',
      name: 'Quantum Matrix Holodeck Cyber Grid',
      category: 'Scenes',
      description: 'Infinite green phosphor digital holodeck grid with towering data matrix pillars and floating procedural voxel cubes.',
      keywords: ['scene', 'matrix', 'holodeck', 'grid', 'data', 'towers', 'cyber grid', 'green', 'voxels', 'digital'],
      primaryComponent: 'Infinite Cyber Grid & Data Towers',
      components: ['neon_coordinate_grid', 'data_towers', 'floating_voxel_cubes', 'quantum_conduits'],
      defaultDimensions: { gridSize: 50.0, towerCount: 12, cubeCount: 20 },
      defaultPBRStyle: 'bio-organic',
      defaultThemeColor: '#34d399',
      defaultSecColor: '#10b981',
      tags: ['scene', 'matrix', 'holodeck', 'cyber', 'grid', 'data'],
      samplePrompts: [
        'Quantum Matrix Holodeck cyber grid scene with green data towers and floating holographic cubes',
        'Matrix cyber grid holodeck scene with glowing neon coordinates'
      ]
    },
    {
      id: 'scifi_hangar_bay',
      name: 'Mech Hangar Bay & Launch Deck',
      category: 'Scenes',
      description: 'Industrial starship and mech hangar bay featuring reinforced runway deck, overhead gantry crane, blast shields, and runway guidance lights.',
      keywords: ['scene', 'hangar', 'launch', 'deck', 'mech', 'bay', 'gantry', 'crane', 'runway', 'beacons', 'industrial'],
      primaryComponent: 'Runway Deck & Overhead Gantry Crane',
      components: ['runway_deck', 'gantry_crane', 'blast_shields', 'guidance_beacons', 'tool_racks'],
      defaultDimensions: { deckLength: 30.0, deckWidth: 15.0, gantryHeight: 8.0 },
      defaultPBRStyle: 'brushed-titanium',
      defaultThemeColor: '#38bdf8',
      defaultSecColor: '#fbbf24',
      tags: ['scene', 'hangar', 'industrial', 'mech', 'launch', 'deck'],
      samplePrompts: [
        'Sci-Fi Mech Hangar Bay launch deck scene with overhead gantry crane and landing beacons',
        'Starship hangar bay scene with launch runway and maintenance cranes'
      ]
    },
    {
      id: 'crystal_sky_islands',
      name: 'Floating Celestial Crystal Islands',
      category: 'Scenes',
      description: 'Floating sky archipelago landscape with inverted rock islands, phosphorescent crystal spires, and suspended gravity anchor chains.',
      keywords: ['scene', 'island', 'islands', 'sky', 'floating', 'landscape', 'crystal', 'celestial', 'spires', 'clouds', 'rocks'],
      primaryComponent: 'Floating Rock Islands & Crystal Spires',
      components: ['floating_islands', 'crystal_clusters', 'gravity_anchor_chains', 'satellite_boulders'],
      defaultDimensions: { islandCount: 5, maxRadius: 8.0, elevation: 12.0 },
      defaultPBRStyle: 'damascus-steel',
      defaultThemeColor: '#e8c872',
      defaultSecColor: '#38bdf8',
      tags: ['scene', 'islands', 'sky', 'floating', 'crystal', 'landscape'],
      samplePrompts: [
        'Floating celestial crystal islands landscape scene with crystal spires and satellite rocks',
        'Floating sky islands scene with glowing crystals and cloud canopy'
      ]
    }
  ];

  // Map templates by ID for instant O(1) lookup
  var TEMPLATE_MAP = {};
  for (var ti = 0; ti < TEMPLATE_VAULT.length; ti++) {
    TEMPLATE_MAP[TEMPLATE_VAULT[ti].id] = TEMPLATE_VAULT[ti];
  }

  // =========================================================================
  // 3. SEMANTIC VECTOR RETRIEVAL & HYBRID RANKING ENGINE
  // =========================================================================

  /**
   * Precomputes corpus document frequencies and sparse feature vectors for all templates
   */
  var CorpusIndex = (function buildCorpusIndex() {
    var docCount = TEMPLATE_VAULT.length;
    var dfMap = {}; // Term Document Frequency
    var docVectors = {}; // Template ID -> Vector { term: weight }

    // 1. Collect all terms for each template
    for (var i = 0; i < docCount; i++) {
      var tpl = TEMPLATE_VAULT[i];
      var textCorpus = [
        tpl.name,
        tpl.category,
        tpl.description,
        tpl.primaryComponent,
        tpl.keywords.join(' '),
        tpl.components.join(' '),
        tpl.tags.join(' '),
        tpl.samplePrompts.join(' ')
      ].join(' ');

      var tokens = tokenize(textCorpus, { removeStopWords: true, stem: true });
      var nGrams = extractNGrams(tokens, 2);
      var allFeatures = tokens.concat(nGrams);

      var uniqueTerms = new Set(allFeatures);
      uniqueTerms.forEach(function (term) {
        dfMap[term] = (dfMap[term] || 0) + 1;
      });

      // Count term frequencies within this document
      var tfMap = {};
      for (var f = 0; f < allFeatures.length; f++) {
        var term = allFeatures[f];
        tfMap[term] = (tfMap[term] || 0) + 1;
      }
      docVectors[tpl.id] = tfMap;
    }

    // 2. Compute TF-IDF weights and normalize vector lengths
    var normalizedVectors = {};
    for (var tplId in docVectors) {
      var tf = docVectors[tplId];
      var vec = {};
      var sumSq = 0;

      for (var term in tf) {
        var idf = Math.log(1 + (docCount / (dfMap[term] || 1)));
        var tfVal = 1 + Math.log(tf[term]);
        var weight = tfVal * idf;
        vec[term] = weight;
        sumSq += weight * weight;
      }

      var norm = Math.sqrt(sumSq) || 1;
      for (var t in vec) {
        vec[t] /= norm;
      }
      normalizedVectors[tplId] = vec;
    }

    return {
      docCount: docCount,
      dfMap: dfMap,
      docVectors: normalizedVectors
    };
  })();

  /**
   * Vectorizes arbitrary user query text using the corpus IDF weights
   */
  function vectorizeQuery(queryTokensAndNGrams) {
    var tfMap = {};
    for (var i = 0; i < queryTokensAndNGrams.length; i++) {
      var term = queryTokensAndNGrams[i];
      tfMap[term] = (tfMap[term] || 0) + 1;
    }

    var vec = {};
    var sumSq = 0;
    for (var term in tfMap) {
      var df = CorpusIndex.dfMap[term] || 1;
      var idf = Math.log(1 + (CorpusIndex.docCount / df));
      var tfVal = 1 + Math.log(tfMap[term]);
      var weight = tfVal * idf;
      vec[term] = weight;
      sumSq += weight * weight;
    }

    var norm = Math.sqrt(sumSq) || 1;
    for (var t in vec) {
      vec[t] /= norm;
    }
    return vec;
  }

  /**
   * Cosine similarity between two unit-normalized sparse vectors
   */
  function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB) return 0;
    var dot = 0;
    for (var term in vecA) {
      if (vecB[term]) {
        dot += vecA[term] * vecB[term];
      }
    }
    return Math.max(0, Math.min(1, dot));
  }

  /**
   * Jaccard token overlap similarity between two sets of tokens
   */
  function jaccardSimilarity(tokensA, tokensB) {
    if (!tokensA || !tokensB || !tokensA.length || !tokensB.length) return 0;
    var setA = new Set(tokensA);
    var setB = new Set(tokensB);
    var intersection = 0;

    setA.forEach(function (token) {
      if (setB.has(token)) intersection++;
    });

    var union = setA.size + setB.size - intersection;
    if (union <= 0) return 0;
    return intersection / union;
  }

  /**
   * Match & Retrieve best CAD templates ranked by hybrid semantic score
   */
  function match(promptText, options) {
    options = options || {};
    var topK = options.topK || 5;
    var minScore = options.minScore || 0.05;

    if (!promptText || typeof promptText !== 'string' || !promptText.trim()) {
      // Return top popular default templates
      return TEMPLATE_VAULT.slice(0, topK).map(function (tpl) {
        return {
          template: tpl,
          score: 1.0,
          confidence: '100%',
          matchReasons: ['Default Featured Template'],
          extractedParams: extractDimensions(tpl.samplePrompts[0]),
          materials: extractMaterialsAndColors(tpl.samplePrompts[0])
        };
      });
    }

    var queryTokens = tokenize(promptText, { removeStopWords: true, stem: true });
    var queryNGrams = extractNGrams(queryTokens, 2);
    var allQueryFeatures = queryTokens.concat(queryNGrams);
    var queryVec = vectorizeQuery(allQueryFeatures);

    var dimensions = extractDimensions(promptText);
    var materials = extractMaterialsAndColors(promptText);
    var pLower = promptText.toLowerCase();

    var results = [];

    for (var i = 0; i < TEMPLATE_VAULT.length; i++) {
      var tpl = TEMPLATE_VAULT[i];
      var tplVec = CorpusIndex.docVectors[tpl.id];
      var cosSim = cosineSimilarity(queryVec, tplVec);

      // Query Coverage: fraction of query terms present in document
      var matchedQueryWeight = 0;
      var totalQueryWeight = 0;
      for (var qTerm in queryVec) {
        totalQueryWeight += queryVec[qTerm];
        if (tplVec[qTerm]) {
          matchedQueryWeight += queryVec[qTerm];
        }
      }
      var queryCoverage = totalQueryWeight > 0 ? (matchedQueryWeight / totalQueryWeight) : 0;

      // Jaccard token overlap on keywords
      var tplKeywordsStemmed = tpl.keywords.map(stem);
      var jaccardSim = jaccardSimilarity(queryTokens, tplKeywordsStemmed);

      // Direct keyword hits bonus
      var keywordHits = [];
      for (var k = 0; k < tpl.keywords.length; k++) {
        var kw = tpl.keywords[k];
        if (pLower.includes(kw)) {
          keywordHits.push(kw);
        }
      }

      var exactBonus = Math.min(0.5, keywordHits.length * 0.15);

      // Category / Scene detection bonus
      var categoryBonus = 0;
      if (tpl.category === 'Scenes' && (pLower.includes('scene') || pLower.includes('environment') || pLower.includes('landscape') || pLower.includes('plaza') || pLower.includes('station'))) {
        categoryBonus += 0.15;
      }
      if (tpl.category === 'Weapons' && (pLower.includes('weapon') || pLower.includes('rifle') || pLower.includes('sword') || pLower.includes('blade') || pLower.includes('gun') || pLower.includes('cannon') || pLower.includes('shield'))) {
        categoryBonus += 0.12;
      }
      if (tpl.category === 'Vehicles' && (pLower.includes('vehicle') || pLower.includes('ship') || pLower.includes('fighter') || pLower.includes('speeder') || pLower.includes('drone') || pLower.includes('freighter'))) {
        categoryBonus += 0.12;
      }
      if (tpl.category === 'Sacred Math' && (pLower.includes('4d') || pLower.includes('tesseract') || pLower.includes('manifold') || pLower.includes('fibonacci') || pLower.includes('gear') || pLower.includes('superquadric') || pLower.includes('klein') || pLower.includes('mobius') || pLower.includes('metatron'))) {
        categoryBonus += 0.15;
      }
      if (tpl.category === 'Mechs' && (pLower.includes('mech') || pLower.includes('robot') || pLower.includes('walker') || pLower.includes('titan') || pLower.includes('exoskeleton') || pLower.includes('turret'))) {
        categoryBonus += 0.12;
      }
      if (tpl.category === 'Creatures' && (pLower.includes('dragon') || pLower.includes('wyrm') || pLower.includes('wolf') || pLower.includes('beast') || pLower.includes('creature') || pLower.includes('organoid') || pLower.includes('metaball'))) {
        categoryBonus += 0.15;
      }

      // Hybrid Weighting Formula
      // Score combines Query Coverage (40%), Cosine Sim (25%), Jaccard Token Overlap (15%), Keyword Bonus (10%), and Domain Category (10%)
      var hybridScore = (0.40 * queryCoverage) + (0.25 * Math.min(1.0, cosSim * 2.0)) + (0.15 * jaccardSim) + (0.10 * Math.min(1.0, exactBonus * 2.0)) + (0.10 * Math.min(1.0, categoryBonus * 2.0));
      hybridScore = Math.max(0.0, Math.min(1.0, hybridScore));

      if (hybridScore >= minScore || keywordHits.length > 0) {
        var reasons = [];
        if (keywordHits.length > 0) reasons.push('Matched keywords: ' + keywordHits.slice(0, 4).join(', '));
        if (queryCoverage > 0.4) reasons.push('Term coverage: ' + Math.round(queryCoverage * 100) + '%');
        if (cosSim > 0.2) reasons.push('Vector affinity: ' + Math.round(cosSim * 100) + '%');
        if (jaccardSim > 0.2) reasons.push('Token overlap: ' + Math.round(jaccardSim * 100) + '%');
        if (categoryBonus > 0) reasons.push('Archetype domain (' + tpl.category + ')');

        results.push({
          template: tpl,
          score: hybridScore,
          cosineScore: cosSim,
          queryCoverage: queryCoverage,
          jaccardScore: jaccardSim,
          confidence: Math.round(hybridScore * 100) + '%',
          keywordHits: keywordHits,
          matchReasons: reasons.length ? reasons : ['General Semantic Association'],
          extractedParams: dimensions,
          materials: materials
        });
      }
    }

    // Sort descending by score
    results.sort(function (a, b) {
      return b.score - a.score;
    });

    return results.slice(0, topK);
  }

  /**
   * Intelligently decompose arbitrary natural language prompt into full CAD blueprint
   */
  function decompose(promptText) {
    var matches = match(promptText, { topK: 3 });
    var topMatch = matches && matches.length > 0 ? matches[0] : null;
    var tpl = topMatch ? topMatch.template : TEMPLATE_VAULT[0];

    var dimensions = extractDimensions(promptText);
    var materials = extractMaterialsAndColors(promptText);

    // Merge default template dimensions with prompt-extracted dimensions
    var finalDimensions = Object.assign({}, tpl.defaultDimensions);
    if (dimensions.scale !== 1.0) finalDimensions.scale = dimensions.scale;
    if (dimensions.count !== null) finalDimensions.count = dimensions.count;
    if (dimensions.radius !== null) finalDimensions.radius = dimensions.radius;
    if (dimensions.length !== null) finalDimensions.length = dimensions.length;
    if (dimensions.wireframe) finalDimensions.wireframe = true;

    // Component decomposition list
    var componentsToSynthesize = tpl.components.slice();

    return {
      prompt: promptText,
      primaryArchetype: tpl.category,
      templateId: tpl.id,
      templateName: tpl.name,
      description: tpl.description,
      primaryComponent: tpl.primaryComponent,
      components: componentsToSynthesize,
      dimensions: finalDimensions,
      materials: materials,
      sacredMath: {
        phi: PHI,
        goldenAngle: GOLDEN_ANGLE,
        isGoldenRatioAligned: dimensions.goldenRatio || tpl.category === 'Sacred Math'
      },
      matchConfidence: topMatch ? topMatch.confidence : '50%',
      matchScore: topMatch ? topMatch.score : 0.5,
      alternativeMatches: matches.slice(1).map(function (m) {
        return { id: m.template.id, name: m.template.name, score: m.score, confidence: m.confidence };
      })
    };
  }

  // =========================================================================
  // 4. REAL-TIME PROMPT AUTOCOMPLETE & QUERY EXPANSION ENGINE
  // =========================================================================

  /**
   * Suggest autocomplete phrases, archetype starters, and stylistic modifiers
   */
  function getSuggestions(partialText, maxResults) {
    maxResults = maxResults || 8;
    var query = (partialText || '').toLowerCase().trim();
    var suggestions = [];
    var seen = new Set();

    function addSuggestion(text, category, badge, score) {
      if (!text || seen.has(text.toLowerCase())) return;
      seen.add(text.toLowerCase());
      suggestions.push({
        text: text,
        category: category || 'General',
        badge: badge || '✨ Suggested',
        score: score || 1.0
      });
    }

    if (!query) {
      // Empty prompt: return featured starter prompts across diverse categories
      addSuggestion('Synthesize a glowing quantum reactor core with magnetic accelerator rings and iridescent refraction', 'Gadgets', '⚡ Featured', 1.0);
      addSuggestion('Cyberpunk plasma sniper rifle with glowing energy coils and carbon stock', 'Weapons', '🔥 Weapon', 0.98);
      addSuggestion('Ancient damascus steel katana blade with folded wave pattern', 'Weapons', '⚔️ Damascus', 0.96);
      addSuggestion('Supersonic starfighter ship with twin thruster nozzles and swept wings', 'Vehicles', '🚀 Aerospace', 0.95);
      addSuggestion('4D Tesseract hypercube matrix with rotating stereographic 4D projection', 'Sacred Math', '🧊 4D Math', 0.94);
      addSuggestion('Cyberpunk Megacity Plaza scene with neon skyscrapers, reflective asphalt, and holographic monument', 'Scenes', '🏙️ Scene', 0.93);
      addSuggestion('Deep space nebula space station scene with asteroid belt and orbital torus', 'Scenes', '🌌 Cosmos', 0.92);
      addSuggestion('Faceted crystal spire monolith with orbiting Fibonacci shards and noise displacement', 'Architecture', '💎 Crystal', 0.91);
      return suggestions.slice(0, maxResults);
    }

    var tokens = tokenize(query, { removeStopWords: false, stem: false });
    var lastToken = tokens[tokens.length - 1] || '';

    // 1. Direct Sample Prompt Substring / Prefix Matching
    for (var i = 0; i < TEMPLATE_VAULT.length; i++) {
      var tpl = TEMPLATE_VAULT[i];
      for (var sp = 0; sp < tpl.samplePrompts.length; sp++) {
        var sample = tpl.samplePrompts[sp];
        var sampleLower = sample.toLowerCase();
        if (sampleLower.includes(query)) {
          addSuggestion(sample, tpl.category, '🎯 Exact Match', 0.95);
        }
      }
    }

    // 2. Template Keyword & Modifier Expansions
    var matchedTemplates = match(query, { topK: 3, minScore: 0.1 });
    for (var m = 0; m < matchedTemplates.length; m++) {
      var matchItem = matchedTemplates[m];
      var t = matchItem.template;

      // Generate dynamic modifier combinations based on template features
      var baseName = query;
      var styleModifiers = [
        'with glowing energy coils and carbon fiber stock',
        'with titanium plating and holographic HUD optics',
        'with damascus steel folded pattern and golden accents',
        'with bio-organic vascular veins and cellular membrane',
        'with 4D stereographic projection and glass refraction',
        'with Fibonacci phyllotaxis golden spiral shards',
        'with twin vectoring thrusters and swept delta wings',
        'with magnetic accelerator torus rings and plasma core'
      ];

      for (var s = 0; s < styleModifiers.length; s++) {
        var mod = styleModifiers[s];
        if (!query.includes(mod.slice(5, 15))) {
          var expanded = query + ' ' + mod;
          addSuggestion(expanded, t.category, '⚡ Enhanced', 0.85 - (s * 0.02));
        }
      }
    }

    // 3. Archetype Starter Prompts if matching category or keywords
    for (var k = 0; k < TEMPLATE_VAULT.length; k++) {
      var template = TEMPLATE_VAULT[k];
      var hasKw = template.keywords.some(function (kw) {
        return kw.startsWith(lastToken) || query.includes(kw);
      });
      if (hasKw) {
        for (var p = 0; p < template.samplePrompts.length; p++) {
          addSuggestion(template.samplePrompts[p], template.category, '📐 Blueprint', 0.80);
        }
      }
    }

    return suggestions.slice(0, maxResults);
  }

  // =========================================================================
  // 5. CONTINUOUS PROMPT LEARNING & LOCAL RECIPE VAULT
  // =========================================================================

  var VAULT_STORAGE_KEY = 'zoth_nexus3d_recipes_vault';
  var HISTORY_STORAGE_KEY = 'zoth_nexus3d_gen_history';

  var RecipeVault = {
    /**
     * Get all saved prompt recipes
     */
    getAll: function () {
      var data = Storage.getItem(VAULT_STORAGE_KEY);
      var parsed = [];
      try {
        if (data) parsed = JSON.parse(data);
      } catch (e) {}
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.seedDefaults();
        data = Storage.getItem(VAULT_STORAGE_KEY);
        try { parsed = JSON.parse(data); } catch (e) {}
      }
      return Array.isArray(parsed) ? parsed : [];
    },

    /**
     * Save or update a recipe
     */
    save: function (recipe) {
      if (!recipe || !recipe.prompt) return null;
      var recipes = this.getAll();

      var id = recipe.id || ('recipe_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6));
      var existingIndex = -1;
      for (var i = 0; i < recipes.length; i++) {
        if (recipes[i].id === id) {
          existingIndex = i;
          break;
        }
      }

      var decomp = decompose(recipe.prompt);
      var record = {
        id: id,
        name: recipe.name || tplNameFallback(decomp.templateName, recipe.prompt),
        prompt: recipe.prompt.trim(),
        category: recipe.category || decomp.primaryArchetype,
        templateId: recipe.templateId || decomp.templateId,
        components: recipe.components || decomp.components,
        dimensions: recipe.dimensions || decomp.dimensions,
        materials: recipe.materials || decomp.materials,
        tags: recipe.tags || [decomp.primaryArchetype.toLowerCase(), 'custom'],
        notes: recipe.notes || '',
        favorite: !!recipe.favorite,
        createdAt: existingIndex >= 0 ? recipes[existingIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        recipes[existingIndex] = record;
      } else {
        recipes.unshift(record);
      }

      Storage.setItem(VAULT_STORAGE_KEY, JSON.stringify(recipes));
      return record;
    },

    /**
     * Get recipe by ID
     */
    getById: function (id) {
      var recipes = this.getAll();
      for (var i = 0; i < recipes.length; i++) {
        if (recipes[i].id === id) return recipes[i];
      }
      return null;
    },

    /**
     * Delete recipe by ID
     */
    delete: function (id) {
      var recipes = this.getAll();
      var filtered = recipes.filter(function (r) { return r.id !== id; });
      Storage.setItem(VAULT_STORAGE_KEY, JSON.stringify(filtered));
      return filtered.length < recipes.length;
    },

    /**
     * Toggle favorite bookmark status
     */
    toggleFavorite: function (id) {
      var recipes = this.getAll();
      for (var i = 0; i < recipes.length; i++) {
        if (recipes[i].id === id) {
          recipes[i].favorite = !recipes[i].favorite;
          recipes[i].updatedAt = new Date().toISOString();
          Storage.setItem(VAULT_STORAGE_KEY, JSON.stringify(recipes));
          return recipes[i].favorite;
        }
      }
      return false;
    },

    /**
     * Search & Filter recipes
     */
    search: function (query, options) {
      options = options || {};
      var recipes = this.getAll();
      var category = options.category;
      var onlyFavorites = options.onlyFavorites;
      var tag = options.tag;
      var q = (query || '').toLowerCase().trim();

      return recipes.filter(function (r) {
        if (onlyFavorites && !r.favorite) return false;
        if (category && r.category !== category) return false;
        if (tag && (!r.tags || !r.tags.includes(tag))) return false;
        if (q) {
          var matchName = r.name && r.name.toLowerCase().includes(q);
          var matchPrompt = r.prompt && r.prompt.toLowerCase().includes(q);
          var matchCat = r.category && r.category.toLowerCase().includes(q);
          var matchTags = r.tags && r.tags.some(function (t) { return t.toLowerCase().includes(q); });
          if (!matchName && !matchPrompt && !matchCat && !matchTags) return false;
        }
        return true;
      });
    },

    /**
     * Record generation event for continuous prompt learning
     */
    recordGeneration: function (promptText, metadata) {
      if (!promptText || !promptText.trim()) return null;
      var history = this.getHistory();
      var decomp = decompose(promptText);

      var item = {
        id: 'gen_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        prompt: promptText.trim(),
        templateId: decomp.templateId,
        category: decomp.primaryArchetype,
        confidence: decomp.matchConfidence,
        pbrStyle: decomp.materials.pbrStyle,
        themeColor: decomp.materials.themeColor,
        timestamp: new Date().toISOString(),
        metadata: metadata || {}
      };

      history.unshift(item);
      // Keep up to 100 historical records
      if (history.length > 100) {
        history = history.slice(0, 100);
      }

      Storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      return item;
    },

    /**
     * Get generation history
     */
    getHistory: function (limit) {
      limit = limit || 50;
      var data = Storage.getItem(HISTORY_STORAGE_KEY);
      try {
        var parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed.slice(0, limit) : [];
      } catch (e) {
        return [];
      }
    },

    /**
     * Clear generation history
     */
    clearHistory: function () {
      Storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
    },

    /**
     * Export all recipes to formatted JSON string
     */
    exportJSON: function () {
      var recipes = this.getAll();
      return JSON.stringify({
        version: VERSION,
        exportedAt: new Date().toISOString(),
        totalRecipes: recipes.length,
        recipes: recipes
      }, null, 2);
    },

    /**
     * Import recipes from JSON string
     */
    importJSON: function (jsonString) {
      try {
        var data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
        var incoming = Array.isArray(data) ? data : (data.recipes || []);
        var current = this.getAll();
        var idMap = {};
        for (var c = 0; c < current.length; c++) {
          idMap[current[c].id] = c;
        }

        var importedCount = 0;
        for (var i = 0; i < incoming.length; i++) {
          var inc = incoming[i];
          if (!inc.prompt) continue;
          if (idMap[inc.id] !== undefined) {
            current[idMap[inc.id]] = inc;
          } else {
            current.push(inc);
          }
          importedCount++;
        }

        Storage.setItem(VAULT_STORAGE_KEY, JSON.stringify(current));
        return { success: true, count: importedCount, total: current.length };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    /**
     * Get summary analytics
     */
    getStats: function () {
      var recipes = this.getAll();
      var history = this.getHistory(100);
      var categoryCounts = {};
      var favorites = 0;

      for (var i = 0; i < recipes.length; i++) {
        var cat = recipes[i].category || 'Uncategorized';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        if (recipes[i].favorite) favorites++;
      }

      var popularArchetypes = {};
      for (var h = 0; h < history.length; h++) {
        var hCat = history[h].category || 'Uncategorized';
        popularArchetypes[hCat] = (popularArchetypes[hCat] || 0) + 1;
      }

      return {
        totalRecipes: recipes.length,
        favoritesCount: favorites,
        categoryCounts: categoryCounts,
        totalGenerations: history.length,
        popularArchetypes: popularArchetypes
      };
    },

    /**
     * Seed curated starter recipes
     */
    seedDefaults: function () {
      var starters = [
        {
          name: 'Overclocked Railgun Sniper',
          prompt: 'Plasma sniper rifle with glowing energy coils, carbon stock, and titanium barrel shroud',
          category: 'Weapons',
          favorite: true,
          tags: ['weapon', 'sniper', 'railgun', 'carbon']
        },
        {
          name: 'Valkyrie Aerospace Interceptor',
          prompt: 'Supersonic starfighter ship with twin thruster nozzles, swept wings, and gold canards',
          category: 'Vehicles',
          favorite: true,
          tags: ['vehicle', 'starfighter', 'aerospace', 'speed']
        },
        {
          name: 'Tokamak Quantum Reactor',
          prompt: 'Synthesize a glowing quantum reactor core with magnetic accelerator rings and iridescent refraction',
          category: 'Gadgets',
          favorite: true,
          tags: ['reactor', 'quantum', 'fusion', 'energy']
        },
        {
          name: '4D Tesseract Hypercube',
          prompt: '4D Tesseract hypercube matrix with rotating stereographic 4D projection and glass refraction',
          category: 'Sacred Math',
          favorite: false,
          tags: ['sacred', '4d', 'tesseract', 'math']
        },
        {
          name: 'Ouroboros Damascus Katana',
          prompt: 'Ancient damascus steel katana blade with folded wave pattern and gold tsuba guard',
          category: 'Weapons',
          favorite: true,
          tags: ['katana', 'sword', 'damascus', 'gold']
        },
        {
          name: 'Cyberpunk Megacity Plaza',
          prompt: 'Cyberpunk Megacity Plaza scene with neon skyscrapers, reflective asphalt, and holographic monument',
          category: 'Scenes',
          favorite: false,
          tags: ['scene', 'cyberpunk', 'city', 'megacity']
        }
      ];

      var records = [];
      for (var s = 0; s < starters.length; s++) {
        var starter = starters[s];
        var decomp = decompose(starter.prompt);
        records.push({
          id: 'default_recipe_' + (s + 1),
          name: starter.name,
          prompt: starter.prompt,
          category: starter.category,
          templateId: decomp.templateId,
          components: decomp.components,
          dimensions: decomp.dimensions,
          materials: decomp.materials,
          tags: starter.tags,
          notes: 'Curated CAD-grade blueprint template',
          favorite: starter.favorite,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      Storage.setItem(VAULT_STORAGE_KEY, JSON.stringify(records));
    }
  };

  function tplNameFallback(templateName, prompt) {
    if (templateName) return templateName;
    if (!prompt) return 'Custom Geometry';
    var words = prompt.split(/\s+/).slice(0, 4).join(' ');
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  // =========================================================================
  // 6. PUBLIC API EXPORTS
  // =========================================================================

  return {
    VERSION: VERSION,
    PHI: PHI,
    GOLDEN_ANGLE: GOLDEN_ANGLE,
    TAU: TAU,

    // Tokenizer & NLP Utilities
    Tokenizer: {
      tokenize: tokenize,
      stem: stem,
      extractNGrams: extractNGrams,
      extractDimensions: extractDimensions,
      extractMaterialsAndColors: extractMaterialsAndColors,
      STOP_WORDS: STOP_WORDS,
      IRREGULAR_STEMS: IRREGULAR_STEMS
    },

    // Taxonomy & Catalog
    CATEGORIES: ARCHETYPE_CATEGORIES,
    TEMPLATES: TEMPLATE_VAULT,
    TEMPLATE_MAP: TEMPLATE_MAP,

    // Retrieval & Vector Engine
    RetrievalEngine: {
      match: match,
      decompose: decompose,
      vectorizeQuery: vectorizeQuery,
      cosineSimilarity: cosineSimilarity,
      jaccardSimilarity: jaccardSimilarity,
      CorpusIndex: CorpusIndex
    },

    // Real-time Autocomplete
    Autocomplete: {
      getSuggestions: getSuggestions
    },

    // Continuous Prompt Learning & Recipe Vault
    RecipeVault: RecipeVault,

    // High-Level Convenience Methods
    tokenize: tokenize,
    stem: stem,
    match: match,
    decompose: decompose,
    getSuggestions: getSuggestions,
    saveRecipe: function (recipe) { return RecipeVault.save(recipe); },
    getRecipes: function (filter) { return RecipeVault.search('', filter); },
    recordGeneration: function (prompt, meta) { return RecipeVault.recordGeneration(prompt, meta); }
  };
});
