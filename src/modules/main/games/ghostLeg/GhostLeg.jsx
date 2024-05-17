import Prepare from "../../../common/Prepare";
import {isDev} from "../../../../App";

const GhostLeg = () => {
    console.log()
    return (
        <>
            {(isDev) ? (
                <div>사다리타기 게임~~ ^^</div>
            ) : (
                <Prepare/>
            )}
        </>
    )
}

export default GhostLeg;