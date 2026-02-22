import { useEffect, useRef, useState } from "react";
import { useToastsStore } from "./toastStore";

/**
 * @description 토스트 표시 순서를 관리하는 비즈니스 로직 훅
 * - 토스트 큐에서 하나씩 꺼내어 표시/숨김 애니메이션 제어
 * - 재귀 타이머로 다음 토스트 자동 진행
 */
export const useToastSequencer = () => {
  const isRunRef = useRef(false);
  const [isShow, setIsShow] = useState(false);
  const toastStore = useToastsStore();

  const show = () => {
    if (useToastsStore.getState().toasts.length > 0) {
      isRunRef.current = true;
      setIsShow(true);

      // 팝업 알람이기 때문에 일정 시간 후 알람을 다시 숨김
      setTimeout(() => {
        setIsShow(false);

        // 애니메이션이 종료되는 타이밍에 실행
        setTimeout(() => {
          toastStore.removeToast();
          show();
        }, 300);
      }, 2500);
    } else {
      isRunRef.current = false;
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: 원본과 동일하게 toasts 변경 시에만 실행
  useEffect(() => {
    if (!isRunRef.current) show();
  }, [toastStore.toasts]);

  const currentToast = toastStore.toasts[0] ?? null;

  return { currentToast, isShow };
};
