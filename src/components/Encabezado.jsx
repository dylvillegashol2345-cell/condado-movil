import styled from "styled-components/native";

/* Header de marca de la pantalla principal.
   Recibe por props cuántas propiedades se están mostrando. */

export default function Encabezado({ cantidad }) {
  return (
    <Fondo>
      <Marca>Grupo Condado</Marca>
      <Bajada>Propiedades sustentables en Córdoba</Bajada>
      <Contador>{cantidad} propiedades disponibles</Contador>
    </Fondo>
  );
}

const Fondo = styled.View`
  background-color: ${({ theme }) => theme.colors.condado};
  padding: 28px 20px 24px;
`;

const Marca = styled.Text`
  font-family: serif;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
`;

const Bajada = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.condadoLight};
  margin-top: 4px;
`;

const Contador = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.condado3};
  margin-top: 12px;
  font-weight: 600;
`;
