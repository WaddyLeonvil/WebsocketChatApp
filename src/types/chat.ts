export type Message = {
	id: string;
	text: string;
	sender: "me" | "them";
	createdAt: Date;
};
