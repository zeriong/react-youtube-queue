import CryptoJS from "crypto-js";

// 대칭형 키
const cryptoKey = import.meta.env.VITE_CRYPTO_KEY || "";

/**
 * @description 암호화 메서드
 */
export const cipher = (token: string): string => {
  return CryptoJS.AES.encrypt(token, cryptoKey).toString();
};

/**
 * @description 복호화 메서드
 */
export const decipher = (token: string): string => {
  return CryptoJS.AES.decrypt(token, cryptoKey).toString(CryptoJS.enc.Utf8);
};
