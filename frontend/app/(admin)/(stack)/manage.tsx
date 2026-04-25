import { Text, TouchableOpacity, View, Image, TextInput, Alert} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import info from "@/assets/images/info.png";
import trash from "@/assets/images/trash.png";
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

type User = {
    id: number;
    username: string;
}

export default function manageUsers() {
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        showUsers();
    }, []);

    const showUsers = async () => {
        try {
            const res = await apiFetch(`/api/admin`, { method: "GET" });
            const data = await res.json();
            if (res.ok) {
                setUsers(data);
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            setError("Network Error. Please Try Again " + String(err));
        }
    }

    const searchUser = async (text: string) => {
        setSearchQuery(text);
        
        if (text === ""){
            showUsers(); return;
        }

        try {
            const res = await apiFetch(`/api/admin/search?query=${text}`, { method: "GET" });
            const data = await res.json();
            if (res.ok) {
                setUsers(data);
            } else {
                setUsers([]);
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            setError("Network Error. Please Try Again " + String(err));
        }
    }

    const deleteUser = async (id: number) => {
        Alert.alert(
            "Delete User",
            "Are you sure you want to delete this user?",
            [{
                text: "Delete",
                onPress: async () => {
                    try {
                        const res = await apiFetch(`/api/admin/delete/${id}`, { method: "DELETE" });
                        const data = await res.json();
                        if (res.ok) {
                            setUsers((prev) => prev.filter((user) => user.id !== id));
                        } else {
                            setError(data.message || "Something went wrong");
                        }
                    } catch (err) {
                        setError("Network Error. Please Try Again " + String(err));
                    }
                },
            },  { 
                  text: "Nevermind",
                  style: "cancel"
                },
            ]
        );
    }

    const infoUser = async () => {
        // TODO (fish table)
    }

  return (
      <SafeAreaView className="flex-1 space-y-4 items-center justify-center bg-[#FFE3A9] px-4">

        <View className="w-full max-w-md rounded-xl items-center px-6 py-4">
            <View className="mt-1">
                <TextInput
                placeholder="Search"
                value={searchQuery}
                onChangeText={(text) => searchUser(text)}
                className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1" />
        </View>

            <View className="w-full max-w-lg rounded-xl items-center bg-white py-4 px-6 mt-4">
                {users.length > 0 ? (
                    users.map((user) => (
                        <View key={user.id} className="border border-slate-900 rounded-xl p-4">
                            <Text>{user.id} | {user.username} </Text>
                            <View className="flex-row">
				        		<TouchableOpacity className="flex-row items-center justify-center rounded-lg py-3 mr-5"
                                    onPress={() => {
                                        infoUser();
                                    }}>
				        			<Image source={info} style={{ width: 32, height: 32 }} resizeMode="contain" />
				        		</TouchableOpacity>

				        		<TouchableOpacity className="flex-row items-center justify-center rounded-lg py-3"
                                    onPress={() => {
                                        deleteUser(user.id);
                                    }}>
				        			<Image source={trash} style={{ width: 32, height: 32 }} resizeMode="contain" />
				        		</TouchableOpacity>
				        	</View>
                        </View>
                    ))) : ( <Text className="text-gray-400">No users found</Text> )}
            </View>

        </View>
      </SafeAreaView>
  );
}


