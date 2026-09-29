import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useFavoritos = create(
  persist(
    (set) => ({
      ids: [],

      alternar: (id) =>
        set((estado) => ({
          ids: estado.ids.includes(id)
            ? estado.ids.filter((x) => x !== id)
            : [...estado.ids, id],
        })),

      limpiar: () => set({ ids: [] }),
    }),
    {
      // persist guarda los favoritos en el celular
      name: "condado-favoritos",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
