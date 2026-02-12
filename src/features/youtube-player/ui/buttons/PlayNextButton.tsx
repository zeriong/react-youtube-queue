import { twMerge } from "tailwind-merge";

interface PlayNextButtonProps {
  onClick: () => void;
  classNames?: string;
}

const PlayNextButton = ({ onClick, classNames }: PlayNextButtonProps) => {
  return (
    <button
      type="button"
      className={twMerge(
        "border-2 border-gray-700 play-next bg-black text-white",
        "h-[80px] w-[110px] text-[18px] font-bold hover:scale-110",
        classNames,
      )}
      onClick={onClick}
    >
      <p className="relative -translate-x-[5px]">다음 곡</p>
    </button>
  );
};

export default PlayNextButton;
