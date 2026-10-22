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
  10: "San Francisco",
  11: "Bell Ville",
  12: "Marcos Juárez",
  13: "La Carlota",
  14: "Laboulaye",
  15: "Villa Dolores",
  16: "Cruz del Eje",
  17: "Dean Funes",
  18: "Arroyito",
  19: "Oliva",
  20: "Monte Maíz",
  21: "Las Varillas",
  22: "Leones",
  23: "Justiniano Posse",
  24: "Oncativo",
  25: "Río Segundo",
  26: "Río Primero",
  27: "La Falda",
  28: "Capilla del Monte",
  29: "Mina Clavero",
  30: "Villa de Soto",
  31: "Unquillo",
  32: "Mendiolaza",
  33: "La Calera",
  34: "Malagueño",
  35: "Pilar",
  36: "Villa del Totoral",
  37: "Laguna Larga",
  38: "Morteros",
  39: "Brinkmann",
  40: "San Marcos Sierras",
};

export const ESTADOS_PROPIEDAD = ["Disponible", "Reservada", "Vendida", "Alquilada"];

export const TIPOS_OPERACION = ["Venta", "Alquiler"];

export function tipoLabel(id) {
  return TIPOS[Number(id)] || "Desconocido";
}

export function localidadLabel(id) {
  return LOCALIDADES[Number(id)] || "Desconocida";
}

export const IMG_PROPIEDAD_FALLBACK =
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=70";
