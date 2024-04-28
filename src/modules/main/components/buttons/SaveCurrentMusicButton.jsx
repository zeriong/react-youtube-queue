import {addDoc, collection} from "firebase/firestore";
import {initFireStore} from "../../../../libs/firebase";
import {useToastsStore} from "../../../common/components/Toasts";

const SaveCurrentMusicButton = ({ currentListItem, isSubmitPlayingRef }) => {
    const toastStore = useToastsStore();

    const saveCurrentPlayMusic = () => {
        (async () => {
            if (!isSubmitPlayingRef) return toastStore.addToast("기본 음악은 저장할 수 없습니다.");
            // confirm을 체크 후 fireStore에 저장
            const confirmSubmit = window.confirm("재생중인 플레이리스트를 저장하시겠습니까?");
            if (confirmSubmit) {
                await addDoc(collection(initFireStore, "savedList"), currentListItem)
                    .then(() => {
                        toastStore.addToast("저장된 플레이리스트에 추가되었습니다.");
                    })
                    .catch((e) => {
                        alert("플레이리스트 저장에 실패하였습니다.");
                        console.log(e);
                    });
            } else {
                toastStore.addToast("플레이리스트 저장이 취소되었습니다.");
            }
        })()
    }

    return (
        <button
            type="button"
            onClick={saveCurrentPlayMusic}
            className="border-4 border-gray-600 px-4 py-2 rounded-lg text-2xl hover:scale-105"
        >
            재생중인 음악 저장
        </button>
    )
}

export default SaveCurrentMusicButton;