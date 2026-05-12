export type Message = {
	id: string;
	text: string;
	sender: "me" | "them";
	clientId?: string;
	username?: string;
	createdAt: Date;
};

export type ConnectionStatus = "connecting" | "connected" | "disconnected";
