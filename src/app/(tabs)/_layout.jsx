import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "styled-components/native";

import { useComparar } from "../../store/comparar";
import { useFavoritos } from "../../store/favoritos";

export default function LayoutTabs() {
  const theme = useTheme();
  const favoritos = useFavoritos((estado) => estado.ids.length);
  const comparando = useComparar((estado) => estado.ids.length);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.condado,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Catálogo",
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: "Favoritos",
          tabBarBadge: favoritos > 0 ? favoritos : undefined,
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="comparar"
        options={{
          title: "Comparar",
          tabBarBadge: comparando > 0 ? comparando : undefined,
          tabBarIcon: ({ color, size }) => <Ionicons name="git-compare-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
