import { Redirect } from "expo-router";
import { useAuth } from "../utils/authContext";

export default function Index() {
	const { isReady, isLoggedIn, role } = useAuth();

	if (!isReady){
		return null;
	}

	if (!isLoggedIn) {
		return <Redirect href="/(auth)/signin" />;
	}

	if (role === "admin"){
		return <Redirect href="/(admin)/(stack)/adminHome" />;
	}

	return <Redirect href="/(user)/(drawer)/home" />;
}
