// components/chat.tsx
"use client";
import { KontextModal } from "@kontext.dev/kontext-sdk/components";
import { useKontext } from "@kontext.dev/kontext-sdk/react";

export default function Chat() {
	const { isConnected } = useKontext();

	const getContext = async () => {
		if (!isConnected) {
			return (
				<div className="p-8">
					<h2>Connect Gmail to enable personalization</h2>
					<KontextModal
						trigger={<button type="button">Connect Gmail</button>}
					/>
				</div>
			);
		}

		// Call your API route
		const response = await fetch("/api/chat", {
			method: "GET",
		});
		console.log("response", response);

		const data = await response.json();
		return data.response;
	};

	return (
		<button onClick={() => getContext()} type="button">
			Get Context
		</button>
	);
}
