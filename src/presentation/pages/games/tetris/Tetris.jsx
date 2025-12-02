import {isDev} from "../../../../App";
import Prepare from "../../../common/Prepare";

const Tetris = () => {
    return (
        <div className="min-w-full">
            {!isDev ? <Prepare/> :
                <p>
                    이것은 테트리스
                </p>
            }
        </div>
    )
}

export default Tetris;
