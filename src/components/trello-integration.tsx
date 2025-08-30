"use client";

import { useState } from "react";
import { TrelloButton } from "./trello-button";
import { TrelloBoardText } from "./trello-board-text";

type TrelloIntegrationProps = {
  defaultBoardId?: string;
};

export function TrelloIntegration({
  defaultBoardId = "68b2d261fd8b6b2f72c7167d",
}: TrelloIntegrationProps) {
  const [trelloConnected, setTrelloConnected] = useState(false);
  const [trelloLoading, setTrelloLoading] = useState(false);
  const [trelloBoardText, setTrelloBoardText] = useState("");

  const connectTrello = async () => {
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
  };

  const disconnectTrello = () => {
    setTrelloConnected(false);
    setTrelloBoardText("");
  };

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-4">
        <TrelloButton
          isConnected={trelloConnected}
          loading={trelloLoading}
          onConnect={connectTrello}
          onDisconnect={disconnectTrello}
        />
        <span className="text-xs text-gray-500">
          Board ID: {defaultBoardId}
        </span>
      </div>
      <TrelloBoardText
        value={trelloBoardText}
        onChange={setTrelloBoardText}
        placeholder="Trello board JSON/text will appear here after connecting…"
        rows={12}
      />
    </div>
  );
}
