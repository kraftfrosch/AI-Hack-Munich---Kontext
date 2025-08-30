import { useKontext } from "@kontext.dev/kontext-sdk/react";

export default function ConnectButton() {
	const { isConnected, connectGmail, disconnect, isLoading } = useKontext();

	if (isConnected) {
		return (
			<button onClick={disconnect} type="button">
				Disconnect
			</button>
		);
	}

	return (
		<button onClick={connectGmail} disabled={isLoading} type="button">
			Enable Personalization
		</button>
	);
}
