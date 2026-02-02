import { Text, Touchable, TouchableOpacity, View, Image, TextInput} from "react-native";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import logo from "../assets/images/Isda-StrokedS.png"
import gicon from "../assets/images/g-iconL.png";
import { Link } from "expo-router";

export default function signIn() {
    return (
        <View className="min-h-screen flex items-center justify-center bg-[#8CCDEB]">

            <Image source={logo} className="w-32 h-32"/>
            <View className="w-full max-w-md rounded-xl items-center justify-center bg-[#FFE3A9] space-y-4 py-4">
                <Text className="text-3xl text-[#0B1D51] font-semibold">Sign In</Text>
                <Text className="text-[#FFE3A9]">Message Error/Success</Text> {/* Change color */}

                <View className="space-y-1">
                    <Text className="">Email</Text>
                    <TextInput
                    //value="{email}" //remove quotation and comment
                    placeholder="JuanDelaCruz@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="bg-white w-96 rounded-lg border border-gray-500 px-2 py-1" />
                </View>

                <View className="space-y-1">
                    <Text className="">Password</Text>
                    <TextInput
                    //value="{password}" //remove quotation and comment
                    placeholder="***************"
                    secureTextEntry
                    className="bg-white w-96 rounded-lg border border-gray-500 px-2 py-1" />
                </View>

                <TouchableOpacity className="bg-white hover:bg-gray-200 text-[#0B1D51] text-center font-semibold py-2 px-4 w-40 border border-black rounded shadow">
                 Sign In
                </TouchableOpacity>

                <View className="flex-row space-x-16">
                    <TouchableOpacity className="flex-row items-center justify-center rounded-lg py-3">
                        <Image source={gicon} className="w-5 h-5" resizeMode="contain"/>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-center rounded-lg py-3">
                        <Ionicons name="finger-print" size={46} color="black" />
                    </TouchableOpacity>
                </View>

                <Text className="">
                    Don't have an account?{" "}
                    <Link href="/signUp" asChild>
                        <Text className="text-cyan-500 underline px-1">
                            Sign Up!
                        </Text>
                    </Link>
                </Text>
            </View>
        </View>
    );
}