import { Text, TouchableOpacity, View, Image, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import logo from "@/assets/images/Isda-iconS.png"
import gicon from "@/assets/images/g-iconL.png";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/utils/authContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as LocalAuthentication from 'expo-local-authentication';
import { sanitizeEmail } from "@/utils/sanitize";
import { validateEmail } from "@/utils/validate";
import { apiFetch} from "@/utils/api";
import * as Biometric from "@/utils/biometric";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");
	const [emailError, setEmailError] = useState<string[]>([]);
	const [biometric, setBiometric] = useState(false);

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
					const hasBiometric = await Biometric.hasBiometric();

					if(hasHardware && isEnrolled && !hasBiometric){
						Alert.alert(
          				  	"Enable Biometrics",
          				  	"Would you like to use Biometrics for future logins?",
          				  	[
          				  	  {
          				  	    text: "Yes",
          				  	    onPress: async () => {
          				  	    	await Biometric.saveBiometric(data.token, email);
          				  	    	setBiometric(true);
									await logIn(data.token);
          				  	    },
          				  	  },
          				  	  { 
								text: "Not Now",
								style: "cancel",
								onPress: async () => {
									await logIn(data.token);
								},
							  },
          				  	]
          				);
					} else {
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
