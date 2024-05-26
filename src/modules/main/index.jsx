import {Route, useParams} from "react-router-dom";
import DashBoard from "./dashBoard/DashBoard";
import YoutubeQueuePlay from "./youtubePlayer/YoutubeQueuePlay";
import GhostLeg from "./games/ghostLeg/GhostLeg";
import Poll from "./games/poll/Poll";
import {useEffect, useState} from "react";
import {HEADER_LIST} from "../../constants/headerList";

const Main = () => {
    const [sectionMove, setSectionMove] = useState(0)
    const param = useParams()["*"];

    useEffect(() => {
        const find = HEADER_LIST.findIndex(item => item.path === param);
        if (find === undefined) setSectionMove(0);
        else setSectionMove((find + 1) * 100);
        console.log("이게 되려나?",param);
    }, [param]);

    return (
        <div className={`flex absolute w-full h-full ease-in-out left-[${sectionMove}%]`}>
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
