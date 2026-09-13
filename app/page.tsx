"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { CATEGORIES, TOPICS_DATA } from "@/lib/topics-data";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SearchModal } from "@/components/SearchModal";
import { getDifficultyColor } from "@/lib/utils";

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [activeShell, setActiveShell] = useState<"powershell" | "cmd" | "bash">("powershell");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Quick Request Form State
  const [requestEmail, setRequestEmail] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Get the newly published production guide
  const newPublishingTopic = React.useMemo(() => {
    return TOPICS_DATA.find((t) => t.id === "topic-web-publishing-fullstack") || TOPICS_DATA[TOPICS_DATA.length - 1];
  }, []);

  // Featured topics: place the newest guide at the top of the list for visibility
  const featuredTopics = React.useMemo(() => {
    if (selectedTab === "all") {
      const others = TOPICS_DATA.filter((t) => t.id !== "topic-web-publishing-fullstack").slice(0, 5);
      return [newPublishingTopic, ...others];
    }
    return TOPICS_DATA.filter((t) => t.categorySlug === selectedTab).slice(0, 6);
  }, [selectedTab, newPublishingTopic]);

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

      {/* Hero Section: Clean, Crisp, Minimal */}
      <section className="pt-12 sm:pt-16 pb-10 border-b border-slate-200/80 dark:border-slate-800">
        <div className="portal-container text-center max-w-3xl mx-auto space-y-6">
          <Link
            href={`/docs/${newPublishingTopic.categorySlug}/${newPublishingTopic.slug}`}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-[8px] bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-900/50 text-[#357abd] dark:text-blue-300 text-xs font-semibold hover:border-[#4a90e2] transition-colors"
          >
            <span className="w-2 h-2 rounded-[2px] bg-[#4a90e2] inline-block" />
            <span className="font-bold">New:</span>
            <span>Full-Stack Web Publishing, Databases &amp; M-Pesa Payments Guide</span>
            <ArrowRight className="w-3 h-3 text-[#4a90e2]" />
          </Link>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Verified Step-by-Step IT Fixes
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Diagnostic workflows, copy-ready terminal commands, and solutions for operating systems, networking, databases, and infrastructure.
          </p>

          {/* Instant Search Bar Trigger */}
          <div className="pt-2 max-w-xl mx-auto">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-white dark:bg-slate-800 hover:border-[#4a90e2] dark:hover:border-[#4a90e2] border border-slate-200 dark:border-slate-700 rounded-[10px] text-slate-500 dark:text-slate-400 text-xs sm:text-sm shadow-xs transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-[#4a90e2] group-hover:scale-110 transition-transform" />
                <span className="text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">
                  Search error codes, commands, symptoms (e.g. BSOD, DNS, STK Push)...
                </span>
              </div>
              <kbd className="hidden sm:inline-block px-2.5 py-1 font-mono text-[11px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[6px] text-slate-500 dark:text-slate-400">
                Ctrl + K
              </kbd>
            </button>

            {/* Quick Search Chips */}
            <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap text-xs">
              <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium mr-1">Popular:</span>
              {[
                "Web Publishing",
                "M-Pesa STK Push",
                "DNS Flush",
                "BSOD 0x0000001E",
                "Cloudflare SSL",
                "Disk Cleanup",
              ].map((query) => (
                <button
                  key={query}
                  onClick={() => setIsSearchOpen(true)}
                  className="px-2.5 py-1 rounded-[6px] bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#4a90e2] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Minimal 4-Metric Strip */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="portal-card p-3 text-center">
              <span className="text-xl font-bold text-[#4a90e2] block font-mono">{TOPICS_DATA.length}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Guides</span>
            </div>
            <div className="portal-card p-3 text-center">
              <span className="text-xl font-bold text-[#4a90e2] block font-mono">{CATEGORIES.length}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Domains</span>
            </div>
            <div className="portal-card p-3 text-center">
              <span className="text-xl font-bold text-[#4a90e2] block font-mono">5</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">OS Platforms</span>
            </div>
            <div className="portal-card p-3 text-center">
              <span className="text-xl font-bold text-[#4a90e2] block font-mono">100%</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Verified Fixes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight: Featured New Engineering Blueprint */}
      <section className="portal-container">
        <div className="portal-card p-6 sm:p-7 border-l-4 border-l-[#4a90e2] bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4a90e2] bg-blue-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-[6px] border border-blue-200/60 dark:border-blue-900">
                  Featured Blueprint
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-[6px] font-mono font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                  ADVANCED
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 18 min read
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                <Link
                  href={`/docs/${newPublishingTopic.categorySlug}/${newPublishingTopic.slug}`}
                  className="hover:text-[#4a90e2] transition-colors"
                >
                  {newPublishingTopic.title}
                </Link>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Step-by-step architecture for code hosting on GitHub, domain registration (.com, .co.ke with KeNIC), Cloudflare DNS &amp; Full Strict SSL proxying, managed databases (Supabase, Firebase, Railway, Render), secure auth, and Daraja 3.0 M-Pesa &amp; PayHero Kenya API integrations.
              </p>

              <div className="pt-1 flex items-center gap-2 flex-wrap text-xs">
                {["GitHub CI/CD", "Cloudflare DNS", "Supabase", "Firebase", "Daraja 3.0", "PayHero"].map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] px-2 py-0.5 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href={`/docs/${newPublishingTopic.categorySlug}/${newPublishingTopic.slug}`}
                className="btn-primary px-4 py-2.5 text-xs font-semibold shadow-xs"
              >
                Read Full Blueprint <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11 Technical Domains Directory: Scannable & Clean */}
      <section className="portal-container">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Explore by Technical Domain
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Structured documentation across operating systems, web engineering, and infrastructure stacks.
            </p>
          </div>
          <Link
            href="/docs"
            className="text-xs font-semibold text-[#4a90e2] hover:text-[#357abd] hover:underline flex items-center gap-1 shrink-0"
          >
            All {TOPICS_DATA.length} guides <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/docs/${cat.slug}`}
              className="portal-card group p-4 flex flex-col justify-between hover:border-[#4a90e2] transition-colors"
            >
              <div>
                <div className="w-9 h-9 rounded-[8px] bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-[#4a90e2] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <CategoryIcon name={cat.icon} className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-[#4a90e2] transition-colors">
                  {cat.name}
                </h3>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="font-mono">{cat.topicCount} Guides</span>
                <ArrowRight className="w-3 h-3 text-[#4a90e2] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Remediation Guides */}
      <section className="portal-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Featured Remediation Guides
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Curated, production-tested solutions with copy-ready terminal commands.
            </p>
          </div>

          {/* Category Filter Tabs including Web Development */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { label: "All", slug: "all" },
              { label: "Web Development", slug: "web-development" },
              { label: "Windows OS", slug: "windows-os" },
              { label: "Networking", slug: "networking" },
              { label: "Security", slug: "security" },
              { label: "Emerging Tech", slug: "emerging-tech" },
            ].map((tab) => (
              <button
                key={tab.slug}
                onClick={() => setSelectedTab(tab.slug)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTab === tab.slug
                    ? "bg-[#4a90e2] text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Clean Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredTopics.map((topic) => {
            const diffColors = getDifficultyColor(topic.difficulty);
            return (
              <div
                key={topic.id}
                className="portal-card p-5 flex flex-col justify-between hover:border-[#4a90e2] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-semibold text-[#4a90e2] flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {topic.category}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-[6px] font-mono font-medium border ${diffColors.bg} ${diffColors.text} ${diffColors.border}`}
                    >
                      {topic.difficulty}
                    </span>
                  </div>

                  <Link
                    href={`/docs/${topic.categorySlug}/${topic.slug}`}
                    className="block group"
                  >
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#4a90e2] transition-colors line-clamp-2">
                      {topic.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" /> {topic.estimatedRead} min read
                  </span>
                  <Link
                    href={`/docs/${topic.categorySlug}/${topic.slug}`}
                    className="font-semibold text-xs text-[#4a90e2] hover:text-[#357abd] hover:underline flex items-center gap-1"
                  >
                    View Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Multi-OS Terminal Quick Utility */}
      <section className="portal-container">
        <div className="p-6 sm:p-8 rounded-[10px] bg-slate-900 text-white border border-slate-800 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#6ba3f5] border border-blue-900/80 bg-blue-950/40 px-2.5 py-0.5 rounded-[6px] uppercase tracking-wider">
                <Terminal className="w-3 h-3" />
                Quick Commands
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Multi-OS Diagnostic Shell
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Instant command snippets for Windows PowerShell, CMD, and Linux/macOS Bash.
              </p>
              <div className="pt-1">
                <Link
                  href="/docs/networking"
                  className="btn-primary px-3.5 py-2 text-xs font-semibold shadow-xs"
                >
                  Explore Networking Commands
                </Link>
              </div>
            </div>

            {/* Interactive Terminal Window */}
            <div className="lg:col-span-3 rounded-[8px] bg-black/90 border border-slate-800 overflow-hidden shadow-inner">
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/80 inline-block" />
                  <span className="text-[11px] text-slate-400 font-mono ml-2">{activeShell}.exe</span>
                </div>

                {/* Shell switcher */}
                <div className="flex items-center gap-1">
                  {(["powershell", "cmd", "bash"] as const).map((shell) => (
                    <button
                      key={shell}
                      onClick={() => setActiveShell(shell)}
                      className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono transition-colors cursor-pointer ${
                        activeShell === shell
                          ? "bg-[#4a90e2] text-white font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {shell.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 font-mono text-xs text-[#6ba3f5] leading-relaxed relative">
                <pre className="whitespace-pre-wrap overflow-x-auto text-[11px] font-mono pr-12">
                  {shellSnippets[activeShell]}
                </pre>
                <button
                  onClick={copyShellCommand}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-[6px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copy command"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Copy</span>
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
        <div className="portal-card p-6 sm:p-8 max-w-2xl mx-auto text-center space-y-4">
          <div className="w-10 h-10 rounded-[10px] bg-blue-50 dark:bg-slate-800 text-[#4a90e2] flex items-center justify-center mx-auto border border-blue-100 dark:border-slate-700">
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Need a Specific Guide or Fix Documented?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Submit your error code, hardware model, or symptom and our team will add the verified diagnostic guide.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-4 rounded-[8px] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-center space-y-1.5">
              <CheckCircle2 className="w-6 h-6 text-[#4a90e2] mx-auto" />
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Request received. Thank you for contributing to the knowledge base.
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setRequestEmail("");
                  setRequestDetails("");
                }}
                className="text-[11px] text-[#4a90e2] hover:underline font-medium pt-1 block mx-auto cursor-pointer"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-3 pt-2 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="email"
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="portal-input text-xs sm:col-span-1"
                />
                <input
                  type="text"
                  required
                  value={requestDetails}
                  onChange={(e) => setRequestDetails(e.target.value)}
                  placeholder="Error code, command, or symptom (e.g. 0x80070005)..."
                  className="portal-input text-xs sm:col-span-2"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Topic Request
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
