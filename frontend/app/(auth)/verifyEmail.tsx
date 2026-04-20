import { Text, TouchableOpacity, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import logo from "@/assets/images/Isda-iconS.png";
import { Link, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function VerifyEmail() {
    const { email } = useLocalSearchParams();

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

