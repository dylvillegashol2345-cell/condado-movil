import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

export default function SinResultados({ busqueda, hayFiltros, onLimpiar }) {
  const hayBusqueda = Boolean(busqueda);
  const restringido = hayBusqueda || hayFiltros;

  let detalle = "Cuando la inmobiliaria publique propiedades van a aparecer acá.";
  if (hayBusqueda && hayFiltros) {
    detalle = `Ninguna coincide con “${busqueda}” y los filtros elegidos.`;
  } else if (hayBusqueda) {
    detalle = `Ninguna coincide con “${busqueda}”. Probá con otro barrio o localidad.`;
  } else if (hayFiltros) {
    detalle = "Ninguna cumple con los filtros elegidos.";
  }

  return (
    <Caja>
      <Ionicons name="home-outline" size={40} color="#c4705f" />
      <Titulo>{restringido ? "No encontramos propiedades" : "Todavía no hay propiedades"}</Titulo>
      <Detalle>{detalle}</Detalle>
      {restringido && onLimpiar ? (
        <Boton onPress={onLimpiar} activeOpacity={0.8}>
          <BotonTexto>Ver todas las propiedades</BotonTexto>
        </Boton>
      ) : null}
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

const Boton = styled.TouchableOpacity`
  margin-top: 18px;
  padding: 10px 18px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.condado};
`;

const BotonTexto = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.condado};
`;
