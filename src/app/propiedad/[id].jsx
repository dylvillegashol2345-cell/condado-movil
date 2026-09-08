import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

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

   Se recibe solo el id y se vuelve a pedir la propiedad a la API, en vez
   de arrastrar el objeto entero por params. Así el detalle siempre
   muestra el dato fresco, y funciona aunque se entre por un link directo
   sin pasar por el catálogo. */

export default function DetallePropiedad() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [propiedad, setPropiedad] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      setPropiedad(await obtenerPropiedad(id));
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [id]);

  const volver = () => (router.canGoBack() ? router.back() : router.replace("/"));

  if (cargando) {
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
        <ErrorCarga mensaje={error} onReintentar={cargar} />
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
