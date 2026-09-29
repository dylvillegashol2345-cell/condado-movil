import { ScrollView } from "react-native";
import styled from "styled-components/native";

export default function FiltroChips({ titulo, opciones, activo, onCambiar }) {
  return (
    <Bloque>
      {titulo ? <Titulo>{titulo}</Titulo> : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {opciones.map((opcion) => {
          const seleccionado = opcion.id === activo;
          return (
            <Chip
              key={String(opcion.id)}
              seleccionado={seleccionado}
              onPress={() => onCambiar(opcion.id)}
              activeOpacity={0.8}
            >
              <ChipTexto seleccionado={seleccionado}>{opcion.label}</ChipTexto>
            </Chip>
          );
        })}
      </ScrollView>
    </Bloque>
  );
}

const Bloque = styled.View`
  margin-bottom: 10px;
`;

const Titulo = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 16px 6px;
`;

const Chip = styled.TouchableOpacity`
  padding: 7px 14px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
  border-width: 1px;
  border-color: ${({ theme, seleccionado }) =>
    seleccionado ? theme.colors.condado : theme.colors.border};
  background-color: ${({ theme, seleccionado }) =>
    seleccionado ? theme.colors.condado : theme.colors.surface};
`;

const ChipTexto = styled.Text`
  font-size: 13px;
  font-weight: ${({ seleccionado }) => (seleccionado ? "700" : "500")};
  color: ${({ theme, seleccionado }) =>
    seleccionado ? "#ffffff" : theme.colors.textSecondary};
`;
