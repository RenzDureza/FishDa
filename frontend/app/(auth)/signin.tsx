import { Text, TouchableOpacity, View, Image, TextInput, Alert, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import logo from "@/assets/images/icon.png"
import gicon from "@/assets/images/g-iconL.png";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/utils/authContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as LocalAuthentication from 'expo-local-authentication';
import { sanitizeEmail } from "@/utils/sanitize";
import { validateEmail } from "@/utils/validate";
import { apiFetch } from "@/utils/api";
import * as Biometric from "@/utils/biometric";
import * as SecureStore from "expo-secure-store";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");
	const [emailError, setEmailError] = useState<string[]>([]);
	const [biometric, setBiometric] = useState(false);
	const [guestTerms, setGuestTerms] = useState(false);

	//const loginURL = process.env.EXPO_PUBLIC_LOGIN as string;
	const { logIn } = useAuth();

	useEffect (() => {
		const checkBiometrics = async () => {
			const hasHardware = await LocalAuthentication.hasHardwareAsync();
			const isEnrolled = await LocalAuthentication.isEnrolledAsync();
			const hasSetup = await Biometric.hasBiometric();
			setBiometric(hasHardware && isEnrolled && hasSetup);
		};
		checkBiometrics();
	}, []);

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
					const hasHardware = await LocalAuthentication.hasHardwareAsync();
					const isEnrolled = await LocalAuthentication.isEnrolledAsync();
					const hasBiometric = await Biometric.hasBiometric(email);
					const biometricEnabled = await Biometric.isBiometricEnabled(email);

					if(hasHardware && isEnrolled && !hasBiometric && !biometricEnabled){
						Alert.alert(
          	    			"Enable Biometrics",
          					"Would you like to use Biometrics for future logins?",
          					[{
          				  		text: "Yes",
          				  		onPress: async () => {
          				  		    await Biometric.saveBiometric(data.token, email);
          				  		    setBiometric(true);
									await logIn(data.token);
          				  		},
          					},{
								text: "Not Now",
								style: "cancel",
								onPress: async () => {
									await logIn(data.token);
								},
							},]
						);
					} else if(hasHardware && isEnrolled && !hasBiometric && biometricEnabled) {
						await Biometric.saveBiometric(data.token, email);
						setBiometric(true);
						await logIn(data.token);
					} else {
						await SecureStore.setItemAsync("biometric-email", email);
						await logIn(data.token);
					}
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
				promptMessage: 'Login via Authentication',
				fallbackLabel: 'Use passcode',
				disableDeviceFallback: false,
			});

			if (biometricsResult.success){
				const token = await Biometric.getBiometricToken();

				if(!token){
					await Biometric.deleteBiometric();
					setBiometric(false);
					setError("Biometric expired. Login via Password");
					return;
				}

				const res = await apiFetch("/api/auth/verify-token", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`,
					},
				});

				const data = await res.json();

				if(res.ok && data.status === "success"){
					await Biometric.refreshBiometricToken(data.token);
					await logIn(data.token);
				} else {
					await Biometric.deleteBiometric();
					setBiometric(false);
					setError("Biometric expired. Login via Password");
				}
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

					<Modal
						visible={guestTerms}
						animationType="slide"
						transparent={true}
						onRequestClose={() => setGuestTerms(false)}
						>
						<View className="flex-1 justify-end bg-black/50">
							<View className="bg-white rounded-t-2xl px-6 pt-6 pb-10" style={{ maxHeight: '80%' }}>
							<Text className="text-xl font-semibold text-[#0B1D51] mb-4">Guest Access</Text>
							<ScrollView className="mb-4">
								<Text className="text-[#0B1D51] text-sm leading-6">
									{"By continuing as a guest, you acknowledge and agree to the following:\n\n"}
									{"1. Limited Features\n"}
									{"- Your scan history will not be saved.\n"}
									{"- You will not be able to access the History feature.\n"}
									{"- Account-specific features are unavailable.\n\n"}

									{"2. Data Collection\n"}
									{"- Fish scan images you submit may be collected and used by IsdaOK to improve our fish recognition model.\n"}
									{"- Scan data is anonymized and used solely for research and training purposes.\n\n"}

									{"3. Disclaimer\n"}
									{"- Fish identification results are provided for informational purposes only.\n"}
									{"- IsdaOK is not liable for any decisions made based on scan results.\n\n"}

									{"4. No Account Security\n"}
									{"- As a guest, your session is temporary and will not be restored after closing the app.\n"}
									{"- We recommend creating an account to save your data and access all features.\n\n"}

									{"5. Governing Law\n"}
									{"These terms are governed by the laws of the Republic of the Philippines.\n\n"}

									{"For the full Terms and Conditions, please create an account and review them during sign up.\n\n"}

									{"Questions? Contact us at: isdaok.app@gmail.com\n"}
								</Text>
							</ScrollView>
							<TouchableOpacity
								className="bg-[#0B1D51] py-3 rounded-xl"
								onPress={() => {
								setGuestTerms(false);
								logIn("guest"); // ← only logs in after agreeing
								}}
							>
								<Text className="text-white text-center font-semibold">Continue as Guest</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className="mt-3"
								onPress={() => setGuestTerms(false)}
							>
								<Text className="text-[#0B1D51] text-center">Cancel</Text>
							</TouchableOpacity>
							</View>
						</View>
						</Modal>

					<TouchableOpacity className="bg-white py-2 px-4 w-40 rounded shadow mt-4" onPress={() => setGuestTerms(true)}>
						<Text className="text-[#0B1D51] text-center font-semibold">
							Continue as Guest
						</Text>
					</TouchableOpacity>

					<View className="flex-row mt-4">
						<Text>or</Text>
					</View>

					<View className="flex-row">
						<TouchableOpacity className="flex-row items-center justify-center rounded-lg py-3 mr-10">
							<Image source={gicon} style={{ width: 46, height: 46 }} resizeMode="contain" />
						</TouchableOpacity>

						<TouchableOpacity onPress={biometricsAuth} className="flex-row items-center justify-center rounded-lg py-3"
						disabled={!biometric} style={{ opacity: biometric ? 1 : 0.2 }}>
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
