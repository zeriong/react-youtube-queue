import {CloseIcon, EditIcon} from "../../svgComponents";

const SubmitListItem = ({ item, idx, setPreViewData, setIsShowPreViewModal, tokenStore, setEditInputValue, setIsShowEditModal }) => {
    // 미리보기 모달 함수
    const onPreViewModal = () => {
        setPreViewData(item);
        setIsShowPreViewModal(true);
    }
    // 에디트 모달 함수
    const onEditModal = () => {
        setEditInputValue(item.link);
        setIsShowEditModal(true);
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
                        <button type="button" onClick={onEditModal}>
                            <EditIcon/>
                        </button>
                        <button type="button" onClick={() => console.log("삭제!")}>
                            <CloseIcon/>
                        </button>
                    </div>
                }
            </div>
        </li>
    )
}

export default SubmitListItem;