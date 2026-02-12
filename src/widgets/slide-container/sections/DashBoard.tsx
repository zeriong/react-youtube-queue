import { Link } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import { CONTENT_LIST } from "@/shared/constants/contentList";

const DashBoard = () => {
  return (
    <div className="w-full min-w-full h-full flex flex-col items-center">
      <div
        className={twMerge(
          "md:max-w-[1300px] md:w-full md:py-[40px]",
          "px-4 py-[20px]",
        )}
      >
        <p className="text-[40px] font-bold mb-[12px]">컨텐츠</p>
        <ul
          className={twMerge(
            "md:grid-cols-4 md:py-4",
            "grid grid-cols-1 flex-wrap gap-4",
          )}
        >
          {CONTENT_LIST.map((item) => {
            return (
              <Link
                key={item.path}
                to={`/main/${item.path}`}
                className={twMerge(
                  "border-2 relative transition-all ease-in-out border-gray-300 p-4",
                  "overflow-hidden rounded-md shadow-lg bottom-0 hover:bottom-2",
                )}
              >
                <p className="font-bold mb-2 text-[20px]">{item.title}</p>
                <p className="break-words text-[15px] text-gray-800">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DashBoard;
