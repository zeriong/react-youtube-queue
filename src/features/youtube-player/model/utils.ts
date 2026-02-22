import type { RefObject } from "react";
import { DEFAULT_PLAYLIST } from "@/shared/constants/defaultPlaylist";
import type { Music } from "@/shared/types";

/**
 * @description 기본음악 랜덤재생 (셔플)
 */
export const defaultPlayer = (
  shuffleRef: RefObject<number[]>,
  setCurrentListItem: (music: Music) => void,
): void => {
  // 난수 생성
  const randomNum = Math.floor(Math.random() * DEFAULT_PLAYLIST.length);

  // 난수가 이미 배열에 존재하면 재귀하여 재생성
  if (shuffleRef.current?.some((val) => randomNum === val)) {
    defaultPlayer(shuffleRef, setCurrentListItem);
    return;
  }

  // 존재하지 않는 난수를 생성 시 셔플ref에 푸시
  shuffleRef.current?.push(randomNum);

  // 해당 번호의 리스트를 setState
  setCurrentListItem({ link: DEFAULT_PLAYLIST[randomNum] });

  // 셔플ref가 가득 차면 초기화
  if (
    shuffleRef.current &&
    shuffleRef.current.length === DEFAULT_PLAYLIST.length
  ) {
    shuffleRef.current = [];
  }
};
