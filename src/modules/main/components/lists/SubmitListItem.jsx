import {AddIcon, CloseIcon, EditIcon} from "../../../svgComponents/svgComponents";
import {deleteFireStore} from "../../../../utils/firebase";
import {useToastsStore} from "../../../common/components/Toasts";
import {usePlayerStore} from "../../../../store/playerStore";
import {useTokenStore} from "../../../../store/commonStore";

const SubmitListItem = ({ item, idx, setIsShowPreViewModal, setIsShowEditModal, isSavedList }) => {
    const toastStore = useToastsStore();
    const tokenStore = useTokenStore();
    const { setSelectedCurrentMusic, deleteMusic } = usePlayerStore();
    // 미리보기 모달 함수
    const onPreViewModal = () => {
        setSelectedCurrentMusic(item);
        setIsShowPreViewModal(true);
    }
    // 에디트 모달 함수
    const onEditModal = () => {
        setSelectedCurrentMusic(item);
        setIsShowEditModal(true);
    }
    // 플레이리스트 삭제 함수
    const onDelete = () => {
        const isConfirmed = window.confirm("해당 리스트를 삭제하시겠습니까?");
        let isDeleted;
        if (isConfirmed) isDeleted = deleteFireStore(item.id, isSavedList ? "savedList" : "playList");
        if (isSavedList && isDeleted) deleteMusic(item.id);
        // 실패, 성공에 따른 토스트
        toastStore.addToast(isDeleted ? "해당 플레이리스트가 삭제되었습니다." : "플레이리스트 삭제가 취소되었습니다.");
    }

    return (
        <li key={idx} className="flex justify-between border-2 border-gray-400 px-2 py-1 rounded-md bg-white w-full">
            <div className="flex gap-3">
                <p>{(isSavedList) ? (item.title) : (`${idx + 1}. ${item?.nickName}님의 신청곡`)}</p>
                <button
                    className="text-[12px] border border-gray-600 px-2 rounded-md"
                    type="button"
                    onClick={onPreViewModal}
                >
                    미리 보기
                </button>
            </div>

            <div className="flex">
                {((item?.nickName === tokenStore.token?.nickName) || (tokenStore.token?.role === 1)) &&
                    <div className="flex gap-2">
                        {/* 에디트 아이콘은 반드시 본인에게만 나타남 */}
                        {(!isSavedList && item?.nickName === tokenStore.token?.nickName) &&
                            <button type="button" onClick={onEditModal}>
                                <EditIcon className="cursor-pointer" />
                            </button>
                        }
                        {isSavedList &&
                            <AddIcon style={{ cursor: "pointer" }}/>
                        }
                        <button type="button" onClick={onDelete}>
                            <CloseIcon/>
                        </button>
                    </div>
                }
            </div>
        </li>
    )
}

export default SubmitListItem;