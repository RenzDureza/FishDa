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

export default function SignUp() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confPassword, setConfPassword] = useState("");
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordErorr] = useState<string[]>([]); 
	const [usernameError, setUsernameErorr] = useState<string[]>([])
	const [confPasswordError, setConfPasswordError] = useState<boolean>("");
		
	const { logIn } = useAuth();
	const registerURL = process.env.EXPO_PUBLIC_REGISTER as string;

	const registerUser = async () => {
		const cleanEmail = sanitizeEmail(email);
		const cleanUsername = sanitizeUsername(username);
		const cleanPassword = sanitizePassword(password);
		const cleanConfPassword = sanitizePassword(confPassword);
		console.log("e: ", cleanEmail, "u: ", cleanUsername, "p: ", cleanPassword);
		const eError = validateEmail(cleanEmail);
		const pErrors = validatePassword(cleanPassword);

		try {
			setSuccess('');
			setError('');
			if (!email || !username || !password) setError("All fields required.");
			else if (cleanPassword != cleanConfPassword) setError("Passwords does not match.");
			else if (validateUsername(username) && validateEmail(email) && validatePassword(password)){
				const res = await fetch(registerURL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, email, password }),
				});

				console.log("Success");
				const data = await res.json();

				if (res.ok && data.status === "success") {
					setSuccess("Success" + data.message);
					logIn();
				} else {
					setError("Error: " + data.message);
				}
			} else {
				if (!validateEmail(cleanEmail)) setError("Email is not valid.");
				else if (!validateUsername(cleanUsername)) setError("Username is not valid.");
				else if (!validatePassword(cleanPassword)) setError("Password is not valid.");
				else setError ("Error unknown.");
			}
		} catch (err) {
			setError ("Error hi" + String(err));
			Alert.alert("Error hi", String(err));
			console.log("Error: ", String(err));
		}
	}

	const biometricsAuth = async () => {
		try {
			const biometricsResult = await LocalAuthentication.authenticateAsync({
				promptMessage: 'Login via Authentication'
			});
			if (biometricsResult.success){
				logIn();
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
					<Text className="text-3xl text-[#0B1D51] font-semibold">
						Sign Up
					</Text>

					{success ? <Text className="text-green-700 mx-4">{success}</Text> : null }
					{error ? <Text className="text-red-600 mx-4">{error}</Text> : null }

					<View className="">
						<Text className="font-semibold">Email</Text>
						<TextInput
							value={email} //remove quotation and comment
							onChangeText={setEmail}
							onBlur={() => setEmailError(validateEmail(sanitizeEmail(email)))}
							placeholder="JuanDelaCruz@email.com"
							keyboardType="email-address"
							autoCapitalize="none"
							className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
					</View>

					{emailError ? <Text className="text-red-600 mx-2">{emailError}</Text> : null }

					<View className="mx-2">
						<Text className="font-semibold">Username</Text>
						<TextInput
							value={username} //remove quotation and comment
							onChangeText={setUsername}
							onBlur={() => setUsernameErorr(validateUsername(sanitizeUsername(username)))}
							placeholder="Juan Dela Cruz"
							keyboardType="email-address"
							autoCapitalize="none"
							className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
					</View>

					{usernameError.length > 0 && usernameError.map((err, idx) => (
						<Text key={idx} className="text-red-600 text-center mx-2">
							{err}
						</Text>
					))}

					<View className="mx-2">
						<Text className="font-semibold">Password</Text>
						<TextInput
							value={password} //remove quotation and comment
							onChangeText={setPassword}
							onBlur={() => setPasswordErorr(validatePassword(sanitizePassword(password)))}
							placeholder="***************"
							secureTextEntry
							className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
					</View>

					{passwordError.length > 0 && passwordError.map((err, idx) => (
						<Text key={idx} className="text-red-600 text-center mx-2">
							{err}
						</Text>
					))}

					<View className="mx-2">
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
						Already have an account?
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
