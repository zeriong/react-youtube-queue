import {addDoc, collection} from "firebase/firestore";
import {initFireStore} from "../../../../libs/firebase";
import {useToastsStore} from "../../../common/components/Toasts";
import {getFireStoreData} from "../../../../utils/firebase";
import {useRef, useState} from "react";
import SaveCurrentMusicModal from "../modal/SaveCurrentMusic.modal";
import {usePlayerStore} from "../../../../store/playerStore";

const SaveCurrentMusicButton = () => {
    const titleInputRef = useRef();
    const toastStore = useToastsStore();
    const [isShowModal, setIsShowModal] = useState(false);
    const savedMusicStore = usePlayerStore();
    const { currentMusic, isSubmitPlaying } = usePlayerStore();

    const saveCurrentPlayMusic = (e) => {
        (async () => {
            e.preventDefault();
            if (!titleInputRef.current?.value) return toastStore.addToast("타이틀을 입력해주세요!");
            if (!isSubmitPlaying) return toastStore.addToast("기본 음악은 저장할 수 없습니다.");
            // confirm을 체크 후 fireStore에 저장
            const confirmSubmit = window.confirm("재생중인 플레이리스트를 저장하시겠습니까?");
            if (!confirmSubmit) return toastStore.addToast("플레이리스트 저장이 취소되었습니다.");

            // 링크가 같다면 추가하지 않음
            const getSavedLists = await getFireStoreData("savedList");
            if (getSavedLists.some(list => list.link === currentMusic.link)) {
                return toastStore.addToast("이미 저장된 플레이리스트입니다.");
            }

            try {
                // 타이틀 추가 지정
                currentMusic.title = titleInputRef.current?.value;
                
                // 링크가 다르다면 fireStore에 저장 
                await addDoc(collection(initFireStore, "savedList"), currentMusic)
                    .then((res) => {
                        console.log("리스폰스다.", res.id);
                        toastStore.addToast("저장된 플레이리스트에 추가되었습니다.");
                        currentMusic.id = res.id;
                        savedMusicStore.saveMusic(currentMusic);
                    })
                    .catch((e) => {
                        alert("플레이리스트 저장에 실패하였습니다.");
                        console.log(e);
                    });
            } catch (e) {
                console.log("재생중인 플레이리스트 저장에 실패했습니다. \nerror: ", e);
            } finally {
                setIsShowModal(false);
            }
        })();
    };

    return (
        <>
            <button
                type="button"
                onClick={() => {
                    if (!isSubmitPlaying) return toastStore.addToast("기본 음악은 저장할 수 없습니다.");
                    setIsShowModal(true);
                }}
                className="border-4 border-gray-600 px-4 py-2 rounded-lg text-2xl hover:scale-105"
            >
                재생중인 음악 저장
            </button>

            {/* 타이틀 지정 모달 */}
            <SaveCurrentMusicModal
                isShow={isShowModal}
                setIsShow={setIsShowModal}
                submit={saveCurrentPlayMusic}
                titleInputRef={titleInputRef}
            />
        </>
    )
}

export default SaveCurrentMusicButton;