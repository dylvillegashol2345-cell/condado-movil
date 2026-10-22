import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useTema = create(
  persist(
    (set) => ({
      oscuro: false,
      alternar: () => set((estado) => ({ oscuro: !estado.oscuro })),
    }),
    {
      name: "condado-tema",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
