import PreViewModal from "./components/modal/PreView.modal";
import EditModal from "./components/modal/Edit.modal";
import SavedListModal from "./components/modal/SavedList.modal";
import PlayerAside from "./components/section/PlayerAside";
import PlayerSection from "./components/section/PlayerSection";
import SavedMusicListButton from "./components/buttons/SavedMusicListButton";

const YoutubeQueuePlay = () => {
    return (
        <>
            {/* transform을 설정하여 내부 컨텐츠 fixed 의 기준을 지정 */}
            <div className="transform flex flex-col pc:flex-row w-full min-w-full h-full cursor-default relative overflow-hidden">

                {/* 저장된 플레이리스트 버튼 */}
                <SavedMusicListButton/>

                {/* 플레이어 컨텐츠 섹션 */}
                <PlayerSection/>

                {/* 어사이드 바 */}
                <PlayerAside/>


                {/* -------------- Modals ------------- */}

                {/* 신청/수정 모달 */}
                <EditModal/>

                {/* 저장된 리스트 모달 */}
                <SavedListModal/>

                {/* 미리보기 모달 */}
                <PreViewModal/>
            </div>
        </>
    )
}

export default YoutubeQueuePlay;