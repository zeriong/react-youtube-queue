import ReactPlayer from "react-player";
import React, {useEffect, useRef, useState} from "react";
import {useToastsStore} from "../../../../common/Toasts";
import {CloseIcon} from "../../../../svgComponents/svgComponents";
import {YOUTUBE_BASE_URL} from "../../../../../constants";
import {initFireStore} from "../../../../../libs/firebase";
import {addDoc, collection} from "firebase/firestore";
import {updateFireStoreData} from "../../../../../utils/firebase";
import {useTokenStore} from "../../../../../store/commonStore";
import {usePlayerStore} from "../../../../../store/playerStore";
import {useUserStore} from "../../../../../store/userStore";

const EditModal = () => {
    const timeoutRef = useRef(null);
    const submitInputAreaRef = useRef(null);

    // input target ref
    const submitInputRef = useRef(null);
    const titleInputRef = useRef(null);

    const [submitURLInput, setSubmitURLInput] = useState("");
    const [canSubmit, setCanSubmit] = useState(false);
    const [isOnce, setIsOnce] = useState(false);

    const { user } = useUserStore()
    const { addToast } = useToastsStore();
    const tokenStore = useTokenStore();
    const {
        submitMaxLength, submitMusic, selectedCurrentMusic,
        setSelectedCurrentMusic, isShowEditModal, setIsShowEditModal
    } = usePlayerStore();

    // submit URL onChange
    const handleSubmitOnChange = ({ target: { value } }) => {
        setCanSubmit(false);
        if (value.trim() === "") return;
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;

            timeoutRef.current = setTimeout(() => {
                setSubmitURLInput(value);
            }, 1000);
        } else {
            timeoutRef.current = setTimeout(() => {
                setSubmitURLInput(value);
            }, 1000);
        }
    }

    // 신청곡 url submit
    const submitURL = async (e) => {
        e.preventDefault();
        // 서브밋이 불가능한 경우 막음
        if (!canSubmit) return;
        if (submitURLInput.trim() === "") return addToast("신청하실 유튜브 음악 링크를 입력해주세요.");
        // 유튜브 링크인지 체크 후 아니라면 toast 알림을 띄움
        if (!submitURLInput.includes(YOUTUBE_BASE_URL)) {
            return addToast("유튜브 링크를 입력해주세요.");
        }
        // 정상적인 비디오 링크인지 검증
        if (!ReactPlayer.canPlay(submitURLInput)) {
            return addToast("재생가능한 동영상 링크가 아닙니다!");
        }

        // 새로 추가인 경우
        if (!selectedCurrentMusic) {
            // 신청곡 최대 개수 이상인 경우
            if (submitMaxLength <= submitMusic.length) {
                setIsShowEditModal(false);
                return addToast(`신청 가능한 플레이리스트는 최대 ${submitMaxLength}개입니다.`);
            }
            // confirm을 체크 후 fireStore에 저장
            const confirmSubmit = window.confirm("플레이리스트에 추가하시겠습니까?");
            if (confirmSubmit) {
                await addDoc(collection(initFireStore, "playList"), {
                    // todo: 추 후 uid와 nickName에 대한 refactoring 필요
                    uid: user.uid,
                    nickName: user.displayName,
                    createAt: Date.now(),
                    link: submitURLInput,
                    title: titleInputRef.current.value,
                })
                    .then(() => {
                        addToast("플레이리스트에 추가되었습니다.");
                        setIsShowEditModal(false);
                    })
                    .catch((e) => {
                        alert("플레이리스트 추가에 실패하였습니다.");
                        console.log(e);
                    });
            } else {
                addToast("플레이리스트 신청이 취소되었습니다.");
            }

            // 수정하는 경우
        } else {
            // 이전 링크와 같다면 취소
            if (selectedCurrentMusic.link === submitURLInput.trim()) {
                addToast("이전 URL과 동일하여 수정을 취소합니다.");
                return setIsShowEditModal(false);
            }
            // 업데이트 요청
            const isUpdate = updateFireStoreData(selectedCurrentMusic.id, { link: submitURLInput.trim() }, "playList");
            // 업데이트 성공, 실패 처리
            if (isUpdate) setIsShowEditModal(false);
            addToast(isUpdate ? "링크가 수정되었습니다." : "링크 수정에 실패하였습니다.");
        }
    }

    // 모달 창이 닫히면 state 초기화
    useEffect(() => {
        if (!isShowEditModal) {
            setSelectedCurrentMusic(null);
            setSubmitURLInput("");
        // 최초 모달 띄울 경우 제목 미필수 안내 토스트 띄움
        } else if (!isOnce) {
            setIsOnce(true);
            addToast("제목은 필수 입력이 아닙니다.<br/> 미입력 시 (닉네임 + 신청곡)으로 표기됩니다.")
        }
    }, [isShowEditModal]);

    // 수정인 경우 setState
    useEffect(() => {
        if (selectedCurrentMusic && submitInputRef.current) {
            submitInputRef.current.value = selectedCurrentMusic.link;
            setSubmitURLInput(selectedCurrentMusic.link);
        }
    }, [selectedCurrentMusic]);

    return isShowEditModal &&
        <div onClick={() => setIsShowEditModal(false)}
             className="fixed top-0 left-0 z-50 w-full h-full bg-black/50 flex justify-center items-center">
            {/* 미리보기 영역 */}
            <section className="p-3 max-w-[500px] max-h-[500px] w-full h-full">
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full h-full flex flex-col rounded-2xl"
                >
                    {/* 모달 헤더 */}
                    <header className="py-2 px-2 flex justify-between font-bold border-b-2 mb-2">
                        {selectedCurrentMusic ? "신청곡 수정하기" : "유튜브 음악 신청하기"}
                        <button type="button" onClick={() => setIsShowEditModal(false)}>
                            <CloseIcon/>
                        </button>
                    </header>
                    {/* 신청 폼 */}
                    <form className="flex gap-2 px-2 mb-3" onSubmit={submitURL}>
                        <div ref={submitInputAreaRef} className="relative w-full flex flex-col gap-2">

                            {/* 신청곡 url input */}
                            <div className="flex items-center gap-2">
                                <p onClick={() => submitInputRef.current.focus()}>
                                    Youtube URL:
                                </p>
                                {/* 신청곡 url input */}
                                <div className="relative w-full">
                                    <input
                                        ref={submitInputRef}
                                        type="text"
                                        className="w-full border-2 border-gray-500 pl-2 pr-6 py-1 rounded-md relative text-[15px] items-center"
                                        onChange={handleSubmitOnChange}
                                        placeholder="유튜브 URL을 입력해주세요!"
                                    />
                                    <button
                                        type="button"
                                        className="bg-black absolute right-[7px] top-1/2 -translate-y-1/2 rounded-full p-[2px] opacity-80"
                                        onClick={() => {
                                            submitInputRef.current.value = "";
                                            setSubmitURLInput("");
                                            submitInputRef.current.focus();
                                        }}
                                    >
                                        <CloseIcon fill="#fff" width={12} height={12}/>
                                    </button>
                                </div>
                            </div>

                            {/* 신청곡 제목 input */}
                            <div className="flex items-center gap-2">
                                <div className="relative top-[-5px]" onClick={() => titleInputRef.current.focus()}>
                                    <p>신청곡 제목:</p>
                                    <p className="absolute text-[12px] left-1/2 -translate-x-1/2 bottom-[-12px] font-bold text-gray-400/85">( 선택 사항 )</p>
                                </div>
                                <div className="relative w-full">
                                    <input
                                        ref={titleInputRef}
                                        type="text"
                                        className="w-full border-2 border-gray-500 pl-2 pr-6 py-1 rounded-md relative text-[15px] items-center"
                                        placeholder={selectedCurrentMusic ? "수정할 제목을 입력해주세요." : "신청곡의 제목을 입력해주세요."}
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
                            </div>

                        </div>
                        <button
                            className={`border px-2 rounded-md ${canSubmit ? "bg-gray-300 font-bold hover:scale-105" : "bg-gray-100 text-gray-400"}`}
                            type="submit">
                            {selectedCurrentMusic ? "수정하기" : "신청하기"}
                        </button>
                    </form>
                    {/* 플레이어 영역 */}
                    <section className="grow px-2 pb-2">
                        <div className="rounded-xl overflow-hidden h-full w-full">
                            {submitURLInput ?
                                <ReactPlayer
                                    width="100%"
                                    height="100%"
                                    controls={true}
                                    url={submitURLInput}
                                    onReady={(e) => {
                                        if (e.getDuration() !== 0) setCanSubmit(true);
                                    }}
                                />
                                :
                                <div
                                    className="bg-black/80 h-full w-full text-3xl text-white flex justify-center items-center">
                                    <div className="flex flex-col justify-center items-center gap-4">
                                        <p>{selectedCurrentMusic ? "유튜브음악을 수정하기 전에" : "유튜브음악을 신청하기 전에"}</p>
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
