import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// --- Types ---

interface ModalEntry {
  id: string;
  close: () => void;
}

interface ModalContextValue {
  /** 모달을 스택에 등록 */
  register: (id: string, close: () => void) => void;
  /** 모달을 스택에서 제거 */
  unregister: (id: string) => void;
  /** 해당 모달을 스택 최상위로 이동 */
  bringToFront: (id: string) => void;
  /** 해당 모달의 z-index 반환 */
  getZIndex: (id: string) => number;
  /** 해당 모달이 스택 최상위인지 확인 */
  isTopmost: (id: string) => boolean;
}

// --- Constants ---

export const MODAL_BASE_Z_INDEX = 1000;

// --- Context ---

const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * ModalProvider 내부에서 모달 스택 컨텍스트를 사용합니다.
 * Provider 외부에서 호출하면 null을 반환합니다.
 */
export const useModalContext = () => useContext(ModalContext);

/**
 * 모달 인스턴스에 고유 ID를 생성합니다.
 */
export const useModalId = () => useId();

// --- Provider ---

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [stack, setStack] = useState<ModalEntry[]>([]);
  const stackRef = useRef(stack);
  const overlayPointerStartRef = useRef(false);

  // 이벤트 핸들러에서 최신 스택을 참조하기 위한 ref 동기화
  stackRef.current = stack;

  const register = useCallback((id: string, close: () => void) => {
    setStack((prev) => [...prev.filter((e) => e.id !== id), { id, close }]);
  }, []);

  const unregister = useCallback((id: string) => {
    setStack((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setStack((prev) => {
      const entry = prev.find((e) => e.id === id);
      if (!entry || prev[prev.length - 1]?.id === id) return prev;
      return [...prev.filter((e) => e.id !== id), entry];
    });
  }, []);

  const getZIndex = useCallback(
    (id: string) => {
      const idx = stack.findIndex((e) => e.id === id);
      return MODAL_BASE_Z_INDEX + (idx + 1) * 10;
    },
    [stack],
  );

  const isTopmost = useCallback(
    (id: string) => stack.length > 0 && stack[stack.length - 1].id === id,
    [stack],
  );

  // ESC 키로 최상위 모달 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stackRef.current.length > 0) {
        e.preventDefault();
        stackRef.current[stackRef.current.length - 1].close();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // 모달이 열려 있을 때 body 스크롤 방지
  const hasModals = stack.length > 0;
  useEffect(() => {
    if (!hasModals) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [hasModals]);

  // 오버레이 포인터 이벤트: pointerDown이 오버레이 자체에서 시작된 경우에만 닫기
  // (모달 드래그 중 오버레이 위에서 포인터를 놓았을 때 의도치 않은 닫힘 방지)
  const handleOverlayPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button === 0 && e.target === e.currentTarget) {
      overlayPointerStartRef.current = true;
    }
  }, []);

  const handleOverlayPointerUp = useCallback((e: React.PointerEvent) => {
    if (e.button === 0 && overlayPointerStartRef.current) {
      overlayPointerStartRef.current = false;
      const s = stackRef.current;
      if (s.length > 0) s[s.length - 1].close();
    }
    overlayPointerStartRef.current = false;
  }, []);

  const value = useMemo<ModalContextValue>(
    () => ({ register, unregister, bringToFront, getZIndex, isTopmost }),
    [register, unregister, bringToFront, getZIndex, isTopmost],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {hasModals &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/50"
            style={{ zIndex: MODAL_BASE_Z_INDEX }}
            onPointerDown={handleOverlayPointerDown}
            onPointerUp={handleOverlayPointerUp}
          />,
          document.body,
        )}
    </ModalContext.Provider>
  );
};
