"use client";

import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Send, Check, MessageSquare } from "lucide-react";

interface FeedbackWidgetProps {
  articleId: string;
  initialYes?: number;
  initialNo?: number;
}

export function FeedbackWidget({
  articleId,
}: FeedbackWidgetProps) {
  const [userVote, setUserVote] = useState<"yes" | "no" | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const storageKey = `article_feedback_${articleId}`;

  useEffect(() => {
    try {
      const savedVote = localStorage.getItem(storageKey);
      if (savedVote === "yes" || savedVote === "no") {
        setUserVote(savedVote);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const handleVote = async (type: "yes" | "no") => {
    if (userVote) return; // already voted

    setUserVote(type);

    try {
      localStorage.setItem(storageKey, type);
    } catch {
      // ignore
    }

    setShowCommentBox(true);

    // Call API in background
    try {
      await fetch(`/api/v1/articles/${articleId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHelpful: type === "yes" }),
      });
    } catch {
      // API fallback graceful
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch(`/api/v1/articles/${articleId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isHelpful: userVote === "yes",
          comment: commentText.trim(),
        }),
      });
      setCommentSubmitted(true);
    } catch {
      setCommentSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="portal-card my-10 p-6 text-center transition-colors">
      <h3 className="text-base font-bold text-[#333333] dark:text-stone-100">
        Was this troubleshooting guide helpful?
      </h3>
      <p className="text-xs text-[#555555] dark:text-stone-400 mt-1 max-w-md mx-auto">
        Your verification helps maintain remediation accuracy across technical guides.
      </p>

      {/* Voting buttons */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={() => handleVote("yes")}
          disabled={userVote !== null}
          className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-xs font-semibold transition-all shadow-sm ${
            userVote === "yes"
              ? "bg-[#4a90e2] text-white font-bold"
              : userVote === "no"
              ? "bg-[#f0f0f5] dark:bg-stone-800 text-[#555555] opacity-50 cursor-not-allowed"
              : "bg-white dark:bg-stone-800 text-[#333333] dark:text-stone-200 hover:bg-[#f0f6fc] hover:text-[#4a90e2] border border-[#dddddd] dark:border-stone-700"
          }`}
        >
          <ThumbsUp className="w-4 h-4 text-emerald-600" />
          <span>Yes, problem resolved</span>
        </button>

        <button
          onClick={() => handleVote("no")}
          disabled={userVote !== null}
          className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-xs font-semibold transition-all shadow-sm ${
            userVote === "no"
              ? "bg-rose-600 text-white font-bold"
              : userVote === "yes"
              ? "bg-[#f0f0f5] dark:bg-stone-800 text-[#555555] opacity-50 cursor-not-allowed"
              : "bg-white dark:bg-stone-800 text-[#333333] dark:text-stone-200 hover:bg-rose-50 hover:text-rose-600 border border-[#dddddd] dark:border-stone-700"
          }`}
        >
          <ThumbsDown className="w-4 h-4 text-rose-500" />
          <span>No, need more details</span>
        </button>
      </div>

      {/* Optional feedback comment form */}
      {showCommentBox && !commentSubmitted && (
        <form
          onSubmit={handleCommentSubmit}
          className="mt-5 max-w-lg mx-auto p-4 rounded-[10px] bg-[#f0f0f5] dark:bg-stone-800/80 border border-[#dddddd] dark:border-stone-700 text-left animate-in fade-in"
        >
          <label className="block text-xs font-medium text-[#333333] dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#4a90e2]" />
            Any specific step that worked or caused trouble? (Optional)
          </label>
          <textarea
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="e.g., Step 3 required administrator elevation in Windows 11..."
            className="portal-input text-xs"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowCommentBox(false)}
              className="px-3 py-1.5 text-xs text-[#555555] hover:text-[#333333] dark:hover:text-stone-300"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="btn-primary px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              {isSubmitting ? "Submitting..." : "Send Feedback"}
            </button>
          </div>
        </form>
      )}

      {commentSubmitted && (
        <div className="mt-4 p-3 rounded-[10px] bg-[#f0f6fc] dark:bg-slate-800 border border-[#4a90e2]/30 text-[#4a90e2] text-xs font-medium inline-flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-[#4a90e2]" />
          Thank you! Your feedback has been logged for our editorial team.
        </div>
      )}
    </div>
  );
}
