import { useLocation } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import YoutubeQueuePlay from "@/features/youtube-player/ui/YoutubeQueuePlay";
import { CONTENT_LIST } from "@/shared/constants/contentList";
import Prepare from "@/shared/ui/Prepare";
import DashBoard from "./sections/DashBoard";

const SlideContainer = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const location = useLocation();

	// 섹션이동을 위한 pathname effect
	useEffect(() => {
		if (!containerRef.current) return;

		// /main/xxx 에서 xxx 추출
		const match = location.pathname
			.replace(/\/$/, "")
			.match(/^\/main\/(.+)$/);
		const subPath = match ? match[1] : null;

		if (!subPath) {
			// /main (대시보드) → 오프셋 없음
			containerRef.current.style.left = "0";
		} else {
			const index = CONTENT_LIST.findIndex((item) => item.path === subPath);
			if (index === -1) {
				containerRef.current.style.left = "0";
			} else {
				// +1: DashBoard가 첫 번째 패널 (index 0)
				containerRef.current.style.left = `-${(index + 1) * 100}%`;
			}
		}
	}, [location.pathname]);

	return (
		<div
			ref={containerRef}
			style={{ transition: "ease-in-out 500ms" }}
			className="flex absolute w-full h-full"
		>
			{/* Default: DashBoard */}
			<DashBoard />
			{/* contents: CONTENT_LIST 순서대로 렌더링 */}
			<YoutubeQueuePlay />
			{/* games */}
			<Prepare />
			{/* poll */}
			<Prepare />
			{/* Tetris */}
			<Prepare />
		</div>
	);
};

export default SlideContainer;
