"use client";

import { CheckCircle } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "./ui/button";

type TrelloButtonProps = {
	isConnected: boolean;
	loading?: boolean;
	onConnect: () => void | Promise<void>;
	onDisconnect: () => void | Promise<void>;
};

export function TrelloButton({
	isConnected,
	loading,
	onConnect,
	onDisconnect,
}: TrelloButtonProps) {
	const handleClick = () => {
		if (loading) return;
		if (isConnected) {
			onDisconnect();
		} else {
			onConnect();
		}
	};

	if (isConnected) {
		return (
			<div className="flex items-center gap-2 px-3 py-2 justify-between">
				<div className="flex items-center gap-2">
					<CheckCircle className="h-4 w-4 text-green-500" />
					<span className="text-sm text-muted-foreground">
						Trello connected
					</span>
				</div>
				<Button
					onClick={handleClick}
					variant="outline"
					size="sm"
					disabled={!!loading}
				>
					{loading ? "Working…" : "Disconnect"}
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2 px-3 py-2 justify-between w-full">
			<div className="flex items-center gap-2">
				<div className="h-4 w-4 bg-gray-300 rounded-full"></div>
				<span className="text-sm text-muted-foreground">
					Trello not connected
				</span>
			</div>
			<Button
				onClick={handleClick}
				variant="outline"
				size="sm"
				disabled={!!loading}
			>
				{loading ? "Working…" : "Connect"}
			</Button>
		</div>
	);
}
