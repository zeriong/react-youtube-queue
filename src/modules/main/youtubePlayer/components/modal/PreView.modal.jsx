import React, {useEffect} from "react";
import ReactPlayer from "react-player";
import {usePlayerStore} from "../../../../../store/playerStore";
import {ModalStandard} from "../../../../common/ModalStandard";

const PreViewModal = () => {
    const {
        setSelectedCurrentMusic, selectedCurrentMusic,
        isShowPreViewModal, setIsShowPreViewModal
    } = usePlayerStore();

    // 모달이 사라지면 state 초기화
    useEffect(() => {
        if (!isShowPreViewModal) setSelectedCurrentMusic(null);
    }, [isShowPreViewModal]);

    return (
        <ModalStandard
            setIsShow={setIsShowPreViewModal}
            isShow={isShowPreViewModal}
            headerTitle={`${selectedCurrentMusic?.nickName}님의 신청곡`}
            contentArea={
                <section className="grow px-2 pb-2">
                    <div className="rounded-xl overflow-hidden h-full w-full">
                        <ReactPlayer
                            width="100%"
                            height="100%"
                            controls={true}
                            url={selectedCurrentMusic?.link}
                        />
                    </div>
                </section>
            }
        />
    )
}

export default PreViewModal;