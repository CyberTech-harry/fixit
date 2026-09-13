"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, ArrowRight, Tag, Filter } from "lucide-react";
import { TOPICS_DATA, CATEGORIES } from "@/lib/topics-data";
import { TopicItem } from "@/lib/types";
import { getDifficultyColor } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
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
    }
  }, [isOpen]);

  const filteredTopics = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    return TOPICS_DATA.filter((topic) => {
      if (selectedCategory !== "all" && topic.categorySlug !== selectedCategory) {
        return false;
      }
      if (selectedDifficulty !== "all" && topic.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
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
    }).slice(0, 20);
  }, [query, selectedCategory, selectedDifficulty]);

  const handleSelectTopic = (topic: TopicItem) => {
    if (query.trim()) {
      const updated = [query.trim(), ...recentSearches.filter((s) => s !== query.trim())].slice(0, 5);
      setRecentSearches(updated);
      try {
        localStorage.setItem("it_docs_recent_searches", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    onClose();
    router.push(`/docs/${topic.categorySlug}/${topic.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredTopics.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTopics.length - 1));
    } else if (e.key === "Enter" && filteredTopics[selectedIndex]) {
      e.preventDefault();
      handleSelectTopic(filteredTopics[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-[10px] shadow-2xl border border-[#dddddd] dark:border-stone-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-[#dddddd] dark:border-stone-800 flex items-center gap-3">
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
            placeholder="Search all 151+ IT guides, error codes, commands, or topics... (ESC to exit)"
            className="w-full bg-transparent text-[#333333] dark:text-stone-100 placeholder-[#555555] dark:placeholder-stone-500 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[#555555] hover:text-[#333333] dark:hover:text-stone-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono text-[#555555] bg-[#f0f0f5] dark:bg-stone-800 rounded-[6px] border border-[#dddddd] dark:border-stone-700">
            ESC
          </kbd>
        </div>

        {/* Filter Buttons */}
        <div className="px-4 py-2 bg-[#f0f0f5] dark:bg-stone-950/50 border-b border-[#dddddd] dark:border-stone-800 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-[#555555] dark:text-stone-400 font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-2.5 py-1 rounded-[6px] whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-[#4a90e2] text-white font-medium shadow-sm"
                : "bg-white dark:bg-stone-800 text-[#555555] dark:text-stone-400 hover:bg-[#e6e6ec] dark:hover:bg-stone-700 border border-[#dddddd] dark:border-stone-700"
            }`}
          >
            All Categories ({TOPICS_DATA.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-2.5 py-1 rounded-[6px] whitespace-nowrap transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-[#4a90e2] text-white font-medium shadow-sm"
                  : "bg-white dark:bg-stone-800 text-[#555555] dark:text-stone-400 hover:bg-[#e6e6ec] dark:hover:bg-stone-700 border border-[#dddddd] dark:border-stone-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="px-4 py-1.5 bg-[#f0f0f5] dark:bg-stone-950/50 border-b border-[#dddddd] dark:border-stone-800 flex items-center gap-2 text-xs">
          <span className="text-[#555555] dark:text-stone-400 font-medium shrink-0">Difficulty:</span>
          {["all", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2 py-0.5 rounded-[6px] transition-colors ${
                selectedDifficulty === diff
                  ? "bg-[#4a90e2] text-white font-bold"
                  : "text-[#555555] dark:text-stone-400 hover:text-[#333333] dark:hover:text-stone-100"
              }`}
            >
              {diff.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-grow overflow-y-auto p-2 divide-y divide-[#eeeeee] dark:divide-stone-800/60">
          {filteredTopics.length === 0 ? (
            <div className="py-12 text-center text-[#555555] dark:text-stone-400">
              <p className="text-base font-medium text-[#333333] dark:text-white">No troubleshooting guides found</p>
              <p className="text-xs mt-1 text-[#555555] dark:text-stone-400">
                Try searching for keywords like "DNS", "Startup", "BSOD", "Printer", or "Cache".
              </p>
            </div>
          ) : (
            filteredTopics.map((topic, index) => {
              const isSelected = index === selectedIndex;
              const diffColors = getDifficultyColor(topic.difficulty);
              return (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-[10px] cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? "bg-[#f0f6fc] dark:bg-slate-800 border border-[#4a90e2]/30"
                      : "hover:bg-[#f9f9fb] dark:hover:bg-stone-800/40 border border-transparent"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-semibold text-[#4a90e2] flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {topic.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-[4px] font-mono font-medium border ${diffColors.bg} ${diffColors.text} ${diffColors.border}`}
                      >
                        {topic.difficulty}
                      </span>
                      <span className="text-xs text-[#555555] dark:text-stone-400 font-mono">
                        {topic.estimatedRead} min read
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-[#333333] dark:text-stone-100 line-clamp-1">
                      {topic.title}
                    </h4>
                    <p className="text-sm text-[#555555] dark:text-stone-400 line-clamp-1 mt-1">
                      {topic.summary}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {topic.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-[4px] bg-[#f0f0f5] dark:bg-stone-800 text-[#555555] dark:text-stone-400 border border-[#dddddd] dark:border-stone-700 font-mono"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 self-center">
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? "text-[#4a90e2] translate-x-1" : "text-[#dddddd] dark:text-stone-700"
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#f0f0f5] dark:bg-stone-950/80 border-t border-[#dddddd] dark:border-stone-800 flex items-center justify-between text-xs text-[#555555] dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span>Showing {filteredTopics.length} of {TOPICS_DATA.length} guides</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-800 rounded border border-[#dddddd] dark:border-stone-700 text-xs font-mono">↑↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-800 rounded border border-[#dddddd] dark:border-stone-700 text-xs font-mono">↵</kbd> to open
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
