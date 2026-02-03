import { Text, TouchableOpacity, View, Image} from "react-native";
import logo from "@/assets/images/Isda-StrokedS.png"

export default function Home() {
  return (
    <View className="flex-1 space-y-4 items-center justify-center bg-[#8CCDEB] px-4">

      <View className="space-y-6 items-center">

        <Image source={logo} className="w-32 h-32" resizeMode="contain"/>

        <Text className="text-[#0B1D51] text-3xl font-semibold text-center">
          Welcome
        </Text>

        <TouchableOpacity className="bg-white py-2 px-4 w-40 border border-black rounded mt-4">
          <Text className="text-center font-semibold text-[#0B1D51] ">Scan a Fish!</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white py-2 px-4 w-40 border border-black rounded mt-4">
        <Text className="text-center font-semibold text-[#0B1D51] ">History</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}


