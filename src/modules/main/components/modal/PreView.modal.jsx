import React from "react";
import ReactPlayer from "react-player";
import {CloseIcon} from "../../../svgComponents";

const PreViewModal = ({ isShow, setIsShow, preViewData }) => {
    return isShow &&
        <div onClick={() => setIsShow(false)} className="fixed top-0 left-0 z-50 w-full h-full bg-black/50 flex justify-center items-center">
            {/* 미리보기 영역 */}
            <section className="p-3 max-w-[500px] max-h-[500px] w-full h-full">

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full h-full flex flex-col rounded-2xl"
                >
                    {/* 모달 헤더 */}
                    <header className="py-2 px-2 flex justify-between">
                        <p>{ `${preViewData.nickName}님의 신청곡` }</p>
                        <button type="button" onClick={() => setIsShow(false)}>
                            <CloseIcon/>
                        </button>
                    </header>
                    {/* 플레이어 영역 */}
                    <section className="grow px-2 pb-2">
                        <div className="rounded-xl overflow-hidden h-full w-full">
                            <ReactPlayer
                                width="100%"
                                height="100%"
                                controls={true}
                                url={preViewData.link}
                            />
                        </div>
                    </section>
                </div>
            </section>
        </div>
}

export default PreViewModal;