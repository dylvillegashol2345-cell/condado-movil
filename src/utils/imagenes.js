/* Normaliza el valor de la columna Imagen de la base.

   Conviven dos formatos:
   - Las fotos cargadas desde el sistema web son data URL en base64.
   - Los datos semilla traen rutas relativas del sitio viejo
     ("img/casa1.jpg"). Esos archivos están en public/img del front web
     y los sirve ese servidor, no la API.

   La app móvil no tiene forma de resolver esas rutas relativas, así que
   devuelve null y la card cae en su imagen de respaldo. */

export function normalizarImagen(valor) {
  if (!valor) return null;
  const src = String(valor).trim();
  if (!src) return null;
  if (src.startsWith("data:") || src.startsWith("http")) return src;
  return null;
}
