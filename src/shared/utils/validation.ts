import type { ValidationResult } from "@/shared/types";

/**
 * @description 문자를 byte 폼으로 계산하여 한글 3~20자, 영문 5~40자 까지 검증하여 true || false 를 반환
 * @param text 검증할 텍스트
 * @param maxByte 최대 바이트 (기본값: 40)
 * @param minByte 최소 바이트
 */
export function validateByteFormLength(
  text: string,
  maxByte = 40,
  minByte?: number,
): ValidationResult {
  let byte = 0;
  let isValidate = true;

  // 글자를 순회하며 byte 단위로 검사
  for (let k = 0; k < text.length; k++) {
    // 순회중 현재 글자의 char code
    const char = text.charCodeAt(k);

    // char code로 한글 식별
    if (char >= 0xac00 && char <= 0xd7af) {
      byte += 2;
    } else {
      byte++;
    }

    // maxByte를 넘기면 반복문을 빠져나옴
    if (byte > maxByte) {
      isValidate = false;
      break;
    }
  }

  // 최소바이트(기본값: 4byte) 이하일 때 false 반환
  if (minByte && byte < minByte) {
    isValidate = false;
  }

  return { isValidate, byte };
}
