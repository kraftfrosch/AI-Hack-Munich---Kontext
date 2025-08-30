"use client";

import { useKontext } from "@kontext.dev/kontext-sdk/react";
import { Calendar, Edit3, FileText } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";

export interface ProgressUpdate {
  id: string;
  weekOf: Date;
  content: string;
}

interface ProgressUpdateNotesProps {
  progressUpdate: ProgressUpdate;
  onUpdate: (content: string) => void;
  trelloContext?: string;
}

export function ProgressUpdateNotes({
  progressUpdate,
  onUpdate,
  trelloContext = "",
}: ProgressUpdateNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(progressUpdate.content);
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleSave = () => {
    onUpdate(editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(progressUpdate.content);
    setIsEditing(false);
  };

  const { systemPrompt } = useKontext();

  const generateInitialContent = async () => {
    // Call the API to generate the initial content
    setIsGenerating(true);
    try {
      const response = await fetch("/api/weekly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kontext: systemPrompt, trello: trelloContext }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Generated content:", data.response);

      // Update both the edit content and the progress update
      setEditContent(data.response);
      onUpdate(data.response);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update local edit content when update prop changes
  if (editContent !== progressUpdate.content && !isEditing) {
    setEditContent(progressUpdate.content);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Progress Update
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Week of {formatDate(progressUpdate.weekOf)}</span>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[200px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your weekly update in markdown..."
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="prose prose-sm max-w-none">
                <div className="text-sm leading-relaxed">
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
                      li: ({ children }) => (
                        <li className="text-sm">{children}</li>
                      ),
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
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          className="text-blue-600 hover:underline"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {progressUpdate.content || "No update content yet."}
                  </ReactMarkdown>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  onClick={generateInitialContent}
                  disabled={isGenerating}
                  className="text-xs"
                >
                  {isGenerating ? "Generating..." : "Generate Content"}
                </Button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  title="Edit update"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
