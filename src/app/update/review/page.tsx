"use client";

import { useState } from "react";
import { Conversation } from "@/components/progress-conversation";
import {
  ProgressUpdateNotes,
  ProgressUpdate,
} from "@/components/progress-update-notes";

export default function Review() {
  const [progressUpdate, setProgressUpdate] = useState<ProgressUpdate>({
    id: "1",
    weekOf: new Date(),
    content: "",
  });

  const handleGetProgressUpdate = (): ProgressUpdate => {
    return progressUpdate;
  };

  const handleUpdateProgressUpdate = (content: string) => {
    setProgressUpdate((prev) => ({
      ...prev,
      content,
    }));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Review Progress Update
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto place-items-center">
          <div className="w-full">
            <ProgressUpdateNotes
              progressUpdate={progressUpdate}
              onUpdate={handleUpdateProgressUpdate}
            />
          </div>
          <div className="w-full">
            <Conversation
              getProgressUpdateTool={handleGetProgressUpdate}
              updateProgressUpdateTool={handleUpdateProgressUpdate}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
