import type { TokenData } from "@/shared/types";

// localStorage 키
export const SINGLE_MODE_KEY = "singleMode";
export const SINGLE_MODE_PLAYLIST_KEY = "singleModePlayList";
export const SINGLE_MODE_SAVED_LIST_KEY = "singleModeSavedList";
export const SINGLE_MODE_VOLUME_KEY = "singleModeVolume";

// Single Mode 전용 fake admin 토큰
export const SINGLE_MODE_TOKEN: TokenData = {
  id: "single-mode",
  nickName: "Single Player",
  expire: "2099-12-31",
  role: 1,
};
