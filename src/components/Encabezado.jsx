import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import styled from "styled-components/native";

import { useFavoritos } from "../store/favoritos";

/* Header de marca de la pantalla principal.

   Recibe por props cuántas propiedades se están mostrando. El contador
   de favoritos, en cambio, lo lee del store: es la demostración de
   Zustand contra el prop drilling. La pantalla no sabe cuántos favoritos
   hay ni se lo pasa al header; el header se suscribe solo. */

export default function Encabezado({ cantidad }) {
  const totalFavoritos = useFavoritos((estado) => estado.ids.length);

  return (
    <Fondo>
      <Fila>
        <Textos>
          <Marca>Grupo Condado</Marca>
          <Bajada>Propiedades sustentables en Córdoba</Bajada>
        </Textos>

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
  color: ${({ theme }) => theme.colors.condadoLight};
  margin-top: 4px;
`;

const Contador = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.condado3};
  margin-top: 12px;
  font-weight: 600;
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
