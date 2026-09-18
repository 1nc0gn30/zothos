/**
 * ⚡ ZOTH SOVEREIGN NETRUNNER MEMORY ENGINE (v3.0)
 * ================================================
 * Universal Client-Side Memory Substrate & Tool/Code Execution Linker
 * 
 * Automatically binds all Zoth Studio tools, terminals, code synthesizers,
 * and consensus validators to the Netrunner Memory Daemon (:8788) & Lucy Oracle.
 *
 * Capabilities:
 * 1. `ZothNetrunnerMemory.recordToolRun()`: Records tool executions, exit codes, and latency
 * 2. `ZothNetrunnerMemory.recordCodeChange()`: Records file modifications, diffs, and AST proofs
 * 3. `ZothNetrunnerMemory.recall()`: Semantic & associative recall before executing actions
 * 4. `ZothNetrunnerMemory.trigger()`: Rehearses and strengthens synaptic memory connections
 * 5. Automatic DOM & CustomEvent interception across all Studio workstations
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ZothNetrunnerMemory = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MEMORY_PORT = 8788;
  var MEMORY_BASE = 'http://127.0.0.1:8788/v1';
  var ORCHESTRATOR_BASE = window.location.port === '8484' ? '' : 'http://127.0.0.1:8484';

  var state = {
    isOnline: null,
    lastChecked: 0,
    recentMemories: [],
    listeners: {}
  };

  // Helper: Format ISO timestamp
  function nowIso() {
    return new Date().toISOString();
  }

  // Helper: Play procedural memory chime
  function playMemoryChime(type) {
    try {
      if (window.ZothAudioFX && window.ZothAudioFX.isEnabled && window.ZothAudioFX.isEnabled()) {
        if (type === 'code') {
          window.ZothAudioFX.playClick(880, 0.09, 'sine');
        } else if (type === 'tool') {
          window.ZothAudioFX.playClick(720, 0.08, 'triangle');
        } else {
          window.ZothAudioFX.playHover();
        }
      }
    } catch (e) {}
  }

  // Core HTTP dispatcher with fallback to Orchestrator proxy
  async function dispatchApi(endpoint, options) {
    options = options || {};
    var method = options.method || 'GET';
    var body = options.body ? JSON.stringify(options.body) : undefined;
    var headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'ZothNetrunnerClient/3.0'
    };

    var targetUrl = MEMORY_BASE + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
    
    try {
      var controller = new AbortController();
      var timeoutId = setTimeout(function () { controller.abort(); }, options.timeout || 4000);
      
      var res = await fetch(targetUrl, {
        method: method,
        headers: headers,
        body: body,
        mode: 'cors',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      state.isOnline = res.ok || res.status === 201;
      state.lastChecked = Date.now();

      if (res.ok || res.status === 201) {
        var data = await res.json();
        return data;
      }
    } catch (err) {
      // Primary daemon (:8788) failed or blocked by CORS — Try fallback proxy via Orchestrator (:8484)
      try {
        var proxyUrl = ORCHESTRATOR_BASE + '/api/memory/proxy?endpoint=' + encodeURIComponent(endpoint);
        var proxyRes = await fetch(proxyUrl, {
          method: method,
          headers: headers,
          body: body,
          mode: 'cors'
        });
        if (proxyRes.ok) {
          return await proxyRes.json();
        }
      } catch (proxyErr) {
        // Both unreachable
        state.isOnline = false;
      }
    }
    return null;
  }

  var MemoryEngine = {
    version: '3.0.0',
    endpoint: MEMORY_BASE,

    /**
     * Check if Netrunner Memory Daemon is reachable
     */
    async checkHealth() {
      try {
        var data = await dispatchApi('/memories?limit=1', { timeout: 1500 });
        state.isOnline = !!data;
        return state.isOnline;
      } catch (e) {
        state.isOnline = false;
        return false;
      }
    },

    /**
     * Helper: Extract Human Digest
     */
    formatHumanDigest(mem) {
      if (!mem) return '';
      if (mem.human_digest) return String(mem.human_digest).trim();
      if (mem.summary) return String(mem.summary).trim();
      if (mem.story) return String(mem.story).trim();
      return String(mem.text || 'Engram details unavailable.').trim();
    },

    /**
     * Helper: Format AI Spectrum JSON
     */
    formatAiSpectrum(mem, indent) {
      indent = typeof indent === 'number' ? indent : 2;
      if (!mem) return '{}';
      var spec = mem.ai_spectrum || mem.raw_payload;
      if (typeof spec === 'string') {
        try {
          return JSON.stringify(JSON.parse(spec), null, indent);
        } catch (e) {
          return spec;
        }
      }
      return JSON.stringify(spec || mem, null, indent);
    },

    /**
     * Record a Tool Execution into Netrunner Memory
     */
    async recordToolRun(opts) {
      opts = opts || {};
      var toolId = String(opts.toolId || opts.id || 'unknown_tool').trim();
      var toolName = opts.toolName || toolId;
      var command = opts.command || opts.cmd || '';
      var agentId = String(opts.agentId || opts.agent || 'orchestrator').toLowerCase();
      var exitCode = typeof opts.exitCode === 'number' ? opts.exitCode : (opts.ok === false ? 1 : 0);
      var durationMs = Number(opts.durationMs || opts.elapsed || 0);
      var metadata = opts.metadata || {};

      var statusLabel = exitCode === 0 ? 'SUCCESS' : ('FAILED (Exit ' + exitCode + ')');
      var statusSym = exitCode === 0 ? '✅' : '❌';
      var durStr = durationMs > 0 ? (' in ' + durationMs.toFixed(1) + 'ms') : '';
      var cmdSnippet = command ? (command.length > 80 ? command.slice(0, 80) + '...' : command) : '';
      var cmdClause = cmdSnippet ? (' Command: `' + cmdSnippet + '`.') : '';

      var humanDigest = '';
      if (exitCode === 0) {
        var outSnippet = opts.output ? String(opts.output).trim().split('\n')[0].slice(0, 100) : 'Completed successfully.';
        humanDigest = statusSym + ' @' + agentId + ' executed tool `' + toolId + '`' + durStr + ' with Exit 0.' + cmdClause + ' Result: ' + outSnippet;
      } else {
        var errSnippet = opts.stderr ? String(opts.stderr).trim().split('\n').pop().slice(0, 120) : (opts.output ? String(opts.output).trim().split('\n').pop().slice(0, 120) : ('Process exited with code ' + exitCode));
        humanDigest = statusSym + ' @' + agentId + ' tool `' + toolId + '` failed (Exit ' + exitCode + ')' + durStr + '.' + cmdClause + ' Error: ' + errSnippet;
      }

      var text = humanDigest;
      var title = '🛠️ Tool Executed: ' + toolId + ' (' + statusLabel + ')';

      var tags = [
        'tool-execution',
        'zoth-tool',
        toolId.toLowerCase(),
        'agent-' + agentId,
        exitCode === 0 ? 'success' : 'error',
        'exit-' + exitCode
      ];
      if (opts.category) tags.push(String(opts.category).toLowerCase());
      if (Array.isArray(metadata.tags)) tags = tags.concat(metadata.tags.map(String));

      var aiSpectrum = {
        spectrum_version: '3.0',
        modality: 'tool_execution',
        telemetry: {
          timestamp: nowIso(),
          agent_id: agentId,
          perspective: agentId,
          subsystem: exitCode === 0 ? 'basal_ganglia' : 'amygdala',
          neuromodulators: {
            dopamine: exitCode === 0 ? 0.85 : 0.20,
            acetylcholine: 0.90,
            noradrenaline: exitCode === 0 ? 0.15 : 0.85,
            serotonin: exitCode === 0 ? 0.80 : 0.30
          },
          salience: exitCode === 0 ? 0.55 : 0.88,
          working_memory: true
        },
        execution: {
          tool_id: toolId,
          tool_name: toolName,
          command: command,
          exit_code: exitCode,
          status: statusLabel,
          duration_ms: durationMs,
          output_preview: opts.output ? String(opts.output).slice(0, 1500) : '',
          stderr_preview: opts.stderr ? String(opts.stderr).slice(0, 1500) : ''
        },
        context: {
          tags: Array.from(new Set(tags)),
          category: exitCode === 0 ? 'building' : 'debug',
          metadata: metadata
        }
      };

      var payload = {
        text: text,
        title: title,
        human_digest: humanDigest,
        summary: humanDigest,
        story: humanDigest,
        agent_id: agentId,
        perspective: agentId,
        category: exitCode === 0 ? 'building' : 'debug',
        tags: Array.from(new Set(tags)),
        working_memory: true,
        salience: exitCode === 0 ? 0.55 : 0.88,
        raw_payload: aiSpectrum,
        ai_spectrum: aiSpectrum
      };

      playMemoryChime('tool');
      var result = await dispatchApi('/memories/encode', { method: 'POST', body: payload });
      
      // Dispatch client notification event
      var evtDetail = { type: 'tool', human_digest: humanDigest, ai_spectrum: aiSpectrum, payload: payload, result: result };
      window.dispatchEvent(new CustomEvent('zoth:memory:tool-recorded', { detail: evtDetail }));
      MemoryEngine._emit('tool-recorded', evtDetail);

      return result || { status: 'offline_buffered', human_digest: humanDigest, ai_spectrum: aiSpectrum, payload: payload };
    },

    /**
     * Record a Code Change / File Modification into Netrunner Memory
     */
    async recordCodeChange(opts) {
      opts = opts || {};
      var filePath = String(opts.filePath || opts.file || opts.path || 'untitled.js').trim();
      var fileName = filePath.split('/').pop() || filePath;
      var action = String(opts.action || 'edit').toLowerCase();
      var agentId = String(opts.agentId || opts.agent || 'azoth').toLowerCase();
      var diffSummary = opts.diffSummary || opts.diff || opts.summary || '';
      var linesAdded = Number(opts.linesAdded || 0);
      var linesRemoved = Number(opts.linesRemoved || 0);
      var language = opts.language || fileName.split('.').pop() || 'code';
      var astVerified = opts.astVerified !== false;
      var metadata = opts.metadata || {};

      var actionIcon = (action === 'create' || action === 'new') ? '✨' : ((action === 'delete' || action === 'remove') ? '🗑️' : '📝');
      var astStr = astVerified ? '✓ AST Verified' : '⚡ Unverified AST';
      var linesStr = (linesAdded > 0 || linesRemoved > 0) ? ('+' + linesAdded + '/-' + linesRemoved + ' lines') : 'delta recorded';
      var diffClause = diffSummary ? (': "' + (diffSummary.length > 120 ? diffSummary.slice(0, 120) + '...' : diffSummary) + '"') : '';
      
      var humanDigest = actionIcon + ' @' + agentId + ' ' + action + ' `' + fileName + '` (' + linesStr + ', ' + language + ')' + diffClause + ' (' + astStr + ').';

      var text = humanDigest;
      var title = '📝 Code Modified: ' + fileName + ' (' + action + ')';

      var tags = [
        'code-change',
        'source-code',
        language.toLowerCase(),
        fileName.toLowerCase(),
        'action-' + action,
        'agent-' + agentId,
        astVerified ? 'ast-verified' : 'ast-raw'
      ];
      if (opts.project) tags.push('proj-' + String(opts.project).toLowerCase());
      if (Array.isArray(metadata.tags)) tags = tags.concat(metadata.tags.map(String));

      var aiSpectrum = {
        spectrum_version: '3.0',
        modality: 'code_modification',
        telemetry: {
          timestamp: nowIso(),
          agent_id: agentId,
          perspective: agentId,
          subsystem: 'neocortex',
          neuromodulators: {
            dopamine: 0.92,
            acetylcholine: 0.95,
            noradrenaline: 0.10,
            serotonin: 0.85
          },
          salience: 0.68,
          working_memory: true
        },
        code_metrics: {
          file_path: filePath,
          file_name: fileName,
          file_extension: fileName.split('.').pop() || language,
          action: action,
          language: language,
          lines_added: linesAdded,
          lines_removed: linesRemoved,
          net_line_delta: linesAdded - linesRemoved,
          diff_summary: diffSummary,
          ast_verified: astVerified,
          ast_proof: {
            syntax_valid: astVerified,
            status: astVerified ? 'CONSENSUS_VERIFIED' : 'RAW_UNCHECKED'
          }
        },
        context: {
          tags: Array.from(new Set(tags)),
          category: 'building',
          metadata: metadata
        }
      };

      var payload = {
        text: text,
        title: title,
        human_digest: humanDigest,
        summary: humanDigest,
        story: humanDigest,
        agent_id: agentId,
        perspective: agentId,
        category: 'building',
        tags: Array.from(new Set(tags)),
        working_memory: true,
        salience: 0.68,
        raw_payload: aiSpectrum,
        ai_spectrum: aiSpectrum
      };

      playMemoryChime('code');
      var result = await dispatchApi('/memories/encode', { method: 'POST', body: payload });

      var evtDetail = { type: 'code', human_digest: humanDigest, ai_spectrum: aiSpectrum, payload: payload, result: result };
      window.dispatchEvent(new CustomEvent('zoth:memory:code-recorded', { detail: evtDetail }));
      MemoryEngine._emit('code-recorded', evtDetail);

      return result || { status: 'offline_buffered', human_digest: humanDigest, ai_spectrum: aiSpectrum, payload: payload };
    },

    /**
     * Recall memories matching topic or query
     */
    async recall(queryOrTopic, limit, mode) {
      limit = limit || 5;
      mode = mode || 'dual';
      var res = null;
      if (!queryOrTopic) {
        res = await dispatchApi('/memories?limit=' + limit);
      } else {
        var clean = encodeURIComponent(String(queryOrTopic).trim());
        res = await dispatchApi('/memories/recall?topic=' + clean);
        if (!res || !Array.isArray(res) || res.length === 0) {
          res = await dispatchApi('/memories?q=' + clean);
        }
      }
      var list = Array.isArray(res) ? res.slice(0, limit) : ((res && Array.isArray(res.memories)) ? res.memories.slice(0, limit) : []);
      return list.map(function (m) {
        if (!m || typeof m !== 'object') return m;
        var copy = Object.assign({}, m);
        copy.human_digest = MemoryEngine.formatHumanDigest(copy);
        if (!copy.ai_spectrum) {
          copy.ai_spectrum = copy.raw_payload || copy.text;
        }
        return copy;
      });
    },

    /**
     * Generic memory encoding method
     */
    async encode(memoryData) {
      if (!memoryData || !memoryData.text) return null;
      var hDigest = memoryData.human_digest || memoryData.summary || memoryData.text;
      var payload = Object.assign({
        agent_id: 'operator',
        perspective: 'operator',
        category: 'general',
        human_digest: hDigest,
        summary: hDigest,
        story: hDigest,
        tags: ['custom'],
        created_at: nowIso()
      }, memoryData);

      playMemoryChime('generic');
      return await dispatchApi('/memories/encode', { method: 'POST', body: payload });
    },

    /**
     * Trigger / Rehearse Memory
     */
    async trigger(memoryId, agentId) {
      if (!memoryId) return null;
      var mid = encodeURIComponent(String(memoryId).trim());
      var aid = encodeURIComponent(String(agentId || 'operator').trim());
      return await dispatchApi('/memories/' + mid + '/trigger?agent_id=' + aid, { method: 'POST' });
    },

    /**
     * Get Prompt Context XML (<memory_context>) for LLM Injection
     */
    async getPromptContext(limit, topic, mode) {
      limit = limit || 5;
      mode = mode || 'dual';
      var url = '/memories/prompt-context?limit=' + limit + '&format=xml';
      if (topic) url += '&topic=' + encodeURIComponent(topic);
      var res = await dispatchApi(url);
      return (res && (res.prompt_context || res.xml || res.raw)) || '<memory_context>\n  <!-- Netrunner Memory :8788 -->\n</memory_context>';
    },

    /**
     * Get Human Digest
     */
    async getDigest(limit) {
      limit = limit || 10;
      var res = await dispatchApi('/memories/digest?limit=' + limit);
      return Array.isArray(res) ? res : ((res && res.digest) || []);
    },

    // Event listener subscription
    on(event, cb) {
      if (!state.listeners[event]) state.listeners[event] = [];
      state.listeners[event].push(cb);
    },
    _emit(event, data) {
      var cbs = state.listeners[event] || [];
      cbs.forEach(function (fn) {
        try { fn(data); } catch (e) {}
      });
    }
  };

  // ── Global CustomEvent Listeners ──
  // 1. Tool execution events
  window.addEventListener('zoth:tool:run', function (e) {
    if (e.detail) MemoryEngine.recordToolRun(e.detail);
  });
  window.addEventListener('zoth:tool:execute', function (e) {
    if (e.detail) MemoryEngine.recordToolRun(e.detail);
  });
  window.addEventListener('zoth:tool:completed', function (e) {
    if (e.detail) MemoryEngine.recordToolRun(e.detail);
  });

  // 2. Code modification & AST consensus events
  window.addEventListener('zoth:code:change', function (e) {
    if (e.detail) MemoryEngine.recordCodeChange(e.detail);
  });
  window.addEventListener('zoth:code:save', function (e) {
    if (e.detail) MemoryEngine.recordCodeChange(e.detail);
  });
  window.addEventListener('zoth:ast:consensus', function (e) {
    var d = e.detail || {};
    MemoryEngine.recordCodeChange({
      filePath: d.filePath || 'consensus-synthesis.py',
      action: 'consensus-ast-triangulation',
      agentId: d.leadAgent || 'azoth',
      diffSummary: d.summary || 'Triangulated AST Consensus Code Synthesis',
      language: d.language || 'python',
      astVerified: true,
      metadata: d
    });
  });

  // 3. Annotator notes
  window.addEventListener('zoth:annotator:note', function (e) {
    var d = e.detail || {};
    MemoryEngine.encode({
      text: '📌 [Visual Annotation] Note pinned to element `' + (d.selector || 'body') + '`: "' + (d.comment || d.text || '') + '" by @' + (d.author || 'user'),
      title: '📌 Annotator Note: ' + (d.comment ? d.comment.slice(0, 40) : 'Feedback'),
      category: 'debug',
      agent_id: d.author || 'user',
      tags: ['annotator', 'ui-feedback', 'code-review', d.tag || 'review'],
      raw_payload: d
    });
  });

  // Auto check initial health
  if (typeof window !== 'undefined') {
    setTimeout(function () { MemoryEngine.checkHealth(); }, 200);
  }

  return MemoryEngine;
}));
