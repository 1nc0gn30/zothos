const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Nexus3DKnowledge = require('./nexus-3d-knowledge.js');

// =========================================================================
// 1. ENGINE INITIALIZATION & MATHEMATICAL CONSTANTS
// =========================================================================

test('Nexus3DKnowledge engine initialization and constants', () => {
  assert.ok(Nexus3DKnowledge.VERSION.includes('vault'));
  assert.ok(Nexus3DKnowledge.PHI > 1.618 && Nexus3DKnowledge.PHI < 1.619);
  assert.ok(Nexus3DKnowledge.GOLDEN_ANGLE > 2.39 && Nexus3DKnowledge.GOLDEN_ANGLE < 2.41);
  assert.ok(Nexus3DKnowledge.TAU > 6.28 && Nexus3DKnowledge.TAU < 6.29);
  assert.ok(Array.isArray(Nexus3DKnowledge.CATEGORIES));
  assert.equal(Nexus3DKnowledge.CATEGORIES.length, 8);
  assert.ok(Array.isArray(Nexus3DKnowledge.TEMPLATES));
  assert.ok(Nexus3DKnowledge.TEMPLATES.length >= 20);
});

// =========================================================================
// 2. NATURAL LANGUAGE TOKENIZER & MORPHOLOGICAL STEMMER
// =========================================================================

test('Tokenizer splits, lowercases, and strips punctuation', () => {
  const text = 'Synthesize a high-tech glowing plasma shield generator with neon coils!';
  const tokens = Nexus3DKnowledge.Tokenizer.tokenize(text, { removeStopWords: false, stem: false });
  assert.ok(tokens.includes('high'));
  assert.ok(tokens.includes('tech'));
  assert.ok(tokens.includes('glowing'));
  assert.ok(tokens.includes('plasma'));
  assert.ok(tokens.includes('shield'));
  assert.ok(tokens.includes('generator'));
  assert.ok(tokens.includes('coils'));
});

test('Tokenizer filters common English and procedural stopwords', () => {
  const text = 'Please synthesize and generate a plasma rifle for me with the best details';
  const tokens = Nexus3DKnowledge.Tokenizer.tokenize(text, { removeStopWords: true, stem: false });
  assert.ok(!tokens.includes('please'));
  assert.ok(!tokens.includes('synthesize'));
  assert.ok(!tokens.includes('generate'));
  assert.ok(!tokens.includes('and'));
  assert.ok(!tokens.includes('a'));
  assert.ok(!tokens.includes('for'));
  assert.ok(!tokens.includes('me'));
  assert.ok(!tokens.includes('with'));
  assert.ok(!tokens.includes('the'));
  assert.ok(tokens.includes('plasma'));
  assert.ok(tokens.includes('rifle'));
  assert.ok(tokens.includes('details'));
});

test('Morphological stemmer normalizes CAD and English plurals/suffixes', () => {
  const stem = Nexus3DKnowledge.Tokenizer.stem;
  assert.equal(stem('rifles'), 'rifle');
  assert.equal(stem('matrices'), 'matrix');
  assert.equal(stem('vertices'), 'vertex');
  assert.equal(stem('crystals'), 'crystal');
  assert.equal(stem('spaceships'), 'spaceship');
  assert.equal(stem('nozzles'), 'nozzle');
  assert.equal(stem('hypercubes'), 'hypercube');
  assert.equal(stem('monoliths'), 'monolith');
  assert.equal(stem('glowing'), 'glow');
  assert.equal(stem('accelerated'), 'accelerat');
  assert.equal(stem('accelerator'), 'accelerat');
  assert.equal(stem('cylindrical'), 'cylinder');
  assert.equal(stem('stepped'), 'step');
});

test('Extract N-Grams generates unigrams, bigrams, and trigrams', () => {
  const tokens = ['plasma', 'sniper', 'rifle'];
  const ngrams = Nexus3DKnowledge.Tokenizer.extractNGrams(tokens, 2);
  assert.ok(ngrams.includes('plasma'));
  assert.ok(ngrams.includes('sniper'));
  assert.ok(ngrams.includes('rifle'));
  assert.ok(ngrams.includes('plasma_sniper'));
  assert.ok(ngrams.includes('sniper_rifle'));
});

// =========================================================================
// 3. PARAMETRIC DIMENSION & SHADER RECIPE EXTRACTION
// =========================================================================

