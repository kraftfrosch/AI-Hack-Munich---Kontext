"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText } from "lucide-react";

export interface InterviewNote {
  id: string;
  timestamp: Date;
  about: string;
  note: string;
}

interface InterviewNotesProps {
  notes: InterviewNote[];
}

export function InterviewNotes({ notes }: InterviewNotesProps) {
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Interview Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No notes yet. Notes will appear here during the interview.
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="border rounded-lg p-3 space-y-2 bg-muted/30"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(note.timestamp)}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      {note.about}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed">{note.note}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
