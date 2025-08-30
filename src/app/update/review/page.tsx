"use client";

import { useState } from "react";
import { ConnectionOverview } from "@/components/connection-overview";
import { Conversation } from "@/components/progress-conversation";
import {
  type ProgressUpdate,
  ProgressUpdateNotes,
} from "@/components/progress-update-notes";
import { TrelloBoardText } from "@/components/trello-board-text";
import { TrelloButton } from "@/components/trello-button";
import { TrelloIntegration } from "@/components/trello-integration";

export default function Review() {
  const [progressUpdate, setProgressUpdate] = useState<ProgressUpdate>({
    id: "1",
    weekOf: new Date(),
    content:
      "# Achivement\n- closed EU client Superscale.ai for 500k\n\n# Blockers\n- we need legal approval for deployment",
  });
  const [trelloBoardText, setTrelloBoardText] = useState("");

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
    <main className="flex h-screen w-full flex-col">
      {/* Page Title */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          Review Progress Update
        </h1>
      </div>

      {/* Split Screen Content */}
      <div className="flex flex-1">
        <div className="flex-1 p-4 pr-2">
          <ProgressUpdateNotes
            progressUpdate={progressUpdate}
            onUpdate={handleUpdateProgressUpdate}
            trelloContext={trelloBoardText}
          />
          <ConnectionOverview
            trelloBoardText={trelloBoardText}
            setTrelloBoardText={setTrelloBoardText}
          />
        </div>

        {/* Right side - Conversation */}
        <div className="flex-1 border-r border-gray-200 p-4 pl-2">
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
