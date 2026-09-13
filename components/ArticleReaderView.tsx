"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Clock,
  Tag,
  Terminal,
  Copy,
  Check,
  Share2,
  Bookmark,
  Printer,
  Compass,
} from "lucide-react";
import { TopicItem, CategoryInfo } from "@/lib/types";
import { MultiOSTerminal } from "@/components/MultiOSTerminal";
import { StepChecklist } from "@/components/StepChecklist";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { CommentsSection } from "@/components/CommentsSection";
import { VideoSynchronizer } from "@/components/VideoSynchronizer";
import { CategoryIcon } from "@/components/CategoryIcon";
import { TableOfContents } from "@/components/TableOfContents";
import { DocsSidebar } from "@/components/DocsSidebar";
import { getDifficultyColor } from "@/lib/utils";

interface ArticleReaderViewProps {
  topic: TopicItem;
  category?: CategoryInfo;
  allCategories: CategoryInfo[];
}

export function ArticleReaderView({
  topic,
  category,
  allCategories,
}: ArticleReaderViewProps) {
  const router = useRouter();
  const [copiedAllSteps, setCopiedAllSteps] = useState(false);
  const [copiedStepIndex, setCopiedStepIndex] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const diffColors = getDifficultyColor(topic.difficulty);

  // Sync bookmarks with localStorage
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
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyAllSteps = () => {
    const formattedSteps = topic.solutions
      .map((step, idx) => `Step ${idx + 1}: ${step}`)
      .join("\n\n");
    const textToCopy = `${topic.title}\n\nSummary:\n${topic.summary}\n\nAction Steps:\n${formattedSteps}\n\nReference: https://fixit.cybertechcomps.com/docs/${topic.categorySlug}/${topic.slug}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedAllSteps(true);
    setTimeout(() => setCopiedAllSteps(false), 2000);
  };

  const handleCopySingleStep = (stepText: string, index: number) => {
    navigator.clipboard.writeText(`Step ${index + 1}: ${stepText}`);
    setCopiedStepIndex(index);
    setTimeout(() => setCopiedStepIndex(null), 2000);
  };

  return (
    <div className="portal-container py-8 pb-24">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Navigation Sidebar */}
        <DocsSidebar currentCategorySlug={topic.categorySlug} currentSlug={topic.slug} />

        {/* Center Column: Documentation Content */}
        <article className="flex-1 min-w-0 py-2 max-w-5xl 2xl:max-w-6xl">
          {/* Breadcrumb Navigation with Category Jump Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
              <Link href="/" className="hover:text-[#4a90e2] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              <Link href="/docs" className="hover:text-[#4a90e2] transition-colors">
                Docs
              </Link>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              <Link
                href={`/docs/${topic.categorySlug}`}
                className="hover:text-[#4a90e2] transition-colors font-medium text-slate-700 dark:text-slate-300"
              >
                {topic.category}
              </Link>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs sm:max-w-md">
                {topic.title}
              </span>
            </nav>

            {/* Category Jump Selector */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 hover:border-[#4a90e2] transition-colors cursor-pointer"
                title="Jump to another technical domain"
              >
                <Compass className="w-4 h-4 text-[#4a90e2]" />
                <span className="font-medium">Jump Domain</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {categoryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setCategoryDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-72 rounded-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-30 p-2 space-y-1 max-h-88 overflow-y-auto">
                    <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Technical Domains
                    </div>
                    {allCategories.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => {
                          setCategoryDropdownOpen(false);
                          router.push(`/docs/${cat.slug}`);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-[6px] text-sm flex items-center justify-between transition-colors cursor-pointer ${
                          cat.slug === topic.categorySlug
                            ? "bg-blue-50 dark:bg-slate-800 text-[#4a90e2] font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <CategoryIcon name={cat.icon} className="w-4 h-4 shrink-0" />
                          <span className="truncate">{cat.name}</span>
                        </div>
                        {cat.topicCount && (
                          <span className="text-xs font-mono font-semibold text-slate-400">
                            {cat.topicCount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Guide Header Banner */}
          <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href={`/docs/${topic.categorySlug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4a90e2] bg-blue-50 dark:bg-slate-800 px-3 py-1.5 rounded-[6px] border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
              >
                <CategoryIcon name={topic.categoryIcon || "Terminal"} className="w-4 h-4" />
                {topic.category}
              </Link>
              <span
                className={`text-xs px-2.5 py-1 rounded-[6px] font-mono font-bold border ${diffColors.bg} ${diffColors.text} ${diffColors.border}`}
              >
                {topic.difficulty}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                <Clock className="w-4 h-4" /> {topic.estimatedRead} min read
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {topic.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {topic.summary}
            </p>

            {/* Clean Action Bar */}
            <div className="flex items-center gap-2.5 pt-2 flex-wrap text-sm">
              <button
                type="button"
                onClick={handleCopyAllSteps}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#4a90e2] border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
                title="Copy all remediation steps"
              >
                {copiedAllSteps ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Steps Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copy Solution Steps</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={toggleBookmark}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-[8px] font-semibold transition-colors shadow-xs cursor-pointer ${
                  isBookmarked
                    ? "bg-[#4a90e2] text-white"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#4a90e2] border border-slate-200 dark:border-slate-700"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                <span>{isBookmarked ? "Saved in Vault" : "Save to Vault"}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
                title="Print or Export as PDF"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
                title="Copy article URL"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-500" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Full Technical Documentation Guide */}
          <div className="space-y-8 mt-6">
            {/* Multimedia Companion */}
            <VideoSynchronizer
              videoUrl={topic.videoUrl}
              audioUrl={topic.audioUrl}
              title={topic.title}
            />

            {/* Standard Remediation Protocol Cards */}
            {topic.solutions && topic.solutions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Standard Remediation Protocol
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {topic.solutions.length} verified steps
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {topic.solutions.map((step, index) => {
                    const stepNumber = String(index + 1).padStart(2, "0");
                    const isCopied = copiedStepIndex === index;

                    return (
                      <div
                        key={index}
                        className="p-4 sm:p-5 rounded-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#4a90e2] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <span className="w-8 h-8 rounded-[6px] bg-blue-50 dark:bg-slate-800 text-[#4a90e2] border border-blue-200 dark:border-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                              {stepNumber}
                            </span>
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                Step {index + 1}
                              </h4>
                              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                                {step}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopySingleStep(step, index)}
                            className="p-2 rounded-[6px] text-slate-400 hover:text-[#4a90e2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                            title="Copy this step"
                          >
                            {isCopied ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Multi-OS Executable Commands */}
            {topic.commands && (
              <div className="my-6">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Multi-OS Terminal Diagnostic Commands
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    PowerShell &bull; Windows CMD &bull; Bash
                  </span>
                </div>
                <MultiOSTerminal commands={topic.commands} />
              </div>
            )}

            {/* Interactive Verification Checklist */}
            {topic.checklists && topic.checklists.length > 0 && (
              <div className="my-6">
                <div className="mb-2.5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Production Verification Checklist
                  </h3>
                </div>
                <StepChecklist slug={topic.slug} steps={topic.checklists} />
              </div>
            )}

            {/* Main Rich Content Section: Architectural Details & Code Blocks */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Architectural Details &amp; Remediation Manual
              </h3>
              <div
                id="article-content"
                className="prose-guide text-slate-800 dark:text-slate-200 p-6 sm:p-8 rounded-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
                dangerouslySetInnerHTML={{ __html: topic.details || topic.summary }}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
              <Tag className="w-4 h-4" /> Tags:
            </span>
            {topic.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-[6px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Helpfulness Rating Widget */}
          <FeedbackWidget
            articleId={topic.id}
            initialYes={topic.helpfulness?.yes}
            initialNo={topic.helpfulness?.no}
          />

          {/* Community Comments Section */}
          <CommentsSection articleId={topic.id} />
        </article>

        {/* Right Column: Dynamic Table of Contents */}
        <aside className="hidden xl:block w-72 shrink-0 py-6">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
}
