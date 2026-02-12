import { usePlayerStore } from "@/entities/player/model";
import { useTokenStore } from "@/entities/user/model";
import { usePlaylistCRUD } from "@/features/youtube-player/model";
import type { Music } from "@/shared/types";
import { AddIcon, CloseIcon, EditIcon } from "@/shared/ui/icons";

interface SubmitListItemProps {
  item: Music;
  idx: number;
  isSavedList?: boolean;
}

const SubmitListItem = ({ item, idx, isSavedList }: SubmitListItemProps) => {
  const { token } = useTokenStore();
  const { setSelectedCurrentMusic, setIsShowPreViewModal, setIsShowEditModal } =
    usePlayerStore();
  const { onDelete, submitCurrentSavedMusic } = usePlaylistCRUD();

  // 미리보기 모달 함수
  const onPreViewModal = () => {
    setSelectedCurrentMusic(item);
    setIsShowPreViewModal(true);
  };

  // 에디트 모달 함수
  const onEditModal = () => {
    setSelectedCurrentMusic(item);
    setIsShowEditModal(true);
  };

  return (
    <li
      key={idx}
      className="flex justify-between border-2 border-gray-400 px-2 py-1
        rounded-md bg-white w-full"
    >
      <div className="flex gap-3">
        {/* 신청곡 제목 */}
        <p className="break-words">{`${idx + 1}. ${item.title || `${item.nickName}님의 신청곡`}`}</p>

        {/* 미리보기 버튼 */}
        <button
          className="text-[12px] border border-gray-600 px-2 rounded-md whitespace-nowrap h-[24px]"
          type="button"
          onClick={onPreViewModal}
        >
          미리보기
        </button>
      </div>

      <div className="flex">
        <div className="flex gap-2">
          {/* 에디트 아이콘은 반드시 본인에게만 나타남 (저장된 리스트가 아닌 경우만) */}
          {!isSavedList && item.nickName === token?.nickName && (
            <button type="button" onClick={onEditModal}>
              <EditIcon className="cursor-pointer" />
            </button>
          )}

          {isSavedList && (
            <button type="button" onClick={() => submitCurrentSavedMusic(item)}>
              <AddIcon style={{ cursor: "pointer" }} />
            </button>
          )}

          {/* 어드민 계정에서만 삭제 가능 */}
          {((isSavedList && token?.role === 1) ||
            (!isSavedList && item.nickName === token?.nickName) ||
            token?.role === 1) && (
            <button type="button" onClick={() => onDelete(item, isSavedList)}>
              <CloseIcon />
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default SubmitListItem;
