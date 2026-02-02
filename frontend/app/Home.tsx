import { Text, Touchable, TouchableOpacity, View, Image} from "react-native";
import logo from "../assets/images/Isda-StrokedS.png"

export default function Index() {
  return (
    <View className="flex-1 space-y-4 items-center justify-center bg-[#8CCDEB]">

      <Image source={logo} className="w-32 h-32"/>
      <Text className="text-[#0B1D51] text-3xl font-semibold">Welcome</Text>
      <TouchableOpacity className="bg-white hover:bg-gray-200 text-[#0B1D51] text-center font-semibold py-2 px-4 w-40 border border-black rounded shadow">
        Scan a Fish!
      </TouchableOpacity>
      <TouchableOpacity className="bg-white hover:bg-gray-200 text-[#0B1D51] text-center font-semibold py-2 px-4 w-40 border border-black rounded shadow">
        History
      </TouchableOpacity>

    </View>
  );
}


