import {isDev} from "../../../App";
import Prepare from "../../components/common/Prepare";
import {CONTENT_LIST} from "../../../shared/constants/contentList";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {useUserStore} from "../../../application/store/userStore";
import {updateProfile} from "firebase/auth";
import { twMerge } from 'tailwind-merge'

const DashBoard = () => {
    const [userName, setUserName] = useState('');
    const { user } = useUserStore();
    const onSubmit = async (e) => {
        e.preventDefault();
        // if(user.displayName !== userName){
        //     await updateProfile(user.auth.currentUser,{displayName: userName});
        // }
    }

    useEffect(() => {
        console.log(user)
    }, []);
    return (
        <div className="w-full min-w-full h-full flex flex-col items-center">
            <div className={twMerge("md:max-w-[1300px] md:w-full md:py-[40px]", "px-4 py-[20px]")}>
                <p className="text-[40px] font-bold mb-[12px]">컨텐츠</p>
                <ul className={twMerge("md:grid-cols-4 md:py-4",
                    "grid grid-cols-1 flex-wrap gap-4")}>
                    {CONTENT_LIST.map((item, idx) => {
                        return (
                            <Link
                                key={idx}
                                to={item.path}
                                className="border-2 relative transition-all ease-in-out border-gray-300 p-4 overflow-hidden rounded-md shadow-lg
                                     bottom-0 hover:bottom-2"
                            >
                                <p className="font-bold mb-2 text-[20px]">
                                    {item.title}
                                </p>
                                <p className="whitespace-break-spaces text-[15px] text-gray-800">
                                    {item.desc}
                                </p>
                            </Link>
                        )
                    })}
                </ul>
            </div>
            {isDev &&
                <>
                    {/*<form onSubmit={onSubmit}>*/}
                    {/*    <div>테스트</div>*/}
                    {/*    <input className="bg-gray-100" onChange={(e) => setUserName(e.target.value)}/>*/}
                    {/*    <div>{user.displayName}</div>*/}
                    {/*    <button type="submit">제출</button>*/}
                    {/*</form> */}

                </>
            }
        </div>
    )
}

export default DashBoard;