test('extractDimensions detects numeric attributes, counts, and sacred flags', () => {
  const text = 'twin barrel railgun with 8 cooling fins scale 2.5x and golden ratio proportions in wireframe';
  const dims = Nexus3DKnowledge.Tokenizer.extractDimensions(text);
  assert.equal(dims.count, 2); // 'twin' -> 2
  assert.equal(dims.scale, 2.5);
  assert.equal(dims.goldenRatio, true);
  assert.equal(dims.wireframe, true);
});

test('extractMaterialsAndColors maps keywords to exact PBR shaders and palettes', () => {
  // Carbon fiber
  const cf = Nexus3DKnowledge.Tokenizer.extractMaterialsAndColors('High-speed racing vehicle with carbon fiber chassis');
  assert.equal(cf.pbrStyle, 'carbon-fiber');
  assert.equal(cf.metalness, 0.50);

  // Brushed titanium
  const ti = Nexus3DKnowledge.Tokenizer.extractMaterialsAndColors('Heavy mech walker with brushed titanium plating');
  assert.equal(ti.pbrStyle, 'brushed-titanium');
  assert.equal(ti.metalness, 0.95);

  // Damascus steel
  const dam = Nexus3DKnowledge.Tokenizer.extractMaterialsAndColors('Ancient damascus steel katana blade with gold tsuba');
  assert.equal(dam.pbrStyle, 'damascus-steel');
  assert.equal(dam.themeColor, '#e8c872');

  // Bio-organic
  const bio = Nexus3DKnowledge.Tokenizer.extractMaterialsAndColors('Alien bio-organic cellular entity with green veins');
  assert.equal(bio.pbrStyle, 'bio-organic');
  assert.equal(bio.themeColor, '#34d399');

  // Iridescent Hologram & Glass Transmission
  const holo = Nexus3DKnowledge.Tokenizer.extractMaterialsAndColors('Iridescent hologram warp gate with transparent glass horizon');
  assert.equal(holo.pbrStyle, 'iridescent-hologram');
  assert.equal(holo.isTransparent, true);
  assert.ok(holo.transmission > 0.8);
});

// =========================================================================
// 4. ARCHETYPE TAXONOMY & TEMPLATE CATALOG COMPLETENESS
// =========================================================================

test('Archetype taxonomy contains all 8 required categories and templates', () => {
  const expectedCategories = [
    'Weapons',
    'Vehicles',
    'Mechs',
    'Gadgets',
    'Architecture',
    'Creatures',
    'Sacred Math',
    'Scenes'
  ];

  expectedCategories.forEach(cat => {
    assert.ok(Nexus3DKnowledge.CATEGORIES.includes(cat), `Missing category: ${cat}`);
    const templatesInCat = Nexus3DKnowledge.TEMPLATES.filter(t => t.category === cat);
    assert.ok(templatesInCat.length >= 2, `Category ${cat} should have at least 2 templates`);
  });

  // Verify key templates exist in map
  assert.ok(Nexus3DKnowledge.TEMPLATE_MAP['plasma_sniper_rifle']);
  assert.ok(Nexus3DKnowledge.TEMPLATE_MAP['damascus_energy_katana']);
  assert.ok(Nexus3DKnowledge.TEMPLATE_MAP['supersonic_starfighter']);
  assert.ok(Nexus3DKnowledge.TEMPLATE_MAP['titan_assault_mech']);
  assert.ok(Nexus3DKnowledge.TEMPLATE_MAP['quantum_reactor_core']);
  assert.ok(Nexus3DKnowledge.TEMPLATE_MAP['omniverse_warp_gate']);
  assert.ok(Nexus3DKnowledge.TEMPLATE_MAP['cyberpunk_skyscraper']);
  assert.ok(Nexus3DKnowledge.TEMPLATE_MAP['cyber_dragon_wyrm']);
  assert.ok(Nexus3DKnowledge.TEMPLATE_MAP['tesseract_4d_hypercube']);
  assert.ok(Nexus3DKnowledge.TEMPLATE_MAP['calabi_yau_manifold']);
  assert.ok(Nexus3DKnowledge.TEMPLATE_MAP['involute_planetary_gear']);
  assert.ok(Nexus3DKnowledge.TEMPLATE_MAP['cyberpunk_megacity']);
  assert.ok(Nexus3DKnowledge.TEMPLATE_MAP['deep_space_station']);
});

