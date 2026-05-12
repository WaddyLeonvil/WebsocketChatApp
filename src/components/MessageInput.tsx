import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type MessageInputProps = {
	value: string;
	onChangeText: (text: string) => void;
	onSend: () => void;
	disabled?: boolean;
};

export default function MessageInput({
	value,
	onChangeText,
	onSend,
	disabled = false,
}: MessageInputProps) {
	const isSendDisabled = disabled || value.trim() === "";

	return (
		<View style={styles.inputRow}>
			<TextInput
				editable={!disabled}
				multiline
				onChangeText={onChangeText}
				onSubmitEditing={onSend}
				placeholder={disabled ? "Connecting..." : "Type a message"}
				placeholderTextColor="#8a94a6"
				returnKeyType="send"
				style={styles.input}
				value={value}
			/>
			<Pressable
				disabled={isSendDisabled}
				onPress={onSend}
				style={({ pressed }) => [
					styles.sendButton,
					pressed && styles.sendButtonPressed,
					isSendDisabled && styles.sendButtonDisabled,
				]}>
				<Text style={styles.sendButtonText}>Send</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
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
	sendButtonDisabled: {
		opacity: 0.6,
	},
	sendButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "700",
	},
});
