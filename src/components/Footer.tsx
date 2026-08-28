'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Twitter, Facebook, Instagram, Github, Sun, Moon } from 'lucide-react';
import { BsOctagonHalf } from 'react-icons/bs';

export default function Footer() {
  const [isDesert, setIsDesert] = useState(true);

  useEffect(() => {
    const syncTheme = () => {
      const saved = localStorage.getItem('theme');
      setIsDesert(saved !== 'dark');
    };
    syncTheme();
    window.addEventListener('themechange', syncTheme);
    return () => window.removeEventListener('themechange', syncTheme);
  }, []);

  const toggleTheme = () => {
    if (isDesert) {
      setIsDesert(false);
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('desert-mode', 'light-mode');
    } else {
      setIsDesert(true);
      localStorage.setItem('theme', 'desert');
      document.documentElement.classList.add('desert-mode', 'light-mode');
      document.documentElement.classList.remove('dark');
    }
    window.dispatchEvent(new Event('themechange'));
  };

  return (
    <footer className="bg-[#060910] border-t border-slate-800/80 pt-14 pb-8 relative z-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/30">
                <BsOctagonHalf className="w-5 h-5 text-emerald-400 rotate-45" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white">Daleel</span>
                <span className="text-emerald-400 text-sm font-arabic">دليل</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              An open-access investigative pipeline for online hate speech detection, academic fact-checking, and digital chain-of-custody evidence packaging.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="hover:text-emerald-400 transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors"><Github className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Academic & Data Frameworks */}
          <div>
            <h3 className="text-slate-200 font-semibold mb-3">Indexed Research</h3>
            <ul className="space-y-2 text-slate-400">
              <li><a href="https://bridge.georgetown.edu/" target="_blank" rel="noreferrer" className="hover:text-slate-200 transition-colors">The Bridge Initiative (Georgetown)</a></li>
              <li><a href="https://tellmamauk.org/" target="_blank" rel="noreferrer" className="hover:text-slate-200 transition-colors">Tell MAMA UK Hate Monitor</a></li>
              <li><a href="https://www.ispu.org/" target="_blank" rel="noreferrer" className="hover:text-slate-200 transition-colors">ISPU Policy Research</a></li>
              <li><a href="https://www.pewresearch.org/" target="_blank" rel="noreferrer" className="hover:text-slate-200 transition-colors">Pew Demographics & Religion</a></li>
            </ul>
          </div>

          {/* Investigation Portals */}
          <div>
            <h3 className="text-slate-200 font-semibold mb-3">Investigation Portals</h3>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Community Reporter Portal</Link></li>
              <li><Link href="/login" className="hover:text-slate-200 transition-colors">Journalist & Fact-Check Hub</Link></li>
              <li><Link href="/login" className="hover:text-amber-400 transition-colors">Official & Agency Portal</Link></li>
              <li><Link href="/privacy" className="hover:text-slate-200 transition-colors">Privacy & Data Governance</Link></li>
            </ul>
          </div>

          {/* Help & Contact */}
          <div>
            <h3 className="text-slate-200 font-semibold mb-3">Investigative Desk</h3>
            <div className="bg-[#0f172a] border border-slate-800 p-3.5 rounded-xl space-y-2 text-slate-400">
              <p>For research partnerships, newsroom integration, or technical support:</p>
              <a href="mailto:daleeel.project@gmail.com" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors pt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>daleeel.project@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>&copy; {new Date().getFullYear()} Daleel Trust & Safety. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            {/* Minimalistic Inline Text Theme Toggle in Footer */}
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer group"
              title={isDesert ? "Switch to Greenish Night (Dark Mode)" : "Switch to Desert Sand (Light Mode)"}
            >
              {isDesert ? <Sun className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-45 transition-transform" /> : <Moon className="w-3.5 h-3.5 text-emerald-400 group-hover:-rotate-12 transition-transform" />}
              <span className="underline-offset-4 hover:underline">Theme: {isDesert ? 'Desert Sand' : 'Green Night'}</span>
            </button>
            <span className="text-slate-600 hidden sm:inline">&bull;</span>
            <p>Public Interest Evidence Repository</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
