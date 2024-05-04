import ReactPlayer from "react-player";
import React, {useEffect, useRef, useState} from "react";
import {useToastsStore} from "../../../common/components/Toasts";
import {CloseIcon} from "../../../svgComponents/svgComponents";
import {YOUTUBE_BASE_URL} from "../../../../constants";
import {initFireStore} from "../../../../libs/firebase";
import {addDoc, collection} from "firebase/firestore";
import {updateFireStoreData} from "../../../../utils/firebase";
import {useTokenStore} from "../../../../store/commonStore";

const EditModal = ({ setIsShow, isShow, currentData, setCurrentData, listLength, listMax }) => {
    const timeoutRef = useRef(null);
    const submitInputRef = useRef(null);
    const submitInputAreaRef = useRef(null);

    const [submitInput, setSubmitInput] = useState("");
    const [canSubmit, setCanSubmit] = useState(false);

    const toastStore = useToastsStore();
    const tokenStore = useTokenStore();

    const handleOnChange = ({ target: { value } }) => {
        setCanSubmit(false);
        if (value.trim() === "") return;
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;

            timeoutRef.current = setTimeout(() => {
                setSubmitInput(value);
            }, 1000);
        } else {
            timeoutRef.current = setTimeout(() => {
                setSubmitInput(value);
            }, 1000);
        }
    }

    // 신청곡 url submit
    const submitURL = async (e) => {
        e.preventDefault();
        // 서브밋이 불가능한 경우 막음
        if (!canSubmit) return;
        if (submitInput.trim() === "") return toastStore.addToast("신청하실 유튜브 음악 링크를 입력해주세요.");
        // 유튜브 링크인지 체크 후 아니라면 toast 알림을 띄움
        if (!submitInput.includes(YOUTUBE_BASE_URL)) {
            return toastStore.addToast("유튜브 링크를 입력해주세요.");
        }
        // 정상적인 비디오 링크인지 검증
        if (!ReactPlayer.canPlay(submitInput)) {
            return toastStore.addToast("재생가능한 동영상 링크가 아닙니다!");
        }

        // 새로 추가인 경우
        if (!currentData) {
            // 신청곡 최대 개수 이상인 경우
            if (listMax <= listLength) {
                setIsShow(false);
                return toastStore.addToast(`신청 가능한 플레이리스트는 최대 ${listMax}개입니다.`);
            }
            // confirm을 체크 후 fireStore에 저장
            const confirmSubmit = window.confirm("플레이리스트에 추가하시겠습니까?");
            if (confirmSubmit) {
                await addDoc(collection(initFireStore, "playList"), {
                    nickName: tokenStore.token.nickName,
                    createAt: Date.now(),
                    link: submitInput,
                })
                    .then(() => {
                        toastStore.addToast("플레이리스트에 추가되었습니다.");
                        setIsShow(false);
                    })
                    .catch((e) => {
                        alert("플레이리스트 추가에 실패하였습니다.");
                        console.log(e);
                    });
            } else {
                toastStore.addToast("플레이리스트 신청이 취소되었습니다.");
            }

            // 수정하는 경우
        } else {
            // 이전 링크와 같다면 취소
            if (currentData.link === submitInput.trim()) {
                toastStore.addToast("이전 URL과 동일하여 수정을 취소합니다.");
                return setIsShow(false);
            }
            // 업데이트 요청
            const isUpdate = updateFireStoreData(currentData.id, { link: submitInput.trim() }, "playList");
            // 업데이트 성공, 실패 처리
            if (isUpdate) setIsShow(false);
            toastStore.addToast(isUpdate ? "링크가 수정되었습니다." : "링크 수정에 실패하였습니다.");
        }
    }

    // 모달 창이 닫히면 state 초기화
    useEffect(() => {
        if (!isShow) {
            setCurrentData(null);
            setSubmitInput("");
        }
    }, [isShow]);

    // 수정인 경우 setState
    useEffect(() => {
        if (currentData && submitInputRef.current) {
            submitInputRef.current.value = currentData.link;
            setSubmitInput(currentData.link);
        }
    }, [currentData]);

    return isShow &&
        <div onClick={() => setIsShow(false)}
             className="fixed top-0 left-0 z-50 w-full h-full bg-black/50 flex justify-center items-center">
            {/* 미리보기 영역 */}
            <section className="p-3 max-w-[500px] max-h-[500px] w-full h-full">

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full h-full flex flex-col rounded-2xl"
                >
                    {/* 모달 헤더 */}
                    <header className="py-2 px-2 flex justify-between">
                        {currentData ? "신청곡 수정하기" : "유튜브 음악 신청하기"}
                        <button type="button" onClick={() => setIsShow(false)}>
                            <CloseIcon/>
                        </button>
                    </header>
                    {/* 신청 폼 */}
                    <form className="flex gap-2 px-2 mb-3" onSubmit={submitURL}>
                        <div ref={submitInputAreaRef} className="relative w-full">
                            <input
                                ref={submitInputRef}
                                type="text"
                                className="w-full border-2 border-gray-500 pl-2 pr-6 py-1 rounded-md relative text-[15px] items-center"
                                onChange={handleOnChange}
                                placeholder={currentData ? "수정할 유튜브 음악 URL을 입력해주세요!" : "유튜브 음악 URL을 입력하여 신청해주세요!"}
                            />
                            <button
                                type="button"
                                className="bg-black absolute right-[7px] top-1/2 -translate-y-1/2 rounded-full p-[2px] opacity-80"
                                onClick={() => {
                                    submitInputRef.current.value = "";
                                    setSubmitInput("");
                                    submitInputRef.current.focus();
                                }}
                            >
                                <CloseIcon fill="#fff" width={12} height={12}/>
                            </button>
                        </div>
                        <button className={`border px-2 rounded-md ${canSubmit ? "bg-gray-300 font-bold hover:scale-105" : "bg-gray-100 text-gray-400"}`} type="submit">
                            {currentData ? "수정하기" : "신청하기"}
                        </button>
                    </form>
                    {/* 플레이어 영역 */}
                    <section className="grow px-2 pb-2">
                        <div className="rounded-xl overflow-hidden h-full w-full">
                            {submitInput ?
                                <ReactPlayer
                                    width="100%"
                                    height="100%"
                                    controls={true}
                                    url={submitInput}
                                    onReady={(e) => {
                                        if (e.getDuration() !== 0) setCanSubmit(true);
                                    }}
                                />
                                :
                                <div className="bg-black/80 h-full w-full text-3xl text-white flex justify-center items-center">
                                    <div className="flex flex-col justify-center items-center gap-4">
                                        <p>{currentData ? "유튜브음악을 수정하기 전에" : "유튜브음악을 신청하기 전에"}</p>
                                        <p>신청곡을 확인해보세요</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </section>
                </div>
            </section>
        </div>
}

export default EditModal;