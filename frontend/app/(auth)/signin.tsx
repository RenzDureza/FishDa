import { Text, TouchableOpacity, View, Image, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import logo from "@/assets/images/Isda-iconS.png"
import gicon from "@/assets/images/g-iconL.png";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../utils/authContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as LocalAuthentication from 'expo-local-authentication';
import { sanitizeEmail } from "@/utils/sanitize";
import { validateEmail } from "@/utils/validate";
import { apiFetch} from "@/utils/api";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");
	const [emailError, setEmailError] = useState<string[]>([]);

	//const loginURL = process.env.EXPO_PUBLIC_LOGIN as string;
	const { logIn } = useAuth();

	const loginUser = async () => {
		setSuccess('');
		setError('');

		if (!email || !password) return setError('All Fields Required');

		try {
			const res = await apiFetch("/api/auth/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				});

				const data = await res.json();

				if (res.ok && data.status === "success") {
					setSuccess("Login Successful");
					await logIn(data.token);
				} else {
					setError(data.message || "Invalid Email or Password");
				}
		} catch (err) {
			setError("Network Error. Please Try Again " + String(err));
		}
	}

	const biometricsAuth = async () => {
		try {
			const biometricsResult = await LocalAuthentication.authenticateAsync({
				promptMessage: 'Login via Authentication'
			});

			if (biometricsResult.success){
				logIn("guest"); // ito muna for now
			} else {
				Alert.alert("Error: " + biometricsResult.error);
			}
		} catch (err) {
			Alert.alert("Error: ", String(err));
		}
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView className="min-h-screen flex items-center justify-center bg-[#8CCDEB] px-4">
				<Image source={logo} style={{ width: 128, height: 128 }} resizeMode="contain" />
				<View className="w-full max-w-md rounded-xl items-center justify-center bg-[#FFE3A9] py-4 px-6">
					<Text className="text-3xl text-[#0B1D51] font-semibold mb-2">
						Sign In
					</Text>

					{success ? <Text className="text-green-700 mx-4">{success}</Text> : null }
					{error ? <Text className="text-red-600 mx-4">{error}</Text> : null }

					<View className="mt-4">
						<Text className="font-semibold">Email</Text>
						<TextInput
							value={email}
							onChangeText={setEmail}
							onBlur={() => setEmailError(validateEmail(sanitizeEmail(email)))}
							placeholder="JuanDelaCruz@email.com"
							keyboardType="email-address"
							autoCapitalize="none"
							className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
					</View>

					{emailError.length > 0 && emailError.map((err, idx) => (
    					<Text key={idx} className="text-red-600 mx-2">{err}</Text>
					))}

					<View className="mt-4">
						<Text className="font-semibold">Password</Text>
						<TextInput
							value={password}
							onChangeText={setPassword}
							placeholder="***************"
							secureTextEntry
							className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
					</View>

					<TouchableOpacity className="bg-white py-2 px-4 w-40 rounded shadow mt-4"
						onPress={() => {
							loginUser();
						}}>
						<Text className="text-[#0B1D51] text-center font-semibold">
							Sign In
						</Text>
					</TouchableOpacity>

					<View className="flex-row mt-4">
						<Text>or</Text>
					</View>

					<View className="flex-row">
						<TouchableOpacity className="flex-row items-center justify-center rounded-lg py-3 mr-10">
							<Image source={gicon} style={{ width: 46, height: 46 }} resizeMode="contain" />
						</TouchableOpacity>

						<TouchableOpacity onPress={biometricsAuth} className="flex-row items-center justify-center rounded-lg py-3">
							<Ionicons name="finger-print" size={46} color="black" />
						</TouchableOpacity>
					</View>

					<Text className="text-[#0B1D51] text-center mt-4">
						{"Don't have an account?"}{' '}
						<Link href="/signup" asChild>
							<Text className="text-cyan-500 underline px-1">
								Sign Up!
							</Text>
						</Link>
					</Text>

					<Link href="/forgotPassword" asChild>
						<TouchableOpacity>
							<Text className="text-cyan-500 underline mt-2">Forgot Password?</Text>
						</TouchableOpacity>
					</Link>

				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}
