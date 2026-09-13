import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTopicBySlug, TOPICS_DATA, getCategoryBySlug, CATEGORIES } from "@/lib/topics-data";
import { ArticleReaderView } from "@/components/ArticleReaderView";

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

export function generateMetadata({ params }: ArticlePageProps): Metadata {
  const topic = getTopicBySlug(params.articleSlug);
  if (!topic) {
    return {
      title: "Guide Not Found | CyberTech FixIT",
    };
  }

  return {
    title: `${topic.title} | CyberTech IT Knowledge Base`,
    description: topic.summary,
    alternates: {
      canonical: `https://fixit.cybertechcomps.com/docs/${topic.categorySlug}/${topic.slug}`,
    },
    openGraph: {
      title: topic.title,
      description: topic.summary,
      url: `https://fixit.cybertechcomps.com/docs/${topic.categorySlug}/${topic.slug}`,
      siteName: "CyberTech FixIT IT Portal",
      type: "article",
    },
  };
}

export default function ArticleReaderPage({ params }: ArticlePageProps) {
  const topic = getTopicBySlug(params.articleSlug);

  if (!topic) {
    notFound();
  }

  const category = getCategoryBySlug(topic.categorySlug);

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleReaderView
        topic={topic}
        category={category}
        allCategories={CATEGORIES}
      />
    </>
  );
}
