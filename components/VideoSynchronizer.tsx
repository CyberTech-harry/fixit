"use client";

import React, { useState } from "react";
import { Video, ChevronDown, ChevronUp, Play, Volume2, Maximize2, Minimize2, ExternalLink } from "lucide-react";

interface VideoSynchronizerProps {
  videoUrl?: string;
  audioUrl?: string;
  title: string;
}

export function VideoSynchronizer({ videoUrl = "https://www.youtube.com/watch?v=p4kQbt0QUkY", audioUrl = "/audio/tech-trouble-solved.mp3", title }: VideoSynchronizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"video" | "audio">("video");

  // Extract YouTube ID
  let youtubeId = "p4kQbt0QUkY";
  if (videoUrl) {
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match) {
      youtubeId = match[1];
    }
  }

  return (
    <div className="my-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-600/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Video className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              Synchronized Video & Audio Companion
              <span className="text-[10px] px-1.5 py-0.2 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 rounded font-normal">
                Multimedia Guide
              </span>
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Watch step-by-step video demonstration or listen to the technical audio walkthrough.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-teal-600 dark:text-teal-400">
            {isOpen ? "Collapse Player" : "Watch / Listen"}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-stone-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-500" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("video")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                mode === "video"
                  ? "bg-rose-600 text-white"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Video Demonstration
            </button>
            <button
              onClick={() => setMode("audio")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                mode === "audio"
                  ? "bg-teal-600 text-white"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" /> Audio Guide
            </button>

            <a
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 flex items-center gap-1"
            >
              Open on YouTube <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Player Display */}
          {mode === "video" ? (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-inner border border-stone-800">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
                title={`Video guide for ${title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-stone-900 text-white space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-600/20 text-teal-400 flex items-center justify-center">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-stone-100">
                    Tech Trouble Solved: Audio Edition
                  </h5>
                  <p className="text-[11px] text-stone-400">
                    Audio overview and troubleshooting methodology
                  </p>
                </div>
              </div>
              <audio controls className="w-full h-10 mt-2" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
