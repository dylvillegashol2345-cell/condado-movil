import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { IMG_PROPIEDAD_FALLBACK } from "../utils/catalogos";
import { money, superficie as fmtSuperficie } from "../utils/format";
import BotonComparar from "./BotonComparar";
import BotonFavorito from "./BotonFavorito";
import EtiquetaEco from "./EtiquetaEco";

export default function PropiedadCard({
  id,
  imagen,
  tipo,
  precio,
  barrio,
  calle,
  numeracion,
  localidad,
  superficie,
  claseEnergetica,
  panelesSolares,
}) {
  return (
    <Card>
      <Portada>
        <Foto
          source={{ uri: imagen || IMG_PROPIEDAD_FALLBACK }}
          resizeMode="cover"
        />
        <BadgeTipo>
          <BadgeTipoTexto>{tipo}</BadgeTipoTexto>
        </BadgeTipo>
        <BadgeEco>
          <EtiquetaEco clase={claseEnergetica} />
        </BadgeEco>
        <Favorito>
          <BotonFavorito id={id} />
        </Favorito>
      </Portada>

      <Cuerpo>
        <Precio>{money(precio)}</Precio>
        <Titulo>
          {barrio} · {calle} {numeracion}
        </Titulo>

        <Ubicacion>
          <Ionicons name="location-outline" size={13} color="#a0918a" />
          <UbicacionTexto>{localidad}</UbicacionTexto>
        </Ubicacion>

        <Meta>
          <MetaItem>
            <Ionicons name="resize-outline" size={13} color="#6b5b52" />
            <MetaTexto>{fmtSuperficie(superficie)}</MetaTexto>
          </MetaItem>

          {panelesSolares ? (
            <MetaItem>
              <Ionicons name="sunny-outline" size={13} color="#6b5b52" />
              <MetaTexto>Paneles solares</MetaTexto>
            </MetaItem>
          ) : null}
          <BotonComparar id={id} />
        </Meta>
      </Cuerpo>
    </Card>
  );
}

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  overflow: hidden;
  margin-bottom: 16px;
`;

const Portada = styled.View`
  height: 200px;
  position: relative;
`;

const Foto = styled.Image`
  width: 100%;
  height: 200px;
`;

const BadgeTipo = styled.View`
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: ${({ theme }) => theme.colors.condado};
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
`;

const BadgeTipoTexto = styled.Text`
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
`;

const BadgeEco = styled.View`
  position: absolute;
  top: 12px;
  right: 12px;
`;

const Favorito = styled.View`
  position: absolute;
  bottom: 12px;
  right: 12px;
`;

const Cuerpo = styled.View`
  padding: 16px 18px 18px;
`;

const Precio = styled.Text`
  font-family: serif;
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.condado};
  margin-bottom: 2px;
`;

const Titulo = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const Ubicacion = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
`;

const UbicacionTexto = styled.Text`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Meta = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
`;

const MetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const MetaTexto = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
