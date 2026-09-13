"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  BookOpen,
  ArrowRight,
  Clock,
  Search,
} from "lucide-react";
import { TopicItem } from "@/lib/types";
import { getDifficultyColor } from "@/lib/utils";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<TopicItem[]>([]);
  const [filterText, setFilterText] = useState("");

  const loadBookmarks = () => {
    try {
      const saved = localStorage.getItem("it_docs_bookmarks");
      if (saved) {
        setBookmarks(JSON.parse(saved));
      } else {
        setBookmarks([]);
      }
    } catch {
      setBookmarks([]);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleRemove = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    try {
      localStorage.setItem("it_docs_bookmarks", JSON.stringify(updated));
      window.dispatchEvent(new Event("bookmark_updated"));
    } catch {
      // ignore
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all saved guides?")) {
      setBookmarks([]);
      try {
        localStorage.removeItem("it_docs_bookmarks");
        window.dispatchEvent(new Event("bookmark_updated"));
      } catch {
        // ignore
      }
    }
  };

  const filtered = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(filterText.toLowerCase()) ||
      b.category.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="portal-container py-10 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#dddddd] dark:border-stone-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#4a90e2] flex items-center gap-1.5 mb-1">
            <Bookmark className="w-4 h-4" /> Personal Saved Vault
          </span>
          <h1 className="text-3xl font-extrabold text-[#333333] dark:text-white tracking-tight">
            Saved IT Guides &amp; Quick References
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-stone-400 mt-1">
            Your personal collection of bookmarked troubleshooting workflows for rapid offline retrieval.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={handleClearAll}
            className="self-start sm:self-center px-3.5 py-2 rounded-[10px] text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All Saved
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="portal-card py-20 text-center p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-[10px] bg-[#f0f6fc] dark:bg-slate-800 text-[#4a90e2] flex items-center justify-center mx-auto border border-[#4a90e2]/20">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#333333] dark:text-stone-100">
            Your Vault is Empty
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-stone-400 max-w-md mx-auto">
            Click the "Save to Vault" button on any of the 151+ IT guides to save it here for immediate reference.
          </p>
          <div className="pt-2">
            <Link
              href="/docs"
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold shadow-sm"
            >
              <BookOpen className="w-4 h-4" /> Browse Documentation
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#555555] dark:text-stone-400" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search within saved guides..."
              className="portal-input pl-10 text-xs sm:text-sm shadow-sm"
            />
          </div>

          {/* Bookmarks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filtered.map((topic) => {
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
                      <button
                        onClick={() => handleRemove(topic.id)}
                        className="text-[#555555] hover:text-rose-500 transition-colors p-1"
                        title="Remove from vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#dddddd] dark:border-stone-800 flex items-center justify-between text-xs text-[#555555] dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {topic.estimatedRead} min read
                    </span>
                    <Link
                      href={`/docs/${topic.categorySlug}/${topic.slug}`}
                      className="font-semibold text-[#4a90e2] hover:text-[#357abd] hover:underline flex items-center gap-1"
                    >
                      Open Guide <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
