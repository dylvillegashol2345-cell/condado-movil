import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import Buscador from "../components/Buscador";
import Encabezado from "../components/Encabezado";
import ErrorCarga from "../components/ErrorCarga";
import FiltroChips from "../components/FiltroChips";
import PropiedadCard from "../components/PropiedadCard";
import SinResultados from "../components/SinResultados";
import { obtenerPropiedades } from "../services/propiedades";
import { localidadLabel, tipoLabel } from "../utils/catalogos";
import {
  OPCIONES_PRECIO,
  OPCIONES_TIPO,
  TODOS,
  aplicarFiltros,
  hayFiltrosActivos,
  opcionesLocalidad,
} from "../utils/filtros";
import { normalizarImagen } from "../utils/imagenes";
import { calcularClaseEnergetica } from "../utils/reglas";

/* Pantalla principal — catálogo de propiedades.

   Los datos del servidor los maneja TanStack Query (useQuery). Lo que
   vive en useState es estado de la interfaz: el texto del buscador y los
   tres filtros. Cada vez que uno cambia, React vuelve a dibujar la lista
   con el resultado de aplicar búsqueda + filtros sobre los datos cacheados.
   No se vuelve a pedir nada a la API: filtrar es local. */

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
  const [tipo, setTipo] = useState(TODOS);
  const [localidad, setLocalidad] = useState(TODOS);
  const [precio, setPrecio] = useState(TODOS);

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

  const filtros = { tipo, localidad, precio };
  const texto = normalizar(busqueda.trim());
  const filtradas = aplicarFiltros(propiedades, filtros).filter((p) => coincide(p, texto));

  const limpiarTodo = () => {
    setBusqueda("");
    setTipo(TODOS);
    setLocalidad(TODOS);
    setPrecio(TODOS);
  };

  /* Las localidades se calculan con la lista completa, no con la filtrada:
     si se armaran con lo ya filtrado, al elegir "Casas" desaparecerían
     del selector las localidades que solo tienen departamentos. */
  const localidades = opcionesLocalidad(propiedades);

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
            <FiltroChips titulo="Tipo" opciones={OPCIONES_TIPO} activo={tipo} onCambiar={setTipo} />
            {localidades.length > 2 ? (
              <FiltroChips titulo="Localidad" opciones={localidades} activo={localidad} onCambiar={setLocalidad} />
            ) : null}
            <FiltroChips titulo="Precio" opciones={OPCIONES_PRECIO} activo={precio} onCambiar={setPrecio} />
            <Separador />
          </>
        }
        ListEmptyComponent={
          <SinResultados
            busqueda={busqueda.trim()}
            hayFiltros={hayFiltrosActivos(filtros)}
            onLimpiar={limpiarTodo}
          />
        }
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

const Separador = styled.View`
  height: 6px;
`;

const Fila = styled.View`
  padding: 0 16px;
`;

const Tocable = styled.TouchableOpacity``;
