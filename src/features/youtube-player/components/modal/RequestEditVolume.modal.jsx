import {ModalStandard} from "../../../../components/common/ModalStandard";
import ReactPlayer from "react-player";
import React, {useEffect, useState} from "react";
import {usePlayerStore} from "../../../../../application/store/playerStore";
import {addDoc, collection, onSnapshot, query} from "firebase/firestore";
import {useTokenStore} from "../../../../../application/store/commonStore";
import {initFireStore} from "../../../../../infrastructure/firebase";
import {CANCEL_USER_REQ} from "../../../../../shared/constants/message";
import {useToastsStore} from "../../../../components/common/Toasts";

const RequestEditVolumeModal = () => {
    const [currentVolume, setCurrentVolume] = useState(100);
    const [submitVolume, setSubmitVolume] = useState(100);
    const {token} = useTokenStore();
    const {addToast} = useToastsStore();
    const {setIsShowEditVolumeModal, isShowEditVolumeModal} = usePlayerStore();

    // 직접입력 시 onChange 함수
    const handleOnChange = (e) => {
        const reg = /^[0-9]*$/;
        if (!e.target.value) setSubmitVolume(0);
        else if (reg.test(e.target.value)) {
            if (Number(e.target.value) > 100) setSubmitVolume(100);
            else setSubmitVolume(Number(e.target.value));
        }
    }

    // 볼륨 변경 버튼 함수
    const handleVolumeChangeButton = (size) => {
        let calc = eval(submitVolume + size);
        if (calc < 0) calc = 0;
        if (calc > 100) calc = 100;
        setSubmitVolume(calc);
    }

    // 볼륨 변경 요청 서브밋 함수
    const requestEditVolume = (e) => {
        e.preventDefault();
        (async () => {
            if (submitVolume === currentVolume) return addToast("현재 볼륨과 동일합니다.");
            const isConfirm = window.confirm("볼륨 변경을 요청하시겠습니까?");
            if (!isConfirm) return addToast(CANCEL_USER_REQ);

            await addDoc(collection(initFireStore, "userRequest"), {
                nickName: token.nickName,
                createAt: Date.now(),
                request: "volume",
                volume: submitVolume,
            })
                .then(() => {
                    addToast("볼륨 변경을 요청하였습니다.");
                })
                .catch((e) => {
                    alert("요청에 실패하였습니다.");
                    console.log("유저 요청실패 error:",e);
                })
                .finally(() => {
                    setIsShowEditVolumeModal(false);
                });
        })();
    }

    // isModal effect
    useEffect(() => {
        if (isShowEditVolumeModal) setSubmitVolume(currentVolume);
    }, [isShowEditVolumeModal]);

    // init effect
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
            setCurrentVolume(contentArr[0].volume);
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
                    <form
                        className="rounded-xl overflow-hidden h-full w-full flex flex-col justify-center items-center gap-4"
                        onSubmit={requestEditVolume}
                    >
                        <div className="flex items-center gap-4">

                            {/* 마이너스 */}
                            <div className="flex gap-4 items-center">
                                <button
                                    type="button"
                                    className="p-1 rounded-md bg-gray-200 h-fit w-[32px]"
                                    onClick={() => handleVolumeChangeButton("-10")}
                                >
                                    -10
                                </button>
                                <button
                                    type="button"
                                    className="p-1 rounded-md bg-gray-200 h-fit w-[32px]"
                                    onClick={() => handleVolumeChangeButton("-5")}
                                >
                                    -5
                                </button>
                                <button
                                    type="button"
                                    className="px-2 py-1 rounded-md bg-gray-200 h-fit w-[32px]"
                                    onClick={() => handleVolumeChangeButton("-1")}
                                >
                                    -
                                </button>
                            </div>

                            {/* 요청할 볼륨 */}
                            <p className="font-bold text-center w-[60px] text-[20px]">
                                {submitVolume}
                            </p>

                            {/* 플러스 */}
                            <div className="flex gap-4 items-center">
                                <button
                                    type="button"
                                    className="px-2 py-1 rounded-md bg-gray-200 h-fit w-[32px]"
                                    onClick={() => handleVolumeChangeButton("+1")}>
                                    +
                                </button>
                                <button
                                    type="button"
                                    className="p-1 rounded-md bg-gray-200 h-fit w-[32px]"
                                    onClick={() => handleVolumeChangeButton("+5")}>
                                    +5
                                </button>
                                <button
                                    type="button"
                                    className="p-1 rounded-md bg-gray-200 h-fit w-[32px]"
                                    onClick={() => handleVolumeChangeButton("+10")}>
                                    +10
                                </button>
                            </div>
                        </div>


                        <div className="flex items-center gap-2 px-2">
                            <p>직접 입력: </p>
                            <input
                                className="bg-gray-100 rounded-md px-4 py-1 text-[18px] w-full"
                                type="text"
                                value={submitVolume}
                                onChange={handleOnChange}
                            />
                            <button
                                type="submit"
                                className="border-2 rounded-md p-1"
                            >
                                요청하기
                            </button>
                        </div>
                    </form>
                </section>
            }
        />
    )
}

export default RequestEditVolumeModal;