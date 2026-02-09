import { createContext, PropsWithChildren, useState, useContext } from "react";
import { useRouter } from "expo-router";

type AuthState = {
    isLoggedIn: boolean,
    logIn: () => void,
    logOut: () => void;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);
/*
export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    logIn: () => {},
    logOut: () => {},
});
*/

export function AuthProvider({ children }: PropsWithChildren){
    const [isLoggedIn, setLoggedIn] = useState(false);
    const router = useRouter();

    const logIn = () => {
        setLoggedIn(true);
        router.replace("/(user)/(drawer)/home");
    }
    const logOut = () => {
        setLoggedIn(false);
        router.replace("/(auth)/signin");
    }

    return(
        <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
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