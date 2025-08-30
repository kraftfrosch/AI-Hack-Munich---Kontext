import { ContextOverview } from "./context-overview";
import { KontextConnectionStatus } from "./kontext-connect-button";
import { TrelloIntegration } from "./trello-integration";
import { Card, CardContent } from "./ui/card";

export function ConnectionOverview({
	trelloBoardText,
	setTrelloBoardText,
}: {
	trelloBoardText: string;
	setTrelloBoardText: (text: string) => void;
}) {
	return (
		<Card className="flex flex-col">
			<CardContent className="flex flex-col gap-2">
				<KontextConnectionStatus />
				<TrelloIntegration
					trelloBoardText={trelloBoardText}
					setTrelloBoardText={setTrelloBoardText}
				/>
				<ContextOverview
					trelloBoardText={trelloBoardText}
					isTrelloConnected={trelloBoardText ? true : false}
				/>
			</CardContent>
		</Card>
	);
}
