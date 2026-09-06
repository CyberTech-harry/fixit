"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Terminal,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Wifi,
  Laptop,
  Apple,
  Smartphone,
  Globe,
  AppWindow,
  Zap,
  TrendingUp,
  Layers,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { CATEGORIES, TOPICS_DATA } from "@/lib/topics-data";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SearchModal } from "@/components/SearchModal";
import { getDifficultyColor } from "@/lib/utils";

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");

  const featuredTopics = React.useMemo(() => {
    if (selectedTab === "all") {
      return TOPICS_DATA.slice(0, 9);
    }
    return TOPICS_DATA.filter((t) => t.categorySlug === selectedTab).slice(0, 9);
  }, [selectedTab]);

  return (
    <div className="space-y-16 pb-20">
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white pt-20 pb-28 border-b border-stone-800">
        <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-800 text-teal-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>117+ Production-Grade IT Troubleshooting Guides</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Instant Remediation for <br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              Everyday IT & Infrastructure
            </span> Issues
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Engineered for SysAdmins, Help Desk Techs, and Power Users. Search across 10 technical domains, copy multi-OS terminal commands, and follow step-by-step diagnostic workflows.
          </p>

          {/* Instant Search Bar Trigger */}
          <div className="max-w-2xl mx-auto pt-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-stone-800/90 hover:bg-stone-800 border border-stone-700 rounded-2xl text-stone-300 text-sm shadow-2xl backdrop-blur-sm group transition-all"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
                <span className="text-stone-400 group-hover:text-stone-200">
                  Search guides by error code, command, or symptom...
                </span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2.5 py-1 font-mono text-xs bg-stone-900 border border-stone-700 rounded-lg text-stone-400">
                  Ctrl + K
                </kbd>
              </div>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-stone-800/50 border border-stone-800/80">
              <span className="text-xl font-bold text-teal-400 block font-mono">117</span>
              <span className="text-xs text-stone-400">Curated IT Guides</span>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-800/50 border border-stone-800/80">
              <span className="text-xl font-bold text-emerald-400 block font-mono">10</span>
              <span className="text-xs text-stone-400">Core Tech Domains</span>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-800/50 border border-stone-800/80">
              <span className="text-xl font-bold text-cyan-400 block font-mono">&lt;100ms</span>
              <span className="text-xs text-stone-400">Instant Search Latency</span>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-800/50 border border-stone-800/80">
              <span className="text-xl font-bold text-amber-400 block font-mono">100%</span>
              <span className="text-xs text-stone-400">Step-by-Step Checklists</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Core Domains Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-1">
              Information Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Explore 10 Technical Domains
            </h2>
          </div>
          <Link
            href="/docs"
            className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            View all 117 guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/docs/${cat.slug}`}
              className="group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-teal-500/50 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <CategoryIcon name={cat.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-400 font-medium">
                <span className="font-mono">{cat.topicCount} Topics</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Troubleshooting Guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Featured Remediation Workflows
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Top referenced technical guides with multi-OS command snippets and checklists.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedTab("all")}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTab === "all"
                  ? "bg-teal-600 text-white"
                  : "bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300"
              }`}
            >
              All Domains
            </button>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedTab(cat.slug)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedTab === cat.slug
                    ? "bg-teal-600 text-white font-semibold"
                    : "bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300"
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
                className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:shadow-xl hover:border-teal-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {topic.category}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border ${diffColors.bg} ${diffColors.text} ${diffColors.border}`}
                    >
                      {topic.difficulty}
                    </span>
                  </div>

                  <Link
                    href={`/docs/${topic.categorySlug}/${topic.slug}`}
                    className="block group"
                  >
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                      {topic.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>

                  {/* Quick diagnostic tips preview */}
                  <div className="mt-4 space-y-1.5 bg-stone-50 dark:bg-stone-950/60 p-3 rounded-xl border border-stone-100 dark:border-stone-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                      Quick Steps Preview
                    </span>
                    {topic.solutions.slice(0, 2).map((sol, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-stone-700 dark:text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{sol}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {topic.estimatedRead} min read
                  </span>
                  <Link
                    href={`/docs/${topic.categorySlug}/${topic.slug}`}
                    className="font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Terminal Quick Cheat Sheet Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-tr from-stone-950 via-stone-900 to-teal-950 text-white border border-stone-800 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 text-teal-300 text-xs font-semibold border border-teal-700">
                <Terminal className="w-3.5 h-3.5" />
                <span>Multi-OS Terminal Snippets</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Single-Click Executable Commands for Any Shell
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Whether you operate in Windows PowerShell, Command Prompt, or Unix Bash/Zsh on macOS and Linux, every guide includes syntax-highlighted commands ready to copy and paste.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/docs/networking"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-md"
                >
                  Explore Networking Commands
                </Link>
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors border border-stone-700"
                >
                  Admin CMS Editor
                </Link>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/80 border border-stone-800 font-mono text-xs text-teal-300 leading-relaxed shadow-inner">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800 text-stone-400">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  PowerShell Diagnostic Snippet
                </span>
                <span className="text-[10px]">Windows 11 / Server</span>
              </div>
              <p className="text-stone-400"># Flush DNS cache and test gateway connectivity</p>
              <p className="text-teal-400 font-semibold">Clear-DnsClientCache</p>
              <p className="text-teal-400 font-semibold">Test-NetConnection -ComputerName 8.8.8.8 -Port 53</p>
              <p className="text-stone-400 mt-2"># Review top CPU process culprits</p>
              <p className="text-teal-400 font-semibold">Get-Process | Sort-Object CPU -Descending | Select -First 5</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
