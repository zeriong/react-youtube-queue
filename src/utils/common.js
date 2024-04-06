import {add, format} from "date-fns";
import {TOKEN_NAME} from "../constants";
import {cipher, decipher} from "./crypto";

/**@desc 로컬스토리지에서 로그인 유지 정보를 확인 후 있다면 자동 연장 후 로그인 유지
 * @return { null || { expire: string, nickName: string } }*/
export const getAuthStorage = () => {
    const getToken = localStorage.getItem(TOKEN_NAME);
    // 토큰이 존재한다면
    if (getToken) {
        const getDecipher = decipher(getToken); // 토큰 복호화
        const token = JSON.parse(getDecipher); // 객체화
        const getNow = Number(format(Date.now(), "yyyyMMdd")); // 비교를 위해 이어붙인 숫자로 변환
        const getExpire = Number(format(token.expire, "yyyyMMdd")); // 비교를 위해 이어붙인 숫자로 변환

        // 유효기간이 지났다면 null
        if (getNow > getExpire) {
            localStorage.removeItem(TOKEN_NAME);
            return null;
        }

        // 유효기간이 지나지 않았다면 자동 연장
        const renewExpire = format(add(new Date(token.expire), {months: 1}), "yyyy-MM-dd");

        // 갱신해 줄 유효기간이 현재 유효기간과 같은 경우 setItem 하지 않음
        if (renewExpire === token.expire) return token;

        // 유효기간을 갱신해 줄 필요가 있을 때
        token.expire = renewExpire;

        const stringifyToken = JSON.stringify(token); // 문자열로 변환
        const cipherToken = cipher(stringifyToken); // 암호화

        // 암호화 된 토큰을 로컬스토리지에 저장
        localStorage.setItem(TOKEN_NAME, cipherToken);

        return token;
    }
    // 토큰이 존재하지 않는다면 null 반환
    return null;
}

/**@desc 로컬스토리지에 로그인 유지 정보 등록 */
export const setAuthStorage = (nickName, isAdmin) => {
    // 로컬스토리지에 저장할 토큰 생성
    const expire = format(add(Date.now(), {months: 1}), "yyyy-MM-dd");
    const role = isAdmin ? 1 : 0
    const stringifyToken = JSON.stringify({ nickName, expire, role });
    const cipherToken = cipher(stringifyToken);
    // 로컬스토리지에 저장
    localStorage.setItem(TOKEN_NAME, cipherToken);
}