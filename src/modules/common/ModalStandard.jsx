import {CloseIcon} from "../svgComponents/svgComponents";
import React from "react";

export const ModalStandard = ({ isShow, setIsShow, headerTitle, contentArea }) => {
    return isShow &&
        <div onClick={() => setIsShow(false)} className={`fixed top-0 left-0 z-[100] w-full h-full bg-black/50 flex justify-center items-center`}>
            {/* 미리보기 영역 */}
            <section className="p-3 max-w-[500px] max-h-[500px] w-full h-full">
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full h-full flex flex-col rounded-2xl z-10"
                >
                    {/* 모달 헤더 */}
                    <header className="py-2 px-2 flex justify-between">
                        <div>{ headerTitle }</div>
                        <button type="button" onClick={() => setIsShow(false)}>
                            <CloseIcon/>
                        </button>
                    </header>
                    {/* 컨텐츠 영역 */}
                    { contentArea }
                </div>
            </section>
        </div>
}