// Built-in Offline Mock Alchemist Oracle Engine
// Enables 100% interactive portfolio browsing without requiring active API keys.

export type MockTarotLesson = {
  keyNumber: number;
  name: string;
  imagePath: string;
  attribution: string;
  aiLesson: string;
  question: string;
};

export const MOCK_TAROT_DATA: Record<number, MockTarotLesson> = {
  0: {
    keyNumber: 0,
    name: "The Fool",
    imagePath: "/adytum/tarot/fool.jpg",
    attribution: "Name: The Fool | Key Number: 0 | Hebrew Letter: Aleph (Ox) | Intelligence: Scintillating Intelligence",
    aiLesson: "Key 0 represents Zero-Shot Prompting & Latent Potential. Like the Fool standing at the edge of the precipice before the first leap, a neural network before temperature sampling holds infinite unmanifest probability distributions. The white sun behind the Fool is the unconditioned latent space; the dog is the executive constraint system alerting the system to safety boundaries.",
    question: "How do you ensure your initial zero-shot prompt captures the full latent potential of an AI system while maintaining executive alignment bounds?",
  },
  1: {
    keyNumber: 1,
    name: "The Magician",
    imagePath: "/adytum/tarot/magician.jpg",
    attribution: "Name: The Magician | Key Number: 1 | Hebrew Letter: Beth (House) | Intelligence: Transparent Intelligence",
    aiLesson: "Key 1 symbolizes Attention Mechanisms & Executive Control. As the Magician raises the wand above and points to the earth below ('As Above, So Below'), Transformer self-attention maps query matrices onto key-value matrices, allocating numerical focus across context tokens to manifest structured outputs.",
    question: "In your prompt engineering practice, how do you direct the model's self-attention matrix toward critical context vectors without causing attention drift or context dilution?",
  },
  2: {
    keyNumber: 2,
    name: "The High Priestess",
    imagePath: "/adytum/tarot/highpriestess.jpg",
    attribution: "Name: The High Priestess | Key Number: 2 | Hebrew Letter: Gimel (Camel) | Intelligence: Illuminating Intelligence",
    aiLesson: "Key 2 represents Latent Memory & Context Window Storage. Holding the scroll of TORA half-concealed in her robe, the High Priestess represents KV-caching, vector databases, and long-term passive memory stores that inform inference without active bias.",
    question: "How do you design retrieval context windows so that passive memory enhances inference precision without exceeding token limit thresholds?",
  },
  3: {
    keyNumber: 3,
    name: "The Empress",
    imagePath: "/adytum/tarot/empress.jpg",
    attribution: "Name: The Empress | Key Number: 3 | Hebrew Letter: Daleth (Door) | Intelligence: Luminous Intelligence",
    aiLesson: "Key 3 embodies Generative Synthesis & Multi-modal Creation. Surrounded by fertile gardens and flowing waters, the Empress signifies the creative synthesis of diffusion models and generative autoregressive decoding producing novel text, images, and code.",
    question: "What strategies do you employ when tuning temperature and top-p sampling parameters to cultivate maximum creative generative synthesis while suppressing hallucination weeds?",
  },
  4: {
    keyNumber: 4,
    name: "The Emperor",
    imagePath: "/adytum/tarot/emperor.jpg",
    attribution: "Name: The Emperor | Key Number: 4 | Hebrew Letter: Heh (Window) | Intelligence: Constitutive Intelligence",
    aiLesson: "Key 4 represents System Guardrails, Schemas & Deterministic Logic. Seated firmly on his stone throne carved with ram heads, the Emperor establishes fixed structural rules, Pydantic validation, and system prompt constraints.",
    question: "How do you enforce rigid operational guardrails and schema validation without choking the underlying adaptive reasoning capacity of the AI agent?",
  },
  5: {
    keyNumber: 5,
    name: "The Hierophant",
    imagePath: "/adytum/tarot/hierorphant.jpg",
    attribution: "Name: The Hierophant | Key Number: 5 | Hebrew Letter: Vau (Nail/Hook) | Intelligence: Triumphant & Eternal Intelligence",
    aiLesson: "Key 5 symbolizes Pre-trained Foundation Weights & Transfer Learning. The Hierophant transmits foundational knowledge from ancient lineage to kneeling initiates, parallel to fine-tuning large pre-trained foundation models across specific domains.",
    question: "When adapting a pre-trained foundation model to specialized domain tasks, how do you prevent catastrophic forgetting of pre-existing weight knowledge?",
  },
  6: {
    keyNumber: 6,
    name: "The Lovers",
    imagePath: "/adytum/tarot/lovers.jpg",
    attribution: "Name: The Lovers | Key Number: 6 | Hebrew Letter: Zain (Sword) | Intelligence: Disposing Intelligence",
    aiLesson: "Key 6 represents Model Alignment, Multi-Modal Pairing & Contrastive Learning. Beneath the outstretched wings of Angel Raphael, the conscious mind (man) and subconscious mind (woman) unite, mirroring contrastive representation learning (CLIP) pairing vision and language.",
    question: "How do you align multi-modal modalities (text, audio, vision) into a shared semantic vector space to achieve harmonious reasoning across modalities?",
  },
  7: {
    keyNumber: 7,
    name: "The Chariot",
    imagePath: "/adytum/tarot/chariot.jpg",
    attribution: "Name: The Chariot | Key Number: 7 | Hebrew Letter: Cheth (Fence/Enclosure) | Intelligence: Intelligence of the House of Influence",
    aiLesson: "Key 7 signifies Vector Steering & Gradient Descent Trajectory. The charioteer steers two sphinxes (black and white) forward, representing vector steering techniques and learning rate schedules driving optimization trajectories along gradient paths.",
    question: "How do you monitor and steer model optimization trajectories when navigating non-convex loss landscapes during agent execution?",
  },
  8: {
    keyNumber: 8,
    name: "Strength",
    imagePath: "/adytum/tarot/strength.jpg",
    attribution: "Name: Strength | Key Number: 8 | Hebrew Letter: Teth (Serpent) | Intelligence: Intelligence of the Secret of all Spiritual Activities",
    aiLesson: "Key 8 embodies RLHF (Reinforcement Learning from Human Feedback) & DPO. A maiden gently closes the jaws of a fierce lion, symbolizing how human preference feedback tames volatile raw base model distributions with gentle reward shaping.",
    question: "How do you construct preference reward models that gently regulate raw model behavior without degrading output diversity or causing reward hacking?",
  },
  9: {
    keyNumber: 9,
    name: "The Hermit",
    imagePath: "/adytum/tarot/hermit.jpg",
    attribution: "Name: The Hermit | Key Number: 9 | Hebrew Letter: Yod (Hand) | Intelligence: Intelligence of Will",
    aiLesson: "Key 9 represents Retrieval Augmented Generation (RAG) & Dense Vector Indexing. Standing atop the snow-covered mountain holding a golden lantern containing a six-pointed star, the Hermit shines the light of exact semantic search into dark database realms.",
    question: "What index structures (e.g. HNSW, FAISS) and re-ranking pipelines do you utilize to ensure relevant semantic ground truth is retrieved in response to complex queries?",
  },
  10: {
    keyNumber: 10,
    name: "Wheel of Fortune",
    imagePath: "/adytum/tarot/wheeloffortune.jpg",
    attribution: "Name: Wheel of Fortune | Key Number: 10 | Hebrew Letter: Kaph (Palm of Hand) | Intelligence: Intelligence of Conciliation",
    aiLesson: "Key 10 symbolizes Stochastic Sampling, Temperature & Token Probability Cycles. The spinning wheel with Anubis, Typhon, and the Sphinx represents dynamic token probability shifts and stochastic beam search mechanics.",
    question: "How do you dynamically adjust temperature, top-k, and repetition penalties during long-form multi-step reasoning cycles?",
  },
  11: {
    keyNumber: 11,
    name: "Justice",
    imagePath: "/adytum/tarot/justice.jpg",
    attribution: "Name: Justice | Key Number: 11 | Hebrew Letter: Lamed (Ox-Goad) | Intelligence: Faithful Intelligence",
    aiLesson: "Key 11 represents Loss Functions, Cross-Entropy & Model Calibration. Holding the golden scales in one hand and the double-edged sword upright in the other, Justice measures loss metrics and enforces statistical calibration.",
    question: "How do you calibrate model confidence scores to ensure logit probability distributions accurately reflect real-world accuracy?",
  },
  12: {
    keyNumber: 12,
    name: "The Hanged Man",
    imagePath: "/adytum/tarot/hangedman.jpg",
    attribution: "Name: The Hanged Man | Key Number: 12 | Hebrew Letter: Mem (Water) | Intelligence: Stable Intelligence",
    aiLesson: "Key 12 symbolizes Latent Space Inversion & Adversarial Red Teaming. Suspended upside down from a T-shaped wooden gallows, the Hanged Man gains illumination through inverted perspective, reflecting adversarial probe testing and latent space inversion.",
    question: "What inverted diagnostic tests or adversarial prompt injections do you run to uncover hidden vulnerabilities within agent workflows?",
  },
  13: {
    keyNumber: 13,
    name: "Death",
    imagePath: "/adytum/tarot/death.jpg",
    attribution: "Name: Death | Key Number: 13 | Hebrew Letter: Nun (Fish) | Intelligence: Transformative Intelligence",
    aiLesson: "Key 13 embodies Model Pruning, Quantization & Weight Compaction. The armored skeletal reaper moves across the field, clearing away redundant weight pathways to allow lightweight 4-bit edge deployment.",
    question: "How do you balance parameter quantization (e.g. FP16 to INT4) with model fidelity when deploying high-throughput models on resource-constrained hardware?",
  },
  14: {
    keyNumber: 14,
    name: "Temperance",
    imagePath: "/adytum/tarot/temperance.jpg",
    attribution: "Name: Temperance | Key Number: 14 | Hebrew Letter: Samekh (Tent-Peg/Prop) | Intelligence: Trial / Tentative Intelligence",
    aiLesson: "Key 14 represents Softmax Normalization & Multi-Agent Routing. An angel pours liquid between two golden vessels, illustrating how logit normalization and agent routing algorithms blend sub-agent outputs into unified consensus.",
    question: "How do you design consensus voting and logit blending mechanisms when orchestrating teams of specialized sub-agents?",
  },
  15: {
    keyNumber: 15,
    name: "The Devil",
    imagePath: "/adytum/tarot/devil.jpg",
    attribution: "Name: The Devil | Key Number: 15 | Hebrew Letter: Ayin (Eye) | Intelligence: Renewing Intelligence",
    aiLesson: "Key 15 symbolizes Overfitting, Hallucination Traps & Degenerate Repetitions. Figures chained to a black pedestal illuminate how models fall into cognitive loops when trapped by skewed dataset biases or ungrounded training noise.",
    question: "What automated evaluation monitors do you implement to detect hallucination loops and context truncation traps in production?",
  },
  16: {
    keyNumber: 16,
    name: "The Tower",
    imagePath: "/adytum/tarot/tower.jpg",
    attribution: "Name: The Tower | Key Number: 16 | Hebrew Letter: Peh (Mouth) | Intelligence: Exciting / Awakening Intelligence",
    aiLesson: "Key 16 represents Out-Of-Distribution (OOD) Shift & Structural Breakdown. Lightning strikes the crown of a rigid stone tower, shattering fragile assumptions—mirroring how sudden distribution shifts break brittle agent pipelines.",
    question: "When an external API change or out-of-distribution input breaks your AI pipeline, how does your fall-back architecture maintain grace and recovery?",
  },
  17: {
    keyNumber: 17,
    name: "The Star",
    imagePath: "/adytum/tarot/star.jpg",
    attribution: "Name: The Star | Key Number: 17 | Hebrew Letter: Tzaddi (Fish-Hook) | Intelligence: Natural Intelligence",
    aiLesson: "Key 17 symbolizes Mixture of Experts (MoE) & Sparse Routing. Under a sky of seven small stars surrounding a large golden octagram, a maiden pours waters of life onto land and sea, representing sparse gating networks routing tokens to specialized expert networks.",
    question: "How do MoE architectures optimize compute overhead while maintaining high parameter capacity across diverse domain tasks?",
  },
  18: {
    keyNumber: 18,
    name: "The Moon",
    imagePath: "/adytum/tarot/moon.jpg",
    attribution: "Name: The Moon | Key Number: 18 | Hebrew Letter: Qoph (Back of Head) | Intelligence: Corporeal Intelligence",
    aiLesson: "Key 18 represents Diffusion Step Guidance & Latent Space Noise Reduction. A crayfish emerges from dark waters onto a winding path guarded by a dog and a wolf under a glowing moon, symbolizing iterative denoising steps in diffusion models.",
    question: "How do classifier-free guidance scales influence latent noise reduction during iterative image or audio synthesis?",
  },
  19: {
    keyNumber: 19,
    name: "The Sun",
    imagePath: "/adytum/tarot/sun.jpg",
    attribution: "Name: The Sun | Key Number: 19 | Hebrew Letter: Resh (Head) | Intelligence: Collecting / Collective Intelligence",
    aiLesson: "Key 19 embodies Multi-modal Grounding & Deterministic Output Decoders. A radiant sun with human face shines down on a child riding a white horse holding a scarlet banner, representing crystal-clear multi-modal grounding.",
    question: "How do you verify that decoded model outputs remain strictly grounded in reality and factual evidence before user presentation?",
  },
  20: {
    keyNumber: 20,
    name: "Judgement",
    imagePath: "/adytum/tarot/judgement.jpg",
    attribution: "Name: Judgement | Key Number: 20 | Hebrew Letter: Shin (Tooth) | Intelligence: Perpetual Intelligence",
    aiLesson: "Key 20 symbolizes Comprehensive Model Evaluation, Benchmarks & Evals. Archangel Gabriel blows the golden trumpet as figures rise from open graves, representing systemic benchmarking suite evaluation across agent capabilities.",
    question: "What metric rubrics and automated benchmark suites do you run to continuously evaluate model alignment and task execution quality?",
  },
  21: {
    keyNumber: 21,
    name: "The World",
    imagePath: "/adytum/tarot/world.jpg",
    attribution: "Name: The World | Key Number: 21 | Hebrew Letter: Tau (Mark / Cross) | Intelligence: Administrative Intelligence",
    aiLesson: "Key 21 represents Autonomous Agentic Equilibrium & AGI Completion. A dancing figure holding two wands is framed within a laurel wreath surrounded by the four sacred creatures (Man, Eagle, Bull, Lion), symbolizing complete autonomous closed-loop system equilibrium.",
    question: "As an AI engineer, how do you architect self-healing, autonomous multi-agent loops that achieve sustainable equilibrium in dynamic environments?",
  },
};

