import {isDev} from "../../../App";
import Prepare from "../../common/Prepare";

const DashBoard = () => {
    return (
        <>
            {(isDev) ? (
                <div>
                    대쉬보드 입니다.`
                </div>
            ) : (
                <Prepare/>
            )}
        </>
    )
}

export default DashBoard;