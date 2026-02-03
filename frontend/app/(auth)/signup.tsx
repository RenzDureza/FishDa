import { Text, TouchableOpacity, View, Image, TextInput} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import logo from "../assets/images/Isda-iconS.png"
import gicon from "../assets/images/g-iconL.png";
import { Link } from "expo-router";

export default function SignUp() {
    return (
        <View className="min-h-screen flex items-center justify-center bg-[#8CCDEB] px-4">

                <Image source={logo} style={{ width: 128, height: 128 }} resizeMode="contain"/>
                <View className="w-full max-w-md rounded-xl items-center justify-center bg-[#FFE3A9] py-4 px-6">
                    <Text className="text-3xl text-[#0B1D51] font-semibold">
                        Sign Up
                    </Text>

                    <Text className="text-[#FFE3A9] mt-4">
                        Message Error/Success
                    </Text> {/* Placeholder */}

                    <View className="mt-1">
                        <Text className="">Email</Text>
                        <TextInput
                        //value="{email}" //remove quotation and comment
                        placeholder="JuanDelaCruz@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
                    </View>

                    <View className="mt-1">
                        <Text className="">Username</Text>
                        <TextInput
                        //value="{username}" //remove quotation and comment
                        placeholder="Juan Dela Cruz"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
                    </View>

                    <View className="mt-4">
                        <Text className="">Password</Text>
                        <TextInput
                        //value="{password}" //remove quotation and comment
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

                    <TouchableOpacity className="bg-white py-2 px-4 w-40 rounded shadow mt-4">
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
                        <Link href="/signIn" asChild>
                            <Text className="text-cyan-500 underline px-1">
                                Sign In!
                            </Text>
                        </Link>
                    </Text>
                </View>
        </View>
    );
}