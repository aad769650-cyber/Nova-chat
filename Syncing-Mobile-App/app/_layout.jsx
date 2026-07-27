// app/_layout.jsx
import { useEffect } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider, useAppTheme } from "../src/context/ThemeContext";
import { AuthProvider } from "../src/context/AuthContext";
import { ChatProvider } from "../src/context/ChatContext";

// Keep the native splash visible until our own theme/auth state is ready —
// the JS-drawn splash in app/index.jsx takes over the visual from there.
SplashScreen.preventAutoHideAsync().catch(() => {});

function ThemedStack() {
  const { paperTheme, mode, ready } = useAppTheme();

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: paperTheme.colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ animation: "fade" }} />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat/[id]" options={{ animation: "fade" }} />
        <Stack.Screen name="about" />
        <Stack.Screen name="privacy" />
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
              <ThemedStack />
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
