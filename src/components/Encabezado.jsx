import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import styled from "styled-components/native";

import { useFavoritos } from "../store/favoritos";
import { useTema } from "../store/tema";

export default function Encabezado({ cantidad }) {
  const totalFavoritos = useFavoritos((estado) => estado.ids.length);
  const oscuro = useTema((estado) => estado.oscuro);
  const alternarTema = useTema((estado) => estado.alternar);

  return (
    <Fondo>
      <Fila>
        <Textos>
          <Marca>Grupo Condado</Marca>
          <Bajada>Propiedades sustentables en Córdoba</Bajada>
        </Textos>

        <Botones>
          <Circulo
            onPress={alternarTema}
            activeOpacity={0.75}
            accessibilityLabel={oscuro ? "Usar modo claro" : "Usar modo oscuro"}
          >
            <Ionicons name={oscuro ? "sunny-outline" : "moon-outline"} size={20} color="#ffffff" />
          </Circulo>

          <Link href="/favoritos" asChild>
            <Corazon activeOpacity={0.75} accessibilityRole="button" accessibilityLabel="Ver favoritos">
              <Ionicons name={totalFavoritos > 0 ? "heart" : "heart-outline"} size={22} color="#ffffff" />
              {totalFavoritos > 0 ? (
                <Globo>
                  <GloboTexto>{totalFavoritos}</GloboTexto>
                </Globo>
              ) : null}
            </Corazon>
          </Link>
        </Botones>
      </Fila>

      <Contador>
        {cantidad === 1
          ? "1 propiedad disponible"
          : `${cantidad} propiedades disponibles`}
      </Contador>
    </Fondo>
  );
}

const Fondo = styled.View`
  background-color: ${({ theme }) => theme.colors.condado};
  padding: 28px 20px 24px;
  margin-bottom: 20px;
`;

const Fila = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const Textos = styled.View`
  flex: 1;
`;

const Marca = styled.Text`
  font-family: serif;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
`;

const Bajada = styled.Text`
  font-size: 14px;
  color: #f5e9e6;
  margin-top: 4px;
`;

const Contador = styled.Text`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 12px;
  font-weight: 600;
`;

const Botones = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const Circulo = styled.TouchableOpacity`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background-color: rgba(255, 255, 255, 0.14);
  align-items: center;
  justify-content: center;
  margin-top: 4px;
`;

const Corazon = styled.TouchableOpacity`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background-color: rgba(255, 255, 255, 0.14);
  align-items: center;
  justify-content: center;
  margin-top: 4px;
`;

const Globo = styled.View`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 10px;
  background-color: #e0455a;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.condado};
`;

const GloboTexto = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
`;
