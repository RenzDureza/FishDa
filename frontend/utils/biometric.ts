import * as SecureStore from "expo-secure-store";

const BIOMETRIC_TOKEN_KEY = "biometric-auth-key";
const BIOMETRIC_EMAIL_KEY = "biometric-email";

export const saveBiometric = async (token: string, email: string) => {
    await SecureStore.setItemAsync(BIOMETRIC_TOKEN_KEY, token, {
        requireAuthentication: false,
    });
    await SecureStore.setItemAsync(BIOMETRIC_EMAIL_KEY, email, {
        requireAuthentication: false,
    });
};

export const getBiometricToken = async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(BIOMETRIC_TOKEN_KEY);
};

export const hasBiometric = async (): Promise<boolean> => {
    const token = await SecureStore.getItemAsync(BIOMETRIC_TOKEN_KEY);
    return !!token;
};

export const deleteBiometric = async () => {
    await SecureStore.deleteItemAsync(BIOMETRIC_TOKEN_KEY);
    await SecureStore.deleteItemAsync(BIOMETRIC_EMAIL_KEY);
};

export const refreshBiometricToken = async (token: string) => {
    await SecureStore.setItemAsync(BIOMETRIC_TOKEN_KEY, token);
};