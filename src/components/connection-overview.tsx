import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ContextOverview } from "./context-overview";
import { KontextConnectionStatus } from "./kontext-connect-button";
import { TrelloIntegration } from "./trello-integration";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function ConnectionOverview({
	trelloBoardText,
	setTrelloBoardText,
	trelloConnected,
	setTrelloConnected,
	connectTrello,
	trelloLoading,
}: {
	trelloBoardText: string;
	setTrelloBoardText: (text: string) => void;
	trelloConnected: boolean;
	setTrelloConnected: (connected: boolean) => void;
	connectTrello: () => Promise<void>;
	trelloLoading: boolean;
}) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<Card className="flex flex-col">
			<CardHeader
				className="cursor-pointer hover:bg-muted/50 transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<CardTitle className="flex items-center justify-between">
					<span>Context Overview</span>
					{isExpanded ? (
						<ChevronDown className="h-4 w-4" />
					) : (
						<ChevronRight className="h-4 w-4" />
					)}
				</CardTitle>
			</CardHeader>
			{isExpanded && (
				<CardContent className="flex flex-col gap-2">
					<KontextConnectionStatus />
					<TrelloIntegration
						trelloBoardText={trelloBoardText}
						setTrelloBoardText={setTrelloBoardText}
						trelloConnected={trelloConnected}
						setTrelloConnected={setTrelloConnected}
						connectTrello={connectTrello}
						trelloLoading={trelloLoading}
					/>
					<ContextOverview
						trelloBoardText={trelloBoardText}
						isTrelloConnected={trelloConnected}
					/>
				</CardContent>
			)}
		</Card>
	);
}
