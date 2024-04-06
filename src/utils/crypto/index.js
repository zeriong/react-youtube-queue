const crypto = require("crypto");
// 대칭형 키
const cryptoKey = process.env.REACT_APP_CRYPTO_KEY;

// 암호화 메서드
export const cipher = (token) => {
    const encrypt = crypto.createCipher('des', cryptoKey) // des알고리즘과 키를 설정
    const encryptResult = encrypt.update(token, 'utf8', 'base64') // 암호화
        + encrypt.final('base64') // 인코딩

    return encryptResult;
}

// 복호화 메서드
export const decipher = (token) => {
    const decode = crypto.createDecipher('des', cryptoKey)
    const decodeResult = decode.update(token, 'base64', 'utf8') // 암호화된 문자열, 암호화 했던 인코딩 종류, 복호화 할 인코딩 종류 설정
        + decode.final('utf8') // 복호화 결과의 인코딩

    return decodeResult;
}