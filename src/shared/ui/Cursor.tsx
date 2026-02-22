import { twMerge } from "tailwind-merge";

interface CursorProps {
  bg?: string;
  w?: string;
  h?: string;
}

const Cursor = ({
  bg = "bg-black",
  w = "w-[14px]",
  h = "h-[4px]",
}: CursorProps) => {
  return (
    <div
      className={twMerge(
        "inline-block top-[3px] relative animate-blink",
        bg,
        w,
        h,
      )}
    />
  );
};

export default Cursor;
