import { Link, useLocation } from "@tanstack/react-router";
import type { Ref } from "react";
import { twMerge } from "tailwind-merge";
import { useLogout } from "@/features/auth/model";
import { CONTENT_LIST } from "@/shared/constants/contentList";
import { LogoutIcon } from "@/shared/ui/icons";

interface HeaderProps {
  ref?: Ref<HTMLElement>;
}

const Header = ({ ref }: HeaderProps) => {
  const location = useLocation();
  const { logout } = useLogout();

  // pathname에서 활성 탭 이름 파생
  const activeName = (() => {
    const match = location.pathname.replace(/\/$/, "").match(/^\/main\/(.+)$/);
    return match ? match[1] : undefined;
  })();

  return (
    <header
      ref={ref}
      className={twMerge(
        "w-full px-5 shadow-md flex items-center justify-between",
      )}
    >
      {/* Left Section */}
      <div className="flex gap-20">
        <Link to="/main" className="text-3xl font-black flex items-center">
          Z-Space
        </Link>
        <ul className="flex items-center gap-2 my-2">
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
                className="h-full flex items-center px-4 py-2.5"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Section */}
      <div>
        <button
          type="button"
          className="bg-gray-300 px-3 py-2 rounded-md text-xl hover:scale-110"
          onClick={logout}
        >
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
