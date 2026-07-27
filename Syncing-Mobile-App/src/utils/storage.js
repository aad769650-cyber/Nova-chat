// src/utils/storage.js
// Thin JSON-aware wrapper around AsyncStorage used by every context in the app.
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getJSON(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export async function setJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // best-effort persistence — a failed write shouldn't crash the UI
  }
}

export async function removeKey(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // best-effort
  }
}
