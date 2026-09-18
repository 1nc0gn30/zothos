import React, { useEffect, useState } from 'react';

const AgentStatusHud = ({ themeColor = '#ff0033' }) => {
  const [agents, setAgents] = useState([
    { id: 'RECON-01', name: 'OSINT Radar', role: 'Asset Enumeration', status: 'ONLINE', load: 24, ram: '180 MB', tasks: 1429 },
    { id: 'VULN-02', name: 'CVE Classifier', role: 'Vulnerability Match', status: 'SCANNING', load: 68, ram: '420 MB', tasks: 892 },
    { id: 'EXPLOIT-03', name: 'Payload Synth', role: 'Sandbox Simulation', status: 'STANDBY', load: 8, ram: '95 MB', tasks: 318 },
    { id: 'NEURAL-04', name: 'LocalAI Bridge', role: 'LLM Cognitive Core', status: 'ACTIVE', load: 82, ram: '4.8 GB', tasks: 2044 },
    { id: 'DEFENSE-05', name: 'Mitre Patch', role: 'Countermeasure Engine', status: 'VERIFIED', load: 15, ram: '110 MB', tasks: 610 },
  ]);

  const [vram, setVram] = useState(4.82);
  const [tokensPerSec, setTokensPerSec] = useState(48.6);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        load: Math.min(100, Math.max(5, Math.floor(agent.load + (Math.random() * 14 - 7)))),
        tasks: agent.status === 'SCANNING' || agent.status === 'ACTIVE' ? agent.tasks + Math.floor(Math.random() * 2) : agent.tasks
      })));
      setTokensPerSec(prev => Number((46 + Math.random() * 6).toFixed(1)));
      setVram(prev => Number((4.78 + Math.random() * 0.12).toFixed(2)));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="agent-hud-container" role="region" aria-label="Agent Orchestration HUD">
      <div className="hud-header">
        <div className="hud-title">
          <span className="live-dot" />
          <span>AUTONOMOUS AGENT ORCHESTRATION CLUSTER</span>
        </div>
        <div className="hud-meta">
          <span>VRAM: <strong style={{ color: themeColor }}>{vram} GB / 6.00 GB</strong></span>
          <span>SPEED: <strong style={{ color: themeColor }}>{tokensPerSec} T/s</strong></span>
        </div>
      </div>

      <div className="hud-grid">
        {agents.map((agent) => (
          <div key={agent.id} className="hud-agent-card">
            <div className="agent-card-top">
              <span className="agent-id">[{agent.id}]</span>
              <span className={`agent-badge status-${agent.status.toLowerCase()}`}>
                {agent.status}
              </span>
            </div>
            <div className="agent-name">{agent.name}</div>
            <div className="agent-role">{agent.role}</div>

            <div className="agent-gauge-track">
              <div
                className="agent-gauge-fill"
                style={{
                  width: `${agent.load}%`,
                  backgroundColor: agent.load > 75 ? '#ff3344' : themeColor
                }}
              />
            </div>

            <div className="agent-card-stats">
              <span>LOAD: {agent.load}%</span>
              <span>RAM: {agent.ram}</span>
              <span>OPS: {agent.tasks.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .agent-hud-container {
          background: rgba(10, 2, 4, 0.85);
          border: 1px solid rgba(255, 0, 50, 0.25);
          border-radius: 4px;
          padding: 12px 16px;
          margin-bottom: 12px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
        }

        .hud-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 0, 50, 0.2);
          padding-bottom: 8px;
          margin-bottom: 12px;
          font-size: 0.75rem;
          letter-spacing: 1.5px;
        }

        .hud-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #ffffff;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #00ff66;
          border-radius: 50%;
          box-shadow: 0 0 8px #00ff66;
          animation: pulseDot 1.4s infinite;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .hud-meta {
          display: flex;
          gap: 16px;
          font-size: 0.7rem;
          color: #888;
        }

        .hud-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
        }

        .hud-agent-card {
          background: rgba(18, 5, 8, 0.7);
          border: 1px solid rgba(255, 0, 50, 0.18);
          border-radius: 3px;
          padding: 8px 10px;
          font-size: 0.7rem;
          transition: border-color 0.2s;
        }

        .hud-agent-card:hover {
          border-color: rgba(255, 0, 50, 0.5);
        }

        .agent-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .agent-id {
          color: #888;
          font-weight: bold;
        }

        .agent-badge {
          font-size: 0.6rem;
          padding: 2px 6px;
          border-radius: 2px;
          font-weight: bold;
          letter-spacing: 0.5px;
        }

        .status-online, .status-verified {
          background: rgba(0, 255, 100, 0.15);
          color: #00ff66;
          border: 1px solid rgba(0, 255, 100, 0.3);
        }

        .status-active, .status-scanning {
          background: rgba(255, 0, 80, 0.2);
          color: #ff3366;
          border: 1px solid rgba(255, 0, 80, 0.4);
        }

        .status-standby {
          background: rgba(255, 200, 0, 0.15);
          color: #ffcc00;
          border: 1px solid rgba(255, 200, 0, 0.3);
        }

        .agent-name {
          font-weight: 700;
          color: #ffffff;
          font-size: 0.78rem;
          margin-bottom: 2px;
        }

        .agent-role {
          color: #777;
          font-size: 0.65rem;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .agent-gauge-track {
          width: 100%;
          height: 4px;
          background: #1a080c;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .agent-gauge-fill {
          height: 100%;
          transition: width 0.4s ease;
        }

        .agent-card-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.62rem;
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default AgentStatusHud;
