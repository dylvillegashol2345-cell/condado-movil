import { useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import Buscador from "../components/Buscador";
import Encabezado from "../components/Encabezado";
import PropiedadCard from "../components/PropiedadCard";
import SinResultados from "../components/SinResultados";
import { propiedades } from "../data/propiedades";
import { localidadLabel, tipoLabel } from "../utils/catalogos";
import { calcularClaseEnergetica } from "../utils/reglas";

/* Pantalla principal — catálogo de propiedades.

   Unidad 2:
   - ScrollView reemplazado por FlatList.
   - Primer estado del proyecto: el texto del buscador. Se guarda con
     useState porque cambia mientras la app está abierta y la lista
     tiene que volver a dibujarse con cada tecla.

   El filtrado se hace sobre una copia: nunca se modifica el arreglo
   original de propiedades. */

/* Busqueda sin tildes: nadie escribe "Cosquin" con acento al buscar.
   Se reemplazan a mano en vez de usar normalize("NFD"), porque el soporte
   Unicode de Hermes (el motor JS de React Native) no es el del navegador. */
const ACENTOS = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ü": "u", "ñ": "n" };

function normalizar(valor) {
  return String(valor)
    .toLowerCase()
    .replace(/[áéíóúüñ]/g, (c) => ACENTOS[c]);
}

function coincide(propiedad, texto) {
  if (!texto) return true;
  const campos = [
    propiedad.Barrio,
    propiedad.Calle,
    localidadLabel(propiedad.IdLocalidad),
    tipoLabel(propiedad.IdTipo),
  ];
  return campos.some((campo) => normalizar(campo).includes(texto));
}

export default function Inicio() {
  const [busqueda, setBusqueda] = useState("");

  const texto = normalizar(busqueda.trim());
  const filtradas = propiedades.filter((p) => coincide(p, texto));

  return (
    <Pantalla edges={["top"]}>
      <FlatList
        data={filtradas}
        keyExtractor={(item) => String(item.IdPropiedad)}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <Encabezado cantidad={filtradas.length} />
            <Buscador valor={busqueda} onCambiar={setBusqueda} />
          </>
        }
        ListEmptyComponent={<SinResultados busqueda={busqueda.trim()} />}
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

const Fila = styled.View`
  padding: 0 16px;
`;
