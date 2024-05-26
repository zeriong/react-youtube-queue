import {isDev} from "../../../App";
import Prepare from "../../common/Prepare";

const DashBoard = () => {
    return (
        <div className="w-full min-w-full h-full">
            {(isDev) ? (
                <div>
                    대쉬보드 입니다.`
                </div>
            ) : (
                <Prepare/>
            )}
        </div>
    )
}

export default DashBoard;