import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Metadata } from "next";
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

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = getCategoryBySlug(params.categorySlug);
  if (!category) {
    return { title: "Domain Not Found | CyberTech FixIT" };
  }
  return {
    title: `${category.name} IT Guides & Diagnostic Playbooks | CyberTech FixIT`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.categorySlug);

  if (!category) {
    notFound();
  }

  const topics = getTopicsByCategory(category.slug);

  return (
    <div className="portal-container py-8 pb-24">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#4a90e2] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
        <Link href="/docs" className="hover:text-[#4a90e2] transition-colors">
          Knowledge Base
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
        <span className="text-slate-900 dark:text-white font-semibold">
          {category.name}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar Navigation */}
        <DocsSidebar currentCategorySlug={category.slug} />

        {/* Main Content Area */}
        <div className="flex-1 space-y-8 min-w-0">
          {/* Category Header Card */}
          <div className="p-6 sm:p-8 rounded-[10px] bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
            <div className="relative z-10 flex items-start gap-4 sm:gap-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[10px] bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-[#4a90e2] flex items-center justify-center shrink-0">
                <CategoryIcon name={category.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-[#4a90e2] text-xs font-semibold border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-slate-800">
                  Technical Domain
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {category.name}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  {category.description}
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{topics.length} Guides</span>
                  <span>&bull;</span>
                  <span>Tested diagnostic workflows</span>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Guides in {category.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
              {topics.map((topic, index) => {
                const diffColors = getDifficultyColor(topic.difficulty);
                return (
                  <div
                    key={topic.id}
                    className="portal-card p-5 sm:p-6 flex flex-col justify-between hover:border-[#4a90e2] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-mono font-semibold text-slate-400">
                          #{String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-[6px] font-mono font-semibold border ${diffColors.bg} ${diffColors.text} ${diffColors.border}`}
                        >
                          {topic.difficulty}
                        </span>
                      </div>

                      <Link
                        href={`/docs/${topic.categorySlug}/${topic.slug}`}
                        prefetch={true}
                        className="block group"
                      >
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#4a90e2] transition-colors line-clamp-2">
                          {topic.title}
                        </h3>
                      </Link>

                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                        {topic.summary}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-400">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        <Clock className="w-3.5 h-3.5" /> {topic.estimatedRead} min read
                      </span>
                      <Link
                        href={`/docs/${topic.categorySlug}/${topic.slug}`}
                        prefetch={true}
                        className="font-semibold text-[#4a90e2] hover:text-[#357abd] hover:underline flex items-center gap-1 text-sm"
                      >
                        Open Guide <ArrowRight className="w-4 h-4" />
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
