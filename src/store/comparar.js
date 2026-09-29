import { create } from "zustand";

export const MAXIMO = 3;

export const useComparar = create((set, get) => ({
  ids: [],

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
