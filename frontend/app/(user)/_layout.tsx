import { Stack, Redirect, Slot } from "expo-router";
import { useAuth } from "../../utils/authContext";

export default function UserLayout() {
	const { isLoggedIn } = useAuth();
	if(!isLoggedIn){
		return <Redirect href="/(auth)/signin" />
	}

	return <Slot />

	{/*
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="(drawer)" />
			<Stack.Screen name="scan" />
		</Stack>
	);
	*/}
}
