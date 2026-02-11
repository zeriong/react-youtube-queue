import { create } from "zustand";
import { TOKEN_NAME } from "@/shared/constants";

interface TokenStore {
  token: string | null;
  setToken: (getToken: string) => void;
  deleteToken: () => void;
}

/**
 * @description Token store
 */
export const useTokenStore = create<TokenStore>((set) => ({
  token: null,
  setToken: (getToken) =>
    set(() => {
      return { token: getToken };
    }),
  deleteToken: () =>
    set(() => {
      localStorage.removeItem(TOKEN_NAME);
      return { token: null };
    }),
}));
