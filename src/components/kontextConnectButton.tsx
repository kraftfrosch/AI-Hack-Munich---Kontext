"use client";

import {
	KontextConnectButton,
	KontextStatus,
} from "@kontext.dev/kontext-sdk/components";
import { useKontext } from "@kontext.dev/kontext-sdk/react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKontextCookie } from "@/hooks/useKontextCookie";

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
			<div className="flex flex-col gap-2 px-3 py-2">
				<div className="flex items-center gap-2">
					<CheckCircle className="h-4 w-4 text-green-500" />
					<span className="text-sm text-muted-foreground">Gmail connected</span>
				</div>
				<div className="flex items-center gap-2">
					<KontextStatus />
					<Button
						onClick={disconnect}
						variant="ghost"
						size="sm"
						className="ml-auto"
					>
						Disconnect
					</Button>
				</div>
				{userId && (
					<span className="text-xs text-muted-foreground">
						User ID: {userId}
					</span>
				)}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 px-3 py-2">
			<p className="text-sm text-muted-foreground">
				Connect Gmail for personalized AI responses
			</p>
			<KontextConnectButton variant="default" size="default" />
		</div>
	);
}
