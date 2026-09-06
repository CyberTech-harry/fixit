import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  BookOpen,
  Clock,
  Eye,
  Bookmark,
  Printer,
  Share2,
  Tag,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Info,
} from "lucide-react";
import { getTopicBySlug, TOPICS_DATA, getCategoryBySlug } from "@/lib/topics-data";
import { DocsSidebar } from "@/components/DocsSidebar";
import { TableOfContents } from "@/components/TableOfContents";
import { MultiOSTerminal } from "@/components/MultiOSTerminal";
import { StepChecklist } from "@/components/StepChecklist";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { CommentsSection } from "@/components/CommentsSection";
import { VideoSynchronizer } from "@/components/VideoSynchronizer";
import { ArticleActionButtons } from "@/components/ArticleActionButtons";
import { getDifficultyColor } from "@/lib/utils";

interface ArticlePageProps {
  params: {
    categorySlug: string;
    articleSlug: string;
  };
}

export function generateStaticParams() {
  return TOPICS_DATA.map((topic) => ({
    categorySlug: topic.categorySlug,
    articleSlug: topic.slug,
  }));
}

export default function ArticleReaderPage({ params }: ArticlePageProps) {
  const topic = getTopicBySlug(params.articleSlug);

  if (!topic) {
    notFound();
  }

  const category = getCategoryBySlug(topic.categorySlug);
  const diffColors = getDifficultyColor(topic.difficulty);

  // JSON-LD Structured Data Schema for SEO (HowTo and TechArticle)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: topic.title,
    description: topic.summary,
    totalTime: `PT${topic.estimatedRead}M`,
    step: topic.solutions.map((sol, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `Step ${index + 1}`,
      text: sol,
    })),
  };

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Collapsible Sidebar */}
        <DocsSidebar
          currentSlug={topic.slug}
          currentCategorySlug={topic.categorySlug}
        />

        {/* Center Column: Documentation Content */}
        <article className="flex-1 min-w-0 py-4 max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-teal-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/docs" className="hover:text-teal-600 transition-colors">
              Docs
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href={`/docs/${topic.categorySlug}`}
              className="hover:text-teal-600 transition-colors"
            >
              {topic.category}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-stone-900 dark:text-stone-100 font-semibold truncate max-w-xs">
              {topic.title}
            </span>
          </nav>

          {/* Guide Header Banner */}
          <div className="space-y-4 pb-6 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href={`/docs/${topic.categorySlug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-800/60"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {topic.category}
              </Link>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-lg font-mono font-bold border ${diffColors.bg} ${diffColors.text} ${diffColors.border}`}
              >
                {topic.difficulty}
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {topic.estimatedRead} min read
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 font-mono">
                <Eye className="w-3.5 h-3.5" /> {topic.viewsCount || 120} views
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              {topic.title}
            </h1>

            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              {topic.summary}
            </p>

            {/* Action Bar (Bookmark, Print PDF, Share) */}
            <ArticleActionButtons topic={topic} />
          </div>

          {/* Multimedia Companion (Synchronized Video & Audio Player) */}
          <VideoSynchronizer
            videoUrl={topic.videoUrl}
            audioUrl={topic.audioUrl}
            title={topic.title}
          />

          {/* Multi-OS Executable Commands */}
          {topic.commands && (
            <div className="my-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                Quick Terminal Execution Commands
              </h3>
              <MultiOSTerminal commands={topic.commands} />
            </div>
          )}

          {/* Interactive Diagnostic Checklist */}
          {topic.checklists && topic.checklists.length > 0 && (
            <StepChecklist slug={topic.slug} steps={topic.checklists} />
          )}

          {/* Main Rich Content Section */}
          <div
            id="article-content"
            className="prose-guide text-stone-800 dark:text-stone-200 mt-8"
            dangerouslySetInnerHTML={{ __html: topic.details || topic.summary }}
          />

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-stone-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {topic.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-mono"
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
