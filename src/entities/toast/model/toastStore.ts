import { create } from "zustand";

interface ToastStore {
  toasts: string[];
  addToast: (message: string) => void;
  removeToast: () => void;
}

/**
 * @description 토스트알림에 대한 상태관리 store
 */
export const useToastsStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message) =>
    set((state) => {
      return { toasts: [...state.toasts, message] };
    }),
  removeToast: () =>
    set((state) => {
      state.toasts.shift();
      return { toasts: [...state.toasts] };
    }),
}));
