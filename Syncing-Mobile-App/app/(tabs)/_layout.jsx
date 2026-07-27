// app/(tabs)/_layout.jsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../src/context/ThemeContext";

export default function TabsLayout() {
  const { paperTheme } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: paperTheme.colors.primary,
        tabBarInactiveTintColor: paperTheme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: paperTheme.colors.surface,
          borderTopColor: paperTheme.colors.outline,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
