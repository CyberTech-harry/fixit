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
    <div className="my-6 rounded-[10px] overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-sm">
      {/* Terminal Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Status dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/80" />
          </div>

          {/* OS Selector Tabs */}
          <div className="flex items-center bg-slate-950 rounded-[6px] p-0.5 border border-slate-800 text-xs">
            {commands.powershell && (
              <button
                onClick={() => setActiveTab("powershell")}
                className={`px-3 py-1.5 rounded-[4px] transition-colors flex items-center gap-1.5 font-mono text-xs cursor-pointer ${
                  activeTab === "powershell"
                    ? "bg-[#4a90e2] text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-white" /> PowerShell
              </button>
            )}
            {commands.cmd && (
              <button
                onClick={() => setActiveTab("cmd")}
                className={`px-3 py-1.5 rounded-[4px] transition-colors flex items-center gap-1.5 font-mono text-xs cursor-pointer ${
                  activeTab === "cmd"
                    ? "bg-[#4a90e2] text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <TerminalSquare className="w-3.5 h-3.5 text-white" /> CMD
              </button>
            )}
            {commands.bash && (
              <button
                onClick={() => setActiveTab("bash")}
                className={`px-3 py-1.5 rounded-[4px] transition-colors flex items-center gap-1.5 font-mono text-xs cursor-pointer ${
                  activeTab === "bash"
                    ? "bg-[#4a90e2] text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Apple className="w-3.5 h-3.5 text-white" /> Bash / Zsh
              </button>
            )}
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors border border-slate-700 cursor-pointer"
          title="Copy command to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Code Body */}
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed bg-slate-950">
        <pre className="text-[#6ba3f5] whitespace-pre-wrap select-all font-mono">
          <code>
            {currentCommand || "# No command defined for this shell"}
          </code>
        </pre>
      </div>
    </div>
  );
}
