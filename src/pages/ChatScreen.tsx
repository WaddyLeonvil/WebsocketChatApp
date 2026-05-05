import { useState } from "react";
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Message = {
	id: string;
	text: string;
	sender: "me" | "them";
	createdAt: Date;
};

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
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>Chat</Text>
					<Text style={styles.subtitle}>Local prototype</Text>
				</View>

				<FlatList
					contentContainerStyle={styles.messageList}
					data={messages}
					inverted
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<View
							style={[
								styles.messageBubble,
								item.sender === "me"
									? styles.myMessage
									: styles.theirMessage,
							]}>
							<Text
								style={[
									styles.messageText,
									item.sender === "me"
										? styles.myMessageText
										: styles.theirMessageText,
								]}>
								{item.text}
							</Text>
						</View>
					)}
				/>

				<View style={styles.inputRow}>
					<TextInput
						multiline
						onChangeText={setDraftMessage}
						onSubmitEditing={sendMessage}
						placeholder="Type a message"
						placeholderTextColor="#8a94a6"
						returnKeyType="send"
						style={styles.input}
						value={draftMessage}
					/>
					<Pressable
						onPress={sendMessage}
						style={({ pressed }) => [
							styles.sendButton,
							pressed && styles.sendButtonPressed,
						]}>
						<Text style={styles.sendButtonText}>Send</Text>
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
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
	inputRow: {
		alignItems: "flex-end",
		backgroundColor: "#ffffff",
		borderTopColor: "#dce2ee",
		borderTopWidth: 1,
		flexDirection: "row",
		gap: 10,
		padding: 12,
	},
	input: {
		backgroundColor: "#f8fafc",
		borderColor: "#d5dce8",
		borderRadius: 18,
		borderWidth: 1,
		color: "#182235",
		flex: 1,
		fontSize: 16,
		maxHeight: 110,
		minHeight: 44,
		paddingHorizontal: 14,
		paddingVertical: 10,
	},
	sendButton: {
		alignItems: "center",
		backgroundColor: "#2563eb",
		borderRadius: 18,
		height: 44,
		justifyContent: "center",
		paddingHorizontal: 18,
	},
	sendButtonPressed: {
		opacity: 0.78,
	},
	sendButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "700",
	},
});
