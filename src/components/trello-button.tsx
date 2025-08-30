"use client";

import React from "react";

type TrelloButtonProps = {
  isConnected: boolean;
  loading?: boolean;
  onConnect: () => void | Promise<void>;
  onDisconnect: () => void | Promise<void>;
};

export function TrelloButton({ isConnected, loading, onConnect, onDisconnect }: TrelloButtonProps) {
  const label = isConnected ? "Disconnect Trello" : "Connect Trello";
  const handleClick = () => {
    if (loading) return;
    if (isConnected) {
      onDisconnect();
    } else {
      onConnect();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={!!loading}
    >
      {loading ? "Working…" : label}
    </button>
  );
}


