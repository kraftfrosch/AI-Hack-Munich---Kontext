import { KontextConnectionStatus } from "./kontext-connect-button";
import { TrelloButton } from "./trello-button";
import { Card } from "./ui/card";

export function ConnectionOverview({
	trelloConnected,
	trelloLoading,
	connectTrello,
	disconnectTrello,
}: {
	trelloConnected: boolean;
	trelloLoading: boolean;
	connectTrello: () => void;
	disconnectTrello: () => void;
}) {
	return (
		<Card className="flex flex-col gap-2">
			<KontextConnectionStatus />
			<TrelloButton
				isConnected={trelloConnected}
				loading={trelloLoading}
				onConnect={connectTrello}
				onDisconnect={disconnectTrello}
			/>
		</Card>
	);
}
