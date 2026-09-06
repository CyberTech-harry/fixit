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
  initialYes = 42,
  initialNo = 2,
}: FeedbackWidgetProps) {
  const [userVote, setUserVote] = useState<"yes" | "no" | null>(null);
  const [yesCount, setYesCount] = useState(initialYes);
  const [noCount, setNoCount] = useState(initialNo);
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
    if (type === "yes") setYesCount((p) => p + 1);
    if (type === "no") setNoCount((p) => p + 1);

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
    <div className="my-10 p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 text-center transition-colors">
      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
        Was this troubleshooting guide helpful?
      </h3>
      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
        Your feedback helps improve remediation accuracy for the entire IT engineering community.
      </p>

      {/* Voting buttons */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => handleVote("yes")}
          disabled={userVote !== null}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            userVote === "yes"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-105"
              : userVote === "no"
              ? "bg-stone-100 dark:bg-stone-800 text-stone-400 opacity-60"
              : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-700 dark:hover:text-teal-400 border border-stone-200 dark:border-stone-700 shadow-sm"
          }`}
        >
          <ThumbsUp className="w-4 h-4 text-emerald-500" />
          <span>Yes, problem resolved ({yesCount})</span>
        </button>

        <button
          onClick={() => handleVote("no")}
          disabled={userVote !== null}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            userVote === "no"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-105"
              : userVote === "yes"
              ? "bg-stone-100 dark:bg-stone-800 text-stone-400 opacity-60"
              : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-400 border border-stone-200 dark:border-stone-700 shadow-sm"
          }`}
        >
          <ThumbsDown className="w-4 h-4 text-rose-500" />
          <span>No, need more details ({noCount})</span>
        </button>
      </div>

      {/* Optional feedback comment form */}
      {showCommentBox && !commentSubmitted && (
        <form
          onSubmit={handleCommentSubmit}
          className="mt-5 max-w-lg mx-auto p-4 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-left animate-in fade-in"
        >
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
            Any specific step that worked or caused trouble? (Optional)
          </label>
          <textarea
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="e.g., Step 3 required administrator elevation in Windows 11..."
            className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowCommentBox(false)}
              className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              <Send className="w-3 h-3" />
              {isSubmitting ? "Submitting..." : "Send Feedback"}
            </button>
          </div>
        </form>
      )}

      {commentSubmitted && (
        <div className="mt-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-medium inline-flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-teal-600" />
          Thank you! Your feedback has been logged for our editorial team.
        </div>
      )}
    </div>
  );
}
