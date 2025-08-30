"use client";

import { useCallback, useEffect, useState } from "react";
import { ConnectionOverview } from "@/components/connection-overview";
import { Conversation } from "@/components/progress-conversation";
import {
  type ProgressUpdate,
  ProgressUpdateNotes,
} from "@/components/progress-update-notes";

export default function Review() {
  const [progressUpdate, setProgressUpdate] = useState<ProgressUpdate>({
    id: "1",
    weekOf: new Date(),
    content: "",
  });
  const [trelloBoardText, setTrelloBoardText] = useState("");
  const [trelloConnected, setTrelloConnected] = useState(false);
  const [trelloLoading, setTrelloLoading] = useState(false);
  const defaultBoardId = "68b2d261fd8b6b2f72c7167d";

  const handleGetProgressUpdate = (): ProgressUpdate => {
    return progressUpdate;
  };

  const handleUpdateProgressUpdate = (content: string) => {
    setProgressUpdate((prev) => ({
      ...prev,
      content,
    }));
  };

  const connectTrello = useCallback(async () => {
    try {
      setTrelloLoading(true);
      const r = await fetch(`/api/trello/board?boardId=${defaultBoardId}`, {
        cache: "no-store",
      });
      const text = await r.text();
      if (!r.ok) throw new Error(text);
      setTrelloBoardText(text);
      setTrelloConnected(true);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setTrelloBoardText(`Error: ${errorMessage}`);
      setTrelloConnected(false);
    } finally {
      setTrelloLoading(false);
    }
  }, []);

  // Auto-connect to Trello on page load
  useEffect(() => {
    connectTrello();
  }, [connectTrello]);

  return (
    <main className="flex h-screen w-full flex-col">
      {/* Page Title */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          Review Progress Update
        </h1>
      </div>

      {/* Split Screen Content */}
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-2 p-4 pr-2 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4">
            <ProgressUpdateNotes
              progressUpdate={progressUpdate}
              onUpdate={handleUpdateProgressUpdate}
              trelloContext={trelloBoardText}
            />
            <ConnectionOverview
              trelloBoardText={trelloBoardText}
              setTrelloBoardText={setTrelloBoardText}
              trelloConnected={trelloConnected}
              setTrelloConnected={setTrelloConnected}
              connectTrello={connectTrello}
              trelloLoading={trelloLoading}
            />
          </div>
        </div>

        {/* Right side - Conversation */}
        <div className="flex-1 p-4 pl-2 min-h-0">
          <Conversation
            getProgressUpdateTool={handleGetProgressUpdate}
            updateProgressUpdateTool={handleUpdateProgressUpdate}
          />
        </div>
      </div>

      {/* <TrelloIntegration /> */}
    </main>
  );
}
