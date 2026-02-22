import { useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

/**
 * pathname에서 활성 탭 이름을 파생하는 훅
 */
export const useActiveTab = () => {
  const location = useLocation();

  const activeName = (() => {
    const match = location.pathname.replace(/\/$/, "").match(/^\/main\/(.+)$/);
    return match ? match[1] : undefined;
  })();

  return { activeName, pathname: location.pathname };
};

/**
 * 모바일 햄버거 메뉴 상태 관리 훅
 * - 외부 클릭 시 닫기
 * - 경로 변경 시 닫기
 */
export const useMenuState = () => {
  const { pathname } = useActiveTab();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // 경로 변경 시 메뉴 닫기
  // biome-ignore lint/correctness/useExhaustiveDependencies: 경로 변경 감지 목적
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return { isMenuOpen, menuRef, toggleMenu };
};
