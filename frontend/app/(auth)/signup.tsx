import { Text, TouchableOpacity, View, Image, TextInput, Modal, ScrollView } from "react-native";
import logo from "@/assets/images/Isda-iconS.png";
import gicon from "@/assets/images/g-iconL.png";
import { Link, router } from "expo-router";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/utils/authContext";
import { sanitizeEmail, sanitizePassword, sanitizeUsername } from "@/utils/sanitize";
import { validateEmail, validatePassword, validateUsername } from "@/utils/validate";
import { apiFetch } from "@/utils/api";

export default function SignUp() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confPassword, setConfPassword] = useState("");
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const [showTerms, setShowTerms] = useState(false);

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
		if (confPasswordError) return setError("Passwords do not match");
		if (!agreedToTerms) return setError("You must agree to the Terms and Conditions");

		try {
				const res = await apiFetch("/api/auth/register", {
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
					router.replace({
						pathname: "/verifyEmail",
						params: { email }
					});
				} else {
					setError(data.message || "Registration Failed");
				}
		} catch (err) {
			setError ("Network Error " + String(err));
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

					<Modal
						visible={showTerms}
						animationType="fade"
						transparent={true}
						onRequestClose={() => setShowTerms(false)}
					>
						<View className="flex-1 justify-end bg-black/50">
							<View className="bg-white rounded-t-2xl px-6 pt-6 pb-10" style={{maxHeight: '80%'}}>
								<Text className="text-xl font-semibold text-[#0B1D51] mb-4">Terms and Conditions</Text>
								<ScrollView className="mb-4">
									<Text className="text-[#0B1D51] text-sm leading-6">
										{"Terms and Conditions\n"}
										{"Last updated: April 2026\n\n"}
										{"1. Acceptance of Terms\n"}
										{"By accessing or using IsdaOK ('the App'), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the App.\n\n"}

										{"2. Description of Service\n"}
										{"IsdaOK is a fish identification application that uses image recognition to help users identify fish species. Scan results are provided for informational purposes only and should not be used as the sole basis for consumption or safety decisions.\n\n"}

										{"3. User Accounts\n"}
										{"- You must provide accurate information when creating an account.\n"}
										{"- You are responsible for maintaining the confidentiality of your account credentials.\n"}
										{"- You must be at least 13 years old to use this App.\n"}
										{"- We reserve the right to suspend or terminate accounts that violate these terms.\n\n"}

										{"4. User-Generated Content and Data Collection\n"}
										{"- By using the App, you agree that your fish scan images and results may be collected and used by IsdaOK to improve our fish recognition model and expand our dataset.\n"}
										{"- Scan data will be used solely for research, training, and improvement of the App's AI capabilities.\n"}
										{"- We will not sell your personal information to third parties.\n"}
										{"- Scan images are anonymized before being used for training purposes.\n"}
										{"- You may opt out of data collection by contacting us, though this may limit app functionality.\n\n"}

										{"5. Privacy\n"}
										{"We collect the following information:\n"}
										{"- Email address and username for account management.\n"}
										{"- Fish scan images for identification and dataset improvement.\n"}
										{"- Usage data to improve app performance.\n"}
										{"Please refer to our Privacy Policy for full details on how we handle your data.\n\n"}

										{"6. Intellectual Property\n"}
										{"- The App, its features, and content are owned by IsdaOK and are protected by applicable intellectual property laws.\n"}
										{"- You may not copy, modify, or distribute any part of the App without our written permission.\n\n"}

										{"7. Disclaimer of Warranties\n"}
										{"- Fish identification results are provided 'as is' without any guarantees of accuracy.\n"}
										{"- IsdaOK is not liable for any decisions made based on scan results, including but not limited to consumption, purchase, or safety decisions.\n"}
										{"- We do not guarantee uninterrupted or error-free service.\n\n"}

										{"8. Limitation of Liability\n"}
										{"IsdaOK shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App, including reliance on fish identification results.\n\n"}

										{"9. Changes to Terms\n"}
										{"We reserve the right to update these Terms at any time. Continued use of the App after changes constitutes acceptance of the new Terms.\n\n"}

										{"10. Governing Law\n"}
										{"These Terms shall be governed by the laws of the Republic of the Philippines.\n\n"}

										{"11. Contact Us\n"}
										{"If you have any questions about these Terms, please contact us at: isdaok.app@gmail.com\n"}

									</Text>
								</ScrollView>
								<TouchableOpacity
									className="bg-[#0B1D51] py-3 rounded-xl"
									onPress={() =>{
										setAgreedToTerms(true);
										setShowTerms(false);
									}}>
									<Text className="text-white text-center font-semibold">I Agree</Text>
								</TouchableOpacity>
								<TouchableOpacity
									className="mt-3"
									onPress={() => {
										setShowTerms(false);
									}}
								>
									<Text className="text-[#0B1D51] text-center">Close</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Modal>

					<View className="flex-row items-center mt-4">
						<TouchableOpacity onPress={() => setAgreedToTerms(!agreedToTerms)}>
							<View className={`w-5 h-5 border border-gray-500 rounded mr-2 ${agreedToTerms ? "bg-[#88da7e]" : "bg-white"}`} />
						</TouchableOpacity>
							<Text className="text-[#0B1D51] text-sm">
							I agree to the{" "}
							<Text className="text-cyan-500 underline" onPress={() => setShowTerms(true)}>
							Terms and Conditions
							</Text>
						</Text>
					</View>


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
						<TouchableOpacity className="flex-row items-center justify-center rounded-lg py-3">
							<Image source={gicon} style={{ width: 46, height: 46 }} resizeMode="contain" />
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
