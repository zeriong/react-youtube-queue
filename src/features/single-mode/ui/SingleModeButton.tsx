import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { SingleModeModal } from "./SingleModeModal";

export const SingleModeButton = () => {
  const [isShowModal, setIsShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsShowModal(true)}
        className={twMerge(
          "absolute top-4 left-4 md:top-6 md:left-6 px-2 py-1 md:px-4 md:py-2",
          "text-base md:text-2xl font-semibold text-gray-600",
          "border-2 border-gray-300 rounded-lg",
          "hover:bg-gray-100 shadow-md",
        )}
      >
        Single Mode
      </button>
      <SingleModeModal isShow={isShowModal} setIsShow={setIsShowModal} />
    </>
  );
};
