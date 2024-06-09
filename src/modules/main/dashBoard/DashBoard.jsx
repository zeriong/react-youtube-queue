import {isDev} from "../../../App";
import Prepare from "../../common/Prepare";
import {CONTENT_LIST} from "../../../constants/contentList";

const DashBoard = () => {
    return (
        <div className="w-full min-w-full h-full flex justify-center">
            {(isDev) ? (
                <div className="max-w-[1300px] w-full py-[40px]">
                    <p className="text-[40px] font-bold mb-[12px]">컨텐츠</p>
                    <ul className="grid grid-cols-4 flex-wrap gap-4 py-4">
                        {CONTENT_LIST.map((item, idx) => {
                            return (
                                <li
                                    key={idx}
                                    className="border relative transition-all ease-in-out border-gray-500 p-4 overflow-hidden rounded-md shadow-lg
                                     bottom-0 hover:bottom-2"
                                >
                                    <p className="font-bold mb-2 text-[20px]">{item.title}</p>
                                    <p className="whitespace-break-spaces text-[15px] text-gray-800">{item.desc}</p>
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
