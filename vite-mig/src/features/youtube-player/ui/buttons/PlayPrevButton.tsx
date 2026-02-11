import { twMerge } from "tailwind-merge";

interface PlayPrevButtonProps {
  onClick: () => void;
  disabled?: boolean;
  classNames?: string;
}

const PlayPrevButton = ({
  onClick,
  disabled,
  classNames,
}: PlayPrevButtonProps) => {
  // todo: 버튼 구현 시 disabled에 따른 스타일 변경 필요
  return (
    <button
      disabled={disabled}
      type="button"
      className={twMerge(
        "border-2 border-gray-300 play-prev bg-gray-300 text-white",
        "h-[80px] w-[110px] text-[18px] font-bold",
        classNames
      )}
      onClick={onClick}
    >
      <p className="relative translate-x-[5px]">이전 곡</p>
    </button>
  );
};

export default PlayPrevButton;
