import styled from "styled-components/native";

function colorDeClase(theme, clase) {
  if (clase === "A") return theme.colors.ecoA;
  if (clase === "B") return theme.colors.ecoB;
  return theme.colors.ecoC;
}

export default function EtiquetaEco({ clase }) {
  return (
    <Pill clase={clase}>
      <Texto clase={clase}>Clase {clase}</Texto>
    </Pill>
  );
}

const Pill = styled.View`
  background-color: ${({ theme, clase }) => colorDeClase(theme, clase)};
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.pill}px;
`;

const Texto = styled.Text`
  color: ${({ clase }) => (clase === "A" ? "#ffffff" : "#173b17")};
  font-size: 11px;
  font-weight: 700;
`;
