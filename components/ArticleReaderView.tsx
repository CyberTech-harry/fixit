"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  Clock,
  Tag,
  UserCheck,
  Terminal,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  Share2,
  Bookmark,
  Printer,
  Compass,
  CheckCircle2,
  FileText,
  Sparkles,
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
  const [readerMode, setReaderMode] = useState<"simple" | "technical">("simple");
  const [copiedAllSteps, setCopiedAllSteps] = useState(false);
  const [copiedStepIndex, setCopiedStepIndex] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showExtraSteps, setShowExtraSteps] = useState(false);
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

  // Divide solutions: First 3 are the primary 3-step action cards
  const primarySteps = topic.solutions.slice(0, 3);
  const remainingSteps = topic.solutions.slice(3);

  return (
    <div className="portal-container py-8 pb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Navigation Sidebar */}
        <DocsSidebar currentCategorySlug={topic.categorySlug} currentSlug={topic.slug} />

        {/* Center Column: Documentation Content */}
        <article className="flex-1 min-w-0 py-2 max-w-4xl">
          {/* Breadcrumb Navigation with Category Jump Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <Link href="/" className="hover:text-[#4a90e2] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
              <Link href="/docs" className="hover:text-[#4a90e2] transition-colors">
                Docs
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
              <Link
                href={`/docs/${topic.categorySlug}`}
                className="hover:text-[#4a90e2] transition-colors font-medium text-slate-700 dark:text-slate-300"
              >
                {topic.category}
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
              <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs">
                {topic.title}
              </span>
            </nav>

            {/* Category Jump Selector */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:border-[#4a90e2] transition-colors cursor-pointer"
                title="Jump to another technical domain"
              >
                <Compass className="w-3.5 h-3.5 text-[#4a90e2]" />
                <span className="font-medium">Jump Domain</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {categoryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setCategoryDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-64 rounded-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg z-30 p-1.5 space-y-0.5 max-h-80 overflow-y-auto">
                    <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                        className={`w-full text-left px-2.5 py-2 rounded-[6px] text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          cat.slug === topic.categorySlug
                            ? "bg-blue-50 dark:bg-slate-800 text-[#4a90e2] font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <CategoryIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{cat.name}</span>
                        </div>
                        {cat.topicCount && (
                          <span className="text-[10px] font-mono text-slate-400">
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
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/docs/${topic.categorySlug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4a90e2] bg-blue-50 dark:bg-slate-800 px-2.5 py-1 rounded-[6px] border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
              >
                <CategoryIcon name={topic.categoryIcon || "Terminal"} className="w-3.5 h-3.5" />
                {topic.category}
              </Link>
              <span
                className={`text-[10px] px-2.5 py-1 rounded-[6px] font-mono font-bold border ${diffColors.bg} ${diffColors.text} ${diffColors.border}`}
              >
                {topic.difficulty}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" /> {topic.estimatedRead} min read
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {topic.title}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {topic.summary}
            </p>

            {/* Reader Mode Toggle Bar: Crisp segmented control */}
            <div className="pt-2">
              <div className="p-1 rounded-[10px] bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 inline-flex flex-col sm:flex-row gap-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setReaderMode("simple")}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
                    readerMode === "simple"
                      ? "bg-[#4a90e2] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>Simple Mode</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-normal ${
                      readerMode === "simple"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    Everyday Users
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setReaderMode("technical")}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
                    readerMode === "technical"
                      ? "bg-[#4a90e2] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <Terminal className="w-4 h-4 shrink-0" />
                  <span>Technical Mode</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-mono font-normal ${
                      readerMode === "technical"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    IT Engineers
                  </span>
                </button>
              </div>
            </div>

            {/* Clean Action Bar (Copy All Steps, Save to Vault, Print PDF, Share) */}
            <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
              <button
                type="button"
                onClick={handleCopyAllSteps}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#4a90e2] border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
                title="Copy all remediation steps"
              >
                {copiedAllSteps ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Steps Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Solution Steps</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={toggleBookmark}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] font-semibold transition-colors shadow-xs cursor-pointer ${
                  isBookmarked
                    ? "bg-[#4a90e2] text-white"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#4a90e2] border border-slate-200 dark:border-slate-700"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
                <span>{isBookmarked ? "Saved in Vault" : "Save to Vault"}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
                title="Print or Export as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
                title="Copy article URL"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SIMPLE MODE: For Everyday Users                               */}
          {/* ============================================================ */}
          {readerMode === "simple" && (
            <div className="space-y-6 mt-6">
              {/* Plain-English Explanation Callout */}
              <div className="p-5 rounded-[10px] bg-blue-50/50 dark:bg-slate-900 border border-blue-200/80 dark:border-blue-900/60 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4a90e2] uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  Plain-English Explanation
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {topic.summary}
                </p>
                <div className="text-xs text-slate-500 dark:text-slate-400 pt-1 flex items-center gap-2 flex-wrap font-medium">
                  <span>Difficulty: {topic.difficulty.toLowerCase()}</span>
                  <span>&bull;</span>
                  <span>Est. Fix Time: {topic.estimatedRead} minutes</span>
                  <span>&bull;</span>
                  <span>No command prompt required</span>
                </div>
              </div>

              {/* Warning Precaution Callout */}
              <div className="p-4 rounded-[10px] bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-200 block">
                    Important Safety Precaution
                  </span>
                  <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                    Save all open documents and work before applying any changes. None of the steps below require entering administrator passwords or installing third-party tools. If an unexpected screen appears, contact your support team.
                  </p>
                </div>
              </div>

              {/* Visual 3-Step Action Cards */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    3-Step Solution Protocol
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    Follow in order
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {primarySteps.map((step, index) => {
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
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Step {index + 1}
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                                {step}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopySingleStep(step, index)}
                            className="p-1.5 rounded-[6px] text-slate-400 hover:text-[#4a90e2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
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

                {/* Additional Steps Accordion (if more than 3 solutions) */}
                {remainingSteps.length > 0 && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowExtraSteps(!showExtraSteps)}
                      className="w-full py-2.5 px-4 rounded-[8px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#4a90e2] transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>
                        {showExtraSteps
                          ? "Hide Additional Remediation Steps"
                          : `View ${remainingSteps.length} Additional Quick Fixes`}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                          showExtraSteps ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showExtraSteps && (
                      <div className="space-y-2.5 mt-2.5 pl-2 border-l-2 border-blue-200 dark:border-blue-900">
                        {remainingSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-[8px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                          >
                            <span className="w-6 h-6 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                              {idx + 4}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Clean Summary & Resolution Card */}
              <div className="p-5 rounded-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Expected Resolution Summary
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  After completing these actions, restart the affected service or hardware and verify normal operation. In most scenarios, this clears cached faults and restores default functionality without further intervention.
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Need command line tools or architecture details?
                  </span>
                  <button
                    type="button"
                    onClick={() => setReaderMode("technical")}
                    className="font-semibold text-[#4a90e2] hover:text-[#357abd] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Switch to Technical Mode <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TECHNICAL MODE: For IT Engineers                              */}
          {/* ============================================================ */}
          {readerMode === "technical" && (
            <div className="space-y-6 mt-6">
              {/* Technical Banner */}
              <div className="p-4 rounded-[10px] bg-slate-900 text-slate-200 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Terminal className="w-4 h-4 text-[#4a90e2]" />
                  <span className="font-bold text-white">Technical Engineer Mode Active</span>
                  <span className="text-slate-400">| Complete Terminal &amp; Diagnostic Protocol</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReaderMode("simple")}
                  className="text-xs text-[#4a90e2] hover:underline font-semibold cursor-pointer"
                >
                  Return to Simple Mode
                </button>
              </div>

              {/* Multimedia Companion */}
              <VideoSynchronizer
                videoUrl={topic.videoUrl}
                audioUrl={topic.audioUrl}
                title={topic.title}
              />

              {/* Multi-OS Executable Commands */}
              {topic.commands && (
                <div className="my-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Multi-OS Terminal Diagnostic Commands
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Copy-ready PowerShell, CMD, Bash
                    </span>
                  </div>
                  <MultiOSTerminal commands={topic.commands} />
                </div>
              )}

              {/* Interactive 8-Step Verification Checklist */}
              {topic.checklists && topic.checklists.length > 0 && (
                <div className="my-6">
                  <div className="mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Production Verification Checklist
                    </h3>
                  </div>
                  <StepChecklist slug={topic.slug} steps={topic.checklists} />
                </div>
              )}

              {/* Main Rich Content Section: Architectural Details & Code Blocks */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Architectural Details &amp; Remediation Manual
                </h3>
                <div
                  id="article-content"
                  className="prose-guide text-slate-800 dark:text-slate-200 p-6 rounded-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
                  dangerouslySetInnerHTML={{ __html: topic.details || topic.summary }}
                />
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {topic.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-0.5 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700"
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
        <aside className="hidden xl:block w-64 shrink-0 py-6">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
}
