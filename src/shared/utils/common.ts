import type { RefObject } from "react";
import { DEFAULT_PLAYLIST } from "@/shared/constants/defaultPlaylist";
import type { Music } from "@/shared/types";

/**
 * @description 매개변수에 진동 이벤트를 일으킬 ref를 넣어주면 된다.
 * 해당 요소는 반드시 position이 등록되어 있어야 하고 진동 css 클래스는 Global.css에 존재한다.
 */
export const vibrate = (targetRef: RefObject<HTMLElement>): void => {
  if (!targetRef.current) return;

  targetRef.current.classList.add("vibrate");
  targetRef.current.onanimationend = () => {
    targetRef.current?.classList.remove("vibrate");
  };
};

/**
 * @description 기본음악 랜덤재생
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

/**
 * @description pathName 마지막 경로
 */
export const lastPathName = (): string => {
  return window.location.pathname.split("/").pop() || "";
};

/**
 * @description JSON 을 활용한 다차원 객체 깊은복사
 */
export const jsonDeepCopy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};
