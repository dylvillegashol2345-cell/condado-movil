import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import Encabezado from "../components/Encabezado";
import PropiedadCard from "../components/PropiedadCard";
import { propiedades } from "../data/propiedades";
import { localidadLabel, tipoLabel } from "../utils/catalogos";
import { calcularClaseEnergetica } from "../utils/reglas";

/* Pantalla principal — catálogo de propiedades.

   Unidad 2: se reemplazó ScrollView por FlatList. A diferencia de
   ScrollView, que monta todos los elementos de una, FlatList renderiza
   solo los que están visibles en pantalla. Con 10 propiedades no se
   nota, pero cuando los datos vengan de la API van a ser muchas más.

   Las tres props obligatorias de FlatList son data, keyExtractor y
   renderItem. El Encabezado va como ListHeaderComponent para que
   scrollee junto con la lista en vez de quedar fijo arriba. */

export default function Inicio() {
  return (
    <Pantalla edges={["top"]}>
      <FlatList
        data={propiedades}
        keyExtractor={(item) => String(item.IdPropiedad)}
        ListHeaderComponent={<Encabezado cantidad={propiedades.length} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Fila>
            <PropiedadCard
              imagen={item.Imagen}
              tipo={tipoLabel(item.IdTipo)}
              precio={item.Precio}
              barrio={item.Barrio}
              calle={item.Calle}
              numeracion={item.Numeracion}
              localidad={localidadLabel(item.IdLocalidad)}
              superficie={item.Superficie}
              claseEnergetica={calcularClaseEnergetica(
                item.PanelesSolares,
                item.AislamientoTermico
              )}
              panelesSolares={item.PanelesSolares}
            />
          </Fila>
        )}
      />
    </Pantalla>
  );
}

const Pantalla = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.bg};
`;

/* El padding lateral va por fila y no en el contenedor, para que el
   Encabezado siga ocupando todo el ancho de la pantalla. */
const Fila = styled.View`
  padding: 0 16px;
`;
