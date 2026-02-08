import { Stack } from "expo-router";
import "./global.css"
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/utils/authContext";

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<AuthProvider>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="index" />
					<Stack.Screen name="(auth)" />
					<Stack.Screen name="(user)" />
				</Stack>
			</AuthProvider>
		</SafeAreaProvider>
	);
}
