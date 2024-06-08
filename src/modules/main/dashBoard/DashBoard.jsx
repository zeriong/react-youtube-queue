import {isDev} from "../../../App";
import Prepare from "../../common/Prepare";
import {CONTENT_LIST} from "../../../constants/contentList";

const DashBoard = () => {
    return (
        <div className="w-full min-w-full h-full flex justify-center">
            {(isDev) ? (
                <div className="max-w-[1300px] w-full bg-gray-200 py-[40px]">
                    <p className="text-[40px] font-bold mb-[24px]">컨텐츠</p>
                    <ul className="bg-red-300 flex flex-wrap gap-4">
                        {CONTENT_LIST.map((item, idx) => {
                            return (
                                <li key={idx}>
                                    {item.title}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            ) : (
                <Prepare/>
            )}
        </div>
    )
}

export default DashBoard;
