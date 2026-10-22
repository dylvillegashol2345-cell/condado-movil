// Comprobaciones de las validaciones del formulario de visita.
// Uso:  npm test

import assert from "node:assert";
import {
  normalizarTelefono, mostrarTelefono, telefonoParaApi,
  errorTelefono, errorNombre, formatearFechaHora, errorFechaHora,
} from "../src/utils/validacionVisita.js";

// Teléfono
assert.equal(normalizarTelefono("351264978494"), "3512649784");      // corta el exceso
assert.equal(normalizarTelefono("+54 9 351 264 9784"), "3512649784"); // saca 54 y 9
assert.equal(normalizarTelefono("(351) 264-9784"), "3512649784");
assert.equal(mostrarTelefono("3512649784"), "351 264 9784");
assert.equal(telefonoParaApi("3512649784"), "+543512649784");
assert.equal(errorTelefono("3512649784"), null);
assert.ok(errorTelefono("35126497"));      // corto
assert.ok(errorTelefono(""));              // vacío

// Nombre
assert.equal(errorNombre("Dylan Villegas"), null);
assert.equal(errorNombre("Dylan Alexis Villegas Atoche"), null);
assert.equal(errorNombre("María José Pérez Gómez Núñez"), null);   // 5 palabras: límite
assert.ok(errorNombre("Dylan"));                                    // falta apellido
assert.ok(errorNombre("Juan Carlos Pedro Luis Pérez Gómez"));       // 6 palabras
assert.ok(errorNombre("Dylan 123"));                                // números
assert.ok(errorNombre("Dylan V"));                                  // palabra de 1 letra

// Fecha y hora
assert.equal(formatearFechaHora("20102026153"), "20/10/2026 15:3");
assert.equal(formatearFechaHora("201020261530"), "20/10/2026 15:30");
assert.equal(errorFechaHora(""), null);                        // opcional
assert.equal(errorFechaHora("25/12/2027 10:00"), null);
assert.ok(errorFechaHora("Mañana a la tarde"));                // texto libre
assert.ok(errorFechaHora("31/02/2027 10:00"));                 // no existe
assert.ok(errorFechaHora("20/10/2027 25:00"));                 // hora inválida
assert.ok(errorFechaHora("01/01/2020 10:00"));                 // pasado

console.log("Las 23 comprobaciones pasaron.");
