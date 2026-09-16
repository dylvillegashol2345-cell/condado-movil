import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

/* Estado vacío del catálogo. Distingue dos situaciones que se ven igual
   pero significan cosas distintas: una búsqueda sin coincidencias, y un
   catálogo que directamente no tiene propiedades publicadas. */

export default function SinResultados({ busqueda }) {
  const hayBusqueda = Boolean(busqueda);

  return (
    <Caja>
      <Ionicons name="home-outline" size={40} color="#c4705f" />
      <Titulo>{hayBusqueda ? "No encontramos propiedades" : "Todavía no hay propiedades"}</Titulo>
      <Detalle>
        {hayBusqueda
          ? `Ninguna coincide con “${busqueda}”. Probá con otro barrio o localidad.`
          : "Cuando la inmobiliaria publique propiedades van a aparecer acá."}
      </Detalle>
    </Caja>
  );
}

const Caja = styled.View`
  align-items: center;
  padding: 40px 32px;
`;

const Titulo = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: 12px;
`;

const Detalle = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  margin-top: 6px;
  line-height: 19px;
`;
