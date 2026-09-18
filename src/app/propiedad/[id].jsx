import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import BotonFavorito from "../../components/BotonFavorito";
import ErrorCarga from "../../components/ErrorCarga";
import EtiquetaEco from "../../components/EtiquetaEco";
import FichaAmbiental from "../../components/FichaAmbiental";
import { obtenerPropiedad } from "../../services/propiedades";
import { IMG_PROPIEDAD_FALLBACK, localidadLabel, tipoLabel } from "../../utils/catalogos";
import { money, superficie as fmtSuperficie } from "../../utils/format";
import { normalizarImagen } from "../../utils/imagenes";
import { calcularClaseEnergetica } from "../../utils/reglas";

/* Detalle de una propiedad.

   El nombre del archivo entre corchetes lo convierte en una ruta
   dinámica de Expo Router: /propiedad/1, /propiedad/2, etc. El valor
   llega por useLocalSearchParams.

   Unidad 3: el pedido a la API lo maneja useQuery. La queryKey incluye
   el id, así cada propiedad tiene su propia entrada en el caché: abrir
   la 1, volver, y abrir la 1 de nuevo no vuelve a pedirla. */

export default function DetallePropiedad() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    data: propiedad,
    isLoading,
    error,
    refetch,
  } = useQuery({
    /* ["propiedad", "1"] y ["propiedad", "2"] son entradas distintas del
       caché. Si la key fuera solo ["propiedad"], todas compartirían el
       mismo dato y mostrarían la última que se cargó. */
    queryKey: ["propiedad", id],
    queryFn: () => obtenerPropiedad(id),
  });

  const volver = () => (router.canGoBack() ? router.back() : router.replace("/"));

  if (isLoading) {
    return (
      <Pantalla edges={["top"]}>
        <Centrado>
          <ActivityIndicator size="large" color="#6c2d20" />
        </Centrado>
      </Pantalla>
    );
  }

  if (error) {
    return (
      <Pantalla edges={["top"]}>
        <Volver onPress={volver} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#1a1209" />
        </Volver>
        <ErrorCarga mensaje={error.message} onReintentar={refetch} />
      </Pantalla>
    );
  }

  const p = propiedad;
  const clase = calcularClaseEnergetica(p.PanelesSolares, p.AislamientoTermico);

  return (
    <Pantalla edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Portada>
          <Foto source={{ uri: normalizarImagen(p.Imagen) || IMG_PROPIEDAD_FALLBACK }} resizeMode="cover" />
          <VolverFlotante onPress={volver} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
          </VolverFlotante>
          <FavoritoFlotante>
            <BotonFavorito id={Number(id)} oscuro />
          </FavoritoFlotante>
          <BadgeTipo>
            <BadgeTipoTexto>{tipoLabel(p.IdTipo)}</BadgeTipoTexto>
          </BadgeTipo>
        </Portada>

        <Cuerpo>
          <Fila>
            <Precio>{money(p.Precio)}</Precio>
            <EtiquetaEco clase={clase} />
          </Fila>

          <Direccion>
            {p.Barrio} · {p.Calle} {p.Numeracion}
          </Direccion>

          <Ubicacion>
            <Ionicons name="location-outline" size={14} color="#a0918a" />
            <UbicacionTexto>{localidadLabel(p.IdLocalidad)}</UbicacionTexto>
          </Ubicacion>

          <Datos>
            <Dato>
              <Ionicons name="resize-outline" size={15} color="#6b5b52" />
              <DatoTexto>{fmtSuperficie(p.Superficie)}</DatoTexto>
            </Dato>
            <Dato>
              <Ionicons name="pricetag-outline" size={15} color="#6b5b52" />
              <DatoTexto>{p.Estado}</DatoTexto>
            </Dato>
          </Datos>

          {p.Descripcion ? (
            <>
              <Subtitulo>Descripción</Subtitulo>
              <Parrafo>{p.Descripcion}</Parrafo>
            </>
          ) : null}

          <FichaAmbiental
            claseEnergetica={clase}
            panelesSolares={p.PanelesSolares}
            aislamientoTermico={p.AislamientoTermico}
          />

          <Link href={`/visita/${p.IdPropiedad}`} asChild>
            <BotonVisita activeOpacity={0.85}>
              <Ionicons name="calendar-outline" size={18} color="#ffffff" />
              <BotonVisitaTexto>Solicitar una visita</BotonVisitaTexto>
            </BotonVisita>
          </Link>
        </Cuerpo>
      </ScrollView>
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

const Volver = styled.TouchableOpacity`
  padding: 14px 16px;
`;

const Portada = styled.View`
  height: 260px;
  position: relative;
`;

const Foto = styled.Image`
  width: 100%;
  height: 260px;
`;

const VolverFlotante = styled.TouchableOpacity`
  position: absolute;
  top: 14px;
  left: 14px;
  background-color: rgba(26, 18, 9, 0.55);
  width: 38px;
  height: 38px;
  border-radius: 19px;
  align-items: center;
  justify-content: center;
`;

const FavoritoFlotante = styled.View`
  position: absolute;
  top: 14px;
  right: 14px;
`;

const BadgeTipo = styled.View`
  position: absolute;
  bottom: 14px;
  left: 14px;
  background-color: ${({ theme }) => theme.colors.condado};
  padding: 5px 14px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
`;

const BadgeTipoTexto = styled.Text`
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
`;

const Cuerpo = styled.View`
  padding: 20px 18px 40px;
`;

const Fila = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const Precio = styled.Text`
  font-family: serif;
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.condado};
`;

const Direccion = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 5px;
`;

const Ubicacion = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  margin-bottom: 16px;
`;

const UbicacionTexto = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Datos = styled.View`
  flex-direction: row;
  gap: 20px;
  padding-bottom: 4px;
`;

const Dato = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const DatoTexto = styled.Text`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BotonVisita = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.condado};
  padding: 15px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  margin-top: 22px;
`;

const BotonVisitaTexto = styled.Text`
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
`;

const Subtitulo = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: 20px;
  margin-bottom: 6px;
`;

const Parrafo = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 21px;
`;
