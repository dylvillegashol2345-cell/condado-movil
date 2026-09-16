import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/* Store de favoritos — estado global con Zustand.

   create() devuelve un hook. Cualquier pantalla o componente que lo use
   ve el mismo estado y se vuelve a dibujar cuando cambia, sin que nadie
   le pase props. Eso es lo que resuelve Zustand: el catálogo, el detalle
   y la pantalla de favoritos comparten esta lista sin conocerse entre sí.

   Se guarda solo la lista de ids, no las propiedades enteras. Los datos
   viven en el caché de TanStack Query; acá solo interesa cuáles marcó el
   usuario. Así un favorito nunca queda con datos viejos.

   persist() envuelve el store para que la lista se escriba en el
   almacenamiento del celular y sobreviva al cierre de la app. Sin esto,
   los favoritos se perderían cada vez. */

export const useFavoritos = create(
  persist(
    (set) => ({
      ids: [],

      /* Agrega o quita según esté o no. Nunca modifica el arreglo
         existente: filter y spread devuelven uno nuevo. Si se hiciera
         ids.push(id), React no detectaría el cambio porque el arreglo
         seguiría siendo el mismo objeto — es la regla de inmutabilidad
         de la Clase 2. */
      alternar: (id) =>
        set((estado) => ({
          ids: estado.ids.includes(id)
            ? estado.ids.filter((x) => x !== id)
            : [...estado.ids, id],
        })),

      limpiar: () => set({ ids: [] }),
    }),
    {
      name: "condado-favoritos",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
