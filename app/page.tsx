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
      <section className="bg-stone-900 text-white pt-20 pb-24 border-b border-stone-800">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-teal-400 border border-teal-800 bg-teal-950/60 px-3 py-1 rounded">
            IT Troubleshooting Reference
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Fix IT problems faster with structured, step-by-step guides
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            117 guides across 10 technical domains. Every guide includes multi-OS terminal commands, numbered checklists, and verified fixes for Windows, macOS, Linux, iOS, and Android.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between p-4 bg-stone-800 hover:bg-stone-750 border border-stone-700 rounded text-stone-300 text-sm shadow-lg group transition-colors"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-teal-400" />
                <span className="text-stone-400 group-hover:text-stone-200">
                  Search by error code, command, or symptom...
                </span>
              </div>
              <kbd className="px-2.5 py-1 font-mono text-xs bg-stone-900 border border-stone-700 rounded text-stone-400">
                Ctrl + K
              </kbd>
            </button>
          </div>

          {/* Real Stats */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded bg-stone-800/50 border border-stone-800">
              <span className="text-xl font-bold text-teal-400 block font-mono">117</span>
              <span className="text-xs text-stone-400">Guides published</span>
            </div>
            <div className="p-3.5 rounded bg-stone-800/50 border border-stone-800">
              <span className="text-xl font-bold text-teal-400 block font-mono">10</span>
              <span className="text-xs text-stone-400">Technical domains</span>
            </div>
            <div className="p-3.5 rounded bg-stone-800/50 border border-stone-800">
              <span className="text-xl font-bold text-teal-400 block font-mono">5</span>
              <span className="text-xs text-stone-400">Operating systems</span>
            </div>
            <div className="p-3.5 rounded bg-stone-800/50 border border-stone-800">
              <span className="text-xl font-bold text-teal-400 block font-mono">3</span>
              <span className="text-xs text-stone-400">Shell environments</span>
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

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedTab("all")}
              className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTab === "all"
                  ? "bg-teal-600 text-white"
                  : "bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700"
              }`}
            >
              All Domains
            </button>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedTab(cat.slug)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedTab === cat.slug
                    ? "bg-teal-600 text-white font-semibold"
                    : "bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700"
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
                className="p-6 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:shadow-lg hover:border-teal-500/40 transition-all flex flex-col justify-between"
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

                  <div className="mt-4 space-y-1.5 bg-stone-50 dark:bg-stone-950/60 p-3 rounded border border-stone-100 dark:border-stone-800/80">
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

      {/* Terminal Commands Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded bg-stone-950 text-white border border-stone-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 border border-teal-800 bg-teal-950/60 px-3 py-1 rounded uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                Multi-OS Terminal Commands
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Commands for PowerShell, CMD, Bash, and Zsh
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Every guide includes syntax-highlighted, copy-ready commands for Windows PowerShell, Command Prompt, macOS Terminal, and Linux Bash. No searching. No adapting.
              </p>
              <Link
                href="/docs/networking"
                className="inline-block px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
              >
                Browse Networking Commands
              </Link>
            </div>

            <div className="p-4 rounded bg-black border border-stone-800 font-mono text-xs text-teal-300 leading-relaxed">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800 text-stone-400">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  PowerShell
                </span>
                <span className="text-[10px]">Windows 11 / Server</span>
              </div>
              <p className="text-stone-400"># Flush DNS cache and test connectivity</p>
              <p className="text-teal-400 font-semibold">Clear-DnsClientCache</p>
              <p className="text-teal-400 font-semibold">Test-NetConnection -ComputerName 8.8.8.8 -Port 53</p>
              <p className="text-stone-400 mt-2"># Show top CPU processes</p>
              <p className="text-teal-400 font-semibold">Get-Process | Sort-Object CPU -Descending | Select -First 5</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
