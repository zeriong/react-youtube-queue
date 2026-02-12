import { usePlayerStore } from "@/entities/player/model";
import { useSavedMusicSubscription } from "@/features/youtube-player/model";
import { ModalStandard } from "@/shared/ui";
import SubmitListItem from "../lists/SubmitListItem";

const SavedListModal = () => {
  const {
    saveMusicMaxLength,
    savedMusic,
    isShowSavedListModal,
    setIsShowSavedListModal,
  } = usePlayerStore();

  useSavedMusicSubscription();

  return (
    <ModalStandard
      isShow={isShowSavedListModal}
      setIsShow={setIsShowSavedListModal}
      headerTitle={
        <p>
          저장된 플레이리스트
          <span>{`${`${savedMusic?.length}/${saveMusicMaxLength}`}`}</span>
        </p>
      }
      contentArea={
        <section className="grow px-2 pb-2 overflow-hidden">
          <ul
            className="p-2 bg-gray-100 rounded-md h-full min-h-[200px]
              overflow-y-auto customScroll-vertical"
          >
            {savedMusic.length ? (
              savedMusic.map((item, idx) => (
                <div key={item.id ?? idx} className="flex w-full gap-2">
                  <SubmitListItem item={item} idx={idx} isSavedList={true} />
                </div>
              ))
            ) : (
              <div
                className="flex h-full justify-center items-center
                  text-gray-400 text-2xl"
              >
                <p>저장된 플레이리스트가 없습니다.</p>
              </div>
            )}
          </ul>
        </section>
      }
    />
  );
};

export default SavedListModal;
