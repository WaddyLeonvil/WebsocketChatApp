import { useEffect, useState } from "react";
import {
	FlatList,
	Keyboard,
	KeyboardEvent,
	StyleSheet,
	Text,
	View,
} from "react-native";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import type { Message } from "../types/chat";

const initialMessages: Message[] = [
	{
		id: "welcome-1",
		text: "Welcome! This is local chat state for now.",
		sender: "them",
		createdAt: new Date(),
	},
];

export default function ChatScreen() {
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const [draftMessage, setDraftMessage] = useState("");
	const [keyboardHeight, setKeyboardHeight] = useState(0);

	useEffect(() => {
		const showSubscription = Keyboard.addListener(
			"keyboardDidShow",
			(event: KeyboardEvent) => {
				setKeyboardHeight(event.endCoordinates.height);
			},
		);
		const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
			setKeyboardHeight(0);
		});

		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, []);

	const sendMessage = () => {
		const trimmedMessage = draftMessage.trim();

		if (!trimmedMessage) {
			return;
		}

		const nextMessage: Message = {
			id: `${Date.now()}`,
			text: trimmedMessage,
			sender: "me",
			createdAt: new Date(),
		};

		setMessages((currentMessages) => [nextMessage, ...currentMessages]);
		setDraftMessage("");
	};

	return (
		<>
			<View style={styles.header}>
				<Text style={styles.title}>Chat</Text>
				<Text style={styles.subtitle}>Local prototype</Text>
			</View>
			<FlatList
				contentContainerStyle={styles.messageList}
				data={messages}
				inverted
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <MessageBubble message={item} />}
			/>
			<MessageInput
				onChangeText={setDraftMessage}
				onSend={sendMessage}
				value={draftMessage}
			/>
			<View style={{ height: keyboardHeight }} />
		</>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#f5f7fb",
	},
	container: {
		flex: 1,
	},
	header: {
		borderBottomColor: "#dce2ee",
		borderBottomWidth: 1,
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	title: {
		color: "#14213d",
		fontSize: 22,
		fontWeight: "700",
	},
	subtitle: {
		color: "#64748b",
		fontSize: 14,
		marginTop: 4,
	},
	messageList: {
		flexGrow: 1,
		justifyContent: "flex-end",
		padding: 16,
	},
});
