import { StatusBar } from "expo-status-bar";
import ChatScreen from "./src/pages/ChatScreen";

export default function App() {
	return (
		<>
			<ChatScreen />
			<StatusBar style="auto" />
		</>
	);
}
