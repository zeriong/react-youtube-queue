import {isDev} from "../../../../App";
import Prepare from "../../../common/Prepare";

const Poll = () => {
    return (
        <div>
            <>
                {(isDev) ? (
                    <div className="">투표!!!</div>
                ) : (
                    <Prepare/>
                )}
            </>
        </div>
    )
}

export default Poll;