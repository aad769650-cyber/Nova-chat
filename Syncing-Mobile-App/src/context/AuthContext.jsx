// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getJSON, setJSON, removeKey } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/keys";

const AuthContext = createContext(null);

function titleCaseFromEmail(email) {
  const local = email.split("@")[0] || "";
  const spaced = local.replace(/[._-]+/g, " ").trim();
  if (!spaced) return "NovaChat User";
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [checking, setChecking] = useState(true);

  // ---- Restore auth/onboarding state on launch ----
  useEffect(() => {
    (async () => {
      const onboarded = await getJSON(STORAGE_KEYS.HAS_ONBOARDED, false);
      const loggedIn = await getJSON(STORAGE_KEYS.IS_LOGGED_IN, false);
      const profile = await getJSON(STORAGE_KEYS.USER_PROFILE, null);
      setHasOnboarded(onboarded);
      setIsLoggedIn(loggedIn);
      setUser(profile);
      setChecking(false);
    })();
  }, []);

  const completeOnboarding = useCallback(async () => {
    setHasOnboarded(true);
    await setJSON(STORAGE_KEYS.HAS_ONBOARDED, true);
  }, []);

  // Mock authentication — any non-empty email/password combination succeeds.
  const login = useCallback(async ({ email, password }) => {
    const profile = { name: titleCaseFromEmail(email), email };
    setUser(profile);
    setIsLoggedIn(true);
    await setJSON(STORAGE_KEYS.USER_PROFILE, profile);
    await setJSON(STORAGE_KEYS.IS_LOGGED_IN, true);
    const joinedAt = await getJSON(STORAGE_KEYS.JOINED_AT, null);
    if (!joinedAt) await setJSON(STORAGE_KEYS.JOINED_AT, Date.now());
    return profile;
  }, []);

  const signup = useCallback(async ({ name, email }) => {
    const profile = { name: name?.trim() || titleCaseFromEmail(email), email };
    setUser(profile);
    setIsLoggedIn(true);
    await setJSON(STORAGE_KEYS.USER_PROFILE, profile);
    await setJSON(STORAGE_KEYS.IS_LOGGED_IN, true);
    await setJSON(STORAGE_KEYS.JOINED_AT, Date.now());
    return profile;
  }, []);

  const updateProfile = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      setJSON(STORAGE_KEYS.USER_PROFILE, next);
      return next;
    });
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setIsLoggedIn(false);
    await removeKey(STORAGE_KEYS.IS_LOGGED_IN);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        hasOnboarded,
        checking,
        completeOnboarding,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
