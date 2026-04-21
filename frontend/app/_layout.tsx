import { Stack, Slot } from "expo-router";
import "./global.css"
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/utils/authContext";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { router } from "expo-router";


export default function RootLayout() {
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    const sub = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => sub.remove();
  }, []);

  const handleDeepLink = (url: string) => {
    if (url.includes("signin")) {
      router.replace("/signin");
    }
  };

	return (
		<SafeAreaProvider>
			<AuthProvider>
				<Slot />
			</AuthProvider>
		</SafeAreaProvider>
	);
}
