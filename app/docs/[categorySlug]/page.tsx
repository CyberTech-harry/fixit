import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  ArrowRight,
  Clock,
  Tag,
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";
import { getCategoryBySlug, getTopicsByCategory, CATEGORIES } from "@/lib/topics-data";
import { CategoryIcon } from "@/components/CategoryIcon";
import { DocsSidebar } from "@/components/DocsSidebar";
import { getDifficultyColor } from "@/lib/utils";

interface CategoryPageProps {
  params: {
    categorySlug: string;
  };
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    categorySlug: cat.slug,
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.categorySlug);

  if (!category) {
    notFound();
  }

  const topics = getTopicsByCategory(category.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-6">
        <Link href="/" className="hover:text-teal-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/docs" className="hover:text-teal-600 transition-colors">
          Knowledge Base
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-stone-900 dark:text-stone-100 font-semibold">
          {category.name}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar Navigation */}
        <DocsSidebar currentCategorySlug={category.slug} />

        {/* Main Content Area */}
        <div className="flex-1 space-y-8 min-w-0">
          {/* Category Header Card */}
          <div className="p-8 rounded-[10px] bg-stone-900 text-white border border-stone-800 shadow-sm relative overflow-hidden">
            <div className="relative z-10 flex items-start gap-5">
              <div className="w-14 h-14 rounded-[10px] bg-teal-600/20 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
                <CategoryIcon name={category.icon} className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-teal-400 text-xs font-semibold border border-teal-800 bg-teal-950/80">
                  Domain Guide
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {category.name}
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                  {category.description}
                </p>
                <div className="pt-2 flex items-center gap-4 text-xs text-stone-400 font-mono">
                  <span>{topics.length} Total Guides</span>
                  <span>•</span>
                  <span>Step-by-step diagnostic workflows</span>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">
              Technical Guides in {category.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic, index) => {
                const diffColors = getDifficultyColor(topic.difficulty);
                return (
                  <div
                    key={topic.id}
                    className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-teal-500/50 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono text-stone-400">
                          #{String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border ${diffColors.bg} ${diffColors.text} ${diffColors.border}`}
                        >
                          {topic.difficulty}
                        </span>
                      </div>

                      <Link
                        href={`/docs/${topic.categorySlug}/${topic.slug}`}
                        className="block group"
                      >
                        <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                          {topic.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                        {topic.summary}
                      </p>

                      {/* Quick steps preview */}
                      <div className="mt-3 space-y-1">
                        {topic.solutions.slice(0, 2).map((sol, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-stone-600 dark:text-stone-400">
                            <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{sol}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {topic.estimatedRead} min read
                      </span>
                      <Link
                        href={`/docs/${topic.categorySlug}/${topic.slug}`}
                        className="font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 text-xs"
                      >
                        Open Guide <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
