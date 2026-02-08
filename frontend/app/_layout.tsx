import { Stack } from "expo-router";
import "./global.css"
import { AuthProvider } from "../utils/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
    </Stack>
    </AuthProvider>
  );
}
