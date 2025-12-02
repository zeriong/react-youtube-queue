import {CloseIcon} from "../../../../components/ui/svgComponents";
import React, {useEffect, useRef} from "react";
import {getFireStoreData} from "../../../../../shared/utils/firebase";
import {addDoc, collection} from "firebase/firestore";
import {initFireStore} from "../../../../../infrastructure/firebase";
import {usePlayerStore} from "../../../../../application/store/playerStore";
import {useToastsStore} from "../../../../components/common/Toasts";
import {ModalStandard} from "../../../../components/common/ModalStandard";
import {CANCEL_USER_REQ} from "../../../../../shared/constants/message";
import {useTokenStore} from "../../../../../application/store/commonStore";

const SaveCurrentMusicModal = ({isAdmin}) => {
    const titleInputRef = useRef();
    const { addToast } = useToastsStore();
    const {token} = useTokenStore();
    const {
        setIsShowSaveCurrentMusicModal,
        isShowSaveCurrentMusicModal,
        saveMusicMaxLength,
        isSubmitPlaying,
        currentMusic,
        savedMusic,

        // 어드민이 아닌 유저가 요청한 저장일때
        isShowSaveCurrentMusicRequestModal,
        setIsShowSaveCurrentMusicRequestModal,
    } = usePlayerStore();

    const saveCurrentPlayMusic = (e) => {
        (async () => {
            e.preventDefault();
            // 타이틀, 기본음악 저장불가, 최대 음악개수 validate
            if (!titleInputRef.current?.value) return addToast("타이틀을 입력해주세요!");

            // 어드민이 저장하는 경우
            if (isAdmin) {
                if (!isSubmitPlaying) return addToast("기본 음악은 저장할 수 없습니다.");
                if (savedMusic.length >= saveMusicMaxLength) return addToast(`플레이리스트 저장은 최대 ${saveMusicMaxLength}개까지 가능합니다.`);

                const confirmSubmit = window.confirm("재생중인 플레이리스트를 저장하시겠습니까?");
                if (!confirmSubmit) return addToast("플레이리스트 저장이 취소되었습니다.");
            }

            // 링크가 이미 존재한다면 추가하지 않음
            const getSavedLists = await getFireStoreData("savedList");
            if (getSavedLists.some(list => list.link === currentMusic.link)) {
                return addToast("이미 저장된 플레이리스트입니다.");
            }

            // 어드민이 저장할 때
            if (isAdmin) {
                try {
                    // 타이틀 추가 지정
                    currentMusic.title = titleInputRef.current?.value;

                    // 링크가 다르다면 fireStore에 저장
                    await addDoc(collection(initFireStore, "savedList"), currentMusic);
                } catch (e) {
                    console.log("재생중인 플레이리스트 저장에 실패했습니다. \nerror: ", e);
                } finally {
                    setIsShowSaveCurrentMusicModal(false);
                }

            // 유저가 요청한 저장일 때
            } else {
                const isConfirm = window.confirm(`현재 음악 저장을 요청하시겠습니까?`);
                if (!isConfirm) return addToast(CANCEL_USER_REQ);

                await addDoc(collection(initFireStore, "userRequest"), {
                    nickName: token.nickName,
                    createAt: Date.now(),
                    request: "save",
                    musicTitle: titleInputRef.current?.value,
                })
                    .then(() => {
                        addToast(`현재 음악 저장을 요청하였습니다.`);
                    })
                    .catch((e) => {
                        alert("요청에 실패하였습니다.");
                        console.log("유저 요청실패 error:",e);
                    })
                    .finally(() => {
                        setIsShowSaveCurrentMusicRequestModal(false);
                    });
            }
        })();
    };

    return (
        <ModalStandard
            setIsShow={isAdmin ? setIsShowSaveCurrentMusicModal : setIsShowSaveCurrentMusicRequestModal}
            isShow={isAdmin ? isShowSaveCurrentMusicModal : isShowSaveCurrentMusicRequestModal}
            headerTitle={"재생중인 음악 저장"}
            isFit={true}
            contentArea={
                <form className="flex gap-2 px-2 mb-3" onSubmit={saveCurrentPlayMusic}>
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
            }
        />
    )
}

export default SaveCurrentMusicModal;
