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

export default function Review() {
	const [progressUpdate, setProgressUpdate] = useState<ProgressUpdate>({
		id: "1",
		weekOf: new Date(),
		content:
			"# Achivement\n- closed EU client Superscale.ai for 500k\n\n# Blockers\n- we need legal approval for deployment",
	});

	const [trelloConnected, setTrelloConnected] = useState(false);
	const [trelloLoading, setTrelloLoading] = useState(false);
	const [trelloBoardText, setTrelloBoardText] = useState("");
	const defaultBoardId = "68b2d261fd8b6b2f72c7167d";

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
		} catch (e: any) {
			setTrelloBoardText(`Error: ${e?.message || e}`);
			setTrelloConnected(false);
		} finally {
			setTrelloLoading(false);
		}
	};

	const disconnectTrello = () => {
		setTrelloConnected(false);
		setTrelloBoardText("");
	};

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
					<div className="w-full gap-4 flex flex-col">
						<ProgressUpdateNotes
							progressUpdate={progressUpdate}
							onUpdate={handleUpdateProgressUpdate}
							trelloContext={trelloBoardText}
						/>
						<ConnectionOverview
							trelloConnected={trelloConnected}
							trelloLoading={trelloLoading}
							connectTrello={connectTrello}
							disconnectTrello={disconnectTrello}
						/>
					</div>
					<div className="w-full">
						<Conversation
							getProgressUpdateTool={handleGetProgressUpdate}
							updateProgressUpdateTool={handleUpdateProgressUpdate}
						/>
					</div>
				</div>
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
			</div>
		</main>
	);
}
