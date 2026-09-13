"use client";

import React, { useEffect, useState } from "react";
import { List, ChevronRight } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from the article container
    const article = document.querySelector("#article-content");
    if (!article) return;

    const elements = Array.from(article.querySelectorAll("h2, h3"));
    const items: TocItem[] = elements.map((el, index) => {
      if (!el.id) {
        el.id = `heading-${index}-${el.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      }
      return {
        id: el.id,
        text: el.textContent || "",
        level: el.tagName.toLowerCase() === "h2" ? 2 : 3,
      };
    });

    setHeadings(items);

    // Set up scroll spy observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -60% 0%" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="space-y-3 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
        <List className="w-3.5 h-3.5 text-[#4a90e2]" />
        <span>On This Page</span>
      </div>

      <nav className="space-y-1">
        {headings.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                setActiveId(item.id);
              }}
              className={`block text-xs py-1.5 transition-colors line-clamp-1 ${
                item.level === 3 ? "pl-4" : "pl-1 font-medium"
              } ${
                isActive
                  ? "text-[#4a90e2] font-semibold border-l-2 border-[#4a90e2] pl-2"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {item.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
