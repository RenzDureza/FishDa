import { Text, View, TextInput} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function manageUsers() {
  return (

      <SafeAreaView className="flex-1 space-y-4 items-center justify-center bg-[#FFE3A9] px-4">

        <View className="w-full max-w-md rounded-xl items-center px-6 py-4">
            <View className="mt-1">
                <TextInput
                placeholder="Search"
                className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
        </View>

            <View className="w-full max-w-lg rounded-xl items-center bg-white py-4 px-6 mt-4">
                <View className="border border-slate-900 rounded-xl p-4">
                    <Text>ID | Username | Icon | Icon</Text>

                </View>
            </View>

        </View>
      </SafeAreaView>
  );
}


