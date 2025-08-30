"use client";

import { useKontext } from "@kontext.dev/kontext-sdk/react";
import { ChevronDown, ChevronRight, Mail, Trello } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";

export function ContextOverview({
	trelloBoardText,
	isTrelloConnected = false,
}: {
	trelloBoardText?: string;
	isTrelloConnected?: boolean;
}) {
	const { systemPrompt, isConnected } = useKontext();
	const [isGmailExpanded, setIsGmailExpanded] = useState(false);
	const [isTrelloExpanded, setIsTrelloExpanded] = useState(false);

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-lg">Context Overview</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Gmail Context */}
				{isConnected && (
					<div className="space-y-2">
						<Button
							variant="ghost"
							onClick={() => setIsGmailExpanded(!isGmailExpanded)}
							className="flex items-center gap-2 p-0 h-auto font-normal"
						>
							{isGmailExpanded ? (
								<ChevronDown className="h-4 w-4" />
							) : (
								<ChevronRight className="h-4 w-4" />
							)}
							<Mail className="h-4 w-4" />
							<span>Gmail Context</span>
						</Button>
						{isGmailExpanded && (
							<Textarea
								value={systemPrompt || ""}
								readOnly
								className="h-[200px] text-xs resize-none overflow-y-auto"
								placeholder="No Gmail context available"
							/>
						)}
					</div>
				)}

				{/* Trello Context */}
				{isTrelloConnected && (
					<div className="space-y-2">
						<Button
							variant="ghost"
							onClick={() => setIsTrelloExpanded(!isTrelloExpanded)}
							className="flex items-center gap-2 p-0 h-auto font-normal"
						>
							{isTrelloExpanded ? (
								<ChevronDown className="h-4 w-4" />
							) : (
								<ChevronRight className="h-4 w-4" />
							)}
							<Trello className="h-4 w-4" />
							<span>Trello Context</span>
						</Button>
						{isTrelloExpanded && (
							<Textarea
								value={trelloBoardText || ""}
								readOnly
								className="h-[200px] text-xs resize-none overflow-y-auto"
								placeholder="No Trello context available"
							/>
						)}
					</div>
				)}

				{/* Show message when no services are connected */}
				{!isConnected && !isTrelloConnected && (
					<div className="text-center text-muted-foreground py-4">
						Connect Gmail or Trello to view context
					</div>
				)}
			</CardContent>
		</Card>
	);
}
