import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { login } from "../services/AxiosAuth";
import { router } from "expo-router";
import LoginRequest from "@/models/LoginRequest";

export default function LoginScreen({ setIsLoggedIn }: any) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validate = (): boolean => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Invalid email");
      return false;
    }

    if (password.length < 4) {
      Alert.alert("Error", "Password too short");
      return false;
    }

    return true;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validate()) return;

    const loginData: LoginRequest = { email, password };
    setLoading(true);
    try {
      const response = await login(loginData); // send credentials
      console.log("Login success:", response);

      

      router.replace("/home"); 
    } catch (error: any) {
      console.error("Login failed:", error);
      Alert.alert("Login failed", error.response?.data?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        testID="login-email"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        testID="login-password"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText} testID="login-submit">Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});