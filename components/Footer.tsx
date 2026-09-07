import React from "react";
import Link from "next/link";
import { Terminal, ExternalLink } from "lucide-react";
import { CATEGORIES } from "@/lib/topics-data";

export function Footer() {
  return (
    <footer className="w-full bg-[#4a90e2] text-white border-t-2 border-[#ddd] mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[10px] bg-white/20 border border-white/30 flex items-center justify-center text-white">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white">
                CyberTech Portal
              </span>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              IT documentation and troubleshooting reference across 10 technical domains. 117 guides covering Windows, macOS, Linux, networking, security, hardware, and more.
            </p>
          </div>

          {/* Operating Systems */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Operating Systems
            </h4>
            <ul className="space-y-2 text-xs text-blue-100">
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
                  Mobile — iOS &amp; Android (15 Guides)
                </Link>
              </li>
              <li>
                <Link href="/docs/web-browsers" className="hover:text-white hover:underline transition-colors">
                  Web Browsers (15 Guides)
                </Link>
              </li>
            </ul>
          </div>

          {/* Infrastructure & Hardware */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Infrastructure &amp; Tech
            </h4>
            <ul className="space-y-2 text-xs text-blue-100">
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
                  Emerging Tech &amp; AI (7 Guides)
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal Utilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Portal
            </h4>
            <ul className="space-y-2 text-xs text-blue-100">
              <li>
                <Link href="/bookmarks" className="hover:text-white hover:underline transition-colors">
                  Bookmarks
                </Link>
              </li>
              <li>
                <a
                  href="https://youtu.be/p4kQbt0QUkY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors inline-flex items-center gap-1"
                >
                  YouTube Channel <ExternalLink className="w-3 h-3" />
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

        <div className="pt-6 border-t border-blue-400/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-100">
          <p>&copy; {new Date().getFullYear()} CyberTech IT Knowledge Base. All rights reserved.</p>
          {/* Hidden admin access */}
          <Link
            href="/admin"
            className="text-blue-300 hover:text-white transition-colors select-none"
            title=""
            aria-label="Portal management"
          >
            &middot;
          </Link>
        </div>
      </div>
    </footer>
  );
}
