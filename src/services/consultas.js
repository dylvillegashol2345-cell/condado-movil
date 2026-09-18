import { pedir } from "./api";

/* Consultas a la inmobiliaria.

   La solicitud de visita viaja como una Consulta, no como una Cita.
   Cita es el turno interno: exige un cliente ya cargado y un agente
   asignado, cosas que la persona que mira el catálogo no tiene todavía.
   Consulta es el punto de entrada: la inmobiliaria la recibe, la deriva
   y recién ahí crea la cita — que es el proceso documentado en PP1.

   La fecha no se manda: la pone el servidor con DateTime.Now. */

export async function enviarConsulta({ nombre, telefono, mensaje, propiedadInteres }) {
  await pedir("/Consulta", {
    method: "POST",
    body: {
      Nombre: nombre,
      Telefono: telefono,
      Mensaje: mensaje,
      PropiedadInteres: propiedadInteres,
    },
  });
}
