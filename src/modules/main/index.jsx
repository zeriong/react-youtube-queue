import {useParams} from "react-router-dom";
import DashBoard from "./dashBoard/DashBoard";
import YoutubeQueuePlay from "./youtubePlayer/YoutubeQueuePlay";
import GhostLeg from "./games/ghostLeg/GhostLeg";
import Poll from "./games/poll/Poll";
import {useEffect, useRef, useState} from "react";
import {HEADER_LIST} from "../../constants/headerList";

const Main = () => {
    const containerRef = useRef();
    const param = useParams()["*"];

    // 섹션이동 이동을 위한 param effect
    useEffect(() => {
        if (containerRef.current) {
            const find = HEADER_LIST.findIndex(item => item.path === param);
            if (find === undefined)  containerRef.current.style.left = "0";
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
            <DashBoard/>

            {/* contents */}
            <YoutubeQueuePlay/>

            {/* games */}
            <GhostLeg/>

            {/* poll */}
            <Poll/>
        </div>
    )
}

export default Main
