import React from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Twitter, Facebook, Instagram, Github } from 'lucide-react';
import { BsOctagonHalf } from 'react-icons/bs';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-950/50 p-2 rounded-xl border border-emerald-900/50 shadow-inner shadow-emerald-500/10">
                <BsOctagonHalf className="w-6 h-6 text-emerald-500 rotate-45" />
              </div>
              <div>
                <h2 className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
                  Daleel <span className="text-emerald-500 font-normal">دليل</span>
                </h2>
              </div>
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
              <li><Link href="/privacy" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors">Privacy Policy</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors">Data Security</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-500 text-sm transition-colors">Platform Guidelines</a></li>
            </ul>
          </div>

          {/* Help Desk */}
          <div>
            <h3 className="text-slate-100 font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Technical Support
            </h3>
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
              <p className="text-slate-400 text-sm mb-4">
                Facing technical errors? Please contact our Help Desk with a screenshot and description of the issue.
              </p>
              <div className="space-y-3">
                <a href="mailto:nizamulhaq500@gmail.com" className="flex items-center gap-3 text-slate-300 hover:text-emerald-500 transition-colors group">
                  <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-emerald-500/10">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">nizamulhaq500@gmail.com</span>
                </a>
                <a href="tel:+919596784161" className="flex items-center gap-3 text-slate-300 hover:text-emerald-500 transition-colors group">
                  <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-emerald-500/10">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <span className="text-sm font-medium">+91 9596784161</span>
                </a>
              </div>
            </div>
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
