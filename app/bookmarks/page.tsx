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
  ExternalLink,
  Shield,
  Layers,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5 mb-1">
            <Bookmark className="w-4 h-4" /> Personal Vault
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Saved IT Guides & Quick References
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Your personal collection of bookmarked troubleshooting workflows for rapid offline retrieval.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={handleClearAll}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All Saved
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Your Vault is Empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            Click the "Save to Vault" button on any of the 117+ IT guides to save it here for immediate one-click reference.
          </p>
          <div className="pt-2">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
            >
              <BookOpen className="w-4 h-4" /> Browse Documentation
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search within saved guides..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
            />
          </div>

          {/* Bookmarks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((topic) => {
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
                      <button
                        onClick={() => handleRemove(topic.id)}
                        className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                        title="Remove from vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {topic.estimatedRead} min read
                    </span>
                    <Link
                      href={`/docs/${topic.categorySlug}/${topic.slug}`}
                      className="font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
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
