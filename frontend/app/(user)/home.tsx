import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { icons } from "@/constants/icons"
import { useAuth } from "@/src/context/AuthContext";

export default function Home() {
    const {user, session, signout} = useAuth();
    return (
    <SafeAreaProvider>
        <SafeAreaView className="flex-1 items-center justify-center bg-primary">
        <StatusBar
            animated
            style="dark"
            backgroundColor="#000000"
        />
        
        <Image source={icons.logo} className="size-48 mb-5 mx-auto"/>

        <Text className="text-4xl font-bold color-slate-800">Welcome, {user.name}</Text>
        <TouchableOpacity className="items-center bg-white p-2 mt-10 mb-2 border-2 border-black" onPress={signout}>
            <Text>Sign out</Text>
        </TouchableOpacity>
        </SafeAreaView>

    </SafeAreaProvider>
    );
}

