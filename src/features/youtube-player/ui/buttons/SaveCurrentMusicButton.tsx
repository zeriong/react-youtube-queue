import { twMerge } from "tailwind-merge";
import { useOpenSaveMusicModal } from "@/features/youtube-player/model";
import SaveCurrentMusicModal from "../modals/SaveCurrentMusic.modal";

const SaveCurrentMusicButton = () => {
  const { openSaveMusicModal } = useOpenSaveMusicModal();

  return (
    <>
      <button
        type="button"
        onClick={openSaveMusicModal}
        className={twMerge(
          "border-4 border-gray-600 px-3 py-1.5 md:px-4 md:py-2",
          "rounded-lg text-base md:text-2xl hover:scale-105",
        )}
      >
        재생중인 음악 저장
      </button>

      {/* 타이틀 지정 모달 */}
      <SaveCurrentMusicModal isAdmin={true} />
    </>
  );
};

export default SaveCurrentMusicButton;
