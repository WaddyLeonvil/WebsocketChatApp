import { StyleSheet, Text, View } from "react-native";
import type { Message } from "../types/chat";

type MessageBubbleProps = {
	message: Message;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
	const isMyMessage = message.sender === "me";

	return (
		<View
			style={[
				styles.messageBubble,
				isMyMessage ? styles.myMessage : styles.theirMessage,
			]}>
			<Text
				style={[
					styles.messageText,
					isMyMessage ? styles.myMessageText : styles.theirMessageText,
				]}>
				{message.text}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	messageBubble: {
		borderRadius: 16,
		marginVertical: 4,
		maxWidth: "78%",
		paddingHorizontal: 14,
		paddingVertical: 10,
	},
	myMessage: {
		alignSelf: "flex-end",
		backgroundColor: "#2563eb",
		borderBottomRightRadius: 4,
	},
	theirMessage: {
		alignSelf: "flex-start",
		backgroundColor: "#ffffff",
		borderBottomLeftRadius: 4,
		borderColor: "#e2e8f0",
		borderWidth: 1,
	},
	messageText: {
		fontSize: 16,
		lineHeight: 22,
	},
	myMessageText: {
		color: "#ffffff",
	},
	theirMessageText: {
		color: "#182235",
	},
});
