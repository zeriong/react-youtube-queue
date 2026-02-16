import { type ReactNode, useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./icons";
import { MODAL_BASE_Z_INDEX, useModalContext } from "./ModalProvider";

interface ModalStandardProps {
  isShow: boolean;
  setIsShow: (show: boolean) => void;
  headerTitle: ReactNode;
  contentArea?: ReactNode;
  isFit?: boolean;
}

export const ModalStandard = ({
  isShow,
  setIsShow,
  headerTitle,
  contentArea,
  isFit,
}: ModalStandardProps) => {
  const modalId = useId();
  const titleId = `${modalId}-title`;
  const ctx = useModalContext();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    setIsShow(false);
  }, [setIsShow]);

  // Context 모드: 모달 스택 등록/해제
  useEffect(() => {
    if (!ctx) return;
    if (isShow) {
      ctx.register(modalId, handleClose);
    } else {
      ctx.unregister(modalId);
    }
    return () => ctx.unregister(modalId);
  }, [isShow, ctx, modalId, handleClose]);

  // Standalone 모드: ESC 키 핸들링 (ModalProvider 없이 단독 사용 시)
  useEffect(() => {
    if (ctx || !isShow) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [ctx, isShow, handleClose]);

  // 포커스 관리: 열릴 때 dialog에 포커스, 닫힐 때 이전 포커스 복원
  useEffect(() => {
    if (isShow) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => dialogRef.current?.focus());
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isShow]);

  // 포커스 트랩: Tab 키로 dialog 내부에서만 순환
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

  // 모달 클릭 시 최상위로 이동 (Context 모드)
  const handleModalPointerDown = useCallback(() => {
    ctx?.bringToFront(modalId);
  }, [ctx, modalId]);

  if (!isShow) return null;

  const zIndex = ctx ? ctx.getZIndex(modalId) : MODAL_BASE_Z_INDEX + 10;

  const dialog = (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="bg-white w-full h-full flex flex-col rounded-2xl outline-none"
    >
      {/* 모달 헤더 */}
      <header className="py-2 px-2 flex justify-between">
        <div id={titleId}>{headerTitle}</div>
        <button type="button" aria-label="닫기" onClick={handleClose}>
          <CloseIcon />
        </button>
      </header>
      {/* 컨텐츠 영역 */}
      {contentArea}
    </div>
  );

  // ModalProvider 연동: portal 렌더링 (오버레이는 Provider가 관리)
  if (ctx) {
    return createPortal(
      <div
        className="fixed inset-0 flex justify-center items-center pointer-events-none"
        style={{ zIndex }}
      >
        <section
          className={`p-3 max-w-[500px] max-h-[500px] w-full pointer-events-auto ${isFit ? "h-fit" : "h-full"}`}
          onPointerDown={handleModalPointerDown}
        >
          {dialog}
        </section>
      </div>,
      document.body,
    );
  }

  // Standalone 모드: 자체 오버레이 포함 (ModalProvider 없이 사용 시 폴백)
  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center"
      style={{ zIndex: MODAL_BASE_Z_INDEX }}
      onPointerUp={(e) => {
        if (e.button === 0 && e.target === e.currentTarget) handleClose();
      }}
    >
      <section
        className={`p-3 max-w-[500px] max-h-[500px] w-full ${isFit ? "h-fit" : "h-full"}`}
      >
        {dialog}
      </section>
    </div>
  );
};
