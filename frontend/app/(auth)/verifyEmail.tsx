import { Text, TouchableOpacity, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import logo from "@/assets/images/icon.png";
import { Link, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";

export default function VerifyEmail() {
    const { email } = useLocalSearchParams();
    const [ cooldown, setCooldown ] = useState(0);
    const [ message, setMessage ] = useState("");
    const [ error, setError ] = useState("");

    useEffect(() => {
        if (cooldown <= 0) return;
            const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const resendEmail = async () => {
        setMessage("");
        setError("");

        try {
            const res = await apiFetch("/api/auth/resend-verification", {
                method: "POST",
                body: JSON.stringify({email}),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("Verification Email Sent!")
                setCooldown(300);
            } else {
                setError(data.message || "Failed to resend Email");
            }
        } catch (err) {
        setError("Network Error, Please Try Again.");
        }
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return(
        <SafeAreaProvider>
            <SafeAreaView className="min-h-screen flex items-center justify-center bg-[#8CCDEB] px-4">
                <Image source={logo} style={{ width: 128, height: 128 }} resizeMode="contain" />
                <View className="w-full max-w-md rounded-xl items-center justify-center bg-[#FFE3A9] py-8 px-6">
                    <Ionicons name="mail-unread-outline" size={64} color="#0B1D51" />
                    <Text className="text-3xl text-[#0B1D51] font-semibold mt-4 mb-2">
                        Check your email!
                    </Text>
                    <Text className="text-[#0B1D51] text-center mt-2">
                        We sent a verification link to:
                    </Text>
                    <Text className="text-[#0B1D51] font-semibold text-center mt-1">
                        {email}
                    </Text>
                    <Text className="text-[#0B1D51] text-center mt-4 text-sm">
                        Click the link in the email to verify your account before signing in.
                    </Text>

                    {message ? <Text className="text-green-700 mt-3">{message}</Text> : null}
                    {error ? <Text className="text-red-600 mt-3">{error}</Text> : null}

                    <TouchableOpacity className={`py-2 px-4 w-56 rounded shadow mt-4 ${cooldown > 0 ? "bg-gray-300" : "bg-white"}`} 
                    onPress={resendEmail} disabled={cooldown > 0}>
                        <Text className="text-[#0B1D51] text-center font-semibold">
                        {cooldown > 0 ? `Resend in ${formatTime(cooldown)}` : "Resend Verification Email"}
                        </Text>
                    </TouchableOpacity>

                    <Link href="/signin" asChild>
                        <TouchableOpacity className="bg-white py-2 px-4 w-40 rounded shadow mt-6">
                        <Text className="text-[#0B1D51] text-center font-semibold">
                            Go to Sign In
                        </Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );



}

