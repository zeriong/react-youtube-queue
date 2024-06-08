import {isDev} from "../../../App";
import Prepare from "../../common/Prepare";

const DashBoard = () => {
    return (
        <div className="w-full min-w-full h-full flex justify-center">
            {(isDev) ? (
                <div className="max-w-[1200px] w-full bg-gray-200">
                    <p className="text-[40px] font-bold">컨텐츠</p>
                    <section>

                        <div>

                        </div>
                    </section>
                </div>
            ) : (
                <Prepare/>
            )}
        </div>
    )
}

export default DashBoard;
