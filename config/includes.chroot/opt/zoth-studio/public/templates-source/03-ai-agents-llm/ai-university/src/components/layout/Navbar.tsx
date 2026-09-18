import { GraduationCap, Keyboard, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { soundManager } from "../../utils/soundEffects";

interface NavbarProps {
  onOpenShortcuts?: () => void;
}

export default function Navbar({ onOpenShortcuts }: NavbarProps) {
  return (
    <header role="banner">
      {/* Accessibility Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-university-crimson focus:text-white focus:font-bold focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-university-gold"
      >
        Skip to main content
      </a>

      <nav
        aria-label="Main Navigation"
        className="fixed w-full top-0 z-50 bg-university-paper/85 backdrop-blur-md border-b border-university-navy/10 px-6 py-4 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            onClick={() => soundManager.playClick()}
            className="flex items-center gap-2 hover:opacity-85 transition-opacity focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none rounded-xs p-1"
          >
            <GraduationCap className="h-8 w-8 text-university-crimson" aria-hidden="true" />
            <span className="font-serif font-semibold text-2xl tracking-tight text-university-navy">
              Von Neumann University
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide uppercase text-university-navy/80">
            <Link
              to="/academics"
              onClick={() => soundManager.playClick()}
              className="hover:text-university-crimson transition-colors focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none rounded-xs py-1"
            >
              Academics
            </Link>
            <Link
              to="/playground"
              onClick={() => soundManager.playClick()}
              className="hover:text-university-crimson transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none rounded-xs py-1"
            >
              <Sparkles className="h-3.5 w-3.5 text-university-gold" />
              AI Lab & Playground
            </Link>
            <Link
              to="/campus"
              onClick={() => soundManager.playClick()}
              className="hover:text-university-crimson transition-colors focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none rounded-xs py-1"
            >
              Campus
            </Link>
            <Link
              to="/tuition"
              onClick={() => soundManager.playClick()}
              className="hover:text-university-crimson transition-colors focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none rounded-xs py-1"
            >
              Tuition
            </Link>
            <Link
              to="/admissions"
              onClick={() => soundManager.playClick()}
              className="hover:text-university-crimson transition-colors focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none rounded-xs py-1"
            >
              Admissions
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {onOpenShortcuts && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenShortcuts();
                }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-university-paper border border-university-navy/15 text-university-navy text-xs font-bold uppercase tracking-wider hover:bg-university-navy hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none"
                title="View Keyboard Shortcuts (?)"
                aria-label="View Keyboard Shortcuts"
              >
                <Keyboard className="h-4 w-4 text-university-gold" />
                <span className="font-mono text-[10px]">?</span>
              </button>
            )}

            <Link
              to="/admissions"
              onClick={() => soundManager.playClick()}
              className="px-6 py-2.5 bg-university-navy text-university-paper text-sm font-medium uppercase tracking-wider hover:bg-university-crimson transition-colors focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:outline-none shadow-sm"
            >
              Enroll Agent
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
