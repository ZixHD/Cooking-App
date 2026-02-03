import { Redirect } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const [route, setRoute] = useState<"/login" | "/home" | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        setRoute("/login");
        return;
      }

      const decoded: any = jwtDecode(token);

      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        await SecureStore.deleteItemAsync("token");
        setRoute("/login");
      } else {
        setRoute("/home"); 
      }
    } catch (err) {
      setRoute("/login");
    }
  };

  if (!route) return null;

  return <Redirect href={route} />;
}