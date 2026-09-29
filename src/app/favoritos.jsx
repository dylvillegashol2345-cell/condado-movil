import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import ErrorCarga from "../components/ErrorCarga";
import PropiedadCard from "../components/PropiedadCard";
import { obtenerPropiedades } from "../services/propiedades";
import { useFavoritos } from "../store/favoritos";
import { localidadLabel, tipoLabel } from "../utils/catalogos";
import { normalizarImagen } from "../utils/imagenes";
import { calcularClaseEnergetica } from "../utils/reglas";

export default function Favoritos() {
  const router = useRouter();
  const ids = useFavoritos((estado) => estado.ids);
  const limpiar = useFavoritos((estado) => estado.limpiar);

  const {
    data: propiedades = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["propiedades"],
    queryFn: obtenerPropiedades,
  });

  const volver = () => (router.canGoBack() ? router.back() : router.replace("/"));

  const favoritas = ids
    .map((id) => propiedades.find((p) => p.IdPropiedad === id))
    .filter(Boolean);

  return (
    <Pantalla edges={["top"]}>
      <Barra>
        <Volver onPress={volver} activeOpacity={0.7} accessibilityLabel="Volver">
          <Ionicons name="arrow-back" size={22} color="#1a1209" />
        </Volver>
        <Titulo>Favoritos</Titulo>
        {favoritas.length > 0 ? (
          <Limpiar onPress={limpiar} activeOpacity={0.7}>
            <LimpiarTexto>Vaciar</LimpiarTexto>
          </Limpiar>
        ) : (
          <Espacio />
        )}
      </Barra>

      {isLoading ? (
        <Centrado>
          <ActivityIndicator size="large" color="#6c2d20" />
        </Centrado>
      ) : error ? (
        <ErrorCarga mensaje={error.message} onReintentar={refetch} />
      ) : (
        <FlatList
          data={favoritas}
          keyExtractor={(item) => String(item.IdPropiedad)}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Vacio>
              <Ionicons name="heart-outline" size={44} color="#c4705f" />
              <VacioTitulo>Todavía no guardaste favoritos</VacioTitulo>
              <VacioDetalle>
                Tocá el corazón de una propiedad para tenerla a mano acá.
              </VacioDetalle>
              <Link href="/" asChild>
                <Boton activeOpacity={0.8}>
                  <BotonTexto>Ir al catálogo</BotonTexto>
                </Boton>
              </Link>
            </Vacio>
          }
          renderItem={({ item }) => (
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
          )}
        />
      )}
    </Pantalla>
  );
}

const Pantalla = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.bg};
`;

const Barra = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px 10px 4px;
`;

const Volver = styled.TouchableOpacity`
  padding: 10px 12px;
`;

const Titulo = styled.Text`
  font-family: serif;
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.condado};
`;

const Limpiar = styled.TouchableOpacity`
  padding: 10px 12px;
`;

const LimpiarTexto = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Espacio = styled.View`
  width: 60px;
`;

const Centrado = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Vacio = styled.View`
  align-items: center;
  padding: 60px 32px;
`;

const VacioTitulo = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: 14px;
`;

const VacioDetalle = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  margin-top: 6px;
  line-height: 19px;
`;

const Boton = styled.TouchableOpacity`
  margin-top: 22px;
  background-color: ${({ theme }) => theme.colors.condado};
  padding: 11px 22px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const BotonTexto = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`;

const Fila = styled.View`
  padding: 0 16px;
`;

const Tocable = styled.TouchableOpacity``;
