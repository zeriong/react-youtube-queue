import {isDev} from "../../../../App";
import Prepare from "../../../common/Prepare";

const Poll = () => {
    return (
        <div className="min-w-full">
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