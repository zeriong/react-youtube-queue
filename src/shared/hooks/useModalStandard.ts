import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MODAL_BASE_Z_INDEX, useModalContext } from "@/shared/ui/ModalProvider";

interface UseModalStandardParams {
  isShow: boolean;
  setIsShow: (show: boolean) => void;
  draggable: boolean;
  dragOverflow: boolean;
}

export const useModalStandard = ({
  isShow,
  setIsShow,
  draggable,
  dragOverflow,
}: UseModalStandardParams) => {
  const modalId = useId();
  const titleId = `${modalId}-title`;
  const ctx = useModalContext();
  const dialogRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ctx에서 안정적인(stable) 함수 참조 추출 (useCallback(fn, [])로 정의됨)
  const register = ctx?.register;
  const unregister = ctx?.unregister;
  const bringToFront = ctx?.bringToFront;
  const overlayRef = ctx?.overlayRef;

  // --- 드래그 상태 ---

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({
    pointerX: 0,
    pointerY: 0,
    posX: 0,
    posY: 0,
  });
  positionRef.current = position;

  // --- 모달 닫기 ---

  const handleClose = useCallback(() => {
    setIsShow(false);
  }, [setIsShow]);

  // --- Context 모드: 모달 스택 등록/해제 ---

  useEffect(() => {
    if (!register || !unregister) return;
    if (isShow) {
      register(modalId, handleClose);
    } else {
      unregister(modalId);
    }
    return () => unregister(modalId);
  }, [isShow, register, unregister, modalId, handleClose]);

  // --- Standalone 모드: ESC 키 핸들링 (ModalProvider 없이 단독 사용 시) ---

  useEffect(() => {
    if (register || !isShow) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [register, isShow, handleClose]);

  // --- 포커스 관리: 열릴 때 dialog에 포커스, 닫힐 때 이전 포커스 복원 ---

  useEffect(() => {
    if (isShow) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => dialogRef.current?.focus());
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isShow]);

  // --- 모달 닫힐 때 드래그 위치 초기화 ---

  useEffect(() => {
    if (!isShow) {
      setPosition({ x: 0, y: 0 });
      positionRef.current = { x: 0, y: 0 };
    }
  }, [isShow]);

  // --- 포커스 트랩: Tab 키로 dialog 내부에서만 순환 ---

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  // --- 모달 클릭 시 최상위로 이동 (Context 모드) ---

  const handleModalPointerDown = useCallback(() => {
    bringToFront?.(modalId);
  }, [bringToFront, modalId]);

  // --- 드래그 핸들러 ---

  const handleHeaderPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!draggable || e.button !== 0) return;
      // 버튼 등 인터랙티브 요소 클릭 시 드래그 시작하지 않음
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea, [role="button"]'))
        return;

      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartRef.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        posX: positionRef.current.x,
        posY: positionRef.current.y,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [draggable],
  );

  const handleHeaderPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current || !headerRef.current) return;

      const dx = e.clientX - dragStartRef.current.pointerX;
      const dy = e.clientY - dragStartRef.current.pointerY;
      let newX = dragStartRef.current.posX + dx;
      let newY = dragStartRef.current.posY + dy;

      // dragOverflow가 false면 overlay 경계 내부로 제한
      if (!dragOverflow) {
        const rect = headerRef.current.getBoundingClientRect();
        const cur = positionRef.current;
        const naturalLeft = rect.left - cur.x;
        const naturalTop = rect.top - cur.y;

        // overlay 요소의 실제 영역을 드래그 경계로 사용 (없으면 viewport)
        const overlay = overlayRef?.current;
        const bounds = overlay
          ? overlay.getBoundingClientRect()
          : {
              left: 0,
              top: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };

        newX = Math.max(
          bounds.left - naturalLeft,
          Math.min(bounds.left + bounds.width - naturalLeft - rect.width, newX),
        );
        newY = Math.max(
          bounds.top - naturalTop,
          Math.min(bounds.top + bounds.height - naturalTop - rect.height, newY),
        );
      }

      positionRef.current = { x: newX, y: newY };
      setPosition({ x: newX, y: newY });
    },
    [dragOverflow, overlayRef],
  );

  const handleHeaderPointerUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  // --- Standalone 모드: 오버레이 클릭 닫기 ---

  const handleOverlayPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.button === 0 && e.target === e.currentTarget) handleClose();
    },
    [handleClose],
  );

  // --- 파생 값 ---

  const isContextMode = !!ctx;
  const zIndex = ctx ? ctx.getZIndex(modalId) : MODAL_BASE_Z_INDEX + 10;

  const sectionStyle =
    position.x || position.y
      ? { transform: `translate(${position.x}px, ${position.y}px)` }
      : undefined;

  return {
    titleId,
    isContextMode,
    zIndex,
    isDragging,
    sectionStyle,
    // Refs
    dialogRef,
    sectionRef,
    headerRef,
    // Handlers
    handleClose,
    handleKeyDown,
    handleModalPointerDown,
    handleHeaderPointerDown,
    handleHeaderPointerMove,
    handleHeaderPointerUp,
    handleOverlayPointerUp,
  };
};
