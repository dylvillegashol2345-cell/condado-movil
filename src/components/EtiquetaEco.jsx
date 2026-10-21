import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

function colorDeClase(theme, clase) {
  if (clase === "A") return theme.colors.ecoA;
  if (clase === "B") return theme.colors.ecoB;
  return theme.colors.ecoC;
}

// Mismos colores que la etiqueta del sistema web
export default function EtiquetaEco({ clase }) {
  const colorTexto = clase === "C" ? "#1b5e20" : "#ffffff";
  return (
    <Pill clase={clase}>
      <Ionicons name="leaf" size={11} color={colorTexto} />
      <Texto color={colorTexto}>Clase {clase}</Texto>
    </Pill>
  );
}

const Pill = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  background-color: ${({ theme, clase }) => colorDeClase(theme, clase)};
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
`;

const Texto = styled.Text`
  color: ${({ color }) => color};
  font-size: 11px;
  font-weight: 700;
`;
