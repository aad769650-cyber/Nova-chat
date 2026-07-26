import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MOCK_USER } from "../constants/mockData";

const AUTH_STORAGE_KEY = "@ai_chat_auth_user";
const ONBOARDED_KEY = "@ai_chat_onboarded";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [savedUser, onboarded] = await Promise.all([
          AsyncStorage.getItem(AUTH_STORAGE_KEY),
          AsyncStorage.getItem(ONBOARDED_KEY),
        ]);
        if (savedUser) setUser(JSON.parse(savedUser));
        setHasOnboarded(onboarded === "true");
      } catch (e) {
        // ignore
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const login = async (email, _password) => {
    const loggedInUser = { ...MOCK_USER, email: email || MOCK_USER.email };
    setUser(loggedInUser);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  const signup = async (name, email, _password) => {
    const newUser = { ...MOCK_USER, name: name || MOCK_USER.name, email: email || MOCK_USER.email };
    setUser(newUser);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const completeOnboarding = async () => {
    setHasOnboarded(true);
    await AsyncStorage.setItem(ONBOARDED_KEY, "true");
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      hasOnboarded,
      isReady,
      login,
      signup,
      logout,
      completeOnboarding,
    }),
    [user, hasOnboarded, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
