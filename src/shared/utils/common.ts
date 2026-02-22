import type { RefObject } from "react";

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

/**
 * @description 이벤트 전파 방지
 */
export const stopPropagation = (
  e:
    | React.MouseEvent<HTMLDivElement | HTMLElement>
    | React.KeyboardEvent<HTMLDivElement | HTMLElement>
    | React.FocusEvent<HTMLDivElement | HTMLElement>,
) => {
  e.stopPropagation();
};
