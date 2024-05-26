import Prepare from "../../../common/Prepare";
import {isDev} from "../../../../App";

const GhostLeg = () => {
    console.log()
    return (
        <div className="min-w-full">
            {(isDev) ? (
                <div className="">사다리타기 게임~~ ^^</div>
            ) : (
                <Prepare/>
            )}
        </div>
    )
}

export default GhostLeg;