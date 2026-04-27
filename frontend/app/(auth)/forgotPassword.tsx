import { Text, TouchableOpacity, View, Image, TextInput } from "react-native";
import logo from "@/assets/images/icon.png";
import { Link } from "expo-router";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { apiFetch } from "@/utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const sendResetLink = async () => {
    setSuccess("");
    setError("");
    if (!email) return setError("Email is required");

    try {
      const res = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Network Error. Please try again.");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="min-h-screen flex items-center justify-center bg-[#8CCDEB] px-4">
        <Image source={logo} style={{ width: 128, height: 128 }} resizeMode="contain" />
        <View className="w-full max-w-md rounded-xl items-center justify-center bg-[#FFE3A9] py-8 px-6">
          <Text className="text-3xl text-[#0B1D51] font-semibold mb-2">
            Forgot Password
          </Text>
          <Text className="text-[#0B1D51] text-center mb-4">
            Enter your email and we will send you a reset link.
          </Text>

          {success ? <Text className="text-green-700 mx-4 mb-2">{success}</Text> : null}
          {error ? <Text className="text-red-600 mx-4 mb-2">{error}</Text> : null}

          <View className="mt-2 w-full">
            <Text className="font-semibold">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="JuanDelaCruz@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-white w-80 rounded-lg border border-gray-500 px-2 py-1"
            />
          </View>

          <TouchableOpacity
            className="bg-white py-2 px-4 w-48 rounded shadow mt-6"
            onPress={sendResetLink}
          >
            <Text className="text-[#0B1D51] text-center font-semibold">
              Send Reset Link
            </Text>
          </TouchableOpacity>

          <Text className="text-[#0B1D51] text-center mt-4">
            {"Remember your password?"}{" "}
            <Link href="/signin" asChild>
              <Text className="text-cyan-500 underline px-1">Sign In!</Text>
            </Link>
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}