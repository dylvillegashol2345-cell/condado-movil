/* Catálogos fijos del sistema.
   Los IDs coinciden con las tablas Tipo y Localidad de ULTIMOSQL207.sql,
   así que cuando conectemos la API los datos van a calzar sin traducción. */

export const TIPOS = {
  1: "Casa",
  2: "Departamento",
  3: "Lote",
  4: "Terreno",
};

export const LOCALIDADES = {
  1: "Villa María",
  2: "Córdoba Capital",
  3: "Río Cuarto",
  4: "Río Tercero",
  5: "Cosquín",
  6: "Villa Allende",
  7: "Alta Gracia",
  8: "Villa Carlos Paz",
  9: "Jesús María",
};

export const ESTADOS_PROPIEDAD = ["Disponible", "Reservada", "Vendida", "Alquilada"];

export const TIPOS_OPERACION = ["Venta", "Alquiler"];

export function tipoLabel(id) {
  return TIPOS[Number(id)] || "Desconocido";
}

export function localidadLabel(id) {
  return LOCALIDADES[Number(id)] || "Desconocida";
}

/* Imagen de respaldo cuando una propiedad no tiene foto cargada */
export const IMG_PROPIEDAD_FALLBACK =
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=70";
