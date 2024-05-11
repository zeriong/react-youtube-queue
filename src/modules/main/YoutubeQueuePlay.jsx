import PreViewModal from "./components/modal/PreView.modal";
import EditModal from "./components/modal/Edit.modal";
import SavedListModal from "./components/modal/SavedList.modal";
import PlayerAside from "./components/section/PlayerAside";
import PlayerSection from "./components/section/PlayerSection";
import SavedMusicListButton from "./components/buttons/SavedMusicListButton";
import {useEffect} from "react";
import {usePlayerStore} from "../../store/playerStore";
import {getFireStoreData} from "../../utils/firebase";

const YoutubeQueuePlay = () => {
    return (
        <>
            <div className="flex flex-col pc:flex-row w-full h-full cursor-default relative">

                {/* 저장된 플레이리스트 버튼 */}
                <SavedMusicListButton/>

                {/* 플레이어 컨텐츠 섹션 */}
                <PlayerSection/>

                {/* 어사이드 바 */}
                <PlayerAside/>
            </div>

            {/* 신청/수정 모달 */}
            <EditModal/>

            {/* 미리보기 모달 */}
            <PreViewModal/>

            {/* 저장된 리스트 모달 */}
            <SavedListModal/>
        </>
    )
}

export default YoutubeQueuePlay;