"use client";
// ==============================================================================
// features/global-search/presentation/components/text-highlighter.tsx
// Highlights matching query text substrings cleanly
// ==============================================================================
import React from "react";

interface TextHighlighterProps {
  text: string;
  query: string;
  className?: string;
}

export function TextHighlighter({ text, query, className = "" }: TextHighlighterProps) {
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const q = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${q})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-primary font-bold rounded-xs px-0.5">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </span>
  );
}
