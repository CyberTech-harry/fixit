"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, User, Reply, Clock } from "lucide-react";

interface CommentItem {
  id: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  replies?: CommentItem[];
}

interface CommentsSectionProps {
  articleId: string;
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storageKey = `article_comments_${articleId}`;

  useEffect(() => {
    // Load initial comments from localStorage or default seed
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setComments(JSON.parse(stored));
      } else {
        // Default starter community comment
        const defaultComments: CommentItem[] = [
          {
            id: "c-1",
            author: "DevOps Engineer",
            authorRole: "Verified Tech",
            content: "Tested this resolution on our fleet of workstations. Resolves the latency bottleneck cleanly!",
            createdAt: "2 days ago",
          },
        ];
        setComments(defaultComments);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const author = authorName.trim() || "Anonymous IT Pro";

    const newItem: CommentItem = {
      id: `c-${Date.now()}`,
      author: author,
      authorRole: "Community Member",
      content: newComment.trim(),
      createdAt: "Just now",
    };

    const updated = [newItem, ...comments];
    setComments(updated);
    setNewComment("");
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Call API in background
    try {
      await fetch("/api/v1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          author,
          content: newItem.content,
        }),
      });
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-10 pt-8 border-t border-stone-200 dark:border-stone-800">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          Community Troubleshooting & Insights ({comments.length})
        </h3>
      </div>

      {/* Post comment form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your Name / Call Sign (e.g. SysAdmin_Sam)"
            className="p-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <textarea
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share an edge-case tip, alternative command, or question about this guide..."
          className="w-full p-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 rounded-xl bg-white dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800/80 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[6px] bg-blue-50 dark:bg-slate-800 text-[#4a90e2] border border-blue-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs">
                  {comment.author[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-200 mr-2">
                    {comment.author}
                  </span>
                  {comment.authorRole && (
                    <span className="text-xs px-2 py-0.5 rounded-[4px] bg-blue-50 dark:bg-slate-800 text-[#4a90e2] font-semibold border border-blue-200 dark:border-slate-700">
                      {comment.authorRole}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {comment.createdAt}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-10.5">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
