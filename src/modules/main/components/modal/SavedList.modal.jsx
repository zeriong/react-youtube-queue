import {CloseIcon} from "../../../svgComponents/svgComponents";
import React, {useEffect} from "react";
import SubmitListItem from "../lists/SubmitListItem";
import {usePlayerStore} from "../../../../store/playerStore";

const SavedListModal = () => {
    const { saveMusicMaxLength, savedMusic, isShowSavedListModal, setIsShowSavedListModal } = usePlayerStore();

    useEffect(() => {
        console.log(savedMusic.length)
    }, [savedMusic]);

    return isShowSavedListModal &&
        <div onClick={() => setIsShowSavedListModal(false)}
             className="fixed top-0 left-0 z-50 w-full h-full bg-black/50 flex justify-center items-center">
            {/* 미리보기 영역 */}
            <section className="p-3 max-w-[500px] max-h-[500px] w-full h-full">

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full h-full flex flex-col rounded-2xl"
                >
                    {/* 모달 헤더 */}
                    <header className="py-2 px-2 flex justify-between">
                        <p>저장된 플레이리스트<span>{`${savedMusic.length + "/" + saveMusicMaxLength}`}</span></p>
                        <button type="button" onClick={() => setIsShowSavedListModal(false)}>
                            <CloseIcon/>
                        </button>
                    </header>
                    {/* 저장된 플레이리스트 영역 */}
                    <section className="grow px-2 pb-2">
                        <ul className="p-2 bg-gray-100 rounded-md overflow-hidden h-full min-h-[200px]">
                            {!!savedMusic.length ?
                                savedMusic.map((item, idx) =>
                                    <div key={idx} className="flex w-full gap-2">
                                        {/*<input type="checkbox"/>*/}
                                        <SubmitListItem item={item} idx={idx} isSavedList={true}/>
                                    </div>
                                )
                                :
                                <div className="flex h-full justify-center items-center text-gray-400 text-2xl">
                                    <p>저장된 플레이리스트가 없습니다.</p>
                                </div>
                            }
                        </ul>
                    </section>
                </div>
            </section>
        </div>
}

export default SavedListModal;