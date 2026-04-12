import { getStoredToken } from "./authContext";

export const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export const apiFetch = async (path: string, options: RequestInit = {}) => {
    const token = await getStoredToken();
    return fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
};