import {add, format} from "date-fns";
import {TOKEN_NAME} from "../constants";

/**@desc 로컬스토리지에서 로그인 유지 정보를 확인 후 있다면 자동 연장 후 로그인 유지
 * @return { null || { expire: string, nickName: string } }*/
export const getAuthStorage = () => {
    const getToken = localStorage.getItem(TOKEN_NAME);
    // 토큰이 존재한다면
    if (getToken) {
        const token = JSON.parse(getToken);
        const getNow = format(Date.now(), "yyyyMMdd");
        const getExpire = format(token.expire, "yyyyMMdd");

        // 유효기간이 지났다면 null
        if (getNow > getExpire) {
            localStorage.removeItem(TOKEN_NAME);
            return null;
        }

        // 지나지 않았다면 자동 연장
        // token.expire = format(add(Date.now(), {months: 1}), "yyyy-MM-dd");
        token.expire = format(add(new Date(token.expire), {months: 1}), "yyyy-MM-dd");
        localStorage.setItem(TOKEN_NAME, JSON.stringify(token));

        return token;
    }
    // 토큰이 존재하지 않는다면 null 반환
    return null;
}

/**@desc 로컬스토리지에 로그인 유지 정보 등록 */
export const setAuthStorage = (nickName) => {
    // 로컬스토리지에 저장할 토큰 생성
    const expire = format(add(Date.now(), {months: 1}), "yyyy-MM-dd");
    const token = JSON.stringify({ nickName, expire });
    // 로컬스토리지에 저장
    localStorage.setItem(TOKEN_NAME, token);
}