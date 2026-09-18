/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import Scanner from './components/Scanner';
import Feed from './components/Feed';
import { Post, MOCK_POSTS } from './types';
import { ScanResult } from './services/gemini';
import { Camera, LayoutGrid, Leaf, Command, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function App() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [activeTab, setActiveTab] = useState<string>('scanner');
  const [announcerText, setAnnouncerText] = useState<string>('BudScan AI system initialized. Ready for specimen scanning.');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + S -> Scanner
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setActiveTab('scanner');
        setAnnouncerText('Switched to Scanner view.');
        toast.info('Hotkey: Switched to Scanner');
      }
      // Alt + F -> Feed
      if (e.altKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        setActiveTab('feed');
        setAnnouncerText('Switched to Community Feed view.');
        toast.info('Hotkey: Switched to Feed');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNewPost = (result: ScanResult, image: string) => {
    const newPost: Post = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      imageUrl: image,
      quality: result.quality,
      details: result.details,
      visualNotes: result.visualNotes,
      warnings: result.warnings || [],
      terpenes: result.terpenes || [],
      userName: 'GuestAnalyst_' + Math.floor(Math.random() * 900 + 100)
    };
    setPosts([newPost, ...posts]);
    setAnnouncerText(`New specimen scan posted to feed. Grade: ${result.quality.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-emerald-500/30 relative">
      {/* Skip Navigation for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        Skip to main content
      </a>

      {/* ARIA Live Region for Screen Readers */}
      <div
        id="aria-announcer"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcerText}
      </div>

      <div className="max-w-md mx-auto h-screen flex flex-col relative overflow-hidden border-x border-slate-900 shadow-2xl bg-black/90">
        {/* Banner Header */}
        <header role="banner" className="p-3.5 flex items-center justify-between border-b border-slate-900 bg-black/80 backdrop-blur-xl z-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/50 border border-emerald-400/40">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tighter uppercase italic text-emerald-400 leading-none">
                BudScan <span className="text-slate-400 font-bold">AI</span>
              </h1>
              <span className="text-[9px] text-slate-400 font-mono tracking-wider block">
                Multi-Stage Vision & Sommelier Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://nullai.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-emerald-400/80 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 px-2 py-1 rounded flex items-center gap-1 transition-colors"
              aria-label="Visit Zoth Studio Team Portfolio"
            >
              <span>Portfolio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <div
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.9)]"
              title="System Online"
              aria-label="System status online"
            />
          </div>
        </header>

        {/* Main Application Container */}
        <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col overflow-hidden outline-none">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <TabsContent value="scanner" className="h-full m-0 p-0 focus:outline-none">
                <Scanner
                  onPost={handleNewPost}
                  announcerText={announcerText}
                  setAnnouncerText={setAnnouncerText}
                />
              </TabsContent>
              <TabsContent value="feed" className="h-full m-0 p-0 focus:outline-none">
                <Feed posts={posts} />
              </TabsContent>
            </div>

            {/* Bottom Navigation */}
            <nav role="navigation" aria-label="Main Navigation">
              <TabsList className="h-20 bg-black/95 backdrop-blur-2xl border-t border-slate-900 grid grid-cols-2 p-2 gap-2 rounded-none">
                <TabsTrigger
                  value="scanner"
                  className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 flex flex-col gap-1 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-emerald-400"
                  aria-label="Scanner view (Shortcut Alt+S)"
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    Scanner <span className="text-[8px] opacity-70 font-mono">(Alt+S)</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="feed"
                  className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 flex flex-col gap-1 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-emerald-400"
                  aria-label="Community feed view (Shortcut Alt+F)"
                >
                  <LayoutGrid className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    Feed <span className="text-[8px] opacity-70 font-mono">(Alt+F)</span>
                  </span>
                </TabsTrigger>
              </TabsList>
            </nav>
          </Tabs>
        </main>
      </div>

      <Toaster position="top-center" theme="dark" closeButton />
    </div>
  );
}
