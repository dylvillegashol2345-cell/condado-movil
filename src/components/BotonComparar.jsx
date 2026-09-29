import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { MAXIMO, useComparar } from "../store/comparar";

export default function BotonComparar({ id }) {
  const seleccionada = useComparar((estado) => estado.ids.includes(id));
  const cantidad = useComparar((estado) => estado.ids.length);
  const alternar = useComparar((estado) => estado.alternar);

  const lleno = !seleccionada && cantidad >= MAXIMO;

  const onPress = (evento) => {
    evento?.preventDefault?.();
    evento?.stopPropagation?.();
    if (lleno) return;
    alternar(id);
  };

  return (
    <Boton
      onPress={onPress}
      activeOpacity={0.7}
      disabled={lleno}
      seleccionada={seleccionada}
      lleno={lleno}
      accessibilityRole="button"
      accessibilityLabel={
        seleccionada ? "Quitar de la comparación" : lleno ? "Ya hay 3 en comparación" : "Comparar"
      }
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      <Ionicons
        name={seleccionada ? "checkmark-circle" : "git-compare-outline"}
        size={14}
        color={seleccionada ? "#ffffff" : lleno ? "#c9bfb9" : "#6c2d20"}
      />
      <Texto seleccionada={seleccionada} lleno={lleno}>
        {seleccionada ? "Comparando" : "Comparar"}
      </Texto>
    </Boton>
  );
}

const Boton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  border-width: 1px;
  border-color: ${({ theme, seleccionada, lleno }) =>
    seleccionada ? theme.colors.condado : lleno ? "#e8e0db" : theme.colors.condado3};
  background-color: ${({ theme, seleccionada }) =>
    seleccionada ? theme.colors.condado : "transparent"};
  margin-left: auto;
`;

const Texto = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme, seleccionada, lleno }) =>
    seleccionada ? "#ffffff" : lleno ? "#c9bfb9" : theme.colors.condado};
`;
