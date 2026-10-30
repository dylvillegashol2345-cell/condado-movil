export function money(valor, moneda = "ARS") {
  const n = Math.round(Number(valor) || 0);
  const cifra = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return moneda === "USD" ? `USD ${cifra}` : `$${cifra}`;
}

// "Barrio · Calle 123", sin el punto suelto si falta la calle
export function direccion(barrio, calle, numeracion) {
  return [barrio, `${calle || ""} ${numeracion || ""}`.trim()].filter(Boolean).join(" · ");
}

export function superficie(valor) {
  if (valor === null || valor === undefined) return "—";
  return `${Number(valor)} m²`;
}
