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
  Laptop,
  Terminal,
  Layers,
  Menu,
  X,
  ExternalLink,
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
      <header className="sticky top-0 z-40 w-full bg-[#4a90e2] text-white border-b-2 border-[#ddd] shadow-[0_2px_5px_rgba(0,0,0,0.2)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-[10px] bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-sm transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-tight leading-none">
                  CyberTech Portal
                </span>
                <span className="text-[10px] text-blue-100 font-medium tracking-wide">
                  Enterprise IT Knowledge Base
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/docs"
                className={`px-3 py-2 rounded-[10px] transition-colors ${
                  pathname.startsWith("/docs")
                    ? "bg-[#357abd] text-white font-semibold shadow-inner"
                    : "text-white hover:bg-[#357abd]"
                }`}
              >
                Knowledge Base
              </Link>

              {/* Categories dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 200)}
                  className="px-3 py-2 rounded-[10px] text-white hover:bg-[#357abd] transition-colors flex items-center gap-1"
                >
                  Categories <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {isCategoryDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-[10px] shadow-xl border border-[#ddd] p-2 z-50 text-[#333]">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/docs/${cat.slug}`}
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-medium text-[#333] hover:bg-[#f0f6fc] hover:text-[#4a90e2] transition-colors"
                      >
                        <CategoryIcon name={cat.icon} className="w-4 h-4 text-[#4a90e2]" />
                        <span>{cat.name}</span>
                        <span className="ml-auto text-[10px] text-[#555] font-mono">
                          {cat.topicCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/bookmarks"
                className={`px-3 py-2 rounded-[10px] transition-colors flex items-center gap-1.5 ${
                  pathname === "/bookmarks"
                    ? "bg-[#357abd] text-white font-semibold shadow-inner"
                    : "text-white hover:bg-[#357abd]"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Vault</span>
                {bookmarkCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-white text-[#4a90e2] rounded-full text-[10px] font-bold">
                    {bookmarkCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>

          {/* Center Search Input Trigger */}
          <div className="flex-1 max-w-md hidden sm:block">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 bg-white hover:bg-white/95 border border-[#ddd] rounded-[10px] text-[#555] text-xs transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#4a90e2]" />
                <span className="text-[#555]">Search 117+ guides, solutions & commands...</span>
              </div>
              <kbd className="px-2 py-0.5 font-mono text-[10px] bg-[#f0f0f5] border border-[#ddd] rounded text-[#555]">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 text-white hover:bg-[#357abd] rounded-[10px]"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-[10px] text-white hover:bg-[#357abd] transition-colors"
              title={`Switch mode`}
            >
              {resolvedTheme === "dark" ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-white" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-[#357abd] rounded-[10px]"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                href="/docs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium"
              >
                <BookOpen className="w-4 h-4 text-teal-600" />
                All Docs (117)
              </Link>
              <Link
                href="/bookmarks"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium"
              >
                <Bookmark className="w-4 h-4 text-teal-600" />
                Saved Vault ({bookmarkCount})
              </Link>

            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">
                Browse Categories
              </span>
              <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/docs/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                  >
                    <span className="flex items-center gap-2">
                      <CategoryIcon name={cat.icon} className="w-3.5 h-3.5 text-teal-600" />
                      {cat.name}
                    </span>
                    <span className="text-stone-400">{cat.topicCount}</span>
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
