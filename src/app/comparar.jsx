import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import ErrorCarga from "../components/ErrorCarga";
import EtiquetaEco from "../components/EtiquetaEco";
import { obtenerPropiedades } from "../services/propiedades";
import { useComparar } from "../store/comparar";
import { IMG_PROPIEDAD_FALLBACK, localidadLabel, tipoLabel } from "../utils/catalogos";
import { money } from "../utils/format";
import { normalizarImagen } from "../utils/imagenes";
import { calcularBonificacion, calcularClaseEnergetica } from "../utils/reglas";

/* Comparación de hasta 3 propiedades, lado a lado.

   Todo es local: las propiedades salen del caché de TanStack Query y los
   ids del store de comparación. No se pide nada a la API.

   Cada fila resalta el mejor valor. "Mejor" depende de la fila: menor
   precio, mayor superficie, mejor clase energética. Si todas empatan, no
   se resalta nada — resaltar un empate confunde más de lo que ayuda.

   Precio por m² no viene en los datos: se calcula acá. Es la métrica que
   permite comparar una casa de 240 m² con un departamento de 62. */

const clase = (p) => calcularClaseEnergetica(p.PanelesSolares, p.AislamientoTermico);
const rangoClase = { A: 3, B: 2, C: 1 };

/* Definición de las filas: qué mostrar, cómo se compara y qué gana.
   Definido fuera del componente: no cambia nunca. */
const FILAS = [
  {
    clave: "precio",
    etiqueta: "Precio",
    valor: (p) => `${money(p.Precio)} ${p.Moneda || ""}`.trim(),
    numero: (p) => Number(p.Precio),
    gana: "menor",
  },
  {
    clave: "superficie",
    etiqueta: "Superficie",
    valor: (p) => `${Number(p.Superficie)} m²`,
    numero: (p) => Number(p.Superficie),
    gana: "mayor",
  },
  {
    clave: "m2",
    etiqueta: "Precio por m²",
    valor: (p) => (Number(p.Superficie) > 0 ? money(Number(p.Precio) / Number(p.Superficie)) : "—"),
    numero: (p) => (Number(p.Superficie) > 0 ? Number(p.Precio) / Number(p.Superficie) : null),
    gana: "menor",
  },
  { clave: "tipo", etiqueta: "Tipo", valor: (p) => tipoLabel(p.IdTipo) },
  { clave: "localidad", etiqueta: "Localidad", valor: (p) => localidadLabel(p.IdLocalidad) },
  {
    clave: "clase",
    etiqueta: "Clase energética",
    valor: (p) => clase(p),
    numero: (p) => rangoClase[clase(p)],
    gana: "mayor",
    etiquetaEco: true,
  },
  {
    clave: "paneles",
    etiqueta: "Paneles solares",
    valor: (p) => (p.PanelesSolares ? "Sí" : "No"),
    numero: (p) => (p.PanelesSolares ? 1 : 0),
    gana: "mayor",
  },
  {
    clave: "aislacion",
    etiqueta: "Aislación térmica",
    valor: (p) => (p.AislamientoTermico ? "Sí" : "No"),
    numero: (p) => (p.AislamientoTermico ? 1 : 0),
    gana: "mayor",
  },
  {
    clave: "bonificacion",
    etiqueta: "Bonificación eco",
    valor: (p) => `${calcularBonificacion(clase(p))}%`,
    numero: (p) => calcularBonificacion(clase(p)),
    gana: "mayor",
  },
  { clave: "estado", etiqueta: "Estado", valor: (p) => p.Estado || "—" },
];

/* Devuelve, para una fila, qué índices de columna tienen el mejor valor.
   Vacío si la fila no se compara o si todas empatan. */
function ganadoras(fila, propiedades) {
  if (!fila.numero) return [];
  const valores = propiedades.map(fila.numero);
  if (valores.some((v) => v === null || Number.isNaN(v))) return [];
  const mejor = fila.gana === "menor" ? Math.min(...valores) : Math.max(...valores);
  const indices = valores.map((v, i) => (v === mejor ? i : -1)).filter((i) => i >= 0);
  return indices.length === valores.length ? [] : indices;
}

