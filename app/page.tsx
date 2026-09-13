"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Terminal,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Send,
  Copy,
  Check,
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
  
  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const featuredTopics = React.useMemo(() => {
    if (selectedTab === "all") {
      return TOPICS_DATA.slice(0, 9);
    }
    return TOPICS_DATA.filter((t) => t.categorySlug === selectedTab).slice(0, 9);
  }, [selectedTab]);

  const shellSnippets = {
    powershell: `# Flush DNS cache & verify gateway connectivity\nClear-DnsClientCache\nTest-NetConnection -ComputerName 8.8.8.8 -Port 53\n\n# Identify top CPU resource consumers\nGet-Process | Sort-Object CPU -Descending | Select-Object -First 5`,
    cmd: `:: Flush Windows resolver cache and release lease\nipconfig /flushdns\nipconfig /release\nipconfig /renew\n\n:: Check network interface statistics\nnetstat -e`,
    bash: `# Flush systemd DNS cache (Ubuntu / Debian)\nsudo systemd-resolve --flush-caches\nresolvectl statistics\n\n# Review active memory and processes\nfree -h\nps aux --sort=-%cpu | head -n 6`,
  };

  const copyShellCommand = () => {
    navigator.clipboard.writeText(shellSnippets[activeShell]);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Hero / Introduction Section */}
      <section className="bg-white dark:bg-stone-900 border-b border-[#dddddd] dark:border-stone-800 pt-16 pb-20 transition-colors">
        <div className="portal-container text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-[#f0f6fc] dark:bg-slate-800 border border-[#4a90e2]/30 text-[#357abd] dark:text-[#6ba3f5] text-xs font-semibold">
            <Terminal className="w-3.5 h-3.5 text-[#4a90e2]" />
            <span>CyberTech IT Documentation &amp; Troubleshooting Reference</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#333333] dark:text-white max-w-4xl mx-auto leading-tight">
            Fix IT &amp; Infrastructure Issues with Verified Step-by-Step Guides
          </h1>

          <p className="text-sm sm:text-base text-[#555555] dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Engineered for SysAdmins, Help Desk Techs, and Power Users. Access 117 curated troubleshooting procedures across 10 core technical domains with multi-OS terminal commands, diagnostic checklists, and verified remediation workflows.
          </p>

          {/* Instant Search Bar Trigger */}
          <div className="max-w-2xl mx-auto pt-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between p-4 bg-[#ffffff] dark:bg-stone-800 hover:bg-[#f9f9fb] dark:hover:bg-stone-750 border border-[#dddddd] dark:border-stone-700 rounded-[10px] text-[#555555] dark:text-stone-300 text-sm shadow-sm group transition-all"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-[#4a90e2]" />
                <span className="text-[#555555] dark:text-stone-300 group-hover:text-[#333333] dark:group-hover:text-white">
                  Search by error code, command, or symptom (e.g. BSOD, DNS, 0x80070005)...
                </span>
              </div>
              <kbd className="px-2.5 py-1 font-mono text-xs bg-[#f0f0f5] dark:bg-stone-900 border border-[#dddddd] dark:border-stone-700 rounded-[6px] text-[#555555] dark:text-stone-400">
                Ctrl + K
              </kbd>
            </button>
          </div>

          {/* Verified Repository Metrics */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="portal-card p-4">
              <span className="text-2xl font-bold text-[#4a90e2] block font-mono">{TOPICS_DATA.length}</span>
              <span className="text-xs text-[#555555] dark:text-stone-400 font-medium">Published IT Guides</span>
            </div>
            <div className="portal-card p-4">
              <span className="text-2xl font-bold text-[#4a90e2] block font-mono">10</span>
              <span className="text-xs text-[#555555] dark:text-stone-400 font-medium">Technical Domains</span>
            </div>
            <div className="portal-card p-4">
              <span className="text-2xl font-bold text-[#4a90e2] block font-mono">5</span>
              <span className="text-xs text-[#555555] dark:text-stone-400 font-medium">Supported OS Platforms</span>
            </div>
            <div className="portal-card p-4">
              <span className="text-2xl font-bold text-[#4a90e2] block font-mono">3</span>
              <span className="text-xs text-[#555555] dark:text-stone-400 font-medium">Terminal Shells</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Core Domains Directory Grid */}
      <section className="portal-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#dddddd] dark:border-stone-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4a90e2] block mb-1">
              Information Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#333333] dark:text-white tracking-tight">
              Explore 10 Technical Domains
            </h2>
          </div>
          <Link
            href="/docs"
            className="text-xs sm:text-sm font-semibold text-[#4a90e2] hover:text-[#357abd] hover:underline flex items-center gap-1"
          >
            View all {TOPICS_DATA.length} guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/docs/${cat.slug}`}
              className="portal-card group p-5 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-[10px] bg-[#f0f6fc] dark:bg-slate-800 border border-[#dddddd] dark:border-slate-700 text-[#4a90e2] flex items-center justify-center mb-3">
                  <CategoryIcon name={cat.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#333333] dark:text-stone-100 group-hover:text-[#4a90e2] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#555555] dark:text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dddddd] dark:border-stone-800 flex items-center justify-between text-xs text-[#555555] dark:text-stone-400 font-medium">
                <span className="font-mono">{cat.topicCount} Topics</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#4a90e2] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Troubleshooting Guides */}
      <section className="portal-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-[#dddddd] dark:border-stone-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#333333] dark:text-white tracking-tight">
              Featured Remediation Workflows
            </h2>
            <p className="text-xs text-[#555555] dark:text-stone-400 mt-0.5">
              Production-ready technical procedures with multi-OS command snippets and checklists.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedTab("all")}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTab === "all"
                  ? "bg-[#4a90e2] text-white shadow-sm"
                  : "bg-white dark:bg-stone-800 border border-[#dddddd] dark:border-stone-700 text-[#555555] dark:text-stone-300 hover:bg-[#f0f0f5]"
              }`}
            >
              All Domains
            </button>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedTab(cat.slug)}
                className={`px-3 py-1.5 rounded-[10px] text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedTab === cat.slug
                    ? "bg-[#4a90e2] text-white font-semibold shadow-sm"
                    : "bg-white dark:bg-stone-800 border border-[#dddddd] dark:border-stone-700 text-[#555555] dark:text-stone-300 hover:bg-[#f0f0f5]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTopics.map((topic) => {
            const diffColors = getDifficultyColor(topic.difficulty);
            return (
              <div
                key={topic.id}
                className="portal-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-[#4a90e2] flex items-center gap-1">
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
                    <h3 className="font-bold text-base text-[#333333] dark:text-stone-100 group-hover:text-[#4a90e2] transition-colors line-clamp-2">
                      {topic.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#555555] dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>

                  <div className="mt-4 space-y-1.5 bg-[#f0f0f5] dark:bg-stone-950/60 p-3 rounded-[8px] border border-[#dddddd] dark:border-stone-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#555555] dark:text-stone-400 block mb-1">
                      Quick Steps Preview
                    </span>
                    {topic.solutions.slice(0, 2).map((sol, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-[#333333] dark:text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4a90e2] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{sol}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#dddddd] dark:border-stone-800 flex items-center justify-between text-xs text-[#555555] dark:text-stone-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {topic.estimatedRead} min read
                  </span>
                  <Link
                    href={`/docs/${topic.categorySlug}/${topic.slug}`}
                    className="font-semibold text-[#4a90e2] hover:text-[#357abd] hover:underline flex items-center gap-1"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Multi-OS Terminal Diagnostic Reference */}
      <section className="portal-container">
        <div className="p-8 rounded-[10px] bg-stone-900 text-white border border-stone-800 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#6ba3f5] border border-blue-800 bg-blue-950/50 px-3 py-1 rounded-[10px] uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                Multi-OS Terminal Reference
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Commands for PowerShell, CMD, and Unix Bash
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Every diagnostic workflow provides exact, syntax-highlighted commands ready to copy for Windows PowerShell, Command Prompt, macOS Terminal, and Linux Bash.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/docs/networking"
                  className="btn-primary inline-block px-4 py-2.5 text-xs font-bold shadow-sm"
                >
                  Browse Networking Commands
                </Link>
                <Link
                  href="/docs"
                  className="inline-block px-4 py-2.5 rounded-[10px] bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 text-xs font-semibold transition-colors"
                >
                  All 117 Guides
                </Link>
              </div>
            </div>

            {/* Interactive Terminal Window */}
            <div className="rounded-[10px] bg-black border border-stone-800 overflow-hidden shadow-md">
              <div className="flex items-center justify-between px-4 py-2.5 bg-stone-950 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-[11px] text-stone-400 font-mono ml-2">diagnostic-shell</span>
                </div>

                {/* Shell switcher tabs */}
                <div className="flex items-center gap-1">
                  {(["powershell", "cmd", "bash"] as const).map((shell) => (
                    <button
                      key={shell}
                      onClick={() => setActiveShell(shell)}
                      className={`px-2 py-0.5 rounded-[6px] text-[10px] font-mono transition-colors ${
                        activeShell === shell
                          ? "bg-[#4a90e2] text-white font-bold"
                          : "text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      {shell.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 font-mono text-xs text-[#6ba3f5] leading-relaxed relative">
                <pre className="whitespace-pre-wrap overflow-x-auto text-[11px]">
                  {shellSnippets[activeShell]}
                </pre>
                <button
                  onClick={copyShellCommand}
                  className="absolute top-3 right-3 p-1.5 rounded-[6px] bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs transition-colors flex items-center gap-1"
                  title="Copy snippet"
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

      {/* Technical Assistance / Contact Inquiry Section */}
      <section className="portal-container">
        <div className="portal-card p-8 md:p-10 max-w-3xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4a90e2]">
              Technical Support Desk
            </span>
            <h2 className="text-2xl font-extrabold text-[#333333] dark:text-white tracking-tight">
              Request a Specific Troubleshooting Guide or Fix
            </h2>
            <p className="text-xs text-[#555555] dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
              Have an unresolved hardware fault, Windows error code, or network symptom not yet covered? Submit the diagnostic details below.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-6 rounded-[10px] bg-[#f0f6fc] dark:bg-slate-800 border border-[#4a90e2]/40 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#4a90e2] mx-auto" />
              <h3 className="font-bold text-sm text-[#333333] dark:text-white">
                Diagnostic Request Received
              </h3>
              <p className="text-xs text-[#555555] dark:text-stone-300">
                Thank you, {contactName || "User"}. Our IT engineering team will review the symptom details and evaluate adding a remediation guide to the portal.
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setContactName("");
                  setContactEmail("");
                  setContactSubject("");
                  setContactMessage("");
                }}
                className="mt-3 inline-block px-4 py-1.5 rounded-[10px] bg-[#4a90e2] text-white text-xs font-bold"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-[#333333] dark:text-stone-200">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Alex Tech"
                    className="portal-input"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-[#333333] dark:text-stone-200">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="portal-input"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label htmlFor="contact-subject" className="text-xs font-semibold text-[#333333] dark:text-stone-200">
                  Target Domain or Component
                </label>
                <select
                  id="contact-subject"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="portal-input"
                >
                  <option value="">Select an IT domain (optional)...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="other">Other / Custom Infrastructure</option>
                </select>
              </div>

              <div className="space-y-1 text-left">
                <label htmlFor="contact-message" className="text-xs font-semibold text-[#333333] dark:text-stone-200">
                  Diagnostic Details / Error Code / Symptom Description
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Describe the operating system version, error messages, and steps already attempted..."
                  className="portal-input resize-none"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Technical Inquiry
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
