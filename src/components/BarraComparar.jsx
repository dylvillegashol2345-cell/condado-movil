import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import styled from "styled-components/native";

import { MAXIMO, useComparar } from "../store/comparar";

export default function BarraComparar() {
  const cantidad = useComparar((estado) => estado.ids.length);
  const limpiar = useComparar((estado) => estado.limpiar);

  if (cantidad === 0) return null;

  const lista = cantidad >= 2;

  return (
    <Barra>
      <Texto>
        {lista
          ? `${cantidad} de ${MAXIMO} propiedades elegidas`
          : "Elegí al menos una más para comparar"}
      </Texto>
      <Acciones>
        <Limpiar onPress={limpiar} activeOpacity={0.7} accessibilityLabel="Quitar todas">
          <Ionicons name="close" size={18} color="#f5e9e6" />
        </Limpiar>
        {lista ? (
          <Link href="/comparar" asChild>
            <Boton activeOpacity={0.85}>
              <BotonTexto>Comparar</BotonTexto>
              <Ionicons name="arrow-forward" size={16} color="#6c2d20" />
            </Boton>
          </Link>
        ) : null}
      </Acciones>
    </Barra>
  );
}

const Barra = styled.View`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 18px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background-color: ${({ theme }) => theme.colors.condado};
  padding: 12px 12px 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  elevation: 6;
  shadow-color: #000;
  shadow-opacity: 0.18;
  shadow-radius: 10px;
  shadow-offset: 0px 4px;
`;

const Texto = styled.Text`
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
`;

const Acciones = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const Limpiar = styled.TouchableOpacity`
  padding: 6px;
`;

const Boton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: #ffffff;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
`;

const BotonTexto = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.condado};
`;
