import CryptoJS from "crypto-js";

// 대칭형 키
const cryptoKey = process.env.REACT_APP_CRYPTO_KEY;

// 암호화 메서드
export const cipher = (token) => CryptoJS.AES.encrypt(token, cryptoKey).toString();

// 복호화 메서드
export const decipher = (token) => CryptoJS.AES.decrypt(token, cryptoKey).toString(CryptoJS.enc.Utf8);