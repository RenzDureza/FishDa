import { Text, TouchableOpacity, View, Image } from "react-native";
import logo from "@/assets/images/Isda-AS.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/utils/authContext";

export default function AdminHome() {
	const { logOut } = useAuth();
	return (
		<SafeAreaView className="flex-1 space-y-4 items-center justify-center bg-[#FFE3A9] px-4">
			<View className="space-y-6 items-center">

				<Image source={logo} className="w-32 h-32" resizeMode="contain" />

				<Text className="text-[#0B1D51] text-3xl font-semibold texqt-center">
					Welcome
				</Text>

				<TouchableOpacity className="bg-white py-2 px-4 w-40 border border-black rounded mt-4" onPress={() => router.push("./manage")}>
					<Text className="text-center font-semibold text-[#0B1D51] ">Manage Users</Text>
				</TouchableOpacity>

				<TouchableOpacity className="bg-white py-2 px-4 w-40 border border-black rounded mt-4" onPress={() => { logOut() }}>
					<Text className="text-center font-semibold text-[#0B1D51] ">Logout</Text>
				</TouchableOpacity>

			</View>
		</SafeAreaView>
	);
}


