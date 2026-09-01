import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components/native";

import { lightTheme } from "../theme/theme";

/* Layout raíz. Por ahora una sola pantalla: la navegación entre pantallas
   llega en la Unidad 3, cuando se vea Stack en clase. */

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={lightTheme}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
