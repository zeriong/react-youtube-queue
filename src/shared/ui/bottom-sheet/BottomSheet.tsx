import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  maxHeight?: string;
  handleHeight?: number;
  children: ReactNode;
}

const POSITION_THRESHOLD = 0.3;
const VELOCITY_THRESHOLD = 0.5;
const TRANSITION_MS = 300;

interface DragState {
  isDragging: boolean;
  startY: number;
  startTranslateY: number;
  currentTranslateY: number;
  lastY: number;
  lastTime: number;
  velocity: number;
}

const BottomSheet = ({
  isOpen,
  onClose,
  onOpen,
  maxHeight = "70vh",
  handleHeight = 40,
  children,
}: BottomSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>({
    isDragging: false,
    startY: 0,
    startTranslateY: 0,
    currentTranslateY: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
  });

  const [transitioning, setTransitioning] = useState(false);

  const getClosedY = useCallback(() => {
    if (!sheetRef.current) return 0;
    return sheetRef.current.getBoundingClientRect().height - handleHeight;
  }, [handleHeight]);

  const applyTranslateY = useCallback((y: number) => {
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${y}px)`;
    }
  }, []);

  const snapTo = useCallback(
    (targetY: number, cb?: () => void) => {
      setTransitioning(true);
      applyTranslateY(targetY);
      dragRef.current.currentTranslateY = targetY;
      setTimeout(() => {
        setTransitioning(false);
        cb?.();
      }, TRANSITION_MS);
    },
    [applyTranslateY],
  );

  const snapOpen = useCallback(() => snapTo(0, onOpen), [snapTo, onOpen]);
  const snapClosed = useCallback(() => {
    snapTo(getClosedY(), onClose);
  }, [snapTo, getClosedY, onClose]);

  // 위치 초기화
  useEffect(() => {
    const init = () => {
      const closedY = getClosedY();
      if (closedY === 0) {
        requestAnimationFrame(init);
        return;
      }
      const targetY = isOpen ? 0 : closedY;
      setTransitioning(true);
      applyTranslateY(targetY);
      dragRef.current.currentTranslateY = targetY;
      setTimeout(() => setTransitioning(false), TRANSITION_MS);
    };
    init();
  }, [isOpen, getClosedY, applyTranslateY]);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const drag = dragRef.current;
    drag.isDragging = true;
    drag.startY = e.clientY;
    drag.startTranslateY = drag.currentTranslateY;
    drag.lastY = e.clientY;
    drag.lastTime = Date.now();
    drag.velocity = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag.isDragging) return;

      const now = Date.now();
      const dt = now - drag.lastTime;
      if (dt > 0) drag.velocity = (e.clientY - drag.lastY) / dt;
      drag.lastY = e.clientY;
      drag.lastTime = now;

      const closedY = getClosedY();
      const newY = drag.startTranslateY + (e.clientY - drag.startY);
      const clamped = Math.max(0, Math.min(closedY, newY));
      drag.currentTranslateY = clamped;
      applyTranslateY(clamped);
    },
    [getClosedY, applyTranslateY],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag.isDragging) return;
      drag.isDragging = false;

      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }

      const closedY = getClosedY();
      if (closedY === 0) return;

      const progress = drag.currentTranslateY / closedY;
      const v = drag.velocity;

      if (isOpen) {
        if (v > VELOCITY_THRESHOLD || progress > POSITION_THRESHOLD) {
          snapClosed();
        } else {
          snapOpen();
        }
      } else {
        if (v < -VELOCITY_THRESHOLD || progress < 1 - POSITION_THRESHOLD) {
          snapOpen();
        } else {
          snapClosed();
        }
      }
    },
    [isOpen, getClosedY, snapOpen, snapClosed],
  );

  const handlePointerCancel = useCallback(() => {
    const drag = dragRef.current;
    if (!drag.isDragging) return;
    drag.isDragging = false;
    if (isOpen) snapOpen();
    else snapClosed();
  }, [isOpen, snapOpen, snapClosed]);

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
