import {ModalStandard} from "../../../../common/ModalStandard";
import ReactPlayer from "react-player";
import React, {useEffect, useState} from "react";
import {usePlayerStore} from "../../../../../store/playerStore";
import {addDoc, collection, onSnapshot, query} from "firebase/firestore";
import {useTokenStore} from "../../../../../store/commonStore";
import {initFireStore} from "../../../../../libs/firebase";
import {CANCEL_USER_REQ} from "../../../../../constants/message";
import {useToastsStore} from "../../../../common/Toasts";

const RequestEditVolumeModal = () => {
    const [currentVolume, setCurrentVolume] = useState(100);
    const {token} = useTokenStore();
    const {addToast} = useToastsStore();
    const {setIsShowEditVolumeModal, isShowEditVolumeModal} = usePlayerStore();

    // 일시정지 요청
    const requestEditVolume = (item) => {
        (async () => {
            const isConfirm = window.confirm("볼륨 변경을 요청하시겠습니까?");
            if (!isConfirm) return addToast(CANCEL_USER_REQ);

            await addDoc(collection(initFireStore, "userRequest"), {
                nickName: token.nickName,
                createAt: Date.now(),
                request: "volume",
                volume: currentVolume,
            })
                .then(() => {
                    addToast("볼륨 변경을 요청하였습니다.");
                })
                .catch((e) => {
                    alert("요청에 실패하였습니다.");
                    console.log("유저 요청실패 error:",e);
                });
        })();
    }

    useEffect(() => {
        // 볼륨정보 받아옴
        const volumeQuery = query(collection(initFireStore, "currentVolume"));

        // onSnapshot을 활용하여 실시간 데이터를 받음
        onSnapshot(volumeQuery, (snapshot) => {
            const contentArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // 언제나 볼륨은 1개 item만 존재
            setCurrentVolume(contentArr[0]);
        });
    }, []);
    return (
        <ModalStandard
            setIsShow={setIsShowEditVolumeModal}
            isShow={isShowEditVolumeModal}
            isFit={true}
            headerTitle={"볼륨 변경 요청"}
            contentArea={
                <section className="grow px-2 pb-2">
                    <div className="rounded-xl overflow-hidden h-full w-full">
                        {currentVolume}
                    </div>
                </section>
            }
        />
    )
}

export default RequestEditVolumeModal;