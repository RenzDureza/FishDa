import { createContext, PropsWithChildren, useState, useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

type AuthState = {
    isLoggedIn: boolean,
    isReady: boolean,
    role: string | null,
    username: string | null,
    logIn: (token: string) => Promise<void>;
    logOut: () => Promise<void>;
};

type JWTPayload = {
    id: number;
    username: string;
    role: string;
    exp: number;
    session_start: number;
}

const TOKEN_KEY = "token-key";

export const getStoredToken = () => SecureStore.getItemAsync(TOKEN_KEY);

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    isReady: false,
    role: null,
    username: null,
    logIn: async () => {},
    logOut: async () => {},
});

export function AuthProvider({ children }: PropsWithChildren){
    const [isReady, setIsReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const router = useRouter();

    const logIn = async (token: string) => {
        try{
             if (token === "guest"){
                 setIsLoggedIn(true);
                 setRole("user");
                setUsername("Guest");

                 router.replace("/(user)/(drawer)/home");
                return
             }
            const decoded = jwtDecode<JWTPayload>(token);
            await SecureStore.setItemAsync(TOKEN_KEY, token);
            setIsLoggedIn(true);
            setRole(decoded.role);
            setUsername(decoded.username);

            if(decoded.role === "admin"){
                router.replace("/(admin)/(stack)/adminHome");
            } else {
                router.replace("/(user)/(drawer)/home");
            }
        } catch(err) {
            console.error("logIn error: ", err);
        }
    };

    const logOut = async () => {
        try{
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        } catch(err){
            console.error("logOut error: ", err);
        }
        setIsLoggedIn(false);
        setRole(null);
        setUsername(null);
        router.replace("/(auth)/signin");
    }

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const token = await SecureStore.getItemAsync(TOKEN_KEY);
                const MAX_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

                if(token) {
                    const decoded = jwtDecode<JWTPayload>(token);
                    const isTokenExpired = decoded.exp * 1000 < Date.now();
                    const isSessionExpired = Date.now() - decoded.session_start > MAX_SESSION_DURATION;

                    if(!isTokenExpired && !isSessionExpired){
                        setIsLoggedIn(true);
                        setRole(decoded.role);
                        setUsername(decoded.username);
                    } else {
                        await SecureStore.deleteItemAsync(TOKEN_KEY);
                    }
                }
            } catch(err) {
                console.error("restoreSession error: ", err);
                await SecureStore.deleteItemAsync(TOKEN_KEY);
            }
            setIsReady(true);
        };
        restoreSession();
    }, []);

    return(
        <AuthContext.Provider value={{ isLoggedIn, isReady, role, username, logIn, logOut }}>
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
