import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  BookOpen,
  Clock,
  Tag,
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

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: topic.title,
    description: topic.summary,
    articleSection: topic.category,
    keywords: topic.tags.join(", "),
    timeRequired: `PT${topic.estimatedRead}M`,
    proficiencyLevel: topic.difficulty,
    author: {
      "@type": "Organization",
      name: "CyberTech IT Engineering Team",
      url: "https://fixit.cybertechcomps.com",
    },
    publisher: {
      "@type": "Organization",
      name: "CyberTech Computer Systems",
      url: "https://fixit.cybertechcomps.com",
    },
  };

  return (
    <div className="portal-container py-8 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Navigation Sidebar */}
        <DocsSidebar currentCategorySlug={topic.categorySlug} />

        {/* Center Column: Documentation Content */}
        <article className="flex-1 min-w-0 py-2 max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
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
              className="hover:text-[#4a90e2] transition-colors"
            >
              {topic.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
            <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs">
              {topic.title}
            </span>
          </nav>

          {/* Guide Header Banner */}
          <div className="space-y-3.5 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/docs/${topic.categorySlug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#4a90e2] bg-blue-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-[6px] border border-blue-200 dark:border-blue-900"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {topic.category}
              </Link>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-[6px] font-mono font-medium border ${diffColors.bg} ${diffColors.text} ${diffColors.border}`}
              >
                {topic.difficulty}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {topic.estimatedRead} min read
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {topic.title}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {topic.summary}
            </p>

            {/* Action Bar (Bookmark, Print PDF, Share) */}
            <ArticleActionButtons topic={topic} />
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
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
            className="prose-guide text-slate-800 dark:text-slate-200 mt-8"
            dangerouslySetInnerHTML={{ __html: topic.details || topic.summary }}
          />

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
