import {add, format} from "date-fns";
import {TOKEN_NAME} from "../constants";
import {deleteUser, getFireStoreData} from "./firebase";
import CryptoJS from "crypto-js";
import {DEFAULT_PLAYLIST} from "../constants/defaultPlaylist";

/** 암호화 유틸 */
// 대칭형 키
const cryptoKey = process.env.REACT_APP_CRYPTO_KEY;
// 암호화 메서드
export const cipher = (token) => CryptoJS.AES.encrypt(token, cryptoKey).toString();
// 복호화 메서드
export const decipher = (token) => CryptoJS.AES.decrypt(token, cryptoKey).toString(CryptoJS.enc.Utf8);


/**@desc 로컬스토리지에서 로그인 유지 정보를 확인 후 있다면 자동 연장 후 로그인 유지
 * @return { null || { expire: string, nickName: string } }*/
export const getAuthStorage = async () => {
    const getToken = localStorage.getItem(TOKEN_NAME);
    // 토큰이 존재한다면
    if (getToken) {
        const getDecipher = decipher(getToken); // 토큰 복호화
        const token = JSON.parse(getDecipher); // 객체화

        // 토큰이 존재하고 파이어베이스에도 유저가 존재하는지 validate
        const users = await getFireStoreData("users");
        if (!users.some(user => token.nickName === user.nickName)) {
            localStorage.removeItem(TOKEN_NAME)
            return alert("존재하지 않는 유저입니다.\n다시 로그인해주세요.");
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
        const renewExpire = format(add(new Date(token.expire), {months: 1}), "yyyy-MM-dd");

        // 갱신해 줄 유효기간이 현재 유효기간과 같은 경우 setItem 하지 않음
        if (getExpire === Number(format(add(Date.now(), {months: 1}), "yyyyMMdd"))) {
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
}

/**@desc 로컬스토리지에 로그인 유지 정보 등록 */
export const setAuthStorage = (userData) => {
    const stringifyToken = JSON.stringify(userData);
    const cipherToken = cipher(stringifyToken);
    // 로컬스토리지에 저장
    localStorage.setItem(TOKEN_NAME, cipherToken);
}

/**@desc 매개변수에 진동 이벤트를 일으킬 ref를 넣어주면 된다. 해당 요소는 반드시 position이 등록되어 있어야 하고 진동 css 클래스는 Global.css에 존재한다. */
export const vibrate = (targetRef) => {
    targetRef.current.classList.add("vibrate");
    targetRef.current.onanimationend = () => targetRef.current.classList.remove("vibrate");
}

/**
 * @description 문자를 byte 폼으로 계산하여 한글 3~20자, 영문 5~40자 까지 검증하여 true || false 를 반환
 * @param { string } text
 * @param { number } maxByte
 * @param { number } minByte
 * @returns {{ byte: number, isValidate: boolean }}
 */
export function validateByteFormLength(text, maxByte = 40, minByte) {
    let byte = 0;
    let isValidate = true;

    // 글자를 순회하며 byte 단위로 검사
    for (let k = 0; k < text.length; k++) {
        // 순회중 현재 글자의 char code
        const char = text.charCodeAt(k);

        // char code로 한글 식별
        if (char >= 0xac00 && char <= 0xd7af) byte += 2;
        else byte++;

        // maxByte를 넘기면 반복문을 빠져나옴
        if (byte > maxByte) {
            isValidate = false;
            break;
        }
    }

    // 최소바이트(기본값: 4byte) 이하일 때 false 반환
    if ( minByte && (byte < minByte) ) isValidate = false;

    return {isValidate, byte};
}

export const defaultPlayer = (shuffleRef, setCurrentListItem) => {
    // 난수 생성
    const randomNum = Math.floor(Math.random() * DEFAULT_PLAYLIST.length);
    // 난수가 이미 배열에 존재하면 재귀하여 재생성
    if (shuffleRef.current.some(val => randomNum === val)) return defaultPlayer(shuffleRef, setCurrentListItem);
    // 존재하지 않는 난수를 생성 시 셔플ref에 푸시
    shuffleRef.current?.push(randomNum);
    // 해당 번호의 리스트를 setState
    setCurrentListItem(prev => ({ ...prev, link: DEFAULT_PLAYLIST[randomNum] }));
    // 셔플ref가 가득 차면 초기화
    if (shuffleRef.current.length === DEFAULT_PLAYLIST.length) shuffleRef.current = [];
}