import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import Encabezado from "../components/Encabezado";
import PropiedadCard from "../components/PropiedadCard";
import { propiedades } from "../data/propiedades";
import { localidadLabel, tipoLabel } from "../utils/catalogos";
import { calcularClaseEnergetica } from "../utils/reglas";

/* Pantalla principal — Unidad 1.
   Datos estáticos, ScrollView y una card reutilizable por propiedad.
   La clase energética no viene en los datos: se calcula acá con la RN1
   del sistema, igual que en el front web. */

export default function Inicio() {
  return (
    <Pantalla edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Encabezado cantidad={propiedades.length} />

        <Listado>
          {propiedades.map((p) => (
            <PropiedadCard
              key={p.IdPropiedad}
              imagen={p.Imagen}
              tipo={tipoLabel(p.IdTipo)}
              precio={p.Precio}
              barrio={p.Barrio}
              calle={p.Calle}
              numeracion={p.Numeracion}
              localidad={localidadLabel(p.IdLocalidad)}
              superficie={p.Superficie}
              claseEnergetica={calcularClaseEnergetica(
                p.PanelesSolares,
                p.AislamientoTermico
              )}
              panelesSolares={p.PanelesSolares}
            />
          ))}
        </Listado>
      </ScrollView>
    </Pantalla>
  );
}

const Pantalla = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.bg};
`;

const Listado = styled.View`
  padding: 20px 16px 32px;
`;
