import { Link } from "@tanstack/react-router";
import type { Ref } from "react";
import { twMerge } from "tailwind-merge";
import { useLogout } from "@/features/auth/model";
import { CONTENT_LIST } from "@/shared/constants/contentList";
import { CloseIcon, LogoutIcon, MenuIcon } from "@/shared/ui/icons";
import { useActiveTab, useMenuState } from "./model";

interface HeaderProps {
  ref?: Ref<HTMLElement>;
}

const Header = ({ ref }: HeaderProps) => {
  const { activeName } = useActiveTab();
  const { isMenuOpen, menuRef, toggleMenu } = useMenuState();
  const { logout } = useLogout();

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
            onClick={toggleMenu}
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
          className={twMerge(
            "bg-gray-300 px-2 py-1.5 md:px-3 md:py-2",
            "rounded-md text-base md:text-xl hover:scale-110",
          )}
          onClick={logout}
        >
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
