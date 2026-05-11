import { StatusBar } from "expo-status-bar";
import ChatScreen from "./src/pages/ChatScreen";
import {
	SafeAreaView,
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function App() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<ChatScreen />
			<StatusBar style="auto" translucent={false} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#f5f7fb",
	},
});
