import { Text, TouchableOpacity, View, Image, TextInput} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import logo from "@/assets/images/Isda-iconS.png";
import gicon from "@/assets/images/g-iconL.png";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registerURL = process.env.EXPO_PUBLIC_REGISTER as string;

    const registerUser = async () => {
	try {
	    const res = await fetch(registerURL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, email, password }),
	    });

	    const data = await res.json();

	    if (res.ok && data.status === "success") {
		Alert.alert("Success", "User Registered");
	    } else {
		Alert.alert("Error: " + data.message);
	    }
	} catch(err) {
	    Alert.alert("Error hi", String(err));
	}
    }
    return (
        <SafeAreaProvider>
        <SafeAreaView className="min-h-screen flex items-center justify-center bg-[#8CCDEB] px-4">

                <Image source={logo} style={{ width: 128, height: 128 }} resizeMode="contain"/>
                <View className="w-full max-w-md rounded-xl items-center justify-center bg-[#FFE3A9] py-4 px-6">
                    <Text className="text-3xl text-[#0B1D51] font-semibold">
                        Sign Up
                    </Text>

                    <Text className="text-[#FFE3A9] mt-4">
                        Message Error/Success
                    </Text>

                    <View className="mt-1">
                        <Text className="">Email</Text>
                        <TextInput
                        value={email} //remove quotation and comment
			onChangeText={setEmail}
                        placeholder="JuanDelaCruz@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
                    </View>

                    <View className="mt-1">
                        <Text className="">Username</Text>
                        <TextInput
                        value={username} //remove quotation and comment
			onChangeText={setUsername}
                        placeholder="Juan Dela Cruz"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
                    </View>

                    <View className="mt-4">
                        <Text className="">Password</Text>
                        <TextInput
                        value={password} //remove quotation and comment
			onChangeText={setPassword}
                        placeholder="***************"
                        secureTextEntry
                        className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
                    </View>

                    <View className="mt-4">
                        <Text className="">Confirm Password</Text>
                        <TextInput
                        placeholder="***************"
                        secureTextEntry
                        className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
                    </View>

                    <TouchableOpacity
			className="bg-white py-2 px-4 w-40 rounded shadow mt-4"
			onPress={() => {
			    registerUser();
			}}
		    >
                        <Text className="text-[#0B1D51] text-center font-semibold">
                            Sign Up
                        </Text>
                    </TouchableOpacity>

                    <View className="flex-row mt-4">
                        <Text>or</Text>
                    </View>

                    <View className="flex-row">
                        <TouchableOpacity className="flex-row items-center justify-center rounded-lg py-3 mr-10">
                            <Image source={gicon} style={{ width: 46, height: 46 }} resizeMode="contain"/>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center justify-center rounded-lg py-3">
                            <Ionicons name="finger-print" size={46} color="black" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-[#0B1D51] text-center mt-4">
                        Already have an account?
                            <Text className="text-cyan-500 underline px-1" onPress={() => router.push("./signin")}>
                                Sign In!
                            </Text>
                    </Text>
                </View>
        </SafeAreaView>
        </SafeAreaProvider>
    );
}
