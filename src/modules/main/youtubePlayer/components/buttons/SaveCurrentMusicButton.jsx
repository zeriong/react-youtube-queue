import {useToastsStore} from "../../../../common/Toasts";
import SaveCurrentMusicModal from "../modal/SaveCurrentMusic.modal";
import {usePlayerStore} from "../../../../../store/playerStore";

const SaveCurrentMusicButton = () => {
    const {addToast} = useToastsStore();
    const { isSubmitPlaying, savedMusic, saveMusicMaxLength, setIsShowSaveCurrentMusicModal } = usePlayerStore();

    // 저장 함수
    const handleOnClick = () => {
        if (!isSubmitPlaying) return addToast("기본 음악은 저장할 수 없습니다.");
        if (savedMusic.length >= saveMusicMaxLength) {
            return addToast(`플레이리스트 저장은 최대 ${saveMusicMaxLength}개까지 가능합니다.`);
        }
        setIsShowSaveCurrentMusicModal(true);
    }

    return (
        <>
            <button
                type="button"
                onClick={handleOnClick}
                className="border-4 border-gray-600 px-4 py-2 rounded-lg text-2xl hover:scale-105"
            >
                재생중인 음악 저장
            </button>

            {/* 타이틀 지정 모달 */}
            <SaveCurrentMusicModal/>
        </>
    )
}

export default SaveCurrentMusicButton;