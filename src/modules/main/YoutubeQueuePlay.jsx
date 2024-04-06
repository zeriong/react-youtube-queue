import {getAuthStorage} from "../../utils/common";
import {TOKEN_NAME} from "../../constants";
import {useToastsStore} from "../common/components/Toasts";
import {useNavigate} from "react-router-dom";
import EditModal from "../common/components/EditModal";

const YoutubeQueuePlay = () => {
    const token = getAuthStorage();
    const toastStore = useToastsStore();
    const navigate = useNavigate();
    
    // 접속 종료
    const logout = () => {
        localStorage.removeItem(TOKEN_NAME);
        navigate("/")
        toastStore.addToast("로그아웃 되었습니다.");
    }

    return (
        <>
            <div>
                <p>유튜브 플레이어</p>
                <button
                    type="button"
                    className="fixed right-[20px] top-[20px] bg-brand-blue-300 text-white p-3 rounded-xl text-[20px]"
                    onClick={logout}
                >
                    접속 종료
                </button>
            </div>
        </>

    )
}

export default YoutubeQueuePlay;