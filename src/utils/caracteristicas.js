const NOMBRES = {
  dormitorios: "Dormitorios",
  banos: "Baños",
  cochera: "Cochera",
  quincho: "Quincho",
  pileta: "Pileta",
  jardin: "Jardín",
  amoblado: "Amoblado",
  antiguedad: "Antigüedad",
};

// El sistema web guarda las características como JSON dentro de Descripcion.
// Devuelve null si la descripción es texto común.
export function leerCaracteristicas(descripcion) {
  try {
    const obj = JSON.parse(descripcion);
    if (!obj || typeof obj !== "object") return null;
    return Object.entries(obj)
      .filter(([, valor]) => valor && valor !== "No" && valor !== "0")
      .map(([clave, valor]) => ({ nombre: NOMBRES[clave] || clave, valor: valor === "Si" ? "Sí" : valor }));
  } catch {
    return null;
  }
}