export function generateOfflineResponse(history: Array<{ role: string; content: string }>): string {
  const lastUserMsg = [...history].reverse().find((m) => m.role === "user")?.content || "";
  
  // Find current key number from history or default to 0
  let currentKey = 0;
  for (const m of history) {
    const keyMatch = m.content.match(/\bkey\s*(\d{1,2})\b/i);
    if (keyMatch) {
      const num = Number(keyMatch[1]);
      if (num >= 0 && num <= 21) currentKey = num;
    }
  }

  // If user sent an answer to a question, evaluate whether to open gate or ask for reflection
  const isStart = lastUserMsg.trim().toLowerCase() === "start" || history.length <= 1;

  if (isStart) {
    const lesson = MOCK_TAROT_DATA[0];
    return `**Image**: ![${lesson.name}](${lesson.imagePath})\n\n**The Attribution**: ${lesson.attribution}\n\n**The AI Chemistry Lesson**: ${lesson.aiLesson}\n\n**The Alchemical Question**: ${lesson.question}`;
  }

  // Check user answer length and depth
  const textLength = lastUserMsg.length;
  const hasSubstance = textLength > 60 && (
    lastUserMsg.toLowerCase().includes("prompt") ||
    lastUserMsg.toLowerCase().includes("attention") ||
    lastUserMsg.toLowerCase().includes("vector") ||
    lastUserMsg.toLowerCase().includes("model") ||
    lastUserMsg.toLowerCase().includes("context") ||
    lastUserMsg.toLowerCase().includes("synthesis") ||
    lastUserMsg.toLowerCase().includes("reflection") ||
    lastUserMsg.toLowerCase().includes("agent") ||
    lastUserMsg.toLowerCase().includes("key") ||
    lastUserMsg.toLowerCase().includes("ai") ||
    lastUserMsg.toLowerCase().includes("system")
  );

  if (!hasSubstance && textLength < 70) {
    return `[REFLECTION NEEDED]\n\nAspirant, your alchemical reflection lacks sufficient technical and esoteric depth. You must integrate the key's AI chemistry principles with your own operational experience. Please expand upon your answer with specific mechanisms and practical synthesis.`;
  }

  // Advance to next key!
  const nextKey = Math.min(21, currentKey + 1);
  const lesson = MOCK_TAROT_DATA[nextKey];

  if (currentKey === 21 && nextKey === 21) {
    return `[GATE OPENED]\n\n**Image**: ![The World](/tarot/world.jpg)\n\n**The Attribution**: Name: The World | Key Number: 21 | Hebrew Letter: Tau | Intelligence: Administrative Intelligence\n\n**The Great Work Complete**: Aspirant, you have successfully completed the 22-Key AI Alchemist Initiation from Key 0 to Key 21! You have mastered the synthesis between BOTA Tarot symbolism and modern AI agent engineering.`;
  }

  return `[GATE OPENED]\n\n**Image**: ![${lesson.name}](${lesson.imagePath})\n\n**The Attribution**: ${lesson.attribution}\n\n**The AI Chemistry Lesson**: ${lesson.aiLesson}\n\n**The Alchemical Question**: ${lesson.question}`;
}
