import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { calcularBonificacion } from "../utils/reglas";
import EtiquetaEco from "./EtiquetaEco";

/* Ficha del desempeño ambiental de una propiedad.

   Es el diferencial del producto: el dato que ningún aviso inmobiliario
   muestra. Todo sale de las reglas RN1 y RN2 del sistema Grupo Condado,
   calculadas acá y no leídas de la base. */

function Atributo({ icono, texto, presente }) {
  return (
    <Item>
      <Ionicons
        name={presente ? "checkmark-circle" : "close-circle-outline"}
        size={17}
        color={presente ? "#2e7d32" : "#a0918a"}
      />
      <Ionicons name={icono} size={15} color="#6b5b52" />
      <ItemTexto presente={presente}>{texto}</ItemTexto>
    </Item>
  );
}

export default function FichaAmbiental({ claseEnergetica, panelesSolares, aislamientoTermico }) {
  const bonificacion = calcularBonificacion(claseEnergetica);

  return (
    <Caja>
      <Cabecera>
        <Titulo>Desempeño ambiental</Titulo>
        <EtiquetaEco clase={claseEnergetica} />
      </Cabecera>

      <Atributo icono="sunny-outline" texto="Paneles solares" presente={panelesSolares} />
      <Atributo icono="thermometer-outline" texto="Aislación térmica" presente={aislamientoTermico} />

      {bonificacion > 0 ? (
        <Bonificacion>
          <Ionicons name="leaf" size={15} color="#2e7d32" />
          <BonificacionTexto>Accede a una bonificación del {bonificacion}%</BonificacionTexto>
        </Bonificacion>
      ) : (
        <Nota>Solo las propiedades clase A acceden a bonificación.</Nota>
      )}
    </Caja>
  );
}

const Caja = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px 18px;
  margin-top: 18px;
`;

const Cabecera = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const Titulo = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Item = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 7px;
  margin-bottom: 9px;
`;

const ItemTexto = styled.Text`
  font-size: 13.5px;
  color: ${({ theme, presente }) =>
    presente ? theme.colors.textPrimary : theme.colors.textMuted};
`;

const Bonificacion = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 7px;
  background-color: #eaf3ea;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  margin-top: 6px;
`;

const BonificacionTexto = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #2e7d32;
  flex: 1;
`;

const Nota = styled.Text`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 6px;
  line-height: 18px;
`;
