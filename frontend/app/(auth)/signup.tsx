import { Text, TouchableOpacity, View, Image, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import logo from "@/assets/images/Isda-iconS.png";
import gicon from "@/assets/images/g-iconL.png";
import { Link } from "expo-router";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from "@/utils/authContext";
import { sanitizeEmail, sanitizePassword, sanitizeUsername } from "@/utils/sanitize";
import { validateEmail, validatePassword, validateUsername } from "@/utils/validate";
import { apiFetch, API_BASE } from "@/utils/api";

export default function SignUp() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confPassword, setConfPassword] = useState("");

	//General Success/Error text
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

	//Error texts per input
	const [emailError, setEmailError] = useState<string[]>([]);
	const [passwordError, setPasswordError] = useState<string[]>([]);
	const [usernameError, setUsernameError] = useState<string[]>([])
	const [confPasswordError, setConfPasswordError] = useState<boolean>();
	const { logIn } = useAuth();
	//const registerURL = process.env.EXPO_PUBLIC_REGISTER as string;

	const registerUser = async () => {
		setSuccess('');
		setError('');

		if (!email || !username || !password) return setError('All Fields Required');
		if (emailError.length > 0) return setError("Invalid Email");
		if (usernameError.length > 0) return setError("Invalid Username");
		if (passwordError.length > 0) return setError("Invalid Password");
		if (confPasswordError) return setError("Passwords do not mactch");

		try {
				const res = await apiFetch("/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						username: sanitizeUsername(username),
						email: sanitizeEmail(email),
						password: sanitizePassword(password) }),
				});

				const data = await res.json();

				if (res.ok && data.status === "success") {
					setSuccess("Registered Successfully!");
					await logIn(data.token);
				} else {
					setError(data.message || "Registration Failed");
				}
		} catch (err) {
			setError ("Network Error " + String(err));
		}
	}

	const biometricsAuth = async () => {
		try {
			const biometricsResult = await LocalAuthentication.authenticateAsync({
				promptMessage: 'Login via Authentication'
			});
			if (biometricsResult.success){
				logIn("guest");
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
						Sign Up
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

					{/* {emailError ? <Text className="text-red-600">{emailError}</Text> : null } */}
					{emailError.length > 0 && emailError.map((err, idx) => (
    					<Text key={idx} className="text-red-600 mx-2">{err}</Text>
					))}

					<View className="mt-4">
						<Text className="font-semibold">Username</Text>
						<TextInput
							value={username}
							onChangeText={setUsername}
							onBlur={() => setUsernameError(validateUsername(username))}
							placeholder="Juan Dela Cruz"
							keyboardType="email-address"
							autoCapitalize="none"
							className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
					</View>

					{usernameError.length > 0 && usernameError.map((err, idx) => (
						<Text key={idx} className="text-red-600 text-center">
							{err}
						</Text>
					))}

					<View className="mt-4">
						<Text className="font-semibold">Password</Text>
						<TextInput
							value={password}
							onChangeText={setPassword}
							onBlur={() => setPasswordError(validatePassword(sanitizePassword(password)))}
							placeholder="***************"
							secureTextEntry
							className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
					</View>

					{passwordError.length > 0 && passwordError.map((err, idx) => (
						<Text key={idx} className="text-red-600 text-center mx-2">
							{err}
						</Text>
					))}

					<View className="mt-4">
						<Text className="font-semibold">Confirm Password</Text>
						<TextInput
							value={confPassword}
							onChangeText={(text) => {
								setConfPassword(text);
								setConfPasswordError((text)
								!== (password));
							}}
							placeholder="***************"
							secureTextEntry
							className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
					</View>

					{confPasswordError ? <Text className="text-red-600 mx-2">Passwords does not match.</Text> : null }


					<TouchableOpacity
						className="bg-white py-2 px-4 w-40 rounded shadow mt-4"
						onPress={() => {
							registerUser();
						}}
					>
						<Text className="text-[#0B1D51] text-center">
							Sign Up
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
						{"Already have an account?"}{' '}
						<Link href="/signin" asChild>
							<Text className="text-cyan-500 underline px-1">
								Sign In!
							</Text>
						</Link>
					</Text>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}
