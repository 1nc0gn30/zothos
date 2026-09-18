import { useMemo, useState } from "react";

function port(): string {
  return typeof window === "undefined" ? "" : window.location.port;
}

function hubHref(): string {
  return port() === "8484" ? "/hub/" : "/";
}

function deckHref(): string {
  return port() === "8484" ? "/" : "http://127.0.0.1:8484/";
}

function docsHref(): string {
  return port() === "8484" ? "http://127.0.0.1:8088/docs/" : "/docs/";
}

const LINKS = () => [
  { href: hubHref(), label: "Hub" },
  { href: deckHref(), label: "Deck" },
  { href: "/studio/", label: "Studio" },
  { href: "/studio/swarm.html", label: "Swarm" },
  { href: "/pets/", label: "Pets" },
  { href: "/vault/", label: "Vault" },
  { href: "/adytum/", label: "Adytum", on: true },
  { href: docsHref(), label: "Docs" },
];

export default function ZothStudioBar() {
  const [open, setOpen] = useState(false);
  const links = useMemo(() => LINKS(), []);

  return (
    <header className="zoth-bar">
      <a className="zoth-brand" href={hubHref()} target="_top">
        <img src="/assets/brand/zoth-seal-master.jpg" alt="" width={32} height={32} />
        <span>
          <strong>Zoth</strong>
          <small>Adytum · Studio</small>
        </span>
      </a>
      <button
        type="button"
        className="zoth-burger"
        aria-expanded={open}
        aria-controls="zoth-drawer"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav className="zoth-menu" aria-label="Zoth Studio">
        {links.map((link) => (
          <a key={link.label} href={link.href} target="_top" className={link.on ? "on" : undefined}>
            {link.label}
          </a>
        ))}
      </nav>
      {open ? (
        <nav id="zoth-drawer" className="zoth-drawer" aria-label="Zoth Studio mobile">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_top"
              className={link.on ? "on" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
