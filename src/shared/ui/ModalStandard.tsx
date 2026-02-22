import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { useModalStandard } from "@/shared/hooks/useModalStandard";
import { CloseIcon } from "./icons";
import { MODAL_BASE_Z_INDEX } from "./ModalProvider";

interface ModalStandardProps {
  isShow: boolean;
  setIsShow: (show: boolean) => void;
  headerTitle: ReactNode;
  contentArea?: ReactNode;
  isFit?: boolean;
  draggable?: boolean;
  /** true: 오버레이 경계를 넘어서 드래그 이동 가능 (기본값: false) */
  dragOverflow?: boolean;
}

export const ModalStandard = ({
  isShow,
  setIsShow,
  headerTitle,
  contentArea,
  isFit,
  draggable = true,
  dragOverflow = false,
}: ModalStandardProps) => {
  const {
    titleId,
    isContextMode,
    zIndex,
    isDragging,
    sectionStyle,
    dialogRef,
    sectionRef,
    headerRef,
    handleClose,
    handleKeyDown,
    handleModalPointerDown,
    handleHeaderPointerDown,
    handleHeaderPointerMove,
    handleHeaderPointerUp,
    handleOverlayPointerUp,
  } = useModalStandard({ isShow, setIsShow, draggable, dragOverflow });

  if (!isShow) return null;

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
      {/* 모달 헤더 (드래그 핸들) */}
      <header
        ref={headerRef}
        className={`py-2 px-2 flex justify-between${
          draggable
            ? ` select-none touch-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`
            : ""
        }`}
        onPointerDown={handleHeaderPointerDown}
        onPointerMove={handleHeaderPointerMove}
        onPointerUp={handleHeaderPointerUp}
      >
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
  if (isContextMode) {
    return createPortal(
      <div
        className="fixed inset-0 flex justify-center items-center pointer-events-none"
        style={{ zIndex }}
      >
        <section
          ref={sectionRef}
          className={twMerge(
            "p-2 md:p-3 max-w-[calc(100vw-2rem)] md:max-w-[500px]",
            "max-h-[calc(100vh-4rem)] md:max-h-[500px] w-full pointer-events-auto",
            isFit ? "h-fit" : "h-full",
          )}
          style={sectionStyle}
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
      onPointerUp={handleOverlayPointerUp}
    >
      <section
        ref={sectionRef}
        className={twMerge(
          "p-2 md:p-3 max-w-[calc(100vw-2rem)] md:max-w-[500px]",
          "max-h-[calc(100vh-4rem)] md:max-h-[500px] w-full",
          isFit ? "h-fit" : "h-full",
        )}
        style={sectionStyle}
      >
        {dialog}
      </section>
    </div>
  );
};
