import React from 'react';
import { Mail, ArrowRight, ShieldCheck, Twitter, Facebook, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Daleel<span className="text-emerald-500">.</span></h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              AI-Powered Anti-Muslim Hate Evidence Packager. Empowering communities, journalists, and officials to combat Islamophobia through verifiable data and factual counter-narratives.
            </p>
            <div className="flex items-center gap-4 text-slate-500">
              <a href="#" className="hover:text-emerald-500 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-emerald-500 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-emerald-500 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-emerald-500 transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-100 font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors">Report an Incident</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors">Journalist Hub</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors">Official Portal</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors">False Narratives Database</a></li>
            </ul>
          </div>

          {/* Legal & Policy */}
          <div>
            <h3 className="text-slate-100 font-bold mb-4">Legal & Policy</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors">Data Security</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors">Platform Guidelines</a></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-slate-100 font-bold mb-4">Stay Informed</h3>
            <p className="text-slate-400 text-sm mb-4">Subscribe to our newsletter for weekly intelligence reports on emerging hate narratives.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); alert("Subscribed to Daleel Newsletter!"); }}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Daleel Organization. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Built for The Harvest Anti-Muslim Hate Hackathon
          </p>
        </div>
      </div>
    </footer>
  );
}
