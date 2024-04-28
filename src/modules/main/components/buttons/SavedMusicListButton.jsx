import {SavedPlayList} from "../../../svgComponents/svgComponents";
import {create} from "zustand";
import {useEffect} from "react";
import {getFireStoreData} from "../../../../utils/firebase";

/** @desc 저장된 플레이리스트 스토어<br> setSavedMusic = 매개변수로 전달받은 배열을 savedMusic에 적용.<br>saveMusic = 페이로드로 전달받은 객체를 savedMusic에 추가.<br> deleteMusic = savedMusic state에서 해당 리스트 삭제. */
export const useSavedMusicStore = create((setState) => ({
    savedMusic: [],
    setSavedMusic: (payload) => setState(() => {
       return { savedMusic: payload }
    }),
    saveMusic: (payload) => setState((store) => {
        return { savedMusic: [...store.savedMusic, payload] };
    }),
    deleteMusic: (payloadId) => setState((store) => {
        const leftSavedList = store.savedMusic.filter((list) => payloadId !== list.id);
        return { token: leftSavedList };
    }),
}))

const SavedMusicListButton = ({ setIsShowSavedListModal }) => {
    const savedMusicStore = useSavedMusicStore();

    // 저장된 리스트 on 모달 함수
    const showList = async () => {
        // 모달 띄움
        setIsShowSavedListModal(true);

        // 저장된 리스트를 한번이라도 불러오면 이후 불러오지 않음
        if (!savedMusicStore.savedMusic.length) {
            try {
                const res = await getFireStoreData("savedList");
                savedMusicStore.setSavedMusic(res);
            } catch (e) {
                console.log("저장된 플리 불러오기 에러: ",e);
            }
        }
    }

    useEffect(() => {
        console.log("저장된 음악리스트다~",savedMusicStore.savedMusic);
    }, [savedMusicStore.savedMusic]);

    return (
        <button
            type="button"
            className="fixed left-[20px] top-[20px] border-4 border-gray-800 rounded-lg"
            onClick={showList}
        >
            <SavedPlayList width={50} height={50}/>
        </button>
    )
}

export default SavedMusicListButton;