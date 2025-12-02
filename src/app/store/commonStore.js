import {create} from "zustand";
import {TOKEN_NAME} from "../../shared/constants";

/** Token store */
export const useTokenStore = create((setState) => ({
    token: null,
    setToken: (getToken) => setState(() => {
        return { token: getToken };
    }),
    deleteToken: () => setState(() => {
        localStorage.removeItem(TOKEN_NAME);
        return { token: null };
    })
}));