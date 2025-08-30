"use client";

import {
	KontextConnectButton,
	KontextStatus,
} from "@kontext.dev/kontext-sdk/components";
import { useKontext } from "@kontext.dev/kontext-sdk/react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKontextCookie } from "@/hooks/use-kontext-cookie";

export function KontextConnectionStatus() {
	const { isConnected, connectGmail, disconnect, isLoading, error, userId } =
		useKontext();

	// Set cookie for server-side access
	useKontextCookie();

	if (isLoading) {
		return (
			<div className="flex items-center gap-2 px-3 py-2">
				<Loader2 className="h-4 w-4 animate-spin" />
				<span className="text-sm text-muted-foreground">
					Loading Kontext...
				</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center gap-2 px-3 py-2 text-red-500">
				<span className="text-sm">Error: {error}</span>
			</div>
		);
	}

	if (isConnected) {
		return (
			<div className="flex items-center gap-2 px-3 py-2 justify-between">
				<div className="flex items-center gap-2">
					<CheckCircle className="h-4 w-4 text-green-500" />
					<span className="text-sm text-muted-foreground">Gmail connected</span>
				</div>
				<Button onClick={disconnect} variant="outline" size="sm">
					Disconnect
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2 px-3 py-2 justify-between">
			<div className="flex items-center gap-2">
				<div className="h-4 w-4 bg-gray-300 rounded-full"></div>
				<span className="text-sm text-muted-foreground">
					Gmail not connected
				</span>
			</div>
			<Button
				onClick={connectGmail}
				variant="outline"
				size="sm"
				disabled={!!isLoading}
			>
				{isLoading ? "Working…" : "Connect"}
			</Button>
		</div>
	);
}
