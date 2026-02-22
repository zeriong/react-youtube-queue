import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { BottomSheet } from "@/shared/ui";
import EditModal from "./modals/Edit.modal";
import PreViewModal from "./modals/PreView.modal";
import SavedListModal from "./modals/SavedList.modal";
import PlayerAside from "./sections/PlayerAside";
import PlayerSection from "./sections/PlayerSection";

const YoutubeQueuePlay = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div
      className={twMerge(
        "flex flex-col pc:flex-row w-full min-w-full h-full",
        "cursor-default relative overflow-hidden",
      )}
    >
      {/* 플레이어 컨텐츠 섹션 */}
      <PlayerSection />

      {/* 어사이드 바 (Desktop: 기존 aside, Mobile: 자체 hidden) */}
      <PlayerAside />

      {/* 어사이드 바 (Mobile: BottomSheet) */}
      <BottomSheet
        isOpen={isSheetOpen}
        onOpen={() => setIsSheetOpen(true)}
        onClose={() => setIsSheetOpen(false)}
      >
        <PlayerAside variant="sheet" />
      </BottomSheet>

      {/* -------------- Modals ------------- */}

      {/* 신청/수정 모달 */}
      <EditModal />

      {/* 저장된 리스트 모달 */}
      <SavedListModal />

      {/* 미리보기 모달 */}
      <PreViewModal />
    </div>
  );
};

export default YoutubeQueuePlay;
