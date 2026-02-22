import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { TRANSITION_MS, useBottomSheet } from "@/shared/hooks/useBottomSheet";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  maxHeight?: string;
  handleHeight?: number;
  children: ReactNode;
}

const BottomSheet = ({
  isOpen,
  onClose,
  onOpen,
  maxHeight = "70vh",
  handleHeight = 40,
  children,
}: BottomSheetProps) => {
  const {
    sheetRef,
    contentRef,
    transitioning,
    snapClosed,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = useBottomSheet({ isOpen, onClose, onOpen, handleHeight });

  return (
    <div className="pc:hidden">
      {/* Overlay (항상 렌더, opacity로 fade in/out) */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: overlay dismiss */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: overlay dismiss target */}
      <div
        className={twMerge(
          "fixed inset-0 z-40 bg-black/40",
          "transition-opacity duration-300 ease-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={snapClosed}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={twMerge(
          "fixed right-0 bottom-0 left-0 z-50",
          "rounded-t-2xl bg-white",
          "shadow-[0_-2px_10px_rgba(0,0,0,0.15)]",
          "flex flex-col",
        )}
        style={{
          height: maxHeight,
          transition: transitioning
            ? `transform ${TRANSITION_MS}ms ease-out`
            : "none",
        }}
      >
        {/* Grab Handle */}
        <div
          className={twMerge(
            "flex items-center justify-center shrink-0",
            "cursor-grab active:cursor-grabbing select-none touch-none",
            "bg-gray-50 border-b border-gray-200 rounded-t-2xl",
          )}
          style={{ height: `${handleHeight}px` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div className="h-1.5 w-12 rounded-full bg-gray-400" />
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-auto min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
