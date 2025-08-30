"use client";
import { useKontext } from "@kontext.dev/kontext-sdk/react";

export default function ContextPage() {
	const { userId, isConnected } = useKontext();

	return <div>{userId}</div>;
}
