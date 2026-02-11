import { add, format } from "date-fns";
import { TOKEN_NAME } from "@/shared/constants";
import { getFireStoreData, deleteUser } from "@/shared/lib/firebase";
import { cipher, decipher } from "@/shared/lib/crypto";
import type { TokenData, User } from "@/shared/types";

/**
 * @description 로컬스토리지에서 로그인 유지 정보를 확인 후 있다면 자동 연장 후 로그인 유지
 * @returns null 또는 TokenData
 */
export const getAuthStorage = async (): Promise<TokenData | null> => {
  const getToken = localStorage.getItem(TOKEN_NAME);

  // 토큰이 존재한다면
  if (getToken) {
    const getDecipher = decipher(getToken); // 토큰 복호화
    const token: TokenData = JSON.parse(getDecipher); // 객체화

    // 토큰이 존재하고 파이어베이스에도 유저가 존재하는지 validate
    const users = await getFireStoreData<User>("users");
    if (!users.some((user) => token.nickName === user.nickName)) {
      localStorage.removeItem(TOKEN_NAME);
      alert("존재하지 않는 유저입니다.\n다시 로그인해주세요.");
      return null;
    }

    const getNow = Number(format(Date.now(), "yyyyMMdd")); // 비교를 위해 이어붙인 숫자로 변환
    const getExpire = Number(format(token.expire, "yyyyMMdd")); // 비교를 위해 이어붙인 숫자로 변환

    // 유효기간이 지났다면
    if (getNow > getExpire) {
      // 유저데이터가 fireStore에 존재한다면 유저데이터 삭제
      await deleteUser(token.id);
      return null;
    }

    // 갱신할 유효기간
    const renewExpire = format(
      add(new Date(token.expire), { months: 1 }),
      "yyyy-MM-dd"
    );

    // 갱신해 줄 유효기간이 현재 유효기간과 같은 경우 setItem 하지 않음
    if (getExpire === Number(format(add(Date.now(), { months: 1 }), "yyyyMMdd"))) {
      return token;
    }

    // 유효기간을 갱신해 줄 필요가 있을 때 갱신
    token.expire = renewExpire;

    const stringifyToken = JSON.stringify(token); // 문자열로 변환
    const cipherToken = cipher(stringifyToken); // 암호화

    // 암호화 된 토큰을 로컬스토리지에 저장
    localStorage.setItem(TOKEN_NAME, cipherToken);

    return token;
  }

  // 토큰이 존재하지 않는다면 null 반환
  return null;
};

/**
 * @description 로컬스토리지에 로그인 유지 정보 등록
 */
export const setAuthStorage = (userData: TokenData): void => {
  const stringifyToken = JSON.stringify(userData);
  const cipherToken = cipher(stringifyToken);
  // 로컬스토리지에 저장
  localStorage.setItem(TOKEN_NAME, cipherToken);
};
