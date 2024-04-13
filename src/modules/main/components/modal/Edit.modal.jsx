import React from "react";
import ReactPlayer from "react-player";
import {CloseIcon} from "../../../svgComponents";
import {useToastsStore} from "../../../common/components/Toasts";

const EditModal = ({ isShow, setIsShow, editInputValue, setEditInputValue }) => {
    const toastStore = useToastsStore();

    const editSubmit = (e) => {
        e.preventDefault();
        // 유튜브 링크인지 체크 후 아니라면 toast 알림을 띄움
        if (!editInputValue.includes("https://www.youtube.com/watch")) {
            return toastStore.addToast("유튜브 링크를 입력해주세요.");
        }
    }

    return isShow &&
        <div onClick={() => setIsShow(false)} className="fixed top-0 left-0 z-50 w-full h-full bg-black/50 flex justify-center items-center">
            {/* 미리보기 영역 */}
            <section className="p-3 max-w-[500px] w-full">

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
                        <input
                            type="text"
                            value={editInputValue}
                            onChange={e => setEditInputValue(e.target.value)}
                            className="p-2 w-full"
                        />
                        <p className="text-[12px] font-bold text-red-700">※ 유튜브 링크를 넣어주세요!</p>
                    </form>
                </div>
            </section>
        </div>
}

export default EditModal;