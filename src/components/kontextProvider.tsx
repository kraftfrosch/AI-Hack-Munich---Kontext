"use client";

import { KontextProvider } from "@kontext.dev/kontext-sdk/react";
import type { ReactNode } from "react";

export function AppKontextProvider({ children }: { children: ReactNode }) {
	return (
		<KontextProvider apiKey={process.env.NEXT_PUBLIC_KONTEXT_API_KEY!}>
			{children}
		</KontextProvider>
	);
}
