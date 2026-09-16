import { ScrollView } from "react-native";
import styled from "styled-components/native";

/* Fila de chips seleccionables — el patrón de tabs de la Clase 3.

   Recibe las opciones y cuál está activa, y avisa hacia arriba cuando el
   usuario toca otra. No guarda estado propio: es un componente controlado,
   igual que el Buscador. Por eso sirve para tipo, localidad y precio con
   el mismo código.

   El ScrollView horizontal evita que las opciones se corten en pantallas
   angostas: si no entran, se deslizan. */

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
          /* Comparo el id de cada opción con el activo: así sé a cuál
             pintarle el estilo de seleccionada. */
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
