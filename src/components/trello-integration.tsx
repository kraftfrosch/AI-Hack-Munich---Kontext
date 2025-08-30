"use client";

import React from "react";
import { TrelloButton } from "./trello-button";

type TrelloIntegrationProps = {
	defaultBoardId?: string;
	trelloBoardText: string;
	setTrelloBoardText: (text: string) => void;
	trelloConnected: boolean;
	setTrelloConnected: (connected: boolean) => void;
	connectTrello: () => Promise<void>;
	trelloLoading: boolean;
};

export function TrelloIntegration({
	trelloBoardText, // Used by parent component to track current board text
	setTrelloBoardText,
	trelloConnected,
	setTrelloConnected,
	connectTrello,
	trelloLoading,
}: TrelloIntegrationProps) {
	const disconnectTrello = () => {
		setTrelloConnected(false);
		setTrelloBoardText("");
	};

	return (
		<div className="w-full" data-board-text={trelloBoardText}>
			<TrelloButton
				isConnected={trelloConnected}
				loading={trelloLoading}
				onConnect={connectTrello}
				onDisconnect={disconnectTrello}
			/>
			{/*<span className="text-xs text-gray-500">
					Board ID: {defaultBoardId}
				</span>*/}
		</div>
	);
}
