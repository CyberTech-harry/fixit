"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  BookOpen,
  Terminal,
  ArrowRight,
  Clock,
  Send,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Server,
  CreditCard,
  Database,
  Cloud,
  Laptop,
  Globe,
  TrendingUp,
} from "lucide-react";
import { CATEGORIES, TOPICS_DATA } from "@/lib/topics-data";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SearchModal } from "@/components/SearchModal";
import { getDifficultyColor } from "@/lib/utils";

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeShell, setActiveShell] = useState<"powershell" | "cmd" | "bash">("powershell");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Quick Request Form State
  const [requestEmail, setRequestEmail] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Get the featured fullstack publishing guide
  const newPublishingTopic = useMemo(() => {
    return TOPICS_DATA.find((t) => t.id === "topic-web-publishing-fullstack") || TOPICS_DATA[TOPICS_DATA.length - 1];
  }, []);

  const shellSnippets = {
    powershell: `# Flush DNS cache & test gateway connectivity\nClear-DnsClientCache\nTest-NetConnection -ComputerName 8.8.8.8 -Port 53\n\n# Inspect top CPU resource consumers\nGet-Process | Sort-Object CPU -Descending | Select-Object -First 5`,
    cmd: `:: Flush Windows DNS resolver cache\nipconfig /flushdns\nipconfig /release && ipconfig /renew\n\n:: Check network interface statistics\nnetstat -e`,
    bash: `# Flush systemd DNS cache\nsudo systemd-resolve --flush-caches\nresolvectl statistics\n\n# Check active memory & top processes\nfree -h\nps aux --sort=-%cpu | head -n 6`,
  };

  const copyShellCommand = () => {
    navigator.clipboard.writeText(shellSnippets[activeShell]);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestDetails.trim()) return;
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-14 pb-20">
      {/* Global Search Command Palette */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Hero Section: Edge-to-Edge Full-Bleed with Atmospheric Image & Subtle Micro-Grid */}
      <section className="relative w-full border-b border-slate-200 dark:border-slate-800 overflow-hidden pt-14 sm:pt-20 pb-16 sm:pb-24">
        {/* Background Image Layer with atmospheric high-tech overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/images/hero-bg.jpg"
            alt="Data Center & Cloud Infrastructure"
            fill
            priority
            quality={90}
            className="object-cover object-center opacity-60 dark:opacity-40"
            sizes="100vw"
          />
          {/* Elegant High-Contrast Overlay for Crisp Text Protection */}
          <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/85 backdrop-blur-[1px]" />
          {/* Subtle Hairline Micro-Grid */}
          <div className="absolute inset-0 portal-grid-pattern opacity-60 dark:opacity-40" />
          {/* Edge-to-Edge Bottom Gradient Fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/70 dark:to-slate-950/80" />
        </div>

        <div className="portal-container text-center space-y-7 relative z-10">
          {/* Release Callout */}
          <div className="inline-flex items-center gap-2">
            <Link
              href={`/docs/${newPublishingTopic.categorySlug}/${newPublishingTopic.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900 text-[#357abd] dark:text-blue-300 text-sm font-semibold hover:border-[#4a90e2] transition-colors"
            >
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#4a90e2] inline-block" />
              <span className="font-bold">Latest Blueprint:</span>
              <span>Full-Stack Web Publishing, Databases &amp; M-Pesa Architecture</span>
              <ArrowRight className="w-4 h-4 text-[#4a90e2]" />
            </Link>
          </div>

          {/* Punchy, Non-Wordy Headline with Larger Typography */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Clear, Actionable IT Fixes &amp; Web Engineering
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Step-by-step diagnostic workflows for everyday computer issues, alongside complete production playbooks for cloud hosting, databases, and SEO.
            </p>
          </div>

          {/* Instant Search Bar Trigger: Wide & High-Contrast with Larger Text */}
          <div className="pt-2 max-w-2xl mx-auto">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-800/90 hover:border-[#4a90e2] dark:hover:border-[#4a90e2] border border-slate-200 dark:border-slate-700 rounded-[10px] text-slate-500 dark:text-slate-400 text-sm sm:text-base shadow-xs transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Search className="w-5 h-5 text-[#4a90e2] group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 text-left">
                  Search error codes, symptoms, or commands (e.g. BSOD, DNS Flush, STK Push)...
                </span>
              </div>
              <kbd className="hidden sm:inline-block px-3 py-1 font-mono text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[6px] text-slate-500 dark:text-slate-400 shadow-2xs shrink-0">
                Ctrl + K
              </kbd>
            </button>

            {/* Quick Search Chips with Larger Typography */}
            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-sm">
              <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold mr-1 uppercase tracking-wider">
                Frequent:
              </span>
              {[
                "Web Publishing",
                "M-Pesa STK Push",
                "DNS Flush",
                "Core Web Vitals",
                "Schema JSON-LD",
                "BSOD 0x0000001E",
                "Cloudflare SSL",
                "Slow PC Fix",
              ].map((query) => (
                <button
                  key={query}
                  onClick={() => setIsSearchOpen(true)}
                  className="px-3 py-1.5 rounded-[8px] bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#4a90e2] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Client Fast-Track Journey Cards */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 text-left max-w-5xl mx-auto">
            {/* Pathway 1: Everyday Client Issues */}
            <Link
              href="/docs/windows-os"
              className="portal-card group p-6 bg-white dark:bg-slate-900 hover:border-[#4a90e2] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-[10px] bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-[#4a90e2] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#4a90e2] transition-colors">
                  Everyday Computer &amp; Device Fixes
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Plain-English solutions for Windows BSOD, macOS freezes, Wi-Fi drops, sound issues, and slow boot times.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center text-sm font-semibold text-[#4a90e2]">
                <span>Browse Client Playbooks</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Pathway 2: Web & Cloud Architecture */}
            <Link
              href="/docs/web-development"
              className="portal-card group p-6 bg-white dark:bg-slate-900 hover:border-[#4a90e2] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-[10px] bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-[#4a90e2] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#4a90e2] transition-colors">
                  Web Hosting, Databases &amp; Payments
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Production architecture for GitHub CI/CD, .com/.co.ke domains, Cloudflare SSL, Supabase, and Daraja 3.0 M-Pesa.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center text-sm font-semibold text-[#4a90e2]">
                <span>Explore Web Engineering</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Pathway 3: Technical SEO & Search Visibility */}
            <Link
              href="/docs/seo-growth"
              className="portal-card group p-6 bg-white dark:bg-slate-900 hover:border-[#4a90e2] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-[10px] bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-[#4a90e2] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#4a90e2] transition-colors">
                  Technical SEO &amp; Search Visibility
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Core Web Vitals (LCP, CLS, INP), Schema JSON-LD structured data, XML sitemaps, and Search Console verification.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center text-sm font-semibold text-[#4a90e2]">
                <span>Inspect SEO Blueprints</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 12 Technical Domains Directory: Edge-to-Edge 6-Column Responsive Grid */}
      <section className="portal-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Explore by Technical Domain
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
              Structured documentation across operating systems, web engineering, security, and cloud infrastructure.
            </p>
          </div>
          <Link
            href="/docs"
            className="text-sm font-bold text-[#4a90e2] hover:text-[#357abd] hover:underline flex items-center gap-1.5 shrink-0"
          >
            All {TOPICS_DATA.length} Guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/docs/${cat.slug}`}
              className="portal-card group p-5 flex flex-col justify-between hover:border-[#4a90e2] transition-colors"
            >
              <div>
                <div className="w-11 h-11 rounded-[10px] bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-[#4a90e2] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                  <CategoryIcon name={cat.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#4a90e2] transition-colors">
                  {cat.name}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span className="font-mono">{cat.topicCount} Guides</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#4a90e2] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Multi-OS Terminal Quick Reference: Fluid Edge-to-Edge */}
      <section className="portal-container">
        <div className="p-6 sm:p-9 rounded-[10px] bg-slate-900 text-white border border-slate-800 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6ba3f5] border border-blue-900/80 bg-blue-950/40 px-3 py-1 rounded-[6px] uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                Quick Diagnostics
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Multi-OS Diagnostic Console
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Copy-ready terminal snippets for Windows PowerShell, CMD, and Linux/macOS Bash to troubleshoot network and performance latency.
              </p>
              <div className="pt-2">
                <Link
                  href="/docs/networking"
                  className="btn-primary px-4 py-2.5 text-sm font-semibold shadow-xs inline-flex items-center gap-2"
                >
                  <span>Explore Networking Commands</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Interactive Terminal Window */}
            <div className="lg:col-span-3 rounded-[8px] bg-black/95 border border-slate-800 overflow-hidden shadow-inner">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-[2px] bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-[2px] bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-[2px] bg-emerald-500/80 inline-block" />
                  <span className="text-xs text-slate-400 font-mono ml-2">{activeShell}.exe</span>
                </div>

                {/* Shell switcher */}
                <div className="flex items-center gap-1.5">
                  {(["powershell", "cmd", "bash"] as const).map((shell) => (
                    <button
                      key={shell}
                      onClick={() => setActiveShell(shell)}
                      className={`px-3 py-1 rounded-[6px] text-xs font-mono transition-colors cursor-pointer ${
                        activeShell === shell
                          ? "bg-[#4a90e2] text-white font-bold"
                          : "text-slate-400 hover:text-white bg-slate-900"
                      }`}
                    >
                      {shell.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-5 font-mono text-sm text-[#6ba3f5] leading-relaxed relative">
                <pre className="whitespace-pre-wrap overflow-x-auto text-xs sm:text-sm font-mono pr-14 leading-relaxed">
                  {shellSnippets[activeShell]}
                </pre>
                <button
                  onClick={copyShellCommand}
                  className="absolute top-3.5 right-3.5 p-2 rounded-[6px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Copy command"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-xs font-semibold">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Request / Suggestion Box: Minimal, Non-Wordy */}
      <section className="portal-container">
        <div className="portal-card p-7 sm:p-10 max-w-2xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-[10px] bg-blue-50 dark:bg-slate-800 text-[#4a90e2] flex items-center justify-center mx-auto border border-blue-100 dark:border-slate-700">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Need a Specific Guide or Playbook Documented?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Submit your error code, hardware model, or symptom and our engineering team will add the verified diagnostic playbook.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-5 rounded-[8px] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-center space-y-2">
              <CheckCircle2 className="w-7 h-7 text-[#4a90e2] mx-auto" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Request received. Thank you for contributing to the knowledge base.
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setRequestEmail("");
                  setRequestDetails("");
                }}
                className="text-xs text-[#4a90e2] hover:underline font-semibold pt-1 block mx-auto cursor-pointer"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-3.5 pt-2 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="email"
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="portal-input text-sm sm:col-span-1"
                />
                <input
                  type="text"
                  required
                  value={requestDetails}
                  onChange={(e) => setRequestDetails(e.target.value)}
                  placeholder="Error code, command, or symptom (e.g. 0x80070005)..."
                  className="portal-input text-sm sm:col-span-2"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Submit Topic Request</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
