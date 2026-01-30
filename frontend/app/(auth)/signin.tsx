import { View, TextInput, Text, TouchableOpacity, Image, } from "react-native";
import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { icons } from "@/constants/icons";
import { Redirect } from "expo-router";

const SignIn = () => {
    const { session, signin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        signin({ email, password});
    };

    if (session) return <Redirect href="/" />;
    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-primary">
                <StatusBar animated style="dark" backgroundColor="#000000"/>
                <View className="flex-1 justify-end">
                    <Image source={icons.logo} className="size-48 mb-5 mx-auto"/>
                    <View className="flex-1 w-full bg-secondary px-6 pt-10 border-t-2">
                        <Text className="text-3xl font-bold mx-auto mt-10 mb-3">Sign in</Text>
                        <View className="bg-white pt-2 pb-1 pl-2 mt-2 mb-2 border-2 border-black">
                            <Text>Email:</Text>
                            <TextInput
                                placeholder="juandelacruz@gmail.com"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        <View className="bg-white pt-2 pb-1 pl-2 mt-2 mb-2 border-2 border-black">
                            <Text>Password:</Text>
                            <TextInput
                                placeholder="*************"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                        <TouchableOpacity className="items-center bg-white pt-2 pb-2 pl-2 mt-10 mb-2 border-2 border-black" onPress={handleSubmit}>
                            <Text>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default SignIn;



