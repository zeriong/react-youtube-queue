import PreViewModal from "./modals/PreView.modal";
import EditModal from "./modals/Edit.modal";
import SavedListModal from "./modals/SavedList.modal";
import PlayerAside from "./sections/PlayerAside";
import PlayerSection from "./sections/PlayerSection";
import SavedMusicListButton from "./buttons/SavedMusicListButton";
import { twMerge } from "tailwind-merge";

const YoutubeQueuePlay = () => {
  return (
    <>
      {/* transform을 설정하여 내부 컨텐츠 fixed 의 기준을 지정 */}
      <div
        className={twMerge(
          "transform flex flex-col pc:flex-row w-full min-w-full h-full",
          "cursor-default relative overflow-hidden"
        )}
      >
        {/* 저장된 플레이리스트 버튼 */}
        <SavedMusicListButton />

        {/* 플레이어 컨텐츠 섹션 */}
        <PlayerSection />

        {/* 어사이드 바 */}
        <PlayerAside />

        {/* -------------- Modals ------------- */}

        {/* 신청/수정 모달 */}
        <EditModal />

        {/* 저장된 리스트 모달 */}
        <SavedListModal />

        {/* 미리보기 모달 */}
        <PreViewModal />
      </div>
    </>
  );
};

export default YoutubeQueuePlay;