export default function Comparar() {
  const router = useRouter();
  const ids = useComparar((estado) => estado.ids);
  const quitar = useComparar((estado) => estado.quitar);

  const { data: propiedades = [], isLoading, error, refetch } = useQuery({
    queryKey: ["propiedades"],
    queryFn: obtenerPropiedades,
  });

  const volver = () => (router.canGoBack() ? router.back() : router.replace("/"));

  const elegidas = ids.map((id) => propiedades.find((p) => p.IdPropiedad === id)).filter(Boolean);

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
        <ErrorCarga mensaje={error.message} onReintentar={refetch} />
      </Pantalla>
    );
  }

  return (
    <Pantalla edges={["top"]}>
      <Barra>
        <Volver onPress={volver} activeOpacity={0.7} accessibilityLabel="Volver">
          <Ionicons name="arrow-back" size={22} color="#1a1209" />
        </Volver>
        <Titulo>Comparar</Titulo>
        <Espacio />
      </Barra>

      {elegidas.length < 2 ? (
        <Vacio>
          <Ionicons name="git-compare-outline" size={44} color="#c4705f" />
          <VacioTitulo>Elegí al menos dos propiedades</VacioTitulo>
          <VacioDetalle>
            Desde el catálogo, tocá "Comparar" en las que quieras poner lado a lado. Hasta tres.
          </VacioDetalle>
          <Link href="/" asChild>
            <Boton activeOpacity={0.85}>
              <BotonTexto>Ir al catálogo</BotonTexto>
            </Boton>
          </Link>
        </Vacio>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Cabecera: una columna por propiedad, con foto, dirección y quitar */}
          <Columnas>
            {elegidas.map((p) => (
              <Columna key={p.IdPropiedad}>
                <Foto source={{ uri: normalizarImagen(p.Imagen) || IMG_PROPIEDAD_FALLBACK }} resizeMode="cover" />
                <Quitar
                  onPress={() => quitar(p.IdPropiedad)}
                  activeOpacity={0.8}
                  accessibilityLabel={`Quitar ${p.Barrio} de la comparación`}
                >
                  <Ionicons name="close" size={14} color="#ffffff" />
                </Quitar>
                <Link href={`/propiedad/${p.IdPropiedad}`} asChild>
                  <Direccion activeOpacity={0.7}>
                    <DireccionTexto numberOfLines={2}>
                      {p.Barrio} · {p.Calle} {p.Numeracion}
                    </DireccionTexto>
                  </Direccion>
                </Link>
              </Columna>
            ))}
          </Columnas>

          {/* Filas de comparación */}
          {FILAS.map((fila) => {
            const mejores = ganadoras(fila, elegidas);
            return (
              <Fila key={fila.clave}>
                <FilaEtiqueta>{fila.etiqueta}</FilaEtiqueta>
                <Celdas>
                  {elegidas.map((p, i) => {
                    const gana = mejores.includes(i);
                    return (
                      <Celda key={p.IdPropiedad} gana={gana}>
                        {fila.etiquetaEco ? (
                          <EtiquetaEco clase={fila.valor(p)} />
                        ) : (
                          <CeldaTexto gana={gana}>{fila.valor(p)}</CeldaTexto>
                        )}
                      </Celda>
                    );
                  })}
                </Celdas>
              </Fila>
            );
          })}

          <Leyenda>
            <Ionicons name="checkmark-circle" size={14} color="#2e7d32" />
            <LeyendaTexto>En verde, el mejor valor de cada fila.</LeyendaTexto>
          </Leyenda>
        </ScrollView>
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
  padding: 10px 8px 6px 4px;
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

const Espacio = styled.View`
  width: 46px;
`;

const Centrado = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Columnas = styled.View`
  flex-direction: row;
  gap: 8px;
  padding: 8px 12px 14px;
`;

const Columna = styled.View`
  flex: 1;
  position: relative;
`;

const Foto = styled.Image`
  width: 100%;
  height: 90px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const Quitar = styled.TouchableOpacity`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: rgba(26, 18, 9, 0.65);
  align-items: center;
  justify-content: center;
`;

const Direccion = styled.TouchableOpacity`
  padding-top: 6px;
`;

const DireccionTexto = styled.Text`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Fila = styled.View`
  padding: 0 12px 12px;
`;

const FilaEtiqueta = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 5px;
`;

const Celdas = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const Celda = styled.View`
  flex: 1;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  padding: 8px 6px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ gana }) => (gana ? "#2e7d32" : "#e8e0db")};
  background-color: ${({ gana }) => (gana ? "#eaf3ea" : "#ffffff")};
`;

const CeldaTexto = styled.Text`
  font-size: 13px;
  font-weight: ${({ gana }) => (gana ? "700" : "500")};
  color: ${({ gana, theme }) => (gana ? "#2e7d32" : theme.colors.textPrimary)};
  text-align: center;
`;

const Leyenda = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 6px;
`;

const LeyendaTexto = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Vacio = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px;
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
