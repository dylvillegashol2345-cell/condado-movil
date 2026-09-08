import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

/* Campo de búsqueda del catálogo.

   Es un componente controlado: no guarda el texto por su cuenta, lo
   recibe por props y avisa hacia arriba cada vez que cambia. El estado
   vive en la pantalla, que es la que necesita filtrar la lista. */

export default function Buscador({ valor, onCambiar }) {
  return (
    <Caja>
      <Ionicons name="search-outline" size={18} color="#a0918a" />
      <Campo
        value={valor}
        onChangeText={onCambiar}
        placeholder="Buscar por barrio, calle o localidad"
        placeholderTextColor="#a0918a"
        autoCorrect={false}
        returnKeyType="search"
      />
      {valor.length > 0 && (
        <Limpiar onPress={() => onCambiar("")} accessibilityLabel="Limpiar búsqueda">
          <Ionicons name="close-circle" size={18} color="#a0918a" />
        </Limpiar>
      )}
    </Caja>
  );
}

const Caja = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 10px 12px;
  margin: 0 16px 16px;
`;

const Campo = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 0;
`;

const Limpiar = styled.TouchableOpacity``;
