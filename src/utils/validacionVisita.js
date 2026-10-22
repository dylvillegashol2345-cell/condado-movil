// Validaciones del formulario de visita.

const LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’ -]+$/;
const DIGITOS_TELEFONO = 10; // área + abonado, sin el +54

export const soloDigitos = (texto) => String(texto).replace(/\D/g, "");

// Saca el 54 y el 9 si el usuario los escribe, y corta en 10 dígitos.
export function normalizarTelefono(texto) {
  let d = soloDigitos(texto);
  if (d.startsWith("54")) d = d.slice(2);
  if (d.length > DIGITOS_TELEFONO && d.startsWith("9")) d = d.slice(1);
  return d.slice(0, DIGITOS_TELEFONO);
}

// 3512649784 -> "351 264 9784"
export function mostrarTelefono(digitos) {
  const d = soloDigitos(digitos);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

export const telefonoParaApi = (digitos) => `+54${soloDigitos(digitos)}`;

export function errorTelefono(digitos) {
  const d = soloDigitos(digitos);
  if (!d) return "Ingresá tu teléfono.";
  if (d.length !== DIGITOS_TELEFONO) {
    return `Faltan dígitos: son ${DIGITOS_TELEFONO} con el código de área, sin el 0 ni el 15.`;
  }
  if (d.startsWith("0")) return "No incluyas el 0 del código de área.";
  return null;
}

export function errorNombre(nombre) {
  const limpio = nombre.trim().replace(/\s+/g, " ");
  if (limpio.length < 4) return "Ingresá tu nombre y apellido.";
  if (limpio.length > 60) return "El nombre es demasiado largo.";
  if (!LETRAS.test(limpio)) return "Usá solo letras, sin números ni símbolos.";

  const palabras = limpio.split(" ");
  if (palabras.length < 2) return "Ingresá al menos un nombre y un apellido.";
  if (palabras.length > 5) return "Como máximo 3 nombres y 2 apellidos.";
  if (palabras.some((p) => p.length < 2)) return "Cada nombre tiene que tener al menos 2 letras.";
  return null;
}

// Va metiendo las barras y los dos puntos mientras escribe: 20/10/2026 15:30
export function formatearFechaHora(texto) {
  const d = soloDigitos(texto).slice(0, 12);
  let salida = d.slice(0, 2);
  if (d.length > 2) salida += `/${d.slice(2, 4)}`;
  if (d.length > 4) salida += `/${d.slice(4, 8)}`;
  if (d.length > 8) salida += ` ${d.slice(8, 10)}`;
  if (d.length > 10) salida += `:${d.slice(10, 12)}`;
  return salida;
}

export function errorFechaHora(texto) {
  const valor = texto.trim();
  if (!valor) return null; // es opcional

  const partes = valor.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/);
  if (!partes) return "Usá el formato 20/10/2026 15:30.";

  const [dia, mes, anio, hora, minutos] = partes.slice(1).map(Number);
  if (hora > 23 || minutos > 59) return "La hora tiene que estar entre 00:00 y 23:59.";

  const fecha = new Date(anio, mes - 1, dia, hora, minutos);
  const existe =
    fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
  if (!existe) return "Esa fecha no existe.";
  if (fecha < new Date()) return "Elegí una fecha y hora futuras.";
  return null;
}

export function validar({ nombre, telefono, fechaPreferida }) {
  const errores = {};
  const nom = errorNombre(nombre);
  const tel = errorTelefono(telefono);
  const fec = errorFechaHora(fechaPreferida);
  if (nom) errores.nombre = nom;
  if (tel) errores.telefono = tel;
  if (fec) errores.fechaPreferida = fec;
  return errores;
}
