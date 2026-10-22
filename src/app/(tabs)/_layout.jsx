import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useComparar } from "../../store/comparar";
import { useFavoritos } from "../../store/favoritos";

export default function LayoutTabs() {
  const favoritos = useFavoritos((estado) => estado.ids.length);
  const comparando = useComparar((estado) => estado.ids.length);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6c2d20",
        tabBarInactiveTintColor: "#a0918a",
        tabBarStyle: { backgroundColor: "#ffffff", borderTopColor: "#e8e0db" },
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
