import { create } from "zustand";
import type { User } from "@/shared/types";

interface UserStore {
  user: User | null;
  setLogin: (user: User) => void;
  setLogout: () => void;
}

/**
 * @description User store
 */
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setLogin: (user) =>
    set(() => {
      return { user };
    }),
  setLogout: () =>
    set(() => {
      return { user: null };
    }),
}));
