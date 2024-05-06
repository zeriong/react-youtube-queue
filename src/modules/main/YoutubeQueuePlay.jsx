import {useToastsStore} from "../common/components/Toasts";
import {useEffect, useRef, useState} from "react";
import {collection, onSnapshot, query, orderBy} from "firebase/firestore";
import {initFireStore} from "../../libs/firebase";
import PreViewModal from "./components/modal/PreView.modal";
import {deleteFireStore, deleteUser} from "../../utils/firebase";
import EditModal from "./components/modal/Edit.modal";
import SavedListModal from "./components/modal/SavedList.modal";
import PlayerAside from "./components/section/PlayerAside";
import PlayerSection from "./components/section/PlayerSection";
import {defaultPlayer} from "../../utils/common";
import SavedMusicListButton from "./components/buttons/SavedMusicListButton";
import {useTokenStore} from "../../store/commonStore";
import {usePlayerStore} from "../../store/playerStore";

const YoutubeQueuePlay = () => {
    const shuffleRef = useRef([]);
    const [isShowPreViewModal, setIsShowPreViewModal] = useState(false);
    const [isShowEditModal, setIsShowEditModal] = useState(false);
    const [isShowSavedListModal, setIsShowSavedListModal] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [isPlay, setIsPlay] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // todo: 이전 버튼 구현 시 사용할 disabled state
    const [prevDisabled, setPrevDisabled] = useState(true);

    const toastStore = useToastsStore();
    const tokenStore = useTokenStore();
    const {
        submitMusic, submitMaxLength, isSubmitPlaying,
        setSubmitMusic, setCurrentMusic, setIsSubmitPlaying,
    } = usePlayerStore();

    // 접속 종료
    const logout = async () => {
        await deleteUser(tokenStore.token.id);
        tokenStore.deleteToken();
        toastStore.addToast("로그아웃 되었습니다.");
    }

    // 기본 Lofi음악 리스트 랜덤 재생


    // 재생상태를 지정하고 상태에 따른 플레이어 재생
    const playYoutubeMusic = () => {
        // 첫 재생을 위한 컴포넌트 변경
        if (!isStart) setIsStart(true);

        // 기본 플리 재생중인지 아닌지 체크할 수 있도록
        const isSubmitPlayingVar = !!submitMusic.length;
        setIsSubmitPlaying(isSubmitPlayingVar);

        // 신청곡이 없다면 기본 곡 에서 랜덤재생
        if (!isSubmitPlayingVar) return defaultPlayer(shuffleRef, setCurrentMusic);

        // 신청곡이 있다면 차례로 재생
        const firstItem = submitMusic[0];
        // 리스트에서 삭제
        const isDeleted = deleteFireStore(firstItem.id, "playList");
        if (!isDeleted) return alert("삭제에 실패하였습니다, 서버를 점검해주세요.");

        // setCurrentMusic -> link state를 변경하여 즉시 플레이어 실행
        setCurrentMusic(firstItem);
    }

    // 이전곡을 재생할 함수
    const playPrevMusic = () => {
        console.log("아직은 미구현!")
    }

    // 동영상이 준비된 상태를 체크하여 실행
    useEffect(() => {
        if (isReady) setIsPlay(true);
        else setIsPlay(false);
    }, [isReady]);

    // 신청곡을 감지하여 기본 플리 재생중일 땐 즉시 신청곡을 재생하도록 구성
    useEffect(() => {
        if (isStart && !isSubmitPlaying) playYoutubeMusic();
    }, [submitMusic]);

    // init effect
    useEffect(() => {
        // 온라인 함수
        const onFunc = () => {
            if (isStart && !isReady) setIsReady(true);
        }
        // 오프라인 함수
        const offFunc = () => {
            if (isStart && isReady) setIsReady(false);
        }

        // 데이터 쿼리를 생성 날짜 오름차순으로 정렬 (queue 형태를 구현하기 위함)
        const setFireStoreQuery = query(
            collection(initFireStore, "playList"),
            orderBy("createAt", "asc")
        );
        // onSnapshot을 활용하여 실시간 데이터를 받음
        onSnapshot(setFireStoreQuery, (snapshot) => {
            const contentArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setSubmitMusic(contentArr);
        });

        window.addEventListener("online", onFunc);
        window.addEventListener("offline", offFunc);

        return () => {
            window.removeEventListener("online", onFunc);
            window.removeEventListener("offline", offFunc);
        }
    }, []);

    return (
        <>
            <div className="flex flex-col pc:flex-row w-full h-full cursor-default relative">

                {/* 저장된 플레이리스트 버튼 */}
                <SavedMusicListButton setIsShowSavedListModal={setIsShowSavedListModal}/>

                {/* 플레이어 컨텐츠 섹션 */}
                <PlayerSection
                    playPrevMusic={playPrevMusic}
                    playYoutubeMusic={playYoutubeMusic}
                    isPlay={isPlay}
                    isStart={isStart}
                    prevDisabled={prevDisabled}
                    setIsReady={setIsReady}
                />

                {/* 어사이드 바 */}
                <PlayerAside
                    setIsShowEditModal={setIsShowEditModal}
                    setIsShowPreViewModal={setIsShowPreViewModal}
                    logout={logout}
                />
            </div>

            {/* 신청/수정 모달 */}
            <EditModal
                setIsShow={setIsShowEditModal}
                isShow={isShowEditModal}
            />
            {/* 미리보기 모달 */}
            <PreViewModal
                setIsShow={setIsShowPreViewModal}
                isShow={isShowPreViewModal}
            />
            {/* 저장된 리스트 모달 */}
            <SavedListModal
                isShow={isShowSavedListModal}
                setIsShow={setIsShowSavedListModal}
            />
        </>
    )
}

export default YoutubeQueuePlay;