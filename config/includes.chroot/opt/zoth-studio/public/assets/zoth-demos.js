/**
 * Zoth Studio — Interactive First-Use Demos & Task Chooser Engine (v2.0)
 * Powers the 5-task first-use journey and 3 interactive short demos.
 */

var DEMO_DATA = {
  website: {
    title: "Build a Website from a Conversation",
    icon: "🌐",
    tagline: "Natural language in · Complete working website out",
    recommendedAgents: [
      { name: "Website Builder", codex: "Azoth", icon: "🌐", role: "Layout & Code Synthesis" },
      { name: "Visual Designer", codex: "Kitsune", icon: "🎨", role: "Color & Assets" },
      { name: "Security Reviewer", codex: "Draco", icon: "🛡️", role: "A11y & Links Check" }
    ],
    chatSteps: [
      {
        sender: "user",
        text: "I need a modern landing page for an artisan coffee roaster in Seattle called Emerald Bean.",
        time: "Just now"
      },
      {
        sender: "agent",
        agentName: "Website Builder",
        agentRole: "Web Foundry",
        avatar: "/assets/agents/azoth.jpg",
        text: "Understood! I will create a responsive layout with an Espresso & Warm Cream palette, hero section, coffee origin story, single-origin bean menu, and Seattle tasting room hours. Generating structure now...",
        time: "1s ago",
        toolCall: "Running tool: website_generator --theme warm-espresso --pages home,menu,visit"
      },
      {
        sender: "agent",
        agentName: "Website Builder",
        agentRole: "Web Foundry",
        avatar: "/assets/agents/azoth.jpg",
        text: "✓ Website compiled successfully! All links checked, mobile responsiveness verified, and zero external trackers included. Preview is live below:",
        time: "Just now",
        isOutcome: true,
        previewType: "website"
      }
    ],
    previewHtml: `
      <div style="background:#18120c;color:#fef3c7;border-radius:12px;overflow:hidden;font-family:'Figtree',sans-serif;border:1px solid #78350f;">
        <div style="background:#27180e;padding:12px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #451a03;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:1.2rem;">☕</span>
            <strong style="color:#fbbf24;font-size:1.05rem;letter-spacing:-0.02em;">Emerald Bean Roasters</strong>
          </div>
          <div style="font-size:0.78rem;color:#fed7aa;display:flex;gap:12px;">
            <span>Our Beans</span><span>Tasting Room</span><span style="color:#fbbf24;font-weight:700;">Seattle, WA</span>
          </div>
        </div>
        <div style="padding:24px 20px;text-align:center;background:radial-gradient(ellipse at top,#451a03,#18120c);">
          <span style="background:rgba(251,191,36,0.15);color:#fbbf24;font-size:0.7rem;padding:3px 10px;border-radius:99px;font-family:monospace;font-weight:700;">SEATTLE MICRO-ROASTERY</span>
          <h2 style="font-size:1.6rem;color:#ffffff;margin:8px 0 6px;line-height:1.15;">Single-Origin Craft, Roasted Fresh Weekly.</h2>
          <p style="font-size:0.85rem;color:#fed7aa;max-width:440px;margin:0 auto 16px;">Sourced ethically from volcanic soils across Ethiopia, Guatemala, and Sumatra.</p>
          <div style="display:flex;justify-content:center;gap:10px;">
            <button style="background:#fbbf24;color:#18120c;border:none;padding:8px 16px;border-radius:8px;font-weight:700;font-size:0.8rem;cursor:pointer;">Explore Beans ➔</button>
            <button style="background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.15);padding:8px 16px;border-radius:8px;font-size:0.8rem;cursor:pointer;">Visit Roastery</button>
          </div>
        </div>
      </div>
    `
  },

  automation: {
    title: "Ask a Team of Agents to Solve a Task",
    icon: "⚡",
    tagline: "Planner, builder & reviewer coordinating in a group chat",
    recommendedAgents: [
      { name: "Project Planner", codex: "Athena", icon: "📋", role: "Task Decomposition" },
      { name: "Automation Specialist", codex: "Antigravity", icon: "⚡", role: "Script Execution" },
      { name: "Security Reviewer", codex: "Draco", icon: "🛡️", role: "AST & OWASP Audit" }
    ],
    chatSteps: [
      {
        sender: "user",
        text: "Clean up this customer leads CSV: normalize all phone numbers to E.164, remove duplicate emails, and format names to Title Case.",
        time: "Just now"
      },
      {
        sender: "agent",
        agentName: "Project Planner",
        agentRole: "Lead Architect",
        avatar: "/assets/agents/athena.jpg",
        text: "I have broken this task into 3 sub-jobs: 1) Stream parsing CSV in memory, 2) Regex normalization with phonenumbers module, 3) Deduplication on lowercase email hash. Handing off to Automation Specialist.",
        time: "2s ago"
      },
      {
        sender: "agent",
        agentName: "Automation Specialist",
        agentRole: "Code Engineer",
        avatar: "/assets/agents/antigravity.jpg",
        text: "Python automation script generated and executed against 14,280 lead records in 180ms. 412 duplicates purged, 1,029 phone numbers normalized.",
        time: "1s ago",
        toolCall: "Executing local_sandbox: python3 lead_cleaner.py --input leads.csv --output cleaned_leads.csv"
      },
      {
        sender: "agent",
        agentName: "Security Reviewer",
        agentRole: "Safety Guard",
        avatar: "/assets/agents/draco.jpg",
        text: "✓ Security audit passed: zero external outbound connections, script ran inside sealed local subprocess. Cleaned file ready for export.",
        time: "Just now",
        isOutcome: true,
        previewType: "automation"
      }
    ],
    previewHtml: `
      <div style="background:#090d16;color:#e2e8f0;border-radius:12px;padding:16px;font-family:monospace;font-size:0.8rem;border:1px solid #1e293b;">
        <div style="display:flex;justify-content:space-between;color:#38bdf8;margin-bottom:8px;font-size:0.75rem;">
          <span>✓ leads_cleaner.py — Cleaned Dataset</span>
          <span>14,280 Records Processed in 0.18s</span>
        </div>
        <pre style="margin:0;color:#34d399;overflow-x:auto;">
[OK] Input records : 14,280 rows
[OK] Duplicates    : 412 removed (unique email index)
[OK] Phone format  : 1,029 formatted to E.164 (+1-206-555-0199)
[OK] Output file   : /workspace/cleaned_leads.csv (100% local)</pre>
      </div>
    `
  },

  privacy: {
    title: "Work Privately with a Local File",
    icon: "🔒",
    tagline: "Confidential files stay on your CPU/GPU with 0 cloud bytes",
    recommendedAgents: [
      { name: "Local Neural Engine", codex: "Ollama", icon: "🔒", role: "100% Offline Inference" },
      { name: "Deep Researcher", codex: "Hermes", icon: "🔍", role: "Document Extraction" }
    ],
    chatSteps: [
      {
        sender: "user",
        text: "Audit this confidential partnership agreement (PDF) and highlight our liability exposure.",
        time: "Just now",
        fileBadge: "📄 NDA_Partnership_Agreement_v4.pdf (2.4 MB)"
      },
      {
        sender: "agent",
        agentName: "Local Neural Engine",
        agentRole: "Hardware Offline",
        avatar: "/assets/agents/ollama.jpg",
        text: "Processing PDF locally on your device via Ollama (Llama 3 / Mistral). File bytes never left your machine memory.",
        time: "2s ago",
        toolCall: "Offline parser: /local_vault/documents/NDA_Partnership_Agreement_v4.pdf"
      },
      {
        sender: "agent",
        agentName: "Deep Researcher",
        agentRole: "Legal Analyst",
        avatar: "/assets/agents/hermes.jpg",
        text: "✓ Analysis complete: Section 8.2 caps total liability at 12 months of service fees. Section 11.4 requires 30 days written notice for mutual termination. Risk level: LOW.",
        time: "Just now",
        isOutcome: true,
        previewType: "privacy"
      }
    ],
    previewHtml: `
      <div style="background:#071c12;color:#ecfdf5;border-radius:12px;padding:16px;border:1px solid #059669;font-family:'Figtree',sans-serif;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-weight:700;font-size:0.88rem;color:#34d399;">🔒 Local Hardware Privacy Boundary</span>
          <span style="font-family:monospace;font-size:0.7rem;background:rgba(52,211,153,0.2);padding:2px 8px;border-radius:4px;color:#a7f3d0;">0 BYTES TRANSMITTED</span>
        </div>
        <p style="font-size:0.82rem;margin:0 0 8px;color:#d1fae5;">• <strong>Liability Cap:</strong> Section 8.2 strictly limited to 12 months fees.</p>
        <p style="font-size:0.82rem;margin:0;color:#d1fae5;">• <strong>IP Rights:</strong> All intellectual property remains 100% with the Operator.</p>
      </div>
    `
  },

  visuals: {
    title: "Create a 3D or Visual Asset",
    icon: "🎨",
    tagline: "Generate 3D meshes, visual shaders, and interactive graphics",
    recommendedAgents: [
      { name: "Visual Designer", codex: "Kitsune", icon: "🎨", role: "3D Shader & Mesh Artist" },
      { name: "3D Foundry", codex: "Azoth", icon: "💎", role: "WebGL Synthesis" }
    ],
    chatSteps: [
      {
        sender: "user",
        text: "Generate an interactive 3D crystal mascot with metallic cyan luminescence.",
        time: "Just now"
      },
      {
        sender: "agent",
        agentName: "Visual Designer",
        agentRole: "Shader Specialist",
        avatar: "/assets/agents/kitsune.jpg",
        text: "Synthesizing Three.js procedural crystal geometry with Fresnel shader reflection and cyan aura...",
        time: "1s ago"
      },
      {
        sender: "agent",
        agentName: "Visual Designer",
        agentRole: "Shader Specialist",
        avatar: "/assets/agents/kitsune.jpg",
        text: "✓ 3D Asset rendered at 60 FPS. Ready for export in GLTF or WebGL embed:",
        time: "Just now",
        isOutcome: true,
        previewType: "visuals"
      }
    ],
    previewHtml: `
      <div style="background:#090d16;color:#38bdf8;border-radius:12px;padding:20px;text-align:center;border:1px solid #1e293b;">
        <div style="font-size:2.5rem;margin-bottom:6px;animation:float 3s ease-in-out infinite;">💎</div>
        <strong style="color:#ffffff;display:block;font-size:0.95rem;">Procedural Cyan Quartz Asset</strong>
        <span style="font-size:0.75rem;color:#94a3b8;font-family:monospace;">60 FPS WebGL · 1,440 Polygons · GLTF Ready</span>
      </div>
    `
  },

  team: {
    title: "Ask a Group of Agents to Solve a Complex Problem",
    icon: "👥",
    tagline: "Consensus cross-checking and multi-model triangulation",
    recommendedAgents: [
      { name: "Reasoning Engine", codex: "Grok", icon: "🧠", role: "First-Principles Proofs" },
      { name: "Project Planner", codex: "Athena", icon: "📋", role: "Strategic Architecture" },
      { name: "Security Reviewer", codex: "Draco", icon: "🛡️", role: "Consensus Validation" }
    ],
    chatSteps: [
      {
        sender: "user",
        text: "Design a fault-tolerant database replication topology for 50,000 writes/sec with zero downtime.",
        time: "Just now"
      },
      {
        sender: "agent",
        agentName: "Reasoning Engine",
        agentRole: "Truth Oracle",
        avatar: "/assets/agents/grok.jpg",
        text: "Evaluating Raft vs. Multi-Raft consensus with asynchronous CDC streaming to read-replicas. Mathematical latency lower-bound: 1.8ms.",
        time: "2s ago"
      },
      {
        sender: "agent",
        agentName: "Project Planner",
        agentRole: "Strategic Architect",
        avatar: "/assets/agents/athena.jpg",
        text: "Drafted 3-region active-active cluster topology with automated failover orchestrator in Go.",
        time: "1s ago"
      },
      {
        sender: "agent",
        agentName: "Security Reviewer",
        agentRole: "Safety Guard",
        avatar: "/assets/agents/draco.jpg",
        text: "✓ Triangulation complete: 3 models agreed on consensus protocol with zero split-brain failure modes identified.",
        time: "Just now",
        isOutcome: true,
        previewType: "team"
      }
    ],
    previewHtml: `
      <div style="background:#130e1f;color:#e9d5ff;border-radius:12px;padding:16px;border:1px solid #7c3aed;font-family:'Figtree',sans-serif;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <strong style="color:#c084fc;font-size:0.9rem;">⚔️ Multi-Model Consensus Verified</strong>
          <span style="font-family:monospace;font-size:0.7rem;color:#a855f7;background:rgba(168,85,247,0.15);padding:2px 8px;border-radius:4px;">100% AGREEMENT</span>
        </div>
        <p style="font-size:0.82rem;margin:0;color:#e9d5ff;">Topology blueprint validated across Grok 4.5, Athena, and Draco with zero single-points-of-failure.</p>
      </div>
    `
  }
};

