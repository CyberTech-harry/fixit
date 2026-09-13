"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  BookOpen,
  Bookmark,
  Sun,
  Moon,
  Terminal,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { SearchModal } from "./SearchModal";
import { CATEGORIES } from "@/lib/topics-data";
import { CategoryIcon } from "./CategoryIcon";

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // Sync bookmark count from local storage
  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem("it_docs_bookmarks");
        if (stored) {
          setBookmarkCount(JSON.parse(stored).length);
        } else {
          setBookmarkCount(0);
        }
      } catch {
        setBookmarkCount(0);
      }
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("bookmark_updated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("bookmark_updated", updateCount);
    };
  }, []);

  // Global CMD+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors">
        <div className="portal-container h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-[8px] bg-[#4a90e2] text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                <Terminal className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight leading-none">
                  CyberTech
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                  IT Troubleshooting Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              <Link
                href="/docs"
                className={`px-3 py-1.5 rounded-[8px] transition-colors ${
                  pathname.startsWith("/docs")
                    ? "bg-blue-50 dark:bg-blue-950/60 text-[#4a90e2] dark:text-blue-400 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Knowledge Base
              </Link>

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 250)}
                  className="px-3 py-1.5 rounded-[8px] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  Categories <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
                {isCategoryDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-[10px] shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in duration-150">
                    <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 px-2 py-1 mb-1 border-b border-slate-100 dark:border-slate-800">
                      Technical Domains
                    </div>
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/docs/${cat.slug}`}
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#4a90e2] dark:hover:text-blue-400 transition-colors"
                      >
                        <CategoryIcon name={cat.icon} className="w-4 h-4 text-[#4a90e2]" />
                        <span>{cat.name}</span>
                        <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          {cat.topicCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/bookmarks"
                className={`px-3 py-1.5 rounded-[8px] transition-colors flex items-center gap-1.5 ${
                  pathname === "/bookmarks"
                    ? "bg-blue-50 dark:bg-blue-950/60 text-[#4a90e2] dark:text-blue-400 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved</span>
                {bookmarkCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#4a90e2] text-white rounded-[4px] text-[10px] font-bold font-mono">
                    {bookmarkCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>

          {/* Center Search Trigger */}
          <div className="flex-1 max-w-md hidden sm:block">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[8px] text-slate-500 dark:text-slate-400 text-xs transition-colors"
              title="Search Knowledge Base (Ctrl + K)"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#4a90e2]" />
                <span>Search guides, error codes, commands...</span>
              </div>
              <kbd className="px-2 py-0.5 font-mono text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400 shadow-2xs">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[8px] transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark/Light Mode Switcher */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-[8px] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[8px] transition-colors border border-slate-200 dark:border-slate-700"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/docs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-[8px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#4a90e2]" />
                All Guides ({CATEGORIES.reduce((acc, c) => acc + (c.topicCount || 0), 0)})
              </Link>
              <Link
                href="/bookmarks"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-[8px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#4a90e2]" />
                Saved ({bookmarkCount})
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                Technical Domains
              </span>
              <div className="grid grid-cols-1 gap-1 max-h-56 overflow-y-auto">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/docs/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-[6px] text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <CategoryIcon name={cat.icon} className="w-3.5 h-3.5 text-[#4a90e2]" />
                      {cat.name}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
                      {cat.topicCount}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Command Palette */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
