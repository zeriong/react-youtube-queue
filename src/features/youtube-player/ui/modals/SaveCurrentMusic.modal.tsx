import { useRef } from "react";
import { useSaveCurrentMusic } from "@/features/youtube-player/model";
import { ModalStandard } from "@/shared/ui";
import { CloseIcon } from "@/shared/ui/icons";

interface SaveCurrentMusicModalProps {
  isAdmin: boolean;
}

const SaveCurrentMusicModal = ({ isAdmin }: SaveCurrentMusicModalProps) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const {
    saveCurrentPlayMusic,
    isShowSaveCurrentMusicModal,
    setIsShowSaveCurrentMusicModal,
    isShowSaveCurrentMusicRequestModal,
    setIsShowSaveCurrentMusicRequestModal,
  } = useSaveCurrentMusic(isAdmin, titleInputRef);

  return (
    <ModalStandard
      setIsShow={
        isAdmin
          ? setIsShowSaveCurrentMusicModal
          : setIsShowSaveCurrentMusicRequestModal
      }
      isShow={
        isAdmin
          ? isShowSaveCurrentMusicModal
          : isShowSaveCurrentMusicRequestModal
      }
      headerTitle={"재생중인 음악 저장"}
      isFit={true}
      contentArea={
        <form className="flex gap-2 px-2 mb-3" onSubmit={saveCurrentPlayMusic}>
          <div className="relative w-full">
            <input
              ref={titleInputRef}
              type="text"
              className="w-full border-2 border-gray-500 pl-2 pr-6 py-1 rounded-md
                relative text-[15px] items-center"
              placeholder="재생중인 음악에 타이틀을 입력해주세요."
            />
            <button
              type="button"
              className="bg-black absolute right-[7px] top-1/2 -translate-y-1/2
                rounded-full p-0.5 opacity-80"
              onClick={() => {
                if (titleInputRef.current) {
                  titleInputRef.current.value = "";
                  titleInputRef.current.focus();
                }
              }}
            >
              <CloseIcon fill="#fff" width={12} height={12} />
            </button>
          </div>
          <button
            className="border px-2 rounded-md bg-gray-300 font-bold hover:scale-105 whitespace-nowrap"
            type="submit"
          >
            저장하기
          </button>
        </form>
      }
    />
  );
};

export default SaveCurrentMusicModal;
