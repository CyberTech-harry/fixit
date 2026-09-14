"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Search,
} from "lucide-react";
import { CATEGORIES, TOPICS_DATA } from "@/lib/topics-data";
import { CategoryIcon } from "./CategoryIcon";
import { getDifficultyColor } from "@/lib/utils";

interface DocsSidebarProps {
  currentSlug?: string;
  currentCategorySlug?: string;
}

export function DocsSidebar({ currentSlug, currentCategorySlug }: DocsSidebarProps) {
  // Pre-group topics by category once to avoid array filters on every render
  const topicsByCategory = useMemo(() => {
    const map: Record<string, typeof TOPICS_DATA> = {};
    for (const cat of CATEGORIES) {
      map[cat.slug] = [];
    }
    for (const topic of TOPICS_DATA) {
      if (map[topic.categorySlug]) {
        map[topic.categorySlug].push(topic);
      }
    }
    return map;
  }, []);

  // Default to only expanding the currently active category (or first category if none)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const activeSlug = currentCategorySlug || (CATEGORIES[0]?.slug);
    CATEGORIES.forEach((cat) => {
      initial[cat.slug] = cat.slug === activeSlug;
    });
    return initial;
  });

  const [filterQuery, setFilterQuery] = useState("");

  const toggleCategory = (slug: string) => {
    setOpenCategories((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 py-6 pr-4 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto border-r border-stone-200 dark:border-stone-800/80">
      {/* Quick In-Sidebar Filter */}
      <div className="mb-4 pr-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter guides..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-[8px] text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4a90e2]"
          />
        </div>
      </div>

      <div className="space-y-2 pr-2">
        {CATEGORIES.map((category) => {
          const topics = topicsByCategory[category.slug] || [];
          const filteredTopics = filterQuery
            ? topics.filter((t) => t.title.toLowerCase().includes(filterQuery.toLowerCase()))
            : topics;

          if (filterQuery && filteredTopics.length === 0) return null;

          const isOpen = openCategories[category.slug] || !!filterQuery;

          return (
            <div key={category.slug} className="space-y-1">
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(category.slug)}
                className="w-full flex items-center justify-between p-2.5 rounded-[8px] text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <CategoryIcon name={category.icon} className="w-4 h-4 text-[#4a90e2] dark:text-blue-400" />
                  <span className="group-hover:text-[#4a90e2] dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-[4px]">
                    {topics.length}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Topics Sub-list */}
              {isOpen && (
                <div className="pl-6 pr-1 space-y-1 border-l border-slate-200 dark:border-slate-800 ml-3.5">
                  {filteredTopics.map((topic) => {
                    const isActive = currentSlug === topic.slug;
                    const diffColors = getDifficultyColor(topic.difficulty);
                    return (
                      <Link
                        key={topic.id}
                        href={`/docs/${topic.categorySlug}/${topic.slug}`}
                        prefetch={true}
                        className={`group block py-2 px-2.5 rounded-[6px] text-sm transition-all ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-950/60 text-[#4a90e2] dark:text-blue-300 font-semibold border-l-2 border-[#4a90e2] -ml-[1px]"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="line-clamp-1 flex-1 leading-snug">{topic.title}</span>
                          <span
                            className={`shrink-0 text-xs px-1.5 py-0.5 rounded-[4px] font-mono font-semibold ${diffColors.bg} ${diffColors.text}`}
                          >
                            {topic.difficulty[0]}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
