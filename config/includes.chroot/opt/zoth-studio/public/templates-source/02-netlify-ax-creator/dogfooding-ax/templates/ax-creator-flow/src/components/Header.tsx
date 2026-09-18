import { Link } from 'react-router-dom';
import { useState } from 'react';

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const links = [
  { label: 'AX Browser', href: '/#ax-browser' },
  { label: 'Setup Wizard', href: '/#wizard' },
  { label: 'Playbooks', href: '/#playbooks' },
  { label: 'Book a call', href: '/#book' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg tracking-tight flex items-center gap-2">
          <span className="text-brand-500">AX</span>
          <span>Creator Flow</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-zinc-100 transition">{l.label}</a>
          ))}
          <a
            href="https://github.com/nealfrazier/creator-netlify-boilerplate"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-zinc-100 transition"
          >
            <GithubIcon /> Star
          </a>
        </nav>
        <button className="md:hidden p-2 -mr-2" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-zinc-300 hover:text-white">
              {l.label}
            </a>
          ))}
          <a href="https://github.com/nealfrazier/creator-netlify-boilerplate" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-zinc-300 hover:text-white">
            <GithubIcon /> GitHub
          </a>
        </div>
      )}
    </header>
  );
}