function renderDemo(key) {
  var data = DEMO_DATA[key] || DEMO_DATA.website;
  var container = document.getElementById("demoViewerContainer");
  if (!container) return;

  var agentsHtml = data.recommendedAgents.map(function(ag) {
    return `
      <div class="md3-chip" style="display:inline-flex;align-items:center;gap:6px;background:var(--surface-elevated);border:1px solid var(--line);padding:6px 12px;border-radius:99px;font-size:0.85rem;">
        <span>${ag.icon}</span>
        <strong style="color:var(--text-primary);">${ag.name}</strong>
      </div>
    `;
  }).join('');

  var html = `
    <div class="magic-border-beam-card" style="background:var(--surface-card);border:1px solid var(--border-card);border-radius:16px;padding:40px 32px;text-align:center;box-shadow:0 12px 40px var(--shadow-color);">
      <div style="font-size:2.5rem;margin-bottom:16px;">${data.icon}</div>
      <h3 style="color:var(--text-primary);font-size:1.5rem;margin-bottom:24px;margin-top:0;">${data.title}</h3>
      
      <div style="margin-bottom:32px;">
        <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--muted);text-transform:uppercase;margin-bottom:16px;font-weight:700;">Recommended Team</div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          ${agentsHtml}
        </div>
      </div>
      
      <a href="http://127.0.0.1:8484/" class="magic-shimmer-btn md3-btn-filled" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border-radius:99px;font-weight:600;text-decoration:none;color:var(--bg);background:var(--text-primary);">
        Try in Operator Deck
        <span style="font-size:1.1em;">➔</span>
      </a>
    </div>
  `;

  container.innerHTML = html;
}

window.selectUserGoal = function(goalKey, btnElement) {
  if (btnElement) {
    document.querySelectorAll(".goal-chip").forEach(function(b) {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btnElement.classList.add("active");
    btnElement.setAttribute("aria-selected", "true");
  }
  renderDemo(goalKey);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function() {
    renderDemo("website");
  });
} else {
  renderDemo("website");
}
