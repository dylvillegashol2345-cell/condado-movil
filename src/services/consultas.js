import { pedir } from "./api";

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
