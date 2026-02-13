import { create } from "zustand";
import { SINGLE_MODE_KEY } from "@/shared/constants/single-mode";

interface ModeStore {
  isSingleMode: boolean;
  setIsSingleMode: (payload: boolean) => void;
}

const getInitialMode = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SINGLE_MODE_KEY) === "true";
};

export const useModeStore = create<ModeStore>((set) => ({
  isSingleMode: getInitialMode(),
  setIsSingleMode: (payload) => {
    if (payload) {
      localStorage.setItem(SINGLE_MODE_KEY, "true");
    } else {
      localStorage.removeItem(SINGLE_MODE_KEY);
    }
    set({ isSingleMode: payload });
  },
}));
