import { Button, Image, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { icons } from "@/constants/icons"
import { Link, router } from "expo-router";

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 items-center justify-center bg-primary">
        <StatusBar
          animated
          style="dark"
          backgroundColor="#000000"
        />
        
        <Image source={icons.logo} className="size-48 mb-5 mx-auto"/>

        <Link href="/(auth)/signin" className="text-4xl font-bold color-slate-800">Fishda</Link>
        {/* <Button title="Go to Profile" onPress={() => router.push('/(auth)/signin')} /> */}
      </SafeAreaView>

    </SafeAreaProvider>
  );
}

