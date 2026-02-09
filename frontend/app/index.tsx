import { Redirect } from "expo-router";
import { useAuth } from "../utils/authContext";

export default function Index() {
	const { isLoggedIn } = useAuth();

	if (isLoggedIn) {
		return <Redirect href="/(user)/(drawer)/home" />;
	} else {
		return <Redirect href="/(auth)/signin" />;
	}
}
