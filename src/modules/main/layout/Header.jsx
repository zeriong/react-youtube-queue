import {Link, useLocation, useParams} from "react-router-dom";
import {LogoutIcon} from "../../svgComponents/svgComponents";
import {deleteUser} from "../../../utils/firebase";
import {useTokenStore} from "../../../store/commonStore";
import {useToastsStore} from "../../common/Toasts";
import {useEffect, useState} from "react";
import {CONTENT_LIST} from "../../../constants/contentList";

const Header = () => {
    const location = useLocation();
    const [activeName, setActiveName] = useState(location.pathname);
    const { token, deleteToken } = useTokenStore();
    const { addToast } = useToastsStore();

    const param = useParams()["*"];

    // 접속 종료
    const logout = async () => {
        await deleteUser(token.id);
        deleteToken();
        addToast("로그아웃 되었습니다.");
    }

    // select effect
    useEffect(() => {
        setActiveName(param);
    }, [param]);

    return (
        <header className="w-full px-[20px] shadow-md flex items-center justify-between">
            {/* Left Section */}
            <div className="flex gap-[80px]">
                <Link to="/main" className="text-[30px] font-black flex items-center">
                    Z-Space
                </Link>
                <ul className="flex items-center gap-[8px] my-[8px]">
                    {CONTENT_LIST.map((item, idx) => (
                        <li key={idx} className={`h-full rounded-md hover:bg-gray-200 ${activeName === item.path && "bg-gray-200"}`}>
                            <Link to={`/main/${item.path}`} className="h-full flex items-center px-[16px] py-[10px]">
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Section */}
            <div>
                <button
                    type="button"
                    className="bg-gray-300 px-3 py-2 rounded-md text-[20px] hover:scale-110"
                    onClick={logout}
                >
                    <LogoutIcon/>
                </button>
            </div>
        </header>
    )
}

export default Header;
