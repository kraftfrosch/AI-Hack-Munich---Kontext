"use client";

import { useKontext } from "@kontext.dev/kontext-sdk/react";
import { Calendar, FileText, ListRestart, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedMarkdownBox } from "./animated-markdown-box";
import { Button } from "./ui/button";

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

	const generateInitialContent = useCallback(async () => {
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
	}, [systemPrompt, trelloContext, onUpdate]);

	useEffect(() => {
		if (systemPrompt) {
			generateInitialContent();
		}
	}, [systemPrompt]);

	// Update local edit content when update prop changes
	useEffect(() => {
		if (editContent !== progressUpdate.content && !isEditing) {
			setEditContent(progressUpdate.content);
		}
	}, [progressUpdate.content, editContent, isEditing]);

	const sendInitialDiscordMessage = async () => {
		const response = await fetch("/api/discord", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message:
					"Start your weekly project report: https://ai-hack-munich-kontext-5moe.vercel.app/update/review",
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		console.log("Discord message sent:", data);
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex items-center gap-2">
					<CardTitle className="flex items-center gap-2">
						<FileText className="w-5 h-5" />
						Progress Update
					</CardTitle>
					<div className="flex-1" />
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<Button
							onClick={sendInitialDiscordMessage}
							variant="ghost"
						></Button>
						<Calendar className="w-3 h-3" />
						<span>Week of {formatDate(progressUpdate.weekOf)}</span>
						<Button
							onClick={generateInitialContent}
							disabled={isGenerating}
							variant="ghost"
						>
							<ListRestart className="w-3 h-3" />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-3">
					<div className="space-y-3">
						{isEditing ? (
							<>
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
							</>
						) : (
							<>
								<AnimatedMarkdownBox
									content={progressUpdate.content || "No update content yet."}
									placeholder="No update content yet."
									onEdit={() => setIsEditing(true)}
									showEditButton={true}
								/>
								<div className="flex gap-2 items-center">
									{/*<Button
										onClick={generateInitialContent}
										disabled={isGenerating}
									>
										{isGenerating ? "Generating..." : "Generate Content"}
									</Button>

									<Button
										onClick={sendDiscordMessage}
										disabled={isSendingDiscordMessage}
									>
										{isSendingDiscordMessage ? "Sending..." : "Send to Discord"}
									</Button>
									<Button onClick={() => onUpdate("Hello World")}>
										Set Content Manually
									</Button>*/}
								</div>
							</>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
