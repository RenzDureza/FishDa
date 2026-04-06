import { createContext, PropsWithChildren, useState, useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthState = {
    isLoggedIn: boolean,
    isReady: boolean,
    role: string | null,
    logIn: (role: string) => void,
    logOut: () => void;
};

const authStorageKey = "auth-key";

// export const AuthContext = createContext<AuthState | undefined>(undefined);
export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    isReady: false,
    role: null,
    logIn: () => {},
    logOut: () => {},
});

export function AuthProvider({ children }: PropsWithChildren){
    const [isReady, setIsReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();

    const storeAuthState = async (newState: { isLoggedIn: boolean, role?: string }) => {
        try {
            await AsyncStorage.setItem(authStorageKey, JSON.stringify(newState));
        } catch(err) {
            console.log("Error storing auth state: ", err);
        }
    };

    const logIn = (role: string) => {
        setIsLoggedIn(true);
        setRole(role);
        storeAuthState({ isLoggedIn: true, role });
		if (role === "admin") {
			router.replace("/(admin)/(stack)/home");
		} else {
			router.replace("/(user)/(drawer)/home");
		}
    };

    const logOut = () => {
        setIsLoggedIn(false);
        setRole(null);
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
                    setRole(auth.role ?? null);
                }
            } catch(err) {
                console.log("Error fetch from storage: ", err);
            }
            setIsReady(true);
        };
        getAuthFromStorage();
    }, []);

    return(
        <AuthContext.Provider value={{ isLoggedIn, isReady, role, logIn, logOut }}>
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
