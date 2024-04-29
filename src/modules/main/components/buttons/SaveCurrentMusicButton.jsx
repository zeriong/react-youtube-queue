import {addDoc, collection} from "firebase/firestore";
import {initFireStore} from "../../../../libs/firebase";
import {useToastsStore} from "../../../common/components/Toasts";
import {getFireStoreData} from "../../../../utils/firebase";

const SaveCurrentMusicButton = ({ currentListItem, isSubmitPlayingRef }) => {
    const toastStore = useToastsStore();

    const saveCurrentPlayMusic = () => {
        (async () => {
            if (!isSubmitPlayingRef) return toastStore.addToast("기본 음악은 저장할 수 없습니다.");
            // confirm을 체크 후 fireStore에 저장
            const confirmSubmit = window.confirm("재생중인 플레이리스트를 저장하시겠습니까?");
            if (!confirmSubmit) return toastStore.addToast("플레이리스트 저장이 취소되었습니다.");

            try {
                // 링크가 같다면 추가하지 않음
                const getSavedLists = await getFireStoreData("savedList");
                if (getSavedLists.some(list => list.link === currentListItem.link)) {
                    return toastStore.addToast("이미 저장된 플레이리스트입니다.");
                }
                
                // 링크가 다르다면 fireStore에 저장 
                await addDoc(collection(initFireStore, "savedList"), currentListItem)
                    .then(() => {
                        toastStore.addToast("저장된 플레이리스트에 추가되었습니다.");
                    })
                    .catch((e) => {
                        alert("플레이리스트 저장에 실패하였습니다.");
                        console.log(e);
                    });
            } catch (e) {
                console.log("재생중인 플레이리스트 저장에 실패했습니다. \nerror: ", e);
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