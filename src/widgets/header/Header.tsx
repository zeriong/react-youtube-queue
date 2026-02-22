import { Link, useLocation } from "@tanstack/react-router";
import { type Ref, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useLogout } from "@/features/auth/model";
import { CONTENT_LIST } from "@/shared/constants/contentList";
import { CloseIcon, LogoutIcon, MenuIcon } from "@/shared/ui/icons";

interface HeaderProps {
  ref?: Ref<HTMLElement>;
}

const Header = ({ ref }: HeaderProps) => {
  const location = useLocation();
  const { logout } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // pathname에서 활성 탭 이름 파생
  const activeName = (() => {
    const match = location.pathname.replace(/\/$/, "").match(/^\/main\/(.+)$/);
    return match ? match[1] : undefined;
  })();

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
  }, [location.pathname]);

  return (
    <header
      ref={ref}
      className={twMerge(
        "w-full px-3 py-2 md:py-0 md:px-5 shadow-md flex items-center justify-between",
      )}
    >
      {/* Left Section */}
      <div className="flex gap-4 md:gap-20 items-center">
        <Link
          to="/main"
          className="text-xl md:text-3xl font-black flex items-center whitespace-nowrap"
        >
          Z-Space
        </Link>

        {/* Desktop: 탭 네비게이션 */}
        <ul className="hidden md:flex items-center gap-2 my-2">
          {CONTENT_LIST.map((item) => (
            <li
              key={item.path}
              className={twMerge(
                "h-full rounded-md hover:bg-gray-200",
                activeName === item.path && "bg-gray-200",
              )}
            >
              <Link
                to={`/main/${item.path}`}
                className="h-full flex items-center px-4 py-2.5 whitespace-nowrap"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Mobile: 햄버거 메뉴 */}
        <div ref={menuRef} className="relative md:hidden">
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-gray-200"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          {isMenuOpen && (
            <ul
              className={twMerge(
                "absolute right-0 top-full mt-2 z-50",
                "w-48 bg-white rounded-lg shadow-lg border border-gray-200",
                "py-1 flex flex-col",
              )}
            >
              {CONTENT_LIST.map((item) => (
                <li key={item.path}>
                  <Link
                    to={`/main/${item.path}`}
                    className={twMerge(
                      "block px-4 py-2.5 text-sm hover:bg-gray-100",
                      activeName === item.path && "bg-gray-100 font-semibold",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          className="bg-gray-300 px-2 py-1.5 md:px-3 md:py-2 rounded-md text-base md:text-xl hover:scale-110"
          onClick={logout}
        >
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
