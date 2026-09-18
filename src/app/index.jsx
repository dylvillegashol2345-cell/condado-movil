import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import BarraComparar from "../components/BarraComparar";
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
import { agruparPorLocalidad } from "../utils/secciones";

/* Pantalla principal — catálogo de propiedades.

   Los datos del servidor los maneja TanStack Query (useQuery). Lo que
   vive en useState es estado de la interfaz: el texto del buscador, los
   tres filtros y el modo de vista. Cada cambio vuelve a dibujar la lista
   con el resultado de aplicar búsqueda + filtros sobre los datos
   cacheados. No se vuelve a pedir nada a la API: filtrar es local.

   Dos modos de vista sobre los mismos datos filtrados:
   - Lista: FlatList, un arreglo plano.
   - Por localidad: SectionList, los mismos ítems agrupados bajo un
     encabezado por localidad. Mismo PropiedadCard en los dos: un solo
     componente sirve en dos listas distintas. */

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

/* Definido fuera del componente: no cambia nunca, no hace falta que React
   lo recree en cada render. */
const OPCIONES_VISTA = [
  { id: "lista", label: "Lista" },
  { id: "localidad", label: "Por localidad" },
];

export default function Inicio() {
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState(TODOS);
  const [localidad, setLocalidad] = useState(TODOS);
  const [precio, setPrecio] = useState(TODOS);
  const [vista, setVista] = useState("lista");

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

  /* Lo que comparten las dos vistas. Se define una vez y se le pasa a la
     lista que corresponda. */
  const encabezado = (
    <>
      <Encabezado cantidad={filtradas.length} />
      <Buscador valor={busqueda} onCambiar={setBusqueda} />
      <FiltroChips titulo="Tipo" opciones={OPCIONES_TIPO} activo={tipo} onCambiar={setTipo} />
      {localidades.length > 2 ? (
        <FiltroChips titulo="Localidad" opciones={localidades} activo={localidad} onCambiar={setLocalidad} />
      ) : null}
      <FiltroChips titulo="Precio" opciones={OPCIONES_PRECIO} activo={precio} onCambiar={setPrecio} />
      <FiltroChips titulo="Vista" opciones={OPCIONES_VISTA} activo={vista} onCambiar={setVista} />
      <Separador />
    </>
  );

  const vacio = (
    <SinResultados
      busqueda={busqueda.trim()}
      hayFiltros={hayFiltrosActivos(filtros)}
      onLimpiar={limpiarTodo}
    />
  );

  const renderItem = ({ item }) => (
    <Fila>
      <Link href={`/propiedad/${item.IdPropiedad}`} asChild>
        <Tocable activeOpacity={0.85}>
          <PropiedadCard
            id={item.IdPropiedad}
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
  );

  const propsComunes = {
    keyExtractor: (item) => String(item.IdPropiedad),
    contentContainerStyle: { paddingBottom: 96 },
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: "handled",
    ListHeaderComponent: encabezado,
    ListEmptyComponent: vacio,
    renderItem,
  };

  if (vista === "localidad") {
    return (
      <Pantalla edges={["top"]}>
        <SectionList
          {...propsComunes}
          sections={agruparPorLocalidad(filtradas)}
          /* Recibe la sección completa; se desestructura para sacar el title */
          renderSectionHeader={({ section: { title, data } }) => (
            <SeccionCabecera>
              <SeccionTitulo>{title}</SeccionTitulo>
              <SeccionCantidad>{data.length}</SeccionCantidad>
            </SeccionCabecera>
          )}
          renderSectionFooter={() => <SeccionPie />}
          stickySectionHeadersEnabled={false}
        />
        <BarraComparar />
      </Pantalla>
    );
  }

  return (
    <Pantalla edges={["top"]}>
      <FlatList {...propsComunes} data={filtradas} />
      <BarraComparar />
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

const SeccionCabecera = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 4px 16px 10px;
`;

const SeccionTitulo = styled.Text`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.condado};
`;

const SeccionCantidad = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SeccionPie = styled.View`
  height: 8px;
`;
