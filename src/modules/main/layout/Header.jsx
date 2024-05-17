import {Link} from "react-router-dom";
import {LogoutIcon} from "../../svgComponents/svgComponents";
import {deleteUser} from "../../../utils/firebase";
import {useTokenStore} from "../../../store/commonStore";
import {useToastsStore} from "../../common/components/Toasts";

const Header = () => {
    const { token, deleteToken } = useTokenStore();
    const { addToast } = useToastsStore();

    // 접속 종료
    const logout = async () => {
        await deleteUser(token.id);
        deleteToken();
        addToast("로그아웃 되었습니다.");
    }

    return (
        <header className="w-full px-[20px] py-[14px] shadow-md">
            <div>
                <Link to="/main" className="text-[24px] font-black">
                    Z-Space
                </Link>

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