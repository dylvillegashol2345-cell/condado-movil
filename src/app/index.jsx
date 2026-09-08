import { Link } from "expo-router";
import { useEffect, useState } from "react";
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

   Los datos vienen de la API del sistema Grupo Condado. Tres estados
   conviven acá: las propiedades, el spinner de carga y el error.

   Cada card está envuelta en un <Link> que lleva al detalle. Con asChild,
   el Link no dibuja nada propio: le pasa el comportamiento de navegación
   al TouchableOpacity que tiene adentro. */

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
  const [propiedades, setPropiedades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const cargarPropiedades = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerPropiedades();
      setPropiedades(datos);
    } catch (e) {
      setError(e.message);
    } finally {
      /* finally se ejecuta siempre, salga bien o mal: si el spinner
         quedara prendido tras un error, la app parecería colgada. */
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPropiedades();
  }, []);

  if (cargando) {
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
        <ErrorCarga mensaje={error} onReintentar={cargarPropiedades} />
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
