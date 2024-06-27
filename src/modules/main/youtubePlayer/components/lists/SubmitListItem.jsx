import {AddIcon, CloseIcon, EditIcon} from "../../../../svgComponents/svgComponents";
import {deleteFireStore} from "../../../../../utils/firebase";
import {useToastsStore} from "../../../../common/Toasts";
import {usePlayerStore} from "../../../../../store/playerStore";
import {useTokenStore} from "../../../../../store/commonStore";
import {addDoc, collection} from "firebase/firestore";
import {initFireStore} from "../../../../../libs/firebase";
import {CANCEL_USER_REQ} from "../../../../../constants/message";

const SubmitListItem = ({ item, idx, isSavedList }) => {
    const { addToast } = useToastsStore();
    const { token } = useTokenStore();
    const {
        setSelectedCurrentMusic,
        setIsShowPreViewModal,
        setIsShowEditModal,
    } = usePlayerStore();

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
        console.log("아이템의 아이디다~",item.id);
        if (isConfirmed) isDeleted = deleteFireStore(item.id, isSavedList ? "savedList" : "playList");
        // 실패, 성공에 따른 토스트
        if (isDeleted) addToast(isDeleted ? "해당 플레이리스트가 삭제되었습니다." : "플레이리스트 삭제가 취소되었습니다.");
    }

    // 저장된 플리를 현재 플리에 추가
    const addCurrentPlayList = () => {
        (async () => {
            await addDoc(collection(initFireStore, "playList"), {
                // ! 유저네임 불필요
                createAt: Date.now(),
                title: item.title,
                link: item.link,
            })
                .then(() => {
                    addToast("플레이리스트에 추가되었습니다.");
                    setIsShowEditModal(false);
                })
                .catch((e) => {
                    alert("플레이리스트 추가에 실패하였습니다.");
                    console.log(e);
                });
        })()
    }

    // 저장된 플레이리스트를 현재 플레이리스트에 추가
    const submitCurrentSavedMusic = () => {
        (async () => {
            // 어드민인 경우
            if (token.role === 1) {
                // confirm을 체크 후 fireStore에 저장
                const confirmSubmit = window.confirm("플레이리스트에 추가하시겠습니까?");

                // 해당 리스트를 추가/취소
                if (confirmSubmit) addCurrentPlayList();
                else addToast("플레이리스트 신청이 취소되었습니다.");

                // 일반 유저인 경우
            } else {
                const isConfirm = window.confirm("저장된 해당 음악을 요청하시겠습니까?");
                if (!isConfirm) return addToast(CANCEL_USER_REQ);

                await addDoc(collection(initFireStore, "userRequest"), {
                    nickName: token.nickName,
                    createAt: Date.now(),
                    request: "playSavedMusic",
                    title: item.title,
                    link: item.link,
                })
                    .then(() => {
                        addToast(`저장된 해당 음악을 요청하였습니다.`);
                    })
                    .catch((e) => {
                        alert("요청에 실패하였습니다.");
                        console.log("유저 요청실패 error:",e);
                    });
            }
        })()
    }

    return (
        <li key={idx} className="flex justify-between border-2 border-gray-400 px-2 py-1 rounded-md bg-white w-full">
            <div className="flex gap-3">
                <p>{`${idx + 1}. ${item.title || item?.nickName + "님의 신청곡"}`}</p>
                <button
                    className="text-[12px] border border-gray-600 px-2 rounded-md"
                    type="button"
                    onClick={onPreViewModal}
                >
                    미리 보기
                </button>
            </div>

            <div className="flex">
                <div className="flex gap-2">

                    {/* 에디트 아이콘은 반드시 본인에게만 나타남 (저장된 리스트가 아닌 경우만) */}
                    {(!isSavedList && item?.nickName === token?.nickName) &&
                        <button type="button" onClick={onEditModal}>
                            <EditIcon className="cursor-pointer"/>
                        </button>
                    }

                    {isSavedList &&
                        <button type="button" onClick={submitCurrentSavedMusic}>
                            <AddIcon style={{cursor: "pointer"}}/>
                        </button>
                    }

                    {/* 어드민 계정에서만 삭제 가능 */}
                    {(
                        (isSavedList && token.role === 1) ||
                        (!isSavedList && item?.nickName === token?.nickName) ||
                        (token.role === 1)) &&
                        <button type="button" onClick={onDelete}>
                            <CloseIcon/>
                        </button>
                    }
                </div>
            </div>
        </li>
    )
}

export default SubmitListItem;
