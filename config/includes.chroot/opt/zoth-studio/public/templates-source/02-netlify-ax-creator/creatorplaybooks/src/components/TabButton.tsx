import type { ReactNode } from 'react';

export function TabButton({ active, onClick, icon, label, tooltip }: { active: boolean; onClick: () => void; icon: ReactNode; label: string; tooltip?: string }) {
  return (
    <button className={`tab ${active ? 'active' : ''}`} onClick={onClick} title={tooltip || label} data-tooltip={tooltip}>
      {icon}
      <span>{label}</span>
    </button>
  );
}
