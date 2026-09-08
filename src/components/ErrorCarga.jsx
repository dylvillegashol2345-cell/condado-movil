import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

/* Pantalla de error de conexión, con botón para reintentar.
   Mostrar el mensaje sin dar una salida deja al usuario sin nada que hacer
   más que cerrar la app. */

export default function ErrorCarga({ mensaje, onReintentar }) {
  return (
    <Caja>
      <Ionicons name="cloud-offline-outline" size={44} color="#c4705f" />
      <Titulo>No pudimos cargar las propiedades</Titulo>
      <Detalle>{mensaje}</Detalle>
      <Boton onPress={onReintentar} activeOpacity={0.8}>
        <Ionicons name="refresh" size={16} color="#ffffff" />
        <BotonTexto>Reintentar</BotonTexto>
      </Boton>
    </Caja>
  );
}

const Caja = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

const Titulo = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: 14px;
`;

const Detalle = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  margin-top: 8px;
  line-height: 19px;
`;

const Boton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: ${({ theme }) => theme.colors.condado};
  padding: 11px 22px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  margin-top: 22px;
`;

const BotonTexto = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`;