// =========================================================================
// 5. SEMANTIC VECTOR RETRIEVAL & HYBRID RANKING ENGINE
// =========================================================================

test('Corpus index builds normalized TF-IDF document vectors', () => {
  const corpus = Nexus3DKnowledge.RetrievalEngine.CorpusIndex;
  assert.ok(corpus.docCount >= 20);
  assert.ok(Object.keys(corpus.dfMap).length > 50);

  const rifleVec = corpus.docVectors['plasma_sniper_rifle'];
  assert.ok(rifleVec);
  // Verify vector is normalized (length ~ 1)
  let normSq = 0;
  for (const term in rifleVec) {
    normSq += rifleVec[term] * rifleVec[term];
  }
  assert.ok(Math.abs(Math.sqrt(normSq) - 1.0) < 1e-3);
});

test('Cosine and Jaccard similarity functions behave accurately', () => {
  const cos = Nexus3DKnowledge.RetrievalEngine.cosineSimilarity;
  const jaccard = Nexus3DKnowledge.RetrievalEngine.jaccardSimilarity;

  const vecA = { plasma: 0.6, rifle: 0.8 };
  const vecB = { plasma: 0.6, rifle: 0.8 };
  const vecC = { sword: 1.0 };

  assert.ok(Math.abs(cos(vecA, vecB) - 1.0) < 1e-4);
  assert.equal(cos(vecA, vecC), 0.0);

  const tokensA = ['plasma', 'rifle', 'carbon'];
  const tokensB = ['plasma', 'rifle', 'titanium'];
  const j = jaccard(tokensA, tokensB);
  assert.equal(j, 2 / 4); // 2 overlap out of 4 union
});

test('Semantic matching accurately retrieves matching CAD templates across all domains', () => {
  // 1. Weapon query
  const resWeapon = Nexus3DKnowledge.match('plasma sniper rifle with glowing energy coils and carbon stock');
  assert.ok(resWeapon.length > 0);
  assert.equal(resWeapon[0].template.id, 'plasma_sniper_rifle');
  assert.equal(resWeapon[0].template.category, 'Weapons');
  assert.ok(resWeapon[0].score > 0.4);

  // 2. Vehicle query
  const resVehicle = Nexus3DKnowledge.match('Supersonic starfighter ship with twin thruster nozzles');
  assert.ok(resVehicle.length > 0);
  assert.equal(resVehicle[0].template.id, 'supersonic_starfighter');
  assert.equal(resVehicle[0].template.category, 'Vehicles');

  // 3. Mech query
  const resMech = Nexus3DKnowledge.match('Heavy titan battle mech walker with missile pods');
  assert.ok(resMech.length > 0);
  assert.equal(resMech[0].template.id, 'titan_assault_mech');
  assert.equal(resMech[0].template.category, 'Mechs');

  // 4. Sacred Math query
  const res4D = Nexus3DKnowledge.match('4D Tesseract hypercube matrix with rotating projection');
  assert.ok(res4D.length > 0);
  assert.equal(res4D[0].template.id, 'tesseract_4d_hypercube');
  assert.equal(res4D[0].template.category, 'Sacred Math');

  // 5. Environmental Scene query
  const resScene = Nexus3DKnowledge.match('Deep space station scene with asteroid belt and orbital torus');
  assert.ok(resScene.length > 0);
  assert.equal(resScene[0].template.id, 'deep_space_station');
  assert.equal(resScene[0].template.category, 'Scenes');
});

// =========================================================================
// 6. INTELLIGENT ARCHETYPE DECOMPOSITION
// =========================================================================

test('Archetype decomposition produces structured CAD assembly blueprint', () => {
  const prompt = 'Overclocked plasma sniper rifle with dual coils and carbon-fiber finish';
  const blueprint = Nexus3DKnowledge.decompose(prompt);

  assert.equal(blueprint.primaryArchetype, 'Weapons');
  assert.equal(blueprint.templateId, 'plasma_sniper_rifle');
  assert.ok(blueprint.components.length >= 4);
  assert.ok(blueprint.components.includes('accelerator_coils'));
  assert.equal(blueprint.materials.pbrStyle, 'carbon-fiber');
  assert.ok(blueprint.dimensions.length > 0);
  assert.equal(blueprint.dimensions.count, 2); // 'dual'
  assert.ok(blueprint.matchScore > 0.4);
});

