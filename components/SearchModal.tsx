"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  Clock,
} from "lucide-react";
import { TOPICS_DATA } from "@/lib/topics-data";
import { TopicItem } from "@/lib/types";
import { CategoryIcon } from "@/components/CategoryIcon";
import { getDifficultyColor } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SUGGESTIONS = [
  "M-Pesa STK Push",
  "DNS Flush",
  "BSOD Fix",
  "Core Web Vitals",
  "Slow PC Startup",
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("it_docs_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 4));
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
    }
  }, [isOpen]);

  const filteredTopics = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return TOPICS_DATA.filter((topic) => {
      return (
        topic.title.toLowerCase().includes(q) ||
        topic.summary.toLowerCase().includes(q) ||
        topic.category.toLowerCase().includes(q) ||
        topic.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        topic.solutions.some((s) => s.toLowerCase().includes(q))
      );
    }).slice(0, 8);
  }, [query]);

  const handleSelectTopic = (topic: TopicItem) => {
    if (query.trim()) {
      const updated = [
        query.trim(),
        ...recentSearches.filter((s) => s !== query.trim()),
      ].slice(0, 4);
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

  const isSearching = query.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[10px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">
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
            placeholder="Search guides, error codes, commands..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Content Area */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {isSearching ? (
            /* SEARCH RESULTS */
            <div>
              {filteredTopics.length === 0 ? (
                <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    No results for "{query}"
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try searching for "DNS", "Startup", "BSOD", "SSL", or "M-Pesa".
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredTopics.map((topic, index) => {
                    const isSelected = index === selectedIndex;
                    const diffColors = getDifficultyColor(topic.difficulty);
                    return (
                      <div
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`p-3 rounded-[8px] cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-blue-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-medium text-[#4a90e2] flex items-center gap-1 truncate">
                              <CategoryIcon
                                name={topic.categoryIcon || "Terminal"}
                                className="w-3 h-3"
                              />
                              {topic.category}
                            </span>
                            <span
                              className={`text-[11px] px-1.5 py-0.2 rounded font-mono font-semibold border ${diffColors.bg} ${diffColors.text} ${diffColors.border}`}
                            >
                              {topic.difficulty}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold truncate">
                            {topic.title}
                          </h4>
                        </div>
                        <ArrowRight
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isSelected
                              ? "text-[#4a90e2] translate-x-0.5"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* CLEAN MINIMAL EMPTY STATE */
            <div className="p-3">
              {recentSearches.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-2 py-1 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer font-normal"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        className="w-full px-3 py-2 text-left rounded-[6px] hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 transition-colors cursor-pointer group"
                      >
                        <span className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{term}</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-[#4a90e2] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <p className="text-xs text-slate-400 font-medium">
                    Search across all 151 IT troubleshooting and engineering guides
                  </p>
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <span className="text-xs text-slate-400 mr-1">Suggested:</span>
                    {POPULAR_SUGGESTIONS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setQuery(tag);
                          inputRef.current?.focus();
                        }}
                        className="text-xs px-2.5 py-1 rounded-[6px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#4a90e2] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Minimal Footer Bar */}
        <div className="p-2.5 px-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">151 Guides</span>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>ESC close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
