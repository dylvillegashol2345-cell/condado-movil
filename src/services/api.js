import Constants from "expo-constants";

/* Dirección de la API del sistema Grupo Condado.

   El problema: la API corre en la PC de quien desarrolla, no en el
   celular. Desde Expo Go, "localhost" apunta al propio teléfono, así
   que hay que usar la IP de la PC dentro de la red WiFi.

   La solución: en vez de escribir la IP a mano, se deduce del servidor
   de Expo. Cuando Metro imprime "exp://192.168.100.25:8081", esa IP es
   la de la PC. Así cada integrante corre el proyecto sin editar nada,
   y sigue funcionando cuando el router reparte otra IP. */

const PUERTO_API = 56153;

function hostDeDesarrollo() {
  const uri =
    Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost ?? "";
  const host = String(uri).split(":")[0];
  return host || "localhost";
}

export const API_URL = `http://${hostDeDesarrollo()}:${PUERTO_API}/api`;

export const MSG_SIN_API =
  "No pudimos conectarnos con el servidor. Verificá que la API esté " +
  "corriendo en Visual Studio y que el celular esté en la misma red WiFi.";
