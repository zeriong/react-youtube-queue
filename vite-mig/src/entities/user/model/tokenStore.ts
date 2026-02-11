import { create } from "zustand";
import { TOKEN_NAME } from "@/shared/constants";
import { decipher } from "@/shared/lib/crypto";
import type { TokenData } from "@/shared/types";

interface TokenStore {
	token: TokenData | null;
	setToken: (getToken: TokenData | null) => void;
	deleteToken: () => void;
}

/**
 * @description localStorage에서 동기적으로 토큰을 읽어 초기값으로 설정
 * beforeLoad 라우트 가드가 useEffect보다 먼저 실행되기 때문에 동기 초기화 필요
 */
const getInitialToken = (): TokenData | null => {
	if (typeof window === "undefined") return null;
	try {
		const stored = localStorage.getItem(TOKEN_NAME);
		if (stored) {
			const deciphered = decipher(stored);
			return JSON.parse(deciphered);
		}
	} catch {
		// 복호화 실패 시 null 반환
	}
	return null;
};

/**
 * @description Token store
 */
export const useTokenStore = create<TokenStore>((set) => ({
	token: getInitialToken(),
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
