import { KontextConnectionStatus } from "./kontext-connect-button";
import { TrelloButton } from "./trello-button";
import { TrelloIntegration } from "./trello-integration";
import { Card } from "./ui/card";

export function ConnectionOverview({
	trelloBoardText,
	setTrelloBoardText,
}: {
	trelloBoardText: string;
	setTrelloBoardText: (text: string) => void;
}) {
	return (
		<Card className="flex flex-col gap-2">
			<KontextConnectionStatus />
			<TrelloIntegration
				trelloBoardText={trelloBoardText}
				setTrelloBoardText={setTrelloBoardText}
			/>
		</Card>
	);
}
