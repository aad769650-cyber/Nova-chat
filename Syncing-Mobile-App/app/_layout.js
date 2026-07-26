import "react-native-gesture-handler";
import React from "react";
import { Stack } from "expo-router";
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useAppTheme } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { ChatProvider } from "../context/ChatContext";
import { getPaperTheme } from "../constants/theme";

function InnerLayout() {
  const { colors, isDark, isLoaded } = useAppTheme();

  if (!isLoaded) return null;

  const paperTheme = getPaperTheme(colors, MD3LightTheme, MD3DarkTheme);

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat/[id]" options={{ animation: "fade" }} />
        <Stack.Screen name="about" options={{ animation: "slide_from_bottom" }} />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <ChatProvider>
              <InnerLayout />
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
