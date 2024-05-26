import {Route, useParams} from "react-router-dom";
import DashBoard from "./dashBoard/DashBoard";
import YoutubeQueuePlay from "./youtubePlayer/YoutubeQueuePlay";
import GhostLeg from "./games/ghostLeg/GhostLeg";
import Poll from "./games/poll/Poll";
import {useEffect} from "react";

const Main = () => {
    const param = useParams()["*"];

    useEffect(() => {
        console.log("이게 되려나?",param);
    }, [param]);

    return (
        <div>
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
