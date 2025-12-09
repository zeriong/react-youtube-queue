import { useParams } from "react-router-dom";
import DashBoard from "../../modules/main/dashBoard/DashBoard";
import YoutubeQueuePlay from "../../modules/main/youtubePlayer/YoutubeQueuePlay";
import GhostLeg from "../../modules/main/games/ghostLeg/GhostLeg";
import Poll from "../../modules/main/games/poll/Poll";
import { useEffect, useRef } from "react";
import Tetris from "../../modules/main/games/tetris/Tetris";
import { CONTENT_LIST } from "../../constants/contentList";

const Main = () => {
  const containerRef = useRef();
  const param = useParams()["*"];

  // 섹션이동 이동을 위한 param effect
  useEffect(() => {
    if (containerRef.current) {
      const find = CONTENT_LIST.findIndex((item) => item.path === param);
      if (find === undefined) containerRef.current.style.left = "0";
      else containerRef.current.style.left = `-${(find + 1) * 100}%`;
    }
  }, [param]);

  return (
    <div
      ref={containerRef}
      style={{ transition: "ease-in-out 500ms" }}
      className="flex absolute w-full h-full"
    >
      {/* Default: DashBoard */}
      <DashBoard />

      {/* contents */}
      <YoutubeQueuePlay />

      {/* games */}
      <GhostLeg />

      {/* poll */}
      <Poll />

      {/* Tetris */}
      <Tetris />
    </div>
  );
};

export default Main;
