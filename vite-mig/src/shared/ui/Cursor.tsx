import { useEffect, useRef } from "react";
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
	const interval = useRef<NodeJS.Timeout | null>(null);
	const targetRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (interval.current === null) {
			interval.current = setInterval(() => {
				targetRef.current?.classList?.toggle("hidden");
			}, 500);
		} else {
			clearInterval(interval.current);
			interval.current = null;
			interval.current = setInterval(() => {
				targetRef.current?.classList?.toggle("hidden");
			}, 500);
		}
		return () => {
			if (interval.current) clearInterval(interval.current);
		};
	}, []);

	return (
		<div
			ref={targetRef}
			className={twMerge("inline-block top-[3px] relative", bg, w, h)}
		/>
	);
};

export default Cursor;