test('Archetype decomposition handles sacred geometry proportions', () => {
  const prompt = 'Sacred Metatron cube with golden ratio phyllotaxis spiral constellation';
  const blueprint = Nexus3DKnowledge.decompose(prompt);

  assert.equal(blueprint.primaryArchetype, 'Sacred Math');
  assert.equal(blueprint.templateId, 'fibonacci_metatron_matrix');
  assert.equal(blueprint.sacredMath.isGoldenRatioAligned, true);
  assert.ok(blueprint.sacredMath.phi > 1.618);
});

// =========================================================================
// 7. REAL-TIME PROMPT AUTOCOMPLETE & QUERY EXPANSION
// =========================================================================

test('Autocomplete returns curated starter suggestions for empty query', () => {
  const suggestions = Nexus3DKnowledge.getSuggestions('', 6);
  assert.equal(suggestions.length, 6);
  assert.ok(suggestions.some(s => s.category === 'Gadgets'));
  assert.ok(suggestions.some(s => s.category === 'Weapons'));
  assert.ok(suggestions.some(s => s.category === 'Scenes'));
});

test('Autocomplete expands partial query with contextual modifiers and badges', () => {
  const suggestions = Nexus3DKnowledge.getSuggestions('plasma sniper', 5);
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.some(s => s.text.toLowerCase().includes('plasma sniper')));
  assert.ok(suggestions.some(s => s.badge.includes('Match') || s.badge.includes('Enhanced') || s.badge.includes('Blueprint')));
});

// =========================================================================
// 8. CONTINUOUS PROMPT LEARNING & LOCAL RECIPE VAULT
// =========================================================================

test('RecipeVault initializes with default seed recipes', () => {
  const vault = Nexus3DKnowledge.RecipeVault;
  const recipes = vault.getAll();
  assert.ok(recipes.length >= 5);
  assert.ok(recipes.some(r => r.name.includes('Railgun')));
  assert.ok(recipes.some(r => r.name.includes('Starfighter') || r.name.includes('Valkyrie')));
  assert.ok(recipes.some(r => r.name.includes('Reactor')));
});

test('RecipeVault allows saving, searching, and updating custom recipes', () => {
  const vault = Nexus3DKnowledge.RecipeVault;
  const customPrompt = 'Cybernetic spider drone with 6 articulated legs and titanium armor';
  
  const saved = vault.save({
    name: 'Stealth Hexapod Drone',
    prompt: customPrompt,
    tags: ['stealth', 'drone', 'custom', 'spider'],
    notes: 'Precision scout unit',
    favorite: true
  });

  assert.ok(saved.id);
  assert.equal(saved.name, 'Stealth Hexapod Drone');
  assert.equal(saved.category, 'Mechs');
  assert.equal(saved.favorite, true);

  // Search by text query
  const searchResults = vault.search('hexapod');
  assert.ok(searchResults.length >= 1);
  assert.equal(searchResults[0].id, saved.id);

  // Search by category filter
  const mechRecipes = vault.search('', { category: 'Mechs' });
  assert.ok(mechRecipes.some(r => r.id === saved.id));

  // Search by tag filter
  const stealthRecipes = vault.search('', { tag: 'stealth' });
  assert.ok(stealthRecipes.some(r => r.id === saved.id));

  // Toggle favorite
  const isFav = vault.toggleFavorite(saved.id);
  assert.equal(isFav, false);

  // Delete recipe
  const deleted = vault.delete(saved.id);
  assert.equal(deleted, true);
  assert.equal(vault.getById(saved.id), null);
});

test('RecipeVault tracks generation history and computes summary analytics', () => {
  const vault = Nexus3DKnowledge.RecipeVault;
  vault.clearHistory();

  vault.recordGeneration('Cyberpunk plasma katana with gold tsuba', { source: 'ui' });
  vault.recordGeneration('Deep space station scene with asteroid belt', { source: 'preset' });
  vault.recordGeneration('4D Tesseract hypercube matrix with glass refraction', { source: 'autocomplete' });

  const history = vault.getHistory();
  assert.equal(history.length, 3);
  assert.equal(history[0].category, 'Sacred Math');
  assert.equal(history[1].category, 'Scenes');
  assert.equal(history[2].category, 'Weapons');

  const stats = vault.getStats();
  assert.equal(stats.totalGenerations, 3);
  assert.ok(stats.totalRecipes >= 5);
  assert.ok(stats.popularArchetypes['Sacred Math'] >= 1);
  assert.ok(stats.popularArchetypes['Scenes'] >= 1);
});

