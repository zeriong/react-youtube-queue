import {CloseIcon, EditIcon} from "../../svgComponents";
import {deletePlayList} from "../../../utils/firebase";
import {useToastsStore} from "../../common/components/Toasts";

const SubmitListItem = ({ item, idx, setCurrentData, setIsShowPreViewModal, tokenStore, setIsShowEditModal }) => {
    const toastStore = useToastsStore();
    // 미리보기 모달 함수
    const onPreViewModal = () => {
        setCurrentData(item);
        setIsShowPreViewModal(true);
    }
    // 에디트 모달 함수
    const onEditModal = () => {
        setCurrentData(item)
        setIsShowEditModal(true);
    }
    // 플레이리스트 삭제 함수
    const onDelete = () => {
        const isConfirmed = window.confirm("해당 리스트를 삭제하시겠습니까?");
        let isDeleted;
        if (isConfirmed) isDeleted = deletePlayList(item.id);
        // 실패, 성공에 따른 토스트
        toastStore.addToast(isDeleted ? "해당 플레이리스트가 삭제되었습니다." : "플레이리스트 삭제에 실패하였습니다.");
    }

    return (
        <li key={idx} className="flex">
            <div className="flex">
                <p>{`${idx + 1}.`}</p>
                <p>{`${item?.nickName}님의 신청곡`}</p>
            </div>

            <div>
                <button type="button" onClick={onPreViewModal}>
                    미리 보기
                </button>
                {((item?.nickName === tokenStore.token?.nickName) || (tokenStore.token?.role === 1)) &&
                    <div className="flex gap-2">
                        {/* 에디트 아이콘은 반드시 본인에게만 나타남 */}
                        {(item?.nickName === tokenStore.token?.nickName) &&
                            <button type="button" onClick={onEditModal}>
                                <EditIcon/>
                            </button>
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