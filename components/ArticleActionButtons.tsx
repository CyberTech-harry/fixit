"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, Printer, Share2, Check, Download } from "lucide-react";
import { TopicItem } from "@/lib/types";

interface ArticleActionButtonsProps {
  topic: TopicItem;
}

export function ArticleActionButtons({ topic }: ArticleActionButtonsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("it_docs_bookmarks");
      if (saved) {
        const list: TopicItem[] = JSON.parse(saved);
        setIsBookmarked(list.some((t) => t.id === topic.id));
      }
    } catch {
      // ignore
    }
  }, [topic.id]);

  const toggleBookmark = () => {
    try {
      const saved = localStorage.getItem("it_docs_bookmarks");
      let list: TopicItem[] = saved ? JSON.parse(saved) : [];

      if (isBookmarked) {
        list = list.filter((t) => t.id !== topic.id);
        setIsBookmarked(false);
      } else {
        list = [topic, ...list.filter((t) => t.id !== topic.id)];
        setIsBookmarked(true);
      }

      localStorage.setItem("it_docs_bookmarks", JSON.stringify(list));
      window.dispatchEvent(new Event("bookmark_updated"));

      // Notify backend asynchronously
      fetch("/api/v1/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: topic.id }),
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2 pt-2 flex-wrap">
      <button
        onClick={toggleBookmark}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          isBookmarked
            ? "bg-teal-600 text-white shadow-sm"
            : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-700 dark:hover:text-teal-400 border border-stone-200 dark:border-stone-700"
        }`}
      >
        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
        <span>{isBookmarked ? "Saved in Vault" : "Save to Vault"}</span>
      </button>

      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 transition-colors"
        title="Print or Export as PDF"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Print / PDF</span>
      </button>

      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 transition-colors"
        title="Copy article URL"
      >
        {copiedLink ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500">Link Copied</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </>
        )}
      </button>
    </div>
  );
}
