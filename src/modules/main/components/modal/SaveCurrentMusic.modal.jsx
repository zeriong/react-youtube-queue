import {useSavedMusicStore} from "../buttons/SavedMusicListButton";
import {CloseIcon} from "../../../svgComponents/svgComponents";
import SubmitListItem from "../lists/SubmitListItem";
import React from "react";

const SaveCurrentMusicModal = ({ isShow, setIsShow, submit, titleInputRef }) => {
    return isShow &&
        <div
            onClick={() => setIsShow(false)}
            className="fixed top-0 left-0 z-50 w-full h-full bg-black/50 flex justify-center items-center"
        >
            <section className="p-3 max-w-[500px] w-full">
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full h-full flex flex-col rounded-2xl"
                >
                    {/* 모달 헤더 */}
                    <header className="py-2 px-2 flex justify-between">
                        <p>재생중인 음악 저장</p>
                        <button type="button" onClick={() => setIsShow(false)}>
                            <CloseIcon/>
                        </button>
                    </header>

                    {/* 플레이리스트 타이틀지정 폼 */}
                    <form className="flex gap-2 px-2 mb-3" onSubmit={submit}>
                        <div className="relative w-full">
                            <input
                                ref={titleInputRef}
                                type="text"
                                className="w-full border-2 border-gray-500 pl-2 pr-6 py-1 rounded-md relative text-[15px] items-center"
                                placeholder="재생중인 음악에 타이틀을 입력해주세요."
                            />
                            <button
                                type="button"
                                className="bg-black absolute right-[7px] top-1/2 -translate-y-1/2 rounded-full p-[2px] opacity-80"
                                onClick={() => {
                                    titleInputRef.current.value = "";
                                    titleInputRef.current.focus();
                                }}
                            >
                                <CloseIcon fill="#fff" width={12} height={12}/>
                            </button>
                        </div>
                        <button className="border px-2 rounded-md bg-gray-300 font-bold hover:scale-105" type="submit">
                            저장하기
                        </button>
                    </form>
                </div>
            </section>
        </div>
}

export default SaveCurrentMusicModal;