test('RecipeVault supports full JSON export and import', () => {
  const vault = Nexus3DKnowledge.RecipeVault;
  const json = vault.exportJSON();
  assert.ok(json.includes('zoth_nexus3d') || json.includes('recipes') || json.includes('version'));

  const parsed = JSON.parse(json);
  assert.ok(parsed.recipes.length >= 5);

  const importResult = vault.importJSON(json);
  assert.equal(importResult.success, true);
  assert.ok(importResult.count >= 5);
});

// =========================================================================
// 9. EDGE CASES, ERROR RESILIENCE & ALL 8 ARCHETYPES TEST
// =========================================================================

test('Knowledge engine handles empty, null, and non-string inputs safely', () => {
  assert.deepEqual(Nexus3DKnowledge.Tokenizer.tokenize(null), []);
  assert.deepEqual(Nexus3DKnowledge.Tokenizer.tokenize(undefined), []);
  assert.deepEqual(Nexus3DKnowledge.Tokenizer.tokenize(''), []);
  assert.equal(Nexus3DKnowledge.Tokenizer.stem(null), '');
  assert.equal(Nexus3DKnowledge.Tokenizer.stem('a'), 'a');

  const emptyMatch = Nexus3DKnowledge.match('');
  assert.ok(Array.isArray(emptyMatch));
  assert.ok(emptyMatch.length > 0);

  const nullMatch = Nexus3DKnowledge.match(null);
  assert.ok(Array.isArray(nullMatch));
  assert.ok(nullMatch.length > 0);

  const emptyDecomp = Nexus3DKnowledge.decompose('');
  assert.ok(emptyDecomp.primaryArchetype);
  assert.ok(emptyDecomp.templateId);

  const emptySugg = Nexus3DKnowledge.getSuggestions('', 4);
  assert.equal(emptySugg.length, 4);

  const invalidImport = Nexus3DKnowledge.RecipeVault.importJSON('INVALID_NON_JSON{{{');
  assert.equal(invalidImport.success, false);
  assert.ok(invalidImport.error);
});

