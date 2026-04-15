import { Text, TouchableOpacity, View, Image} from "react-native";
import logo from "@/assets/images/Isda-iconS.png";
import { router } from "expo-router";
import { useAuth } from "@/utils/authContext";

export default function Home() {
  const { logOut } = useAuth();
  return (
    <View className="flex-auto items-center justify-center bg-primary px-4 ">

      <View className="items-center -mt-20">

        <Image source={logo} className="w-32 h-32 mb-22" resizeMode="contain"/>

        <Text className="text-[#0B1D51] text-3xl font-semibold text-center">
          Welcome
        </Text>

        <TouchableOpacity className="bg-white py-2 px-4 w-40 border border-black rounded mt-4" onPress={() => router.push('/scan/capture')}>
          <Text className="text-center font-semibold text-[#0B1D51] ">Scan a Fish!</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white py-2 px-4 w-40 border border-black rounded mt-4">
        <Text className="text-center font-semibold text-[#0B1D51] ">History</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white py-2 px-4 w-40 border border-black rounded mt-4"
            onPress={() => {
                logOut();
            }}>
        <Text className="text-center font-semibold text-[#0B1D51] ">Sign Out</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}


