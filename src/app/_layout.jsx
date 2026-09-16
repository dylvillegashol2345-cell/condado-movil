import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components/native";

import { lightTheme } from "../theme/theme";

/* QueryClient: el "cerebro" de TanStack Query. Mantiene el caché de las
   consultas, maneja reintentos y sincroniza datos entre pantallas.
   Se crea UNA sola vez, afuera del componente, y se comparte en toda la
   app a través del QueryClientProvider. */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /* Cuánto tiempo un dato se considera "fresco": mientras no venza,
         volver a una pantalla no vuelve a pedirlo. Un catálogo inmobiliario
         no cambia cada segundo, así que un minuto es razonable. */
      staleTime: 60 * 1000,
      /* Un reintento alcanza: si la API no está, el segundo intento falla
         igual y solo demora en mostrar el error. */
      retry: 1,
    },
  },
});

export default function Layout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={lightTheme}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="propiedad/[id]" />
            <Stack.Screen name="favoritos" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
