import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import Buscador from "../components/Buscador";
import Encabezado from "../components/Encabezado";
import ErrorCarga from "../components/ErrorCarga";
import PropiedadCard from "../components/PropiedadCard";
import SinResultados from "../components/SinResultados";
import { obtenerPropiedades } from "../services/propiedades";
import { localidadLabel, tipoLabel } from "../utils/catalogos";
import { normalizarImagen } from "../utils/imagenes";
import { calcularClaseEnergetica } from "../utils/reglas";

/* Pantalla principal — catálogo de propiedades.

   Unidad 3: los datos del servidor los maneja TanStack Query. Un solo
   useQuery reemplaza los tres useState (datos, cargando, error) y el
   useEffect que teníamos. Además cachea: al volver del detalle, el
   catálogo no vuelve a pedir la lista.

   Lo que sigue siendo useState es el texto del buscador, porque es
   estado de la interfaz, no del servidor. Esa es la división: TanStack
   para lo que viene de la API, useState para lo que vive en la pantalla. */

/* Búsqueda sin tildes: nadie escribe "Cosquín" con acento al buscar.
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

  /* queryKey: identificador único de esta consulta en el caché. Cualquier
     pantalla que use la misma key comparte el mismo dato.
     queryFn: la función que hace el pedido. Si lanza, useQuery lo captura
     y lo expone en `error`, sin try/catch de nuestro lado. */
  const {
    data: propiedades = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["propiedades"],
    queryFn: obtenerPropiedades,
  });

  if (isLoading) {
    return (
      <Pantalla edges={["top"]}>
        <Centrado>
          <ActivityIndicator size="large" color="#6c2d20" />
          <Cargando>Cargando propiedades…</Cargando>
        </Centrado>
      </Pantalla>
    );
  }

  if (error) {
    return (
      <Pantalla edges={["top"]}>
        <ErrorCarga mensaje={error.message} onReintentar={refetch} />
      </Pantalla>
    );
  }

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
            <Link href={`/propiedad/${item.IdPropiedad}`} asChild>
              <Tocable activeOpacity={0.85}>
                <PropiedadCard
                  imagen={normalizarImagen(item.Imagen)}
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
              </Tocable>
            </Link>
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

const Centrado = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Cargando = styled.Text`
  margin-top: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Fila = styled.View`
  padding: 0 16px;
`;

const Tocable = styled.TouchableOpacity``;
