"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface AnimatedMarkdownBoxProps {
  content: string;
  className?: string;
  placeholder?: string;
  onEdit?: () => void;
  showEditButton?: boolean;
}

interface DiffSegment {
  type: "unchanged" | "removed" | "added";
  text: string;
}

export function AnimatedMarkdownBox({
  content,
  className = "",
  placeholder = "No content available.",
  onEdit,
  showEditButton = false,
}: AnimatedMarkdownBoxProps) {
  // Debug logging
  console.log("AnimatedMarkdownBox props:", {
    showEditButton,
    onEdit: !!onEdit,
    content: content?.substring(0, 50),
  });
  const [previousContent, setPreviousContent] = useState<string>("");
  const [diffSegments, setDiffSegments] = useState<DiffSegment[]>([]);
  const [showDiff, setShowDiff] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const diffTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simple diff algorithm to show changes
  const computeDiff = (oldText: string, newText: string): DiffSegment[] => {
    if (!oldText && !newText) return [];
    if (!oldText) return [{ type: "added", text: newText }];
    if (!newText) return [{ type: "removed", text: oldText }];

    const oldWords = oldText.split(/\s+/);
    const newWords = newText.split(/\s+/);
    const segments: DiffSegment[] = [];

    let i = 0,
      j = 0;

    while (i < oldWords.length || j < newWords.length) {
      if (i >= oldWords.length) {
        segments.push({ type: "added", text: newWords.slice(j).join(" ") });
        break;
      }
      if (j >= newWords.length) {
        segments.push({ type: "removed", text: oldWords.slice(i).join(" ") });
        break;
      }

      // Find common subsequence
      let commonEnd = 0;
      while (
        i + commonEnd < oldWords.length &&
        j + commonEnd < newWords.length &&
        oldWords[i + commonEnd] === newWords[j + commonEnd]
      ) {
        commonEnd++;
      }

      if (commonEnd > 0) {
        segments.push({
          type: "unchanged",
          text: oldWords.slice(i, i + commonEnd).join(" "),
        });
        i += commonEnd;
        j += commonEnd;
      } else {
        // Find next match
        let nextMatch = -1;
        for (let k = j + 1; k < newWords.length && k < j + 10; k++) {
          if (oldWords[i] === newWords[k]) {
            nextMatch = k;
            break;
          }
        }

        if (nextMatch > 0) {
          segments.push({
            type: "added",
            text: newWords.slice(j, nextMatch).join(" "),
          });
          j = nextMatch;
        } else {
          const oldInNew = newWords.indexOf(oldWords[i], j);
          if (oldInNew > j && oldInNew < j + 10) {
            segments.push({
              type: "added",
              text: newWords.slice(j, oldInNew).join(" "),
            });
            j = oldInNew;
          } else {
            segments.push({ type: "removed", text: oldWords[i] });
            i++;
          }
        }
      }
    }

    // Merge consecutive segments of the same type
    const merged: DiffSegment[] = [];
    for (const segment of segments) {
      if (
        merged.length > 0 &&
        merged[merged.length - 1].type === segment.type
      ) {
        merged[merged.length - 1].text += " " + segment.text;
      } else {
        merged.push(segment);
      }
    }

    return merged;
  };

  // Update diff when content changes
  useEffect(() => {
    if (content !== previousContent && previousContent !== "") {
      // Clear any existing timeout
      if (diffTimeoutRef.current) {
        clearTimeout(diffTimeoutRef.current);
      }

      setDiffSegments(computeDiff(previousContent, content));
      setShowDiff(true);
      setIsUpdating(true);

      // Clear update indicator after animation
      setTimeout(() => setIsUpdating(false), 2000);

      // Hide diff after 5 seconds, showing only the current text
      diffTimeoutRef.current = setTimeout(() => {
        setShowDiff(false);
        setDiffSegments([]);
      }, 5000);
    }

    setPreviousContent(content);
  }, [content, previousContent]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (diffTimeoutRef.current) {
        clearTimeout(diffTimeoutRef.current);
      }
    };
  }, []);

  if (!content) {
    return (
      <div className={`text-sm text-gray-500 text-center py-8 ${className}`}>
        <p>{placeholder}</p>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeOut {
          0% {
            opacity: 1;
            text-decoration: line-through;
          }
          80% {
            opacity: 0.3;
            text-decoration: line-through;
          }
          100% {
            opacity: 0;
            text-decoration: none;
            display: none;
          }
        }

        @keyframes fadeToNormal {
          0% {
            background-color: rgb(220 252 231);
            color: rgb(21 128 61);
            font-weight: 500;
          }
          80% {
            background-color: transparent;
            color: rgb(55 65 81);
            font-weight: 400;
          }
          100% {
            background-color: transparent;
            color: rgb(55 65 81);
            font-weight: 400;
          }
        }
      `}</style>

      <div
        className={`bg-white rounded-xl shadow-lg border border-gray-200 p-4 transition-all duration-300 relative ${
          isUpdating ? "ring-2 ring-blue-500 ring-opacity-50" : ""
        } ${className}`}
      >
        <div className="prose prose-sm max-w-none text-sm">
          {showDiff && diffSegments.length > 0 ? (
            <p className="leading-relaxed text-sm transition-all duration-1000">
              {diffSegments.map((segment, index) => {
                if (segment.type === "unchanged") {
                  return (
                    <span key={index} className="text-gray-700">
                      {segment.text}{" "}
                    </span>
                  );
                } else if (segment.type === "removed") {
                  return (
                    <span
                      key={index}
                      className="line-through text-red-500 bg-red-50 px-1 rounded transition-all duration-1000 ease-in-out"
                      style={{
                        animation: "fadeOut 5s ease-in-out forwards",
                      }}
                    >
                      {segment.text}{" "}
                    </span>
                  );
                } else {
                  return (
                    <span
                      key={index}
                      className="text-green-700 bg-green-50 px-1 rounded font-medium transition-all duration-1000"
                      style={{
                        animation: "fadeToNormal 5s ease-in-out forwards",
                      }}
                    >
                      {segment.text}{" "}
                    </span>
                  );
                }
              })}
            </p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0">{children}</p>
                ),
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold mb-2 mt-3 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-medium mb-2 mt-2 first:mt-0">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-3 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-3 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="text-sm">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto mb-3">
                    {children}
                  </pre>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                a: ({ children, href }) => (
                  <a href={href} className="text-blue-600 hover:underline">
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>

        {/* Edit Button - Hover in bottom right corner */}
        {showEditButton && onEdit && (
          <button
            onClick={onEdit}
            className="absolute bottom-3 right-3 p-2 bg-blue-500 hover:bg-blue-600 text-white border border-blue-600 rounded-lg shadow-md opacity-100 transition-all duration-200 hover:scale-105 z-10"
            title="Edit content"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Legend */}
      {diffSegments.length > 0 &&
        diffSegments.some((s) => s.type !== "unchanged") && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <span className="inline-block w-3 h-3 bg-green-50 border border-green-300 rounded"></span>
                <span className="text-gray-600">Added</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="inline-block w-3 h-3 bg-red-50 border border-red-300 rounded"></span>
                <span className="text-gray-600">Removed</span>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
