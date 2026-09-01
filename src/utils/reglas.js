/* Reglas de negocio del sistema Grupo Condado (RN1..RN5).
   Copiadas sin cambios desde el proyecto web: son funciones puras. */

/* RN1 — la clase energética sale de los dos atributos sustentables */
export function calcularClaseEnergetica(panelesSolares, aislamientoTermico) {
  if (panelesSolares && aislamientoTermico) return "A";
  if (panelesSolares || aislamientoTermico) return "B";
  return "C";
}

/* RN2 — solo las clase A reciben bonificación */
export function calcularBonificacion(claseEnergetica) {
  return claseEnergetica === "A" ? 15 : 0;
}

/* RN3 — una propiedad solo se publica con matrícula y título cargados */
export function calcularPublicada(tieneMatricula, tieneTitulo) {
  return Boolean(tieneMatricula && tieneTitulo);
}

/* RN4 — no se puede operar sobre una propiedad ya vendida o alquilada */
export function propiedadDisponible(propiedad) {
  if (!propiedad) return false;
  return propiedad.Estado !== "Vendida" && propiedad.Estado !== "Alquilada";
}

/* RN5 — al registrar una operación la propiedad cambia de estado */
export function estadoSegunOperacion(tipoOperacion) {
  return tipoOperacion === "Venta" ? "Vendida" : "Alquilada";
}
