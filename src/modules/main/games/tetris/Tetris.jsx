import {isDev} from "../../../../App";
import Prepare from "../../../common/Prepare";

const Tetris = () => {
    return (
        <>
            {!isDev ? <Prepare/> :
                <div className="min-w-full">
                    이것은 테트리스
                </div>
            }
        </>
    )
}

export default Tetris;
