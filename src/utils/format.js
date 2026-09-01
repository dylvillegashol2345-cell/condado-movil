/* Helpers de formato. Portados del proyecto web. */

/* Formateo manual de miles en vez de toLocaleString("es-AR"):
   Hermes (el motor JS de React Native) no siempre trae Intl completo,
   y un precio mal formateado es molesto de diagnosticar. */
export function money(valor) {
  const n = Math.round(Number(valor) || 0);
  return "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function superficie(valor) {
  if (valor === null || valor === undefined) return "—";
  return `${Number(valor)} m²`;
}