test('Semantic matching accurately identifies each of the 8 Archetype categories', () => {
  const testCases = [
    { prompt: 'Tactical railgun plasma sniper rifle with carbon fiber stock', expectedCat: 'Weapons', expectedId: 'plasma_sniper_rifle' },
    { prompt: 'Ancient folded damascus steel katana blade with golden tsuba', expectedCat: 'Weapons', expectedId: 'damascus_energy_katana' },
    { prompt: 'Supersonic delta starfighter spacecraft with vectoring thruster nozzles', expectedCat: 'Vehicles', expectedId: 'supersonic_starfighter' },
    { prompt: 'Anti-gravity cyberpunk hover speeder bike with neon repulsor chassis', expectedCat: 'Vehicles', expectedId: 'cyberpunk_hover_speeder' },
    { prompt: 'Titan heavy assault mech walker with bipedal reverse legs and missile pods', expectedCat: 'Mechs', expectedId: 'titan_assault_mech' },
    { prompt: 'Autonomous arachnid spider drone with 6 articulated legs and optic sensor', expectedCat: 'Mechs', expectedId: 'hexapod_spider_drone' },
    { prompt: 'Magnetic confinement quantum tokamak fusion reactor core with plasma orb', expectedCat: 'Gadgets', expectedId: 'quantum_reactor_core' },
    { prompt: 'Omniverse interdimensional warp portal stargate with event horizon disc', expectedCat: 'Gadgets', expectedId: 'omniverse_warp_gate' },
    { prompt: 'Cyberpunk modular skyscraper megastructure with neon billboard platforms', expectedCat: 'Architecture', expectedId: 'cyberpunk_skyscraper' },
    { prompt: 'Sacred alchemical temple of the golden dawn with Solomonic columns', expectedCat: 'Architecture', expectedId: 'alchemical_sanctum_temple' },
    { prompt: 'Aetheric crystal spire obelisk monolith with orbiting Fibonacci shards', expectedCat: 'Architecture', expectedId: 'sacred_crystal_spire' },
    { prompt: 'Mythic cyber dragon wyrm with articulating spine and plasma breath', expectedCat: 'Creatures', expectedId: 'cyber_dragon_wyrm' },
    { prompt: 'Bio-organic cellular metaball tissue entity with pulsating vascular veins', expectedCat: 'Creatures', expectedId: 'bio_organic_organoid' },
    { prompt: '4D Tesseract hypercube matrix with 16 vertex nodes in stereographic projection', expectedCat: 'Sacred Math', expectedId: 'tesseract_4d_hypercube' },
    { prompt: 'Calabi-Yau 6D Riemannian manifold complex cross-section string theory', expectedCat: 'Sacred Math', expectedId: 'calabi_yau_manifold' },
    { prompt: 'Parametric involute planetary gear train with 20 teeth and axle bore', expectedCat: 'Sacred Math', expectedId: 'involute_planetary_gear' },
    { prompt: 'Pinched superquadric monolith pillar solid with satellite shards', expectedCat: 'Sacred Math', expectedId: 'superquadric_monolith' },
    { prompt: 'Differential geometry Klein bottle immersion surface', expectedCat: 'Sacred Math', expectedId: 'klein_bottle_topology' },
    { prompt: 'Chiral Mobius strip ribbon with one-sided topological twist', expectedCat: 'Sacred Math', expectedId: 'mobius_strip_ribbon' },
    { prompt: 'Cyberpunk megacity plaza scene with skyscrapers and reflective asphalt ground', expectedCat: 'Scenes', expectedId: 'cyberpunk_megacity' },
    { prompt: 'Deep space observatory station scene with asteroid belt and solar wings', expectedCat: 'Scenes', expectedId: 'deep_space_station' },
    { prompt: 'Alien crystalline desert scene with sand dunes and dual celestial moons', expectedCat: 'Scenes', expectedId: 'alien_crystalline_desert' },
    { prompt: 'Sunken cyber Atlantis trench scene with hydrothermal vents and coral reef', expectedCat: 'Scenes', expectedId: 'sunken_cyber_atlantis' },
    { prompt: 'Volcanic magma forge scene with basalt caldera and molten lava streams', expectedCat: 'Scenes', expectedId: 'volcanic_magma_forge' },
    { prompt: 'Quantum matrix holodeck cyber grid scene with green data towers', expectedCat: 'Scenes', expectedId: 'matrix_holodeck' },
    { prompt: 'Sci-fi mech hangar bay launch deck scene with overhead gantry crane', expectedCat: 'Scenes', expectedId: 'scifi_hangar_bay' },
    { prompt: 'Floating celestial crystal islands landscape scene with rock spires', expectedCat: 'Scenes', expectedId: 'crystal_sky_islands' }
  ];

  testCases.forEach(tc => {
    const res = Nexus3DKnowledge.match(tc.prompt);
    assert.ok(res.length > 0, `No matches for prompt: "${tc.prompt}"`);
    assert.equal(res[0].template.id, tc.expectedId, `Expected ${tc.expectedId} but got ${res[0].template.id} for prompt "${tc.prompt}"`);
    assert.equal(res[0].template.category, tc.expectedCat, `Expected category ${tc.expectedCat} for prompt "${tc.prompt}"`);
  });
});

test('High-level convenience API exposes all engine capabilities directly', () => {
  const tokens = Nexus3DKnowledge.tokenize('Plasma railgun');
  assert.ok(tokens.includes('plasma'));
  assert.ok(tokens.includes('railgun'));

  const matches = Nexus3DKnowledge.match('starfighter');
  assert.equal(matches[0].template.id, 'supersonic_starfighter');

  const decomp = Nexus3DKnowledge.decompose('tokamak reactor');
  assert.equal(decomp.templateId, 'quantum_reactor_core');

  const suggestions = Nexus3DKnowledge.getSuggestions('quantum', 3);
  assert.ok(suggestions.length > 0);

  const customRecipe = Nexus3DKnowledge.saveRecipe({
    name: 'Aether Blade',
    prompt: 'Ancient damascus blade with gold hilt',
    tags: ['sword', 'gold']
  });
  assert.ok(customRecipe.id);

  const recipes = Nexus3DKnowledge.getRecipes();
  assert.ok(recipes.length >= 6);

  const genRecord = Nexus3DKnowledge.recordGeneration('4D Tesseract', { mode: 'test' });
  assert.ok(genRecord.id);
  assert.equal(genRecord.templateId, 'tesseract_4d_hypercube');
});

