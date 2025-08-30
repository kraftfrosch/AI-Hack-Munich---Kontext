"use client";

import { useKontext } from "@kontext.dev/kontext-sdk/react";
import { useEffect } from "react";

export function ChatProvider({ children }: { children: React.ReactNode }) {
	const { userId, isConnected, systemPrompt } = useKontext();

	console.log("userId", userId);
	console.log("isConnected", isConnected);
	console.log("systemPrompt", systemPrompt);

	// Pass userId to server via cookies
	useEffect(() => {
		if (userId && isConnected) {
			document.cookie = `kontext_user_id=${userId}; path=/; max-age=86400`;
		}
	}, [userId, isConnected]);

	return <>{children} </>;
}
