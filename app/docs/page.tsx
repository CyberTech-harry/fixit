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
    <div className="portal-container py-10 space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-2 border-b border-[#dddddd] dark:border-stone-800 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#4a90e2]">
          Knowledge Base Directory
        </span>
        <h1 className="text-3xl font-extrabold text-[#333333] dark:text-white tracking-tight">
          All IT Troubleshooting Guides &amp; Solutions
        </h1>
        <p className="text-sm text-[#555555] dark:text-stone-300 max-w-3xl leading-relaxed">
          Browse all {TOPICS_DATA.length} operational technical guides across 10 categories. Filter by domain, difficulty rating, or search for exact keywords, error codes, and symptoms.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="portal-card p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#555555] dark:text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter guides by title, error code, command, or tag..."
            className="portal-input pl-10"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-[10px] whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-[#4a90e2] text-white font-semibold shadow-sm"
                : "bg-white dark:bg-stone-800 border border-[#dddddd] dark:border-stone-700 text-[#555555] dark:text-stone-300 hover:bg-[#f0f0f5]"
            }`}
          >
            All Categories ({TOPICS_DATA.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-[10px] whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat.slug
                  ? "bg-[#4a90e2] text-white font-semibold shadow-sm"
                  : "bg-white dark:bg-stone-800 border border-[#dddddd] dark:border-stone-700 text-[#555555] dark:text-stone-300 hover:bg-[#f0f0f5]"
              }`}
            >
              <CategoryIcon name={cat.icon} className="w-3.5 h-3.5 text-current" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Difficulty Selector & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-[#dddddd] dark:border-stone-800 text-xs text-[#555555] dark:text-stone-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Difficulty Level:</span>
            {["all", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-[6px] transition-colors ${
                  selectedDifficulty === diff
                    ? "bg-[#4a90e2] text-white font-bold"
                    : "bg-[#f0f0f5] dark:bg-stone-800 hover:text-[#333333] dark:hover:text-white"
                }`}
              >
                {diff.toUpperCase()}
              </button>
            ))}
          </div>

          <span className="font-mono">
            Showing {filteredTopics.length} of {TOPICS_DATA.length} guides
          </span>
        </div>
      </div>

      {/* Guides Grid */}
      {filteredTopics.length === 0 ? (
        <div className="portal-card py-16 text-center text-[#555555] dark:text-stone-400 p-6">
          <p className="text-base font-semibold text-[#333333] dark:text-white">
            No guides match your filter criteria.
          </p>
          <p className="text-xs mt-1">
            Try clearing your search terms or selecting All Categories.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedDifficulty("all");
            }}
            className="btn-primary mt-4 px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => {
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

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 mt-4 flex-wrap">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-[6px] bg-[#f0f0f5] dark:bg-stone-800 text-[#555555] dark:text-stone-300 font-mono border border-[#dddddd] dark:border-stone-700"
                      >
                        #{tag}
                      </span>
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
      )}
    </div>
  );
}
