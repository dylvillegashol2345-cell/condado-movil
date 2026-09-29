export function money(valor) {
  const n = Math.round(Number(valor) || 0);
  return "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function superficie(valor) {
  if (valor === null || valor === undefined) return "—";
  return `${Number(valor)} m²`;
}
