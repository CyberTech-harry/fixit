import React from "react";
import Link from "next/link";
import { Terminal, ExternalLink, Globe } from "lucide-react";
import { CATEGORIES } from "@/lib/topics-data";

export function Footer() {
  const totalGuides = CATEGORIES.reduce((acc, cat) => acc + (cat.topicCount || 0), 0);

  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[8px] bg-[#4a90e2] flex items-center justify-center text-white shadow-xs">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">
                CyberTech Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diagnostic procedures, multi-OS terminal commands, and infrastructure remediation workflows across {CATEGORIES.length} technical domains.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <Globe className="w-3.5 h-3.5 text-[#4a90e2]" />
              <span>fixit.cybertechcomps.com</span>
            </div>
          </div>

          {/* Operating Systems */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Operating Systems
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/docs/windows-os" className="hover:text-white hover:underline transition-colors">
                  Windows OS (15 Guides)
                </Link>
              </li>
              <li>
                <Link href="/docs/macos" className="hover:text-white hover:underline transition-colors">
                  macOS (10 Guides)
                </Link>
              </li>
              <li>
                <Link href="/docs/mobile" className="hover:text-white hover:underline transition-colors">
                  Mobile (iOS &amp; Android, 15 Guides)
                </Link>
              </li>
              <li>
                <Link href="/docs/web-browsers" className="hover:text-white hover:underline transition-colors">
                  Web Browsers (15 Guides)
                </Link>
              </li>
            </ul>
          </div>

          {/* Infrastructure & Tech */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Infrastructure &amp; Systems
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/docs/networking" className="hover:text-white hover:underline transition-colors">
                  Networking &amp; Internet (15 Guides)
                </Link>
              </li>
              <li>
                <Link href="/docs/security" className="hover:text-white hover:underline transition-colors">
                  Security &amp; Privacy (10 Guides)
                </Link>
              </li>
              <li>
                <Link href="/docs/hardware" className="hover:text-white hover:underline transition-colors">
                  Hardware Diagnostics (10 Guides)
                </Link>
              </li>
              <li>
                <Link href="/docs/emerging-tech" className="hover:text-white hover:underline transition-colors">
                  Emerging Tech &amp; Cloud (8 Guides)
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Resources &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/docs" className="hover:text-white hover:underline transition-colors">
                  Knowledge Base ({totalGuides} Guides)
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="hover:text-white hover:underline transition-colors">
                  Saved Solutions
                </Link>
              </li>
              <li>
                <a
                  href="https://youtu.be/p4kQbt0QUkY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors inline-flex items-center gap-1"
                >
                  Video Walkthroughs <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white hover:underline transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} CyberTech IT Knowledge Base. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">Production Ready</span>
            {/* Hidden admin dot */}
            <Link
              href="/admin"
              className="text-slate-400 hover:text-slate-200 transition-colors select-none"
              title=""
              aria-label="Portal administration"
            >
              &middot;
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
