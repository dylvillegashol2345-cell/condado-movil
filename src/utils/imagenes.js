import { API_URL } from "../services/api";

// Las rutas como "/img/propiedades/casa-01.jpg" las sirve el mismo servidor de la API
const SERVIDOR = API_URL.replace(/\/api$/, "");

export function normalizarImagen(valor) {
  if (!valor) return null;
  const src = String(valor).trim();
  if (!src) return null;
  if (src.startsWith("data:") || src.startsWith("http")) return src;
  return `${SERVIDOR}/${src.replace(/^\//, "")}`;
}
