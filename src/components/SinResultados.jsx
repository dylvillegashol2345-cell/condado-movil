import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

/* Estado vacío: qué mostrar cuando la búsqueda no encuentra nada.
   Sin esto la pantalla queda en blanco y parece que la app se rompió. */

export default function SinResultados({ busqueda }) {
  return (
    <Caja>
      <Ionicons name="home-outline" size={40} color="#c4705f" />
      <Titulo>No encontramos propiedades</Titulo>
      <Detalle>Ninguna coincide con “{busqueda}”. Probá con otro barrio o localidad.</Detalle>
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
