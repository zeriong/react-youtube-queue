import type { Music, TokenData } from "@/shared/types";

/** 해당 아이템을 수정할 수 있는지 판단 (본인 소유 + 저장 리스트가 아닌 경우) */
export const canEditItem = (
  token: TokenData | null,
  item: Music,
  isSavedList?: boolean,
): boolean => {
  if (isSavedList) return false;
  return item.nickName === token?.nickName;
};

/** 해당 아이템을 삭제할 수 있는지 판단 (어드민 또는 본인 소유) */
export const canDeleteItem = (
  token: TokenData | null,
  item: Music,
  isSavedList?: boolean,
): boolean => {
  if (token?.role === 1) return true;
  if (!isSavedList && item.nickName === token?.nickName) return true;
  return false;
};
