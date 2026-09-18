import React from 'react';
import { Terminal, Layout, ShieldCheck, Settings } from 'lucide-react';

export default function Sidebar({ status }) {
  return (
    <div className="sidebar">
      <div className="logo">SENTINEL</div>
      <nav>
        <div className="nav-item active"><Layout size={18} /> Sites</div>
        <div className="nav-item"><ShieldCheck size={18} /> OSINT War-Room</div>
        <div className="nav-item"><Settings size={18} /> Settings</div>
      </nav>
      <div className="status-box">
        <p>CLI: {status?.version || 'Offline'}</p>
      </div>
    </div>
  );
}
