import {create} from "zustand";

/** User store */
export const useUserStore = create((setState) => ({
    user: null,
    setLogin: (user) => setState(() => {
        return { user };
    }),
    setLogout: () => setState(() => {
        return { user: null };
    })
}));
