"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, TerminalSquare, Laptop, Apple } from "lucide-react";

interface MultiOSTerminalProps {
  commands?: {
    powershell?: string;
    cmd?: string;
    bash?: string;
  };
}

export function MultiOSTerminal({ commands }: MultiOSTerminalProps) {
  const [activeTab, setActiveTab] = useState<"powershell" | "cmd" | "bash">("powershell");
  const [copied, setCopied] = useState(false);

  if (!commands) return null;

  const currentCommand =
    activeTab === "powershell"
      ? commands.powershell
      : activeTab === "cmd"
      ? commands.cmd
      : commands.bash;

  const handleCopy = () => {
    if (!currentCommand) return;
    navigator.clipboard.writeText(currentCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 text-stone-100 shadow-xl">
      {/* Terminal Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-900/90 border-b border-stone-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          {/* OS Selector Tabs */}
          <div className="flex items-center bg-stone-950/80 rounded-lg p-0.5 border border-stone-800 text-xs">
            {commands.powershell && (
              <button
                onClick={() => setActiveTab("powershell")}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 font-mono ${
                  activeTab === "powershell"
                    ? "bg-teal-700/80 text-white font-semibold shadow-sm"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <Laptop className="w-3 h-3 text-teal-400" /> PowerShell
              </button>
            )}
            {commands.cmd && (
              <button
                onClick={() => setActiveTab("cmd")}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 font-mono ${
                  activeTab === "cmd"
                    ? "bg-teal-700/80 text-white font-semibold shadow-sm"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <TerminalSquare className="w-3 h-3 text-amber-400" /> CMD
              </button>
            )}
            {commands.bash && (
              <button
                onClick={() => setActiveTab("bash")}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 font-mono ${
                  activeTab === "bash"
                    ? "bg-teal-700/80 text-white font-semibold shadow-sm"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <Apple className="w-3 h-3 text-stone-300" /> Bash / Zsh
              </button>
            )}
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono transition-colors border border-stone-700/60"
          title="Copy command to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-stone-400" />
              <span>Copy Command</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Code Body */}
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed bg-gradient-to-b from-stone-950 to-stone-900/90">
        <pre className="text-teal-300 whitespace-pre-wrap select-all">
          <code>
            {currentCommand || "# No command defined for this shell"}
          </code>
        </pre>
      </div>
    </div>
  );
}
