import * as SecureStore from "expo-secure-store";

const BIOMETRIC_TOKEN_KEY = (email: string) => {
    const emailKey = email.replace(/[^a-zA-Z0-9]/g, "-");
    return `biometric-auth-key-${emailKey}`;
};
const BIOMETRIC_EMAIL_KEY = "biometric-email";

export const saveBiometric = async (token: string, email: string) => {
    await SecureStore.setItemAsync(BIOMETRIC_TOKEN_KEY(email), token, {
        requireAuthentication: false,
    });
    await SecureStore.setItemAsync(BIOMETRIC_EMAIL_KEY, email, {
        requireAuthentication: false,
    });
};

export const getBiometricToken = async (): Promise<string | null> => {
    const email = await SecureStore.getItemAsync(BIOMETRIC_EMAIL_KEY);
    if(!email) return null;
    return await SecureStore.getItemAsync(BIOMETRIC_TOKEN_KEY(email));
};

export const hasBiometric = async (email?: string): Promise<boolean> => {
    const target = email ?? await SecureStore.getItemAsync(BIOMETRIC_EMAIL_KEY);
    if(!target) return false;
    const token = await SecureStore.getItemAsync(BIOMETRIC_TOKEN_KEY(target));
    return !!token;
};

export const deleteBiometric = async (email?: string) => {
    const target = email ?? await SecureStore.getItemAsync(BIOMETRIC_EMAIL_KEY);
    if(target) await SecureStore.deleteItemAsync(BIOMETRIC_TOKEN_KEY(target));
    await SecureStore.deleteItemAsync(BIOMETRIC_EMAIL_KEY);
};

export const refreshBiometricToken = async (token: string) => {
    const email = await SecureStore.getItemAsync(BIOMETRIC_EMAIL_KEY);
    if(!email) return;
    await SecureStore.setItemAsync(BIOMETRIC_TOKEN_KEY(email), token);
};