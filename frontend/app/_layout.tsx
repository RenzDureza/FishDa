import { Stack } from "expo-router";
import "./global.css"
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/utils/authContext";

<<<<<<< HEAD
export default function MainLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
      </Stack>
    </SafeAreaProvider>
  );
=======
export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<AuthProvider>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="index" />
					<Stack.Screen name="(auth)" />
					<Stack.Screen name="(main)" />
				</Stack>
			</AuthProvider>
		</SafeAreaProvider>
	);
>>>>>>> main
}
