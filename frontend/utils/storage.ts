// For handling both web and mobile versions. If mobile only, this ain't needed

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const storage = {
    getItem: async (key: string): Promise<string | null> => {
        if (Platform.OS === "web") {
            return localStorage.getItem(key);
        }
        return SecureStore.getItemAsync(key);
    },

    setItem: async (key: string, value: string): Promise<void> => {
        if (Platform.OS === "web") {
            localStorage.setItem(key, value);
            return;
        }
        await SecureStore.setItemAsync(key, value);
    },

    deleteItem: async (key: string): Promise<void> => {
        if (Platform.OS === "web") {
            localStorage.removeItem(key);
            return;
        }
        await SecureStore.deleteItemAsync(key);
    },
};