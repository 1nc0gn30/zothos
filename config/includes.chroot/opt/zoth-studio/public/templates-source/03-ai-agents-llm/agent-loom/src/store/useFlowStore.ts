import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
} from '@xyflow/react';
import type { AgentTemplate } from '../components/agents/agentTemplates';
import { AGENT_TEMPLATES } from '../components/agents/agentTemplates';
import { playSound, setAudioMuted } from '../utils/audio';

export type LoopMode = 'once' | 'loop' | 'loop-on-error' | 'loop-max';
export type ThemeMode = 'parrot' | 'dark' | 'light';

export interface AgentNodeData {
  [key: string]: unknown;
  label: string;
  role: 'leaf' | 'orchestrator';
  provider: string;
  model: string;
  toolset: string[];
  skills: string[];
  instructions: string;
  loopMode: LoopMode;
  maxLoops: number;
  timeout: number;
  status: 'idle' | 'running' | 'done' | 'error';
  logs: string[];
  output?: string;
  pet: string;
}

export type AgentNode = Node<AgentNodeData>;
export type AgentEdge = Edge;

export interface LogEntry {
  timestamp: string;
  nodeId: string;
  agentLabel: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warn' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

interface FlowState {
  nodes: AgentNode[];
  edges: AgentEdge[];
  selectedNodeId: string | null;
  sidebarNode: AgentNode | null;
  theme: ThemeMode;
  logsTab: string | 'all';
  toasts: ToastItem[];
  isMuted: boolean;
  ariaAnnouncement: string;
  isLogDrawerOpen: boolean;
  isShortcutsOpen: boolean;
  globalLogs: LogEntry[];
  isExecuting: boolean;

  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onConnect: (connection: any) => void;
  addNode: () => void;
  addNodeFromTemplate: (template: AgentTemplate) => void;
  updateNode: (id: string, patch: Partial<AgentNodeData>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  openSidebar: (node: AgentNode | null) => void;
  setTheme: (theme: ThemeMode) => void;
  setLogsTab: (tab: string | 'all') => void;
  toggleMute: () => void;
  setAriaAnnouncement: (msg: string) => void;
  toggleLogDrawer: () => void;
  toggleShortcuts: () => void;
  clearGlobalLogs: () => void;
  loadPresetWorkflow: (preset: 'fullstack' | 'security' | 'mlops') => void;
  exportWorkflowJson: () => void;
  importWorkflowJson: (jsonString: string) => boolean;
  runFlow: () => Promise<void>;
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

let nodeCounter = 0;
const makeId = () => `agent_${Date.now()}_${++nodeCounter}`;

const MOCK_OUTPUTS: Record<string, string> = {
  'web-builder': [
    '```tsx',
    '// Interactive Agent Web Component',
    'export function AgentLoomWidget() {',
    '  return (',
    '    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30">',
    '      <h2 className="text-xl font-bold text-cyan-400">Agent Loom Pipeline</h2>',
    '      <p className="text-sm text-slate-300">Multi-agent reactive canvas running.</p>',
    '    </div>',
    '  );',
    '}',
    '```'
  ].join('\n'),
  'code-reviewer': [
    '### Code Audit Summary',
    '- **Security Check**: PASS (0 injection vectors detected)',
    '- **TypeScript Strictness**: PASS (100% covered)',
    '- **Refactor Suggestion**: Wrap subagent state mutations in atomic batch update.'
  ].join('\n'),
  'devops-engineer': [
    '```dockerfile',
    '# Multi-stage container for Agent Loom',
    'FROM node:22-alpine AS builder',
    'WORKDIR /app',
    'COPY package*.json ./',
    'RUN npm ci',
    'COPY . .',
    'RUN npm run build',
    '```'
  ].join('\n'),
  'security-analyst': [
    '### Threat Model Scan Report',
    '- OWASP Top 10 Audit: Cleared',
    '- Input Sanitization: Verified',
    '- Focus Ring & ARIA Landmarks: Compliant with WCAG 2.1 AA'
  ].join('\n'),
  'data-scientist': [
    '```python',
    '# Synthetic Agent Performance Analytics',
    'import pandas as pd',
    'import numpy as np',
    '',
    'def calculate_throughput(execution_times):',
    '    return np.mean(execution_times), np.std(execution_times)',
    '```'
  ].join('\n'),
  'mlops-engineer': [
    '### Model Deployment Status',
    '- Endpoint: https://api.nealfrazier.tech/v1/models/hermes-llama3',
    '- Status: HEALTHY (Latency: 42ms p95)'
  ].join('\n'),
  'research-agent': [
    '### Synthesis: Autonomous Multi-Agent Architectures',
    '1. Topological DAG routing improves complex reasoning efficiency by 38%.',
    '2. Isolated leaf agents prevent token memory corruption across steps.'
  ].join('\n'),
  'doc-writer': [
    '### Agent Loom API Documentation',
    '- runFlow(): Initiates async topological execution of all agent graph roots.',
    '- addNodeFromTemplate(template): Instantiates specialized agent from catalog.'
  ].join('\n'),
  'orchestrator': [
    '### Master Plan & Task Matrix',
    '- Step 1: Research & Threat Model -> Security Analyst',
    '- Step 2: UI Canvas Component -> Web Builder',
    '- Step 3: CI/CD Pipeline -> DevOps Engineer',
    '- Status: All tasks delegated and verified.'
  ].join('\n'),
};

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  sidebarNode: null,
  theme: 'parrot',
  logsTab: 'all',
  toasts: [],
  isMuted: false,
  ariaAnnouncement: '',
  isLogDrawerOpen: false,
  isShortcutsOpen: false,
  globalLogs: [],
  isExecuting: false,

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes as unknown as any[]) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges as unknown as any[]) }),

  onConnect: (connection) => {
    playSound('connect');
    set({ edges: addEdge(connection, get().edges) });
    get().setAriaAnnouncement('Connected two agent nodes in workflow.');
  },

  addNode: () => {
    playSound('add');
    const id = makeId();
    const newNode: AgentNode = {
      id,
      type: 'agentNode',
      position: { x: Math.random() * 300 + 150, y: Math.random() * 250 + 120 },
      data: {
        label: `Agent ${nodeCounter}`,
        role: 'leaf',
        provider: 'openrouter',
        model: 'openai/gpt-4o',
        toolset: ['browser', 'terminal'],
        skills: ['frontend-design'],
        instructions: 'You are an autonomous AI agent in Agent Loom.',
        loopMode: 'once',
        maxLoops: 3,
        timeout: 60,
        status: 'idle',
        logs: [],
        pet: 'fox',
      },
    };
    set({ nodes: [...get().nodes, newNode] });
    get().setAriaAnnouncement(`Added new agent ${newNode.data.label} to canvas.`);
    get().addToast({
      type: 'info',
      title: 'Agent Added',
      message: `${newNode.data.label} ready for configuration.`,
    });
  },

  addNodeFromTemplate: (template) => {
    playSound('add');
    const id = makeId();
    const newNode: AgentNode = {
      id,
      type: 'agentNode',
      position: { x: Math.random() * 320 + 180, y: Math.random() * 250 + 100 },
      data: {
        label: template.label,
        role: template.role,
        provider: template.provider,
        model: template.model,
        toolset: [...template.toolset],
        skills: [...template.skills],
        instructions: template.instructions,
        loopMode: template.loopMode,
        maxLoops: template.maxLoops,
        timeout: template.timeout,
        status: 'idle',
        logs: [],
        pet: template.pet,
      },
    };
    set({ nodes: [...get().nodes, newNode] });
    get().setAriaAnnouncement(`Deployed ${template.label} template to canvas.`);
    get().addToast({
      type: 'success',
      title: `${template.label} Deployed`,
      message: `${template.role === 'orchestrator' ? 'Orchestrator' : 'Leaf'} agent ready with ${template.toolset.length} tool${template.toolset.length !== 1 ? 's' : ''}.`,
    });
  },

  updateNode: (id, patch) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...patch } } : n
      ),
      sidebarNode:
        get().sidebarNode?.id === id
          ? { ...get().sidebarNode!, data: { ...get().sidebarNode!.data, ...patch } }
          : get().sidebarNode,
    }),

  deleteNode: (id) => {
    playSound('delete');
    const target = get().nodes.find((n) => n.id === id);
    const label = target?.data.label || 'Agent';
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      sidebarNode: get().sidebarNode?.id === id ? null : get().sidebarNode,
    });
    get().setAriaAnnouncement(`Deleted ${label} from canvas.`);
    get().addToast({
      type: 'warn',
      title: 'Agent Deleted',
      message: `${label} removed from workflow graph.`,
    });
  },

  selectNode: (id) => set({ selectedNodeId: id }),
  openSidebar: (node) => set({ sidebarNode: node }),
  setTheme: (theme) => set({ theme }),
  setLogsTab: (tab) => set({ logsTab: tab }),

  toggleMute: () => {
    const next = !get().isMuted;
    setAudioMuted(next);
    set({ isMuted: next });
  },

  setAriaAnnouncement: (msg) => set({ ariaAnnouncement: msg }),
  toggleLogDrawer: () => set((s) => ({ isLogDrawerOpen: !s.isLogDrawerOpen })),
  toggleShortcuts: () => set((s) => ({ isShortcutsOpen: !s.isShortcutsOpen })),
  clearGlobalLogs: () => set({ globalLogs: [] }),

  loadPresetWorkflow: (preset) => {
    playSound('add');
    let newNodes: AgentNode[] = [];
    let newEdges: AgentEdge[] = [];

    const orchTemplate = AGENT_TEMPLATES.find((t) => t.id === 'orchestrator')!;
    const webTemplate = AGENT_TEMPLATES.find((t) => t.id === 'web-builder')!;
    const reviewerTemplate = AGENT_TEMPLATES.find((t) => t.id === 'code-reviewer')!;
    const devopsTemplate = AGENT_TEMPLATES.find((t) => t.id === 'devops-engineer')!;
    const secTemplate = AGENT_TEMPLATES.find((t) => t.id === 'security-analyst')!;
    const docTemplate = AGENT_TEMPLATES.find((t) => t.id === 'doc-writer')!;
    const dataTemplate = AGENT_TEMPLATES.find((t) => t.id === 'data-scientist')!;
    const mlopsTemplate = AGENT_TEMPLATES.find((t) => t.id === 'mlops-engineer')!;

    if (preset === 'fullstack') {
      const n1: AgentNode = {
        id: 'preset_orch_1',
        type: 'agentNode',
        position: { x: 100, y: 150 },
        data: { ...orchTemplate, label: 'Master Orchestrator', status: 'idle', logs: [] },
      };
      const n2: AgentNode = {
        id: 'preset_web_1',
        type: 'agentNode',
        position: { x: 450, y: 50 },
        data: { ...webTemplate, label: 'Web UI Builder', status: 'idle', logs: [] },
      };
      const n3: AgentNode = {
        id: 'preset_rev_1',
        type: 'agentNode',
        position: { x: 450, y: 250 },
        data: { ...reviewerTemplate, label: 'PR Auditor', status: 'idle', logs: [] },
      };
      const n4: AgentNode = {
        id: 'preset_dev_1',
        type: 'agentNode',
        position: { x: 800, y: 150 },
        data: { ...devopsTemplate, label: 'CI/CD Deployer', status: 'idle', logs: [] },
      };
      newNodes = [n1, n2, n3, n4];
      newEdges = [
        { id: 'e1-2', source: 'preset_orch_1', target: 'preset_web_1', animated: true, style: { stroke: 'var(--accent)', strokeWidth: 2 } },
        { id: 'e1-3', source: 'preset_orch_1', target: 'preset_rev_1', animated: true, style: { stroke: 'var(--accent)', strokeWidth: 2 } },
        { id: 'e2-4', source: 'preset_web_1', target: 'preset_dev_1', animated: true, style: { stroke: 'var(--accent)', strokeWidth: 2 } },
        { id: 'e3-4', source: 'preset_rev_1', target: 'preset_dev_1', animated: true, style: { stroke: 'var(--accent)', strokeWidth: 2 } },
      ];
    } else if (preset === 'security') {
      const n1: AgentNode = {
        id: 'preset_orch_sec',
        type: 'agentNode',
        position: { x: 120, y: 160 },
        data: { ...orchTemplate, label: 'Security Chief', status: 'idle', logs: [] },
      };
      const n2: AgentNode = {
        id: 'preset_sec_1',
        type: 'agentNode',
        position: { x: 460, y: 60 },
        data: { ...secTemplate, label: 'OWASP Vulnerability Scanner', status: 'idle', logs: [] },
      };
      const n3: AgentNode = {
        id: 'preset_rev_2',
        type: 'agentNode',
        position: { x: 460, y: 260 },
        data: { ...reviewerTemplate, label: 'Hardened Code Auditor', status: 'idle', logs: [] },
      };
      const n4: AgentNode = {
        id: 'preset_doc_1',
        type: 'agentNode',
        position: { x: 820, y: 160 },
        data: { ...docTemplate, label: 'Compliance Writer', status: 'idle', logs: [] },
      };
      newNodes = [n1, n2, n3, n4];
      newEdges = [
        { id: 'es1-2', source: 'preset_orch_sec', target: 'preset_sec_1', animated: true, style: { stroke: 'var(--accent)', strokeWidth: 2 } },
        { id: 'es1-3', source: 'preset_orch_sec', target: 'preset_rev_2', animated: true, style: { stroke: 'var(--accent)', strokeWidth: 2 } },
        { id: 'es2-4', source: 'preset_sec_1', target: 'preset_doc_1', animated: true, style: { stroke: 'var(--accent)', strokeWidth: 2 } },
        { id: 'es3-4', source: 'preset_rev_2', target: 'preset_doc_1', animated: true, style: { stroke: 'var(--accent)', strokeWidth: 2 } },
      ];
    } else if (preset === 'mlops') {
      const n1: AgentNode = {
        id: 'preset_data_1',
        type: 'agentNode',
        position: { x: 100, y: 150 },
        data: { ...dataTemplate, label: 'Data Scientist', status: 'idle', logs: [] },
      };
      const n2: AgentNode = {
        id: 'preset_mlops_1',
        type: 'agentNode',
        position: { x: 460, y: 150 },
        data: { ...mlopsTemplate, label: 'Model Pipeline Builder', status: 'idle', logs: [] },
      };
      const n3: AgentNode = {
        id: 'preset_dev_ml',
        type: 'agentNode',
        position: { x: 820, y: 150 },
        data: { ...devopsTemplate, label: 'Kubernetes Cluster Deployer', status: 'idle', logs: [] },
      };
      newNodes = [n1, n2, n3];
      newEdges = [
        { id: 'em1-2', source: 'preset_data_1', target: 'preset_mlops_1', animated: true, style: { stroke: 'var(--accent)', strokeWidth: 2 } },
        { id: 'em2-3', source: 'preset_mlops_1', target: 'preset_dev_ml', animated: true, style: { stroke: 'var(--accent)', strokeWidth: 2 } },
      ];
    }

    set({ nodes: newNodes, edges: newEdges, selectedNodeId: null, sidebarNode: null });
    get().setAriaAnnouncement(`Loaded ${preset} preset pipeline into canvas.`);
    get().addToast({
      type: 'success',
      title: 'Preset Loaded',
      message: `Deployed ${preset} multi-agent workflow graph (${newNodes.length} nodes).`,
    });
  },

  exportWorkflowJson: () => {
    playSound('click');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      version: '1.0.0',
      name: 'Agent Loom Pipeline',
      createdAt: new Date().toISOString(),
      nodes: get().nodes,
      edges: get().edges,
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `agent-loom-workflow-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    get().addToast({
      type: 'info',
      title: 'Workflow Exported',
      message: 'Downloaded JSON workflow configuration file.',
    });
  },

  importWorkflowJson: (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        playSound('add');
        set({ nodes: parsed.nodes, edges: parsed.edges, selectedNodeId: null, sidebarNode: null });
        get().setAriaAnnouncement(`Imported workflow with ${parsed.nodes.length} nodes.`);
        get().addToast({
          type: 'success',
          title: 'Workflow Imported',
          message: `Loaded ${parsed.nodes.length} agent nodes and ${parsed.edges.length} edges.`,
        });
        return true;
      }
    } catch (err) {
      get().addToast({
        type: 'error',
        title: 'Import Failed',
        message: 'Invalid JSON workflow format.',
      });
    }
    return false;
  },

  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastItem = { ...toast, id, duration: toast.duration ?? 3500 };
    set({ toasts: [...get().toasts, newToast] });
    setTimeout(() => {
      get().removeToast(id);
    }, newToast.duration);
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },

  runFlow: async () => {
    const state = get();
    if (state.isExecuting) return;
    if (state.nodes.length === 0) {
      state.addToast({
        type: 'warn',
        title: 'Empty Workflow',
        message: 'Add at least one agent node before running the flow.',
      });
      return;
    }

    playSound('run');
    set({ isExecuting: true });
    state.setAriaAnnouncement(`Started workflow execution across ${state.nodes.length} agents.`);
    state.addToast({
      type: 'info',
      title: 'Execution Started',
      message: `Running workflow pipeline across ${state.nodes.length} agent nodes...`,
    });

    const appendGlobalLog = (nodeId: string, label: string, msg: string, type: LogEntry['type']) => {
      const entry: LogEntry = {
        timestamp: new Date().toLocaleTimeString(),
        nodeId,
        agentLabel: label,
        message: msg,
        type,
      };
      set((s) => ({ globalLogs: [entry, ...s.globalLogs.slice(0, 99)] }));
    };

    const runNode = async (nodeId: string): Promise<void> => {
      const node = get().nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const label = node.data.label;
      state.updateNode(nodeId, { status: 'running', logs: [`🤖 Starting execution for ${label}...`] });
      appendGlobalLog(nodeId, label, `Agent initialized (${node.data.provider} / ${node.data.model})`, 'info');
      state.setAriaAnnouncement(`Agent ${label} is now running.`);

      const maxLoops = node.data.loopMode === 'loop-max' ? node.data.maxLoops : 1;

      for (let i = 0; i < maxLoops; i++) {
        const loopLabel = maxLoops > 1 ? `[Loop ${i + 1}/${maxLoops}]` : '';
        
        await new Promise((resolve) => setTimeout(resolve, 600));

        const toolMsg = node.data.toolset.length > 0
          ? `Invoking tools: [${node.data.toolset.join(', ')}]...`
          : 'Processing instructions...';

        state.updateNode(nodeId, {
          logs: [...(get().nodes.find((n) => n.id === nodeId)?.data.logs || []), `${loopLabel} ${toolMsg}`],
        });
        appendGlobalLog(nodeId, label, `${loopLabel} ${toolMsg}`, 'info');

        await new Promise((resolve) => setTimeout(resolve, 700));

        const success = Math.random() > 0.08;
        if (success) {
          const matchKey = Object.keys(MOCK_OUTPUTS).find((k) =>
            node.data.label.toLowerCase().includes(k) || node.data.instructions.toLowerCase().includes(k)
          ) || (node.data.role === 'orchestrator' ? 'orchestrator' : 'web-builder');

          const mockResult = MOCK_OUTPUTS[matchKey] || `### ${label} Output Summary\nSuccessfully completed task.`;
          
          state.updateNode(nodeId, {
            status: 'done',
            output: mockResult,
            logs: [
              ...(get().nodes.find((n) => n.id === nodeId)?.data.logs || []),
              `${loopLabel} ✅ Executed successfully. Generated artifact response.`,
            ],
          });
          playSound('success');
          appendGlobalLog(nodeId, label, `${loopLabel} ✅ Finished successfully`, 'success');
          state.setAriaAnnouncement(`Agent ${label} completed successfully.`);
        } else {
          state.updateNode(nodeId, {
            status: 'error',
            logs: [
              ...(get().nodes.find((n) => n.id === nodeId)?.data.logs || []),
              `${loopLabel} ❌ Timeout / API Fallback trigger encountered`,
            ],
          });
          playSound('error');
          appendGlobalLog(nodeId, label, `${loopLabel} ❌ Encountered fallback timeout`, 'error');
          state.setAriaAnnouncement(`Agent ${label} encountered an error.`);

          if (node.data.loopMode === 'loop-on-error') {
            state.updateNode(nodeId, {
              logs: [...(get().nodes.find((n) => n.id === nodeId)?.data.logs || []), 'Retrying on error...'],
            });
            appendGlobalLog(nodeId, label, 'Retrying step...', 'warn');
          }
        }
      }

      // Execute child outgoing nodes topologically
      const outgoing = get().edges.filter((e) => e.source === nodeId);
      for (const edge of outgoing) {
        const targetNode = get().nodes.find((n) => n.id === edge.target);
        if (targetNode && targetNode.data.status === 'idle') {
          await runNode(edge.target);
        }
      }
    };

    // Reset nodes to idle
    set({
      nodes: get().nodes.map((n) => ({
        ...n,
        data: { ...n.data, status: 'idle' as const, logs: [], output: undefined },
      })),
    });

    const roots = state.nodes.filter(
      (n) => !state.edges.some((e) => e.target === n.id)
    );

    const startRoots = roots.length > 0 ? roots : [state.nodes[0]];

    for (const root of startRoots) {
      await runNode(root.id);
    }

    set({ isExecuting: false });
    state.addToast({
      type: 'success',
      title: 'Flow Complete',
      message: 'Multi-agent pipeline execution finished.',
    });
    state.setAriaAnnouncement('Workflow pipeline execution complete.');
  },
}));

export const useNodes = () => useFlowStore((s) => s.nodes);
export const useEdges = () => useFlowStore((s) => s.edges);
