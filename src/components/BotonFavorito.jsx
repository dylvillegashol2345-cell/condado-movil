import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { useFavoritos } from "../store/favoritos";

/* Corazón para marcar o desmarcar una propiedad como favorita.

   Lee y modifica el store directamente: no recibe ni el estado ni la
   acción por props. Se puede poner en cualquier lugar de la app y
   funciona solo — el mismo botón sirve en la card del catálogo y en el
   detalle.

   El selector (estado) => estado.ids.includes(id) hace que este botón se
   vuelva a dibujar únicamente cuando cambia SU propiedad, no cuando
   cambia cualquier otro favorito. */

export default function BotonFavorito({ id, tamano = 22, oscuro = false }) {
  const esFavorito = useFavoritos((estado) => estado.ids.includes(id));
  const alternar = useFavoritos((estado) => estado.alternar);

  const onPress = (evento) => {
    /* En la web el botón queda dentro del <a> de la card: sin esto, tocar
       el corazón también abriría el detalle. En el celular no hace falta,
       pero no molesta. */
    evento?.preventDefault?.();
    evento?.stopPropagation?.();
    alternar(id);
  };

  return (
    <Boton
      onPress={onPress}
      activeOpacity={0.7}
      oscuro={oscuro}
      accessibilityRole="button"
      accessibilityLabel={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons
        name={esFavorito ? "heart" : "heart-outline"}
        size={tamano}
        color={esFavorito ? "#e0455a" : oscuro ? "#ffffff" : "#6b5b52"}
      />
    </Boton>
  );
}

const Boton = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  align-items: center;
  justify-content: center;
  background-color: ${({ oscuro }) =>
    oscuro ? "rgba(26, 18, 9, 0.55)" : "rgba(255, 255, 255, 0.92)"};
`;
