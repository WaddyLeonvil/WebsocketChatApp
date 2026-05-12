import { useEffect, useRef, useState } from "react";
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
import type { ConnectionStatus, Message } from "../types/chat";

const WEBSOCKET_URL = "ws://192.168.4.22:8080";
const RECONNECT_DELAY_MS = 2000;

type ServerMessage = {
	type: "chat" | "system" | "error";
	id?: string;
	text?: string;
	clientId?: string;
	username?: string;
	createdAt?: string;
};

export default function ChatScreen() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [draftMessage, setDraftMessage] = useState("");
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [connectionStatus, setConnectionStatus] =
		useState<ConnectionStatus>("connecting");
	const clientIdRef = useRef(`${Date.now()}-${Math.random()}`);
	const socketRef = useRef<WebSocket | null>(null);
	const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const usernameRef = useRef(
		`User ${Math.floor(1000 + Math.random() * 9000)}`,
	);

	useEffect(() => {
		let shouldReconnect = true;

		const clearReconnectTimer = () => {
			if (reconnectTimerRef.current) {
				clearTimeout(reconnectTimerRef.current);
				reconnectTimerRef.current = null;
			}
		};

		const scheduleReconnect = () => {
			if (!shouldReconnect || reconnectTimerRef.current) {
				return;
			}

			reconnectTimerRef.current = setTimeout(() => {
				reconnectTimerRef.current = null;
				connect();
			}, RECONNECT_DELAY_MS);
		};

		const handleDisconnect = () => {
			setConnectionStatus("disconnected");
			socketRef.current = null;
			scheduleReconnect();
		};

		const connect = () => {
			setConnectionStatus("connecting");

			const socket = new WebSocket(WEBSOCKET_URL);
			socketRef.current = socket;

			socket.onopen = () => {
				clearReconnectTimer();
				setConnectionStatus("connected");
			};

			socket.onmessage = (event) => {
				try {
					const serverMessage = JSON.parse(
						event.data,
					) as ServerMessage;

					if (!serverMessage.text) {
						return;
					}

					const isMyMessage =
						serverMessage.clientId === clientIdRef.current;

					const nextMessage: Message = {
						id: serverMessage.id ?? `${Date.now()}`,
						text: serverMessage.text,
						sender: isMyMessage ? "me" : "them",
						clientId: serverMessage.clientId,
						username: serverMessage.username,
						createdAt: serverMessage.createdAt
							? new Date(serverMessage.createdAt)
							: new Date(),
					};

					setMessages((currentMessages) => [
						nextMessage,
						...currentMessages,
					]);
				} catch {
					setMessages((currentMessages) => [
						{
							id: `${Date.now()}`,
							text: "Received a message that was not valid JSON.",
							sender: "them",
							createdAt: new Date(),
						},
						...currentMessages,
					]);
				}
			};

			socket.onerror = () => {
				handleDisconnect();
			};

			socket.onclose = () => {
				handleDisconnect();
			};
		};

		connect();

		return () => {
			shouldReconnect = false;
			clearReconnectTimer();
			socketRef.current?.close();
			socketRef.current = null;
		};
	}, []);

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
		const socket = socketRef.current;

		if (!trimmedMessage || socket?.readyState !== WebSocket.OPEN) {
			return;
		}

		socket.send(
			JSON.stringify({
				type: "chat",
				text: trimmedMessage,
				clientId: clientIdRef.current,
				username: usernameRef.current,
			}),
		);
		setDraftMessage("");
	};

	return (
		<>
			<View style={styles.header}>
				<Text style={styles.title}>Chat</Text>
				<Text style={styles.subtitle}>
					{usernameRef.current} ·{" "}
					{connectionStatus === "connected" && "Connected"}
					{connectionStatus === "connecting" && "Connecting..."}
					{connectionStatus === "disconnected" && "Disconnected"}
				</Text>
			</View>
			<FlatList
				contentContainerStyle={styles.messageList}
				data={messages}
				inverted
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <MessageBubble message={item} />}
			/>
			<MessageInput
				disabled={connectionStatus !== "connected"}
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
