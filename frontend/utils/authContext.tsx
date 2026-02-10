import { createContext, PropsWithChildren, useState, useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "expo-router/build/global-state/router-store";

type AuthState = {
    isLoggedIn: boolean,
    isReady: boolean,
    logIn: (role: string) => void,
    logOut: () => void;
};

const authStorageKey = "auth-key";

// export const AuthContext = createContext<AuthState | undefined>(undefined);
export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    isReady: false,
    logIn: () => {},
    logOut: () => {},
});

export function AuthProvider({ children }: PropsWithChildren){
    const [isReady, setIsReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const storeAuthState = async (newState: { isLoggedIn: boolean, role?: string }) => {
        try {
            const jsonValue = JSON.stringify(newState);
            await AsyncStorage.setItem(authStorageKey, jsonValue);
        } catch(err) {
            console.log("Error storing auth state: ", err);
        }
    };

    const logIn = (role: string) => {
        setIsLoggedIn(true);
        storeAuthState({ isLoggedIn: true, role });
		if (role === "admin") {
			router.replace("/(admin)/(stack)/home");
		} else {
			router.replace("/(user)/(drawer)/home");
		}
    }
    const logOut = () => {
        setIsLoggedIn(false);
        storeAuthState({ isLoggedIn: false });
        router.replace("/(auth)/signin");
    }

    useEffect(() => {
        const getAuthFromStorage = async () => {
            try {
                const val = await AsyncStorage.getItem(authStorageKey);
                if(val !== null) {
                    const auth = JSON.parse(val);
                    setIsLoggedIn(auth.isLoggedIn);
                }
            } catch(err) {
                console.log("Error fetch from storage: ", err);
            }
            setIsReady(true);
        };
        getAuthFromStorage();
    }, []);

    return(
        <AuthContext.Provider value={{ isLoggedIn, isReady, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthState {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
