import { Redirect, Stack, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../../../utils/authContext";

export default function AdminLayout() {
  const { isLoggedIn, isReady, role } = useAuth();
  
    if(!isReady) {
      return null;
    }
  
    if(!isLoggedIn){
      return <Redirect href="/(auth)/signin" />
    }

    if(role !== "admin"){
      return <Redirect href="/(user)/(drawer)/home" />
    }

    return (
      <SafeAreaProvider>
          <Stack
          screenOptions={{
            headerShown: false,
            headerStyle:{
              backgroundColor: "#FFE3A9",
            },
            headerShadowVisible: false,
            headerTitleAlign: "center",
            }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="manage"
                options={{
                headerShown: true,
                title: "Manage Users",
                headerLeft: () => <BackButton />
                }}/>
          </Stack>
      </SafeAreaProvider>
    );
}

function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()}>
      <Ionicons
        name="arrow-back"
        size={28}
        style={{marginLeft: 12}}/>
    </TouchableOpacity>
  );
}