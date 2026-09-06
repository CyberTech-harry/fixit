import React from "react";
import Link from "next/link";
import { Terminal, Shield, Sparkles, Heart, ExternalLink } from "lucide-react";
import { CATEGORIES } from "@/lib/topics-data";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-stone-900 dark:text-white">
                CyberTech Portal
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              High-performance full-stack IT documentation and troubleshooting portal spanning 10 core domains, 117+ interactive guides, terminal commands, and telemetry diagnostics.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-teal-100/60 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-medium">
                Next.js App Router
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono">
                Prisma ORM
              </span>
            </div>
          </div>

          {/* Operating Systems */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-3">
              Operating Systems
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/docs/windows-os" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Windows OS (15 Guides)
                </Link>
              </li>
              <li>
                <Link href="/docs/macos" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  macOS (10 Guides)
                </Link>
              </li>
              <li>
                <Link href="/docs/mobile" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Mobile (iOS & Android) (15 Guides)
                </Link>
              </li>
              <li>
                <Link href="/docs/web-browsers" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Web Browsers (15 Guides)
                </Link>
              </li>
            </ul>
          </div>

          {/* Infrastructure & Hardware */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-3">
              Infrastructure & Tech
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/docs/networking" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Networking & Internet (15 Guides)
                </Link>
              </li>
              <li>
                <Link href="/docs/security" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Security & Privacy (10 Guides)
                </Link>
              </li>
              <li>
                <Link href="/docs/hardware" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Hardware Diagnostics (10 Guides)
                </Link>
              </li>
              <li>
                <Link href="/docs/emerging-tech" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Emerging Tech & AI (7 Guides)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Tools & Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-3">
              Portal Utilities
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/bookmarks" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Saved Bookmark Vault
                </Link>
              </li>
              <li>
                <a
                  href="https://youtu.be/p4kQbt0QUkY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors inline-flex items-center gap-1"
                >
                  YouTube Channel <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/docs/productivity" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Productivity Automations
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <p>© {new Date().getFullYear()} CyberTech IT Knowledge Base. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400">
              <Sparkles className="w-3.5 h-3.5" /> 117+ Curated Technical Solutions
            </span>
            {/* Hidden admin access — discreet dot in footer */}
            <Link
              href="/admin"
              className="text-stone-300 dark:text-stone-700 hover:text-stone-400 dark:hover:text-stone-500 transition-colors select-none"
              title=""
              aria-label="Portal management"
            >
              ·
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
