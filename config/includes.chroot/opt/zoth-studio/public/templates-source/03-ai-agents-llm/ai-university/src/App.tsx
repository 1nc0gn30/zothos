import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Academics from "./pages/Academics";
import Tuition from "./pages/Tuition";
import Admissions from "./pages/Admissions";
import Campus from "./pages/Campus";
import PlaygroundPage from "./pages/Playground";
import { Privacy, Terms, ApiDocs } from "./pages/Legal";
import ShortcutModal from "./components/ui/ShortcutModal";
import { soundManager } from "./utils/soundEffects";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function GlobalKeyboardHandler({ onOpenShortcuts }: { onOpenShortcuts: () => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing when typing inside form inputs / textareas
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        onOpenShortcuts();
      } else if (e.altKey) {
        const key = e.key.toLowerCase();
        if (key === "h") {
          e.preventDefault();
          soundManager.playClick();
          navigate("/");
        } else if (key === "a") {
          e.preventDefault();
          soundManager.playClick();
          navigate("/academics");
        } else if (key === "p") {
          e.preventDefault();
          soundManager.playClick();
          navigate("/playground");
        } else if (key === "c") {
          e.preventDefault();
          soundManager.playClick();
          navigate("/campus");
        } else if (key === "t") {
          e.preventDefault();
          soundManager.playClick();
          navigate("/tuition");
        } else if (key === "e") {
          e.preventDefault();
          soundManager.playClick();
          navigate("/admissions");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, onOpenShortcuts]);

  return null;
}

export default function App() {
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const announce = (msg: string) => {
    setLiveAnnouncement(msg);
  };

  return (
    <Router>
      <ScrollToTop />
      <GlobalKeyboardHandler onOpenShortcuts={() => setIsShortcutModalOpen(true)} />
      
      {/* Screen Reader ARIA Live Region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      <div className="min-h-screen bg-university-paper selection:bg-university-crimson selection:text-white flex flex-col font-sans text-university-navy">
        <Navbar onOpenShortcuts={() => setIsShortcutModalOpen(true)} />
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/tuition" element={<Tuition />} />
            <Route path="/admissions" element={<Admissions announce={announce} />} />
            <Route path="/campus" element={<Campus />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/api-docs" element={<ApiDocs />} />
          </Routes>
        </div>

        <Footer />

        <ShortcutModal
          isOpen={isShortcutModalOpen}
          onClose={() => setIsShortcutModalOpen(false)}
        />
      </div>
    </Router>
  );
}
