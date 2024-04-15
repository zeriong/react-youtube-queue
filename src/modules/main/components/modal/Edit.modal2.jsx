import React, {useEffect, useRef, useState} from "react";
import {CloseIcon} from "../../../svgComponents";
import {useToastsStore} from "../../../common/components/Toasts";
import {vibrate} from "../../../../utils/common";
import {YOUTUBE_BASE_URL} from "../../../../constants";
import {updatePlayLink} from "../../../../utils/firebase";
import ReactPlayer from "react-player";

const EditModal2 = ({ isShow, setIsShow, currentData }) => {
    const modalRef = useRef();
    const inputRef = useRef();
    const [editInputValue, setEditInputValue] = useState("");
    const toastStore = useToastsStore();

    // 에디트 서브밋 함수
    const editSubmit = async (e) => {
        e.preventDefault();
        // 유튜브 링크인지 체크 후 아니라면 toast 알림을 띄움
        if (!editInputValue.includes(YOUTUBE_BASE_URL)) {
            vibrate(modalRef); // 진동 애니메이션
            return toastStore.addToast("유튜브 링크를 입력해주세요.");
        }
        if (!ReactPlayer.canPlay(editInputValue)) return toastStore.addToast("재생 가능한 동영상 링크가 아닙니다.");
        // 업데이트 요청
        const isUpdate = updatePlayLink(currentData.id, { link: editInputValue });
        // 업데이트 성공, 실패 처리
        if (isUpdate) setIsShow(false);
        toastStore.addToast(isUpdate ? "링크가 수정되었습니다." : "링크 수정에 실패하였습니다.");
    }

    // 클릭한 데이터 적용
    useEffect(() => {
        if (isShow) setEditInputValue(currentData.link);
    }, [isShow]);

    return isShow &&
        <div onClick={() => setIsShow(false)} className="fixed top-0 left-0 z-50 w-full h-full bg-black/50 flex justify-center items-center">
            <section ref={modalRef} className="p-3 max-w-[500px] w-full relative">

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full h-full flex flex-col rounded-2xl"
                >
                    {/* 모달 헤더 */}
                    <header className="py-2 px-2 flex justify-between">
                        <p>신청곡 변경</p>
                        <button type="button" onClick={() => setIsShow(false)}>
                            <CloseIcon/>
                        </button>
                    </header>
                    {/* 플레이어 영역 */}
                    <form onSubmit={editSubmit} className="grow px-4 pb-2">
                        <div className="w-full flex mb-2 gap-2">
                            <div className="relative flex grow">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={editInputValue}
                                    onChange={e => setEditInputValue(e.target.value)}
                                    className="pl-2 pr-5 py-1 w-full border-2 rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditInputValue("");
                                        inputRef.current.focus();
                                    }}
                                    className="absolute p-[2px] bg-black right-[7px] top-1/2 -translate-y-1/2 rounded-full opacity-70"
                                >
                                    <CloseIcon fill="#fff" width={10} height={10}/>
                                </button>
                            </div>

                            <button type="submit" className="border border-black px-2 rounded-lg">
                                수정
                            </button>
                        </div>

                        <p className="text-[12px] font-bold text-red-700">※ 유튜브 링크를 넣어주세요!</p>
                    </form>
                </div>
            </section>
        </div>
}

export default EditModal2;