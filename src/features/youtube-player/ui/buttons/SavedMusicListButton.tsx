import { twMerge } from "tailwind-merge";
import { usePlayerModalStore } from "@/features/youtube-player/model";
import { SavedPlayList } from "@/shared/ui/icons";

const SavedMusicListButton = () => {
  const { setIsShowSavedListModal } = usePlayerModalStore();

  return (
    <button
      type="button"
      className={twMerge(
        "absolute  border-gray-800 rounded-lg w-fit h-fit",
        "border-3 md:border-4 md:left-5 md:top-5 left-3 top-3",
      )}
      onClick={() => setIsShowSavedListModal(true)}
    >
      <SavedPlayList className="size-[36px] md:size-[50px]" />
    </button>
  );
};

export default SavedMusicListButton;
