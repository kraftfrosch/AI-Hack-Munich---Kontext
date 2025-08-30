"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Edit3 } from "lucide-react";
import { useState } from "react";

export interface ProgressUpdate {
  id: string;
  weekOf: Date;
  content: string;
}

interface ProgressUpdateNotesProps {
  progressUpdate: ProgressUpdate;
  onUpdate: (content: string) => void;
}

export function ProgressUpdateNotes({
  progressUpdate,
  onUpdate,
}: ProgressUpdateNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(progressUpdate.content);

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

  // Update local edit content when update prop changes
  if (editContent !== progressUpdate.content && !isEditing) {
    setEditContent(progressUpdate.content);
  }

  return (
    <Card className="w-full max-w-md mx-auto">
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
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
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
                <div
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: progressUpdate.content || "No update content yet.",
                  }}
                />
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-muted rounded transition-colors"
                title="Edit update"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
