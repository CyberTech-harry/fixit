"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  Clock,
  History,
  TrendingUp,
  FolderOpen,
} from "lucide-react";
import { TOPICS_DATA, CATEGORIES } from "@/lib/topics-data";
import { TopicItem } from "@/lib/types";
import { CategoryIcon } from "@/components/CategoryIcon";
import { getDifficultyColor } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Web Development",
  "M-Pesa STK Push",
  "Core Web Vitals",
  "Cloudflare DNS & SSL",
  "BSOD 0x0000001E",
  "DNS Flush",
  "Slow PC Startup",
  "Wi-Fi Connection Drops",
  "Schema JSON-LD",
  "Disk Cleanup",
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("it_docs_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
      setSelectedCategory("all");
    }
  }, [isOpen]);

  const filteredTopics = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q && selectedCategory === "all") {
      return [];
    }

    return TOPICS_DATA.filter((topic) => {
      if (selectedCategory !== "all" && topic.categorySlug !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        topic.title.toLowerCase().includes(q) ||
        topic.summary.toLowerCase().includes(q) ||
        topic.category.toLowerCase().includes(q) ||
        topic.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        topic.solutions.some((s) => s.toLowerCase().includes(q))
      );
    }).slice(0, 10);
  }, [query, selectedCategory]);

  const handleSelectTopic = (topic: TopicItem) => {
    if (query.trim()) {
      const updated = [
        query.trim(),
        ...recentSearches.filter((s) => s !== query.trim()),
      ].slice(0, 5);
      setRecentSearches(updated);
      try {
        localStorage.setItem(
          "it_docs_recent_searches",
          JSON.stringify(updated)
        );
      } catch {
        // ignore
      }
    }
    onClose();
    router.push(`/docs/${topic.categorySlug}/${topic.slug}`);
  };

  const handleSelectCategory = (slug: string) => {
    onClose();
    router.push(`/docs/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredTopics.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredTopics.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredTopics.length - 1
        );
      } else if (e.key === "Enter" && filteredTopics[selectedIndex]) {
        e.preventDefault();
        handleSelectTopic(filteredTopics[selectedIndex]);
      }
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem("it_docs_recent_searches");
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  const isSearching = query.trim().length > 0 || selectedCategory !== "all";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[10px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">
          <Search className="w-5 h-5 text-[#4a90e2] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, issue, error code, or topic..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2.5 py-1 text-xs font-mono font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-[6px] border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-4 space-y-5 max-h-[60vh]">
          {/* SEARCH RESULTS VIEW */}
          {isSearching ? (
            <div>
              {filteredTopics.length === 0 ? (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    No matching guides found
                  </p>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Try searching for broader keywords like "DNS", "Startup", "BSOD", "SSL", or "M-Pesa".
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 pb-1 flex items-center justify-between">
                    <span>Matching Guides ({filteredTopics.length})</span>
                    <span className="font-mono font-normal lowercase text-xs">use ↑↓ to select</span>
                  </div>

                  {filteredTopics.map((topic, index) => {
                    const isSelected = index === selectedIndex;
                    const diffColors = getDifficultyColor(topic.difficulty);
                    return (
                      <div
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`p-3 rounded-[8px] cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                          isSelected
                            ? "bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-blue-900"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-[#4a90e2] flex items-center gap-1">
                              <CategoryIcon
                                name={topic.categoryIcon || "Terminal"}
                                className="w-3.5 h-3.5"
                              />
                              {topic.category}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-[4px] font-mono font-semibold border ${diffColors.bg} ${diffColors.text} ${diffColors.border}`}
                            >
                              {topic.difficulty}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {topic.estimatedRead} min
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                            {topic.title}
                          </h4>

                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {topic.summary}
                          </p>
                        </div>

                        <div className="shrink-0 self-center pl-2">
                          <ArrowRight
                            className={`w-4 h-4 transition-transform ${
                              isSelected
                                ? "text-[#4a90e2] translate-x-0.5"
                                : "text-slate-300 dark:text-slate-700"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* DEFAULT CLEAN SPOTLIGHT STATE (When query is empty) */
            <div className="space-y-5">
              {/* Recent Searches (if available) */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" /> Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer font-normal normal-case"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#4a90e2] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Search Topics */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#4a90e2]" /> Popular Topics
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {POPULAR_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setQuery(tag);
                        inputRef.current?.focus();
                      }}
                      className="px-3 py-1.5 rounded-[6px] bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-[#4a90e2] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse by Domain */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1 flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-[#4a90e2]" /> Technical Domains
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => handleSelectCategory(cat.slug)}
                      className="p-2.5 rounded-[8px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#4a90e2] text-left transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CategoryIcon
                          name={cat.icon}
                          className="w-4 h-4 text-[#4a90e2] shrink-0"
                        />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#4a90e2] truncate">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-400 shrink-0">
                        {cat.topicCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 px-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>{TOPICS_DATA.length} Total IT Guides</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs">
                ↑↓
              </kbd>{" "}
              navigate
            </span>
            <span className="flex items-center gap-1 font-mono">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs">
                ↵
              </kbd>{" "}
              open
            </span>
            <span className="flex items-center gap-1 font-mono">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs">
                ESC
              </kbd>{" "}
              close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
