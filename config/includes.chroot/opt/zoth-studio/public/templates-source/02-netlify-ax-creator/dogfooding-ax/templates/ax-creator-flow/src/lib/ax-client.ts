import { config } from './config';

// AX API client — fetches knowledge from the CreatorKit boilerplate's AX endpoints

export interface AxOverview {
  name: string;
  version: string;
  axVersion: string;
  endpoints: string[];
  integrationCount: number;
  playbookCount: number;
  templateCount: number;
  integrations: { id: string; name: string; category: string }[];
  playbooks: { id: string; title: string; category: string }[];
  templates: { slug: string; name: string; stack: string }[];
}

export interface AxPlaybook {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: { action: string; detail: string }[];
}

export interface AxIntegration {
  id: string;
  name: string;
  category: string;
  envVars: { key: string; required: boolean; description: string }[];
  setupUrl: string;
  notes: string;
}

export interface AxQueryResult {
  topic: string;
  playbooks: AxPlaybook[];
  integrations: AxIntegration[];
  envVars: { key: string; description: string; integration: string }[];
  templates: any[];
}

export class AxClient {
  private baseUrl: string;

  constructor(apiUrl?: string) {
    this.baseUrl = apiUrl || config.axApiUrl;
  }

  isConfigured() {
    return !!this.baseUrl;
  }

  async fetchOverview(): Promise<AxOverview> {
    const res = await fetch(`${this.baseUrl}/api/ax/overview`);
    if (!res.ok) throw new Error(`AX overview failed: ${res.status}`);
    return res.json();
  }

  async fetchPlaybooks(): Promise<{ playbooks: AxPlaybook[] }> {
    const res = await fetch(`${this.baseUrl}/api/ax/playbooks`);
    if (!res.ok) throw new Error(`AX playbooks failed: ${res.status}`);
    return res.json();
  }

  async fetchPlaybook(id: string): Promise<AxPlaybook> {
    const res = await fetch(`${this.baseUrl}/api/ax/playbooks/${id}`);
    if (!res.ok) throw new Error(`AX playbook ${id} failed: ${res.status}`);
    return res.json();
  }

  async fetchIntegrations(): Promise<{ integrations: AxIntegration[] }> {
    const res = await fetch(`${this.baseUrl}/api/ax/integrations`);
    if (!res.ok) throw new Error(`AX integrations failed: ${res.status}`);
    return res.json();
  }

  async fetchEnvVars(): Promise<{ envVars: { key: string; required: boolean; description: string; integration: string }[] }> {
    const res = await fetch(`${this.baseUrl}/api/ax/env-vars`);
    if (!res.ok) throw new Error(`AX env-vars failed: ${res.status}`);
    return res.json();
  }

  async fetchTemplates(): Promise<{ templates: any[] }> {
    const res = await fetch(`${this.baseUrl}/api/ax/templates`);
    if (!res.ok) throw new Error(`AX templates failed: ${res.status}`);
    return res.json();
  }

  async query(topic: string): Promise<AxQueryResult> {
    const res = await fetch(`${this.baseUrl}/api/ax/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });
    if (!res.ok) throw new Error(`AX query failed: ${res.status}`);
    return res.json();
  }
}