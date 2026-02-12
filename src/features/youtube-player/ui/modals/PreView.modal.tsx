import { useEffect } from "react";
import ReactPlayer from "react-player";
import { usePlayerStore } from "@/entities/player/model";
import { ModalStandard } from "@/shared/ui";

const PreViewModal = () => {
  const {
    setSelectedCurrentMusic,
    selectedCurrentMusic,
    isShowPreViewModal,
    setIsShowPreViewModal,
  } = usePlayerStore();

  // 모달이 사라지면 state 초기화
  useEffect(() => {
    if (!isShowPreViewModal) setSelectedCurrentMusic(null);
  }, [isShowPreViewModal, setSelectedCurrentMusic]);

  return (
    <ModalStandard
      setIsShow={setIsShowPreViewModal}
      isShow={isShowPreViewModal}
      headerTitle={`${selectedCurrentMusic?.nickName ?? ""}님의 신청곡`}
      contentArea={
        <section className="grow px-2 pb-2">
          <div className="rounded-xl overflow-hidden h-full w-full">
            <ReactPlayer
              width="100%"
              height="100%"
              controls={true}
              src={selectedCurrentMusic?.link}
            />
          </div>
        </section>
      }
    />
  );
};

export default PreViewModal;