test('nexus-3d.html includes script tag, Knowledge Vault modal, Archetype HUD, and handler functions', () => {
  const htmlPath = path.join(__dirname, 'nexus-3d.html');
  assert.ok(fs.existsSync(htmlPath), 'nexus-3d.html must exist');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // 1. Script tag inclusion
  assert.ok(html.includes('nexus-3d-knowledge.js'), 'nexus-3d.html must include script tag for nexus-3d-knowledge.js');

  // 2. Archetype Decomposition HUD & Autocomplete elements
  assert.ok(html.includes('id="semantic-archetype-hud"'), 'nexus-3d.html must contain semantic-archetype-hud');
  assert.ok(html.includes('id="hud-archetype-title"'), 'nexus-3d.html must contain hud-archetype-title');
  assert.ok(html.includes('id="hud-match-confidence"'), 'nexus-3d.html must contain hud-match-confidence');
  assert.ok(html.includes('id="hud-pbr-badge"'), 'nexus-3d.html must contain hud-pbr-badge');
  assert.ok(html.includes('id="hud-components-badge"'), 'nexus-3d.html must contain hud-components-badge');
  assert.ok(html.includes('id="hud-sacred-badge"'), 'nexus-3d.html must contain hud-sacred-badge');
  assert.ok(html.includes('id="prompt-autocomplete-chips"'), 'nexus-3d.html must contain prompt-autocomplete-chips');

  // 3. Knowledge Vault Modal & Tab Panes
  assert.ok(html.includes('id="nexus-knowledge-vault-modal"'), 'nexus-3d.html must contain nexus-knowledge-vault-modal');
  assert.ok(html.includes('id="vault-tab-pane-catalog"'), 'nexus-3d.html must contain vault-tab-pane-catalog');
  assert.ok(html.includes('id="vault-tab-pane-recipes"'), 'nexus-3d.html must contain vault-tab-pane-recipes');
  assert.ok(html.includes('id="vault-tab-pane-history"'), 'nexus-3d.html must contain vault-tab-pane-history');
  assert.ok(html.includes('id="vault-tab-pane-sync"'), 'nexus-3d.html must contain vault-tab-pane-sync');

  // 4. Save Recipe Modal
  assert.ok(html.includes('id="save-recipe-modal"'), 'nexus-3d.html must contain save-recipe-modal');
  assert.ok(html.includes('id="save-recipe-name"'), 'nexus-3d.html must contain save-recipe-name');
  assert.ok(html.includes('id="save-recipe-prompt"'), 'nexus-3d.html must contain save-recipe-prompt');

  // 5. JavaScript Integration Functions
  assert.ok(html.includes('function initSemanticKnowledgeHUD'), 'nexus-3d.html must define initSemanticKnowledgeHUD');
  assert.ok(html.includes('function updateSemanticArchetypeHUD'), 'nexus-3d.html must define updateSemanticArchetypeHUD');
  assert.ok(html.includes('function updatePromptAutocomplete'), 'nexus-3d.html must define updatePromptAutocomplete');
  assert.ok(html.includes('function applyAutocompleteSuggestion'), 'nexus-3d.html must define applyAutocompleteSuggestion');
  assert.ok(html.includes('function openKnowledgeVaultModal'), 'nexus-3d.html must define openKnowledgeVaultModal');
  assert.ok(html.includes('function closeKnowledgeVaultModal'), 'nexus-3d.html must define closeKnowledgeVaultModal');
  assert.ok(html.includes('function openSaveRecipeModal'), 'nexus-3d.html must define openSaveRecipeModal');
  assert.ok(html.includes('function confirmSaveRecipe'), 'nexus-3d.html must define confirmSaveRecipe');
  assert.ok(html.includes('function renderSavedRecipesList'), 'nexus-3d.html must define renderSavedRecipesList');
  assert.ok(html.includes('function renderArchetypeCatalog'), 'nexus-3d.html must define renderArchetypeCatalog');
  assert.ok(html.includes('function renderGenerationHistory'), 'nexus-3d.html must define renderGenerationHistory');
  assert.ok(html.includes('function importVaultRecipesJSON'), 'nexus-3d.html must define importVaultRecipesJSON');
});

