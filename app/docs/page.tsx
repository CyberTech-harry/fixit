"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  ArrowRight,
  Clock,
  RotateCcw,
} from "lucide-react";
import { CATEGORIES, TOPICS_DATA } from "@/lib/topics-data";
import { CategoryIcon } from "@/components/CategoryIcon";
import { getDifficultyColor } from "@/lib/utils";

export default function DocsIndexPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const filteredTopics = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
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
        topic.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  return (
    <div className="portal-container py-10 space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-2.5 border-b border-slate-200 dark:border-slate-800 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#4a90e2]">
          Knowledge Base Directory
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          All IT Troubleshooting Guides &amp; Solutions
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Access {TOPICS_DATA.length} operational technical guides across {CATEGORIES.length} technical domains. Filter by domain, difficulty rating, or search for exact keywords and error codes.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="portal-card p-5 sm:p-6 space-y-5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter guides by title, error code, command, or tag..."
            className="portal-input pl-10 text-sm sm:text-base"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-2 rounded-[8px] whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#4a90e2] text-white font-semibold shadow-xs"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            All ({TOPICS_DATA.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-2 rounded-[8px] whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.slug
                  ? "bg-[#4a90e2] text-white font-semibold shadow-xs"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              <CategoryIcon name={cat.icon} className="w-4 h-4 text-current" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Difficulty Selector & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-400">Difficulty:</span>
            {["all", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-[6px] text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  selectedDifficulty === diff
                    ? "bg-[#4a90e2] text-white font-bold"
                    : "bg-slate-100 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {diff.toUpperCase()}
              </button>
            ))}
          </div>

          <span className="font-mono text-xs text-slate-400">
            Showing {filteredTopics.length} of {TOPICS_DATA.length} guides
          </span>
        </div>
      </div>

      {/* Guides Grid */}
      {filteredTopics.length === 0 ? (
        <div className="portal-card py-16 text-center text-slate-500 dark:text-slate-400 p-6">
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            No guides match your filter criteria.
          </p>
          <p className="text-sm mt-1 text-slate-400">
            Try clearing your search terms or selecting All Categories.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedDifficulty("all");
            }}
            className="btn-primary mt-4 px-4 py-2.5 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredTopics.map((topic) => {
            const diffColors = getDifficultyColor(topic.difficulty);
            return (
              <div
                key={topic.id}
                className="portal-card p-5 sm:p-6 flex flex-col justify-between hover:border-[#4a90e2] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-[#4a90e2] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      {topic.category}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-[6px] font-mono font-semibold border ${diffColors.bg} ${diffColors.text} ${diffColors.border}`}
                    >
                      {topic.difficulty}
                    </span>
                  </div>

                  <Link
                    href={`/docs/${topic.categorySlug}/${topic.slug}`}
                    prefetch={true}
                    className="block group"
                  >
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#4a90e2] transition-colors line-clamp-2">
                      {topic.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 mt-3.5 flex-wrap">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-400">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" /> {topic.estimatedRead} min read
                  </span>
                  <Link
                    href={`/docs/${topic.categorySlug}/${topic.slug}`}
                    prefetch={true}
                    className="font-semibold text-sm text-[#4a90e2] hover:text-[#357abd] hover:underline flex items-center gap-1"
                  >
                    View Guide <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
