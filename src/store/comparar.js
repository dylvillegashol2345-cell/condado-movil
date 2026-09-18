import { create } from "zustand";

/* Store de comparación — segundo store de Zustand de la app.

   A diferencia de favoritos, no se persiste: una comparación es algo que
   se arma y se mira en el momento, no una lista que uno quiere conservar.
   Al cerrar la app, se vacía. Por eso no hay persist() acá.

   Tope de 3: en una pantalla de celular más columnas no se leen. */

export const MAXIMO = 3;

export const useComparar = create((set, get) => ({
  ids: [],

  /* Agrega si hay lugar, quita si ya estaba. Devuelve false si no se
     pudo agregar por el tope, para que la interfaz avise. */
  alternar: (id) => {
    const { ids } = get();
    if (ids.includes(id)) {
      set({ ids: ids.filter((x) => x !== id) });
      return true;
    }
    if (ids.length >= MAXIMO) return false;
    set({ ids: [...ids, id] });
    return true;
  },

  quitar: (id) => set((estado) => ({ ids: estado.ids.filter((x) => x !== id) })),

  limpiar: () => set({ ids: [] }),
}));
