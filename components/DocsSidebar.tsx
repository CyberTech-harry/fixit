"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Search,
  Tag,
  Laptop,
} from "lucide-react";
import { CATEGORIES, TOPICS_DATA } from "@/lib/topics-data";
import { CategoryIcon } from "./CategoryIcon";
import { getDifficultyColor } from "@/lib/utils";

interface DocsSidebarProps {
  currentSlug?: string;
  currentCategorySlug?: string;
}

export function DocsSidebar({ currentSlug, currentCategorySlug }: DocsSidebarProps) {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CATEGORIES.forEach((cat) => {
      // Default open the active category or all
      initial[cat.slug] = currentCategorySlug ? cat.slug === currentCategorySlug : true;
    });
    return initial;
  });
  const [filterQuery, setFilterQuery] = useState("");

  const toggleCategory = (slug: string) => {
    setOpenCategories((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 py-6 pr-4 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto border-r border-stone-200 dark:border-stone-800/80">
      {/* Quick In-Sidebar Filter */}
      <div className="mb-4 pr-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter guides..."
            className="w-full pl-8 pr-3 py-1.5 bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-lg text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="space-y-4 pr-2">
        {CATEGORIES.map((category) => {
          const topics = TOPICS_DATA.filter((t) => t.categorySlug === category.slug);
          const filteredTopics = filterQuery
            ? topics.filter((t) => t.title.toLowerCase().includes(filterQuery.toLowerCase()))
            : topics;

          if (filterQuery && filteredTopics.length === 0) return null;

          const isOpen = openCategories[category.slug] || !!filterQuery;

          return (
            <div key={category.slug} className="space-y-1">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.slug)}
                className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <CategoryIcon name={category.icon} className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                    {topics.length}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  )}
                </div>
              </button>

              {/* Topics Sub-list */}
              {isOpen && (
                <div className="pl-6 pr-1 space-y-0.5 border-l border-stone-200 dark:border-stone-800 ml-3">
                  {filteredTopics.map((topic) => {
                    const isActive = currentSlug === topic.slug;
                    const diffColors = getDifficultyColor(topic.difficulty);
                    return (
                      <Link
                        key={topic.id}
                        href={`/docs/${topic.categorySlug}/${topic.slug}`}
                        className={`group block py-1.5 px-2 rounded-md text-xs transition-all ${
                          isActive
                            ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold border-l-2 border-teal-600 -ml-[1px]"
                            : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="line-clamp-1 flex-1 leading-snug">{topic.title}</span>
                          <span
                            className={`shrink-0 text-[9px] px-1 py-0.2 rounded font-mono ${diffColors.bg} ${diffColors.text}`}
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
