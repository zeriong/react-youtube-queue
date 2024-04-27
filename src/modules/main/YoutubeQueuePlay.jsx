import {useToastsStore} from "../common/components/Toasts";
import ReactPlayer from "react-player";
import {useEffect, useRef, useState} from "react";
import {DEFAULT_PLAYLIST} from "../../constants/defaultPlaylist";
import {collection, onSnapshot, query, orderBy} from "firebase/firestore";
import {initFireStore} from "../../libs/firebase";
import PreViewModal from "./components/modal/PreView.modal";
import {deletePlayList, deleteUser} from "../../utils/firebase";
import {useTokenStore} from "../../App";
import SubmitListItem from "./components/lists/SubmitListItem";
import {LogoutIcon, PlayIcon, SavedPlayList} from "../svgComponents/svgComponents";
import Cursor from "../common/components/Cursor";
import EditModal from "./components/modal/Edit.modal";
import PlayPrev from "./components/buttons/PlayPrev";
import playPrev from "./components/buttons/PlayPrev";
import PlayNext from "./components/buttons/PlayNext";
import SavedListModal from "./components/modal/SavedList.modal";
import PlayerAside from "./components/section/PlayerAside";
import PlayerSection from "./components/section/PlayerSection";

const YoutubeQueuePlay = () => {
    const shuffleRef = useRef([]);
    const isSubmitPlayingRef = useRef(false);
    const submitMaxRef= useRef(20);

    const [currentURL, setCurrentURL] = useState("");
    const [submitList, setSubmitList] = useState([]);

    const [currentData, setCurrentData] = useState(null);
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
    
    // 접속 종료
    const logout = async () => {
        await deleteUser(tokenStore.token.id);
        tokenStore.deleteToken();
        toastStore.addToast("로그아웃 되었습니다.");
    }

    // 신청하기 버튼 함수
    const submitMusic = () => {
        if (submitMaxRef.current <= submitList.length) {
            return toastStore.addToast(`신청 가능한 플레이리스트는 최대 ${submitMaxRef.current}개입니다.`)
        }
        setIsShowEditModal(true);
    }

    // 기본 Lofi음악 리스트 랜덤 재생
    const defaultPlayer = () => {
        // 난수 생성
        const randomNum = Math.floor(Math.random() * DEFAULT_PLAYLIST.length);
        // 난수가 이미 배열에 존재하면 재귀하여 재생성
        if (shuffleRef.current.some(val => randomNum === val)) return defaultPlayer();
        // 존재하지 않는 난수를 생성 시 셔플ref에 푸시
        shuffleRef.current.push(randomNum);
        // 해당 번호의 리스트를 currentURL에 setState
        setCurrentURL(DEFAULT_PLAYLIST[randomNum]);
        // 셔플ref가 가득 차면 초기화
        if (shuffleRef.current.length === DEFAULT_PLAYLIST.length) shuffleRef.current = [];
    }

    // 재생상태를 지정하고 상태에 따른 플레이어 재생
    const playYoutubeMusic = () => {
        // 첫 재생을 위한 컴포넌트 변경
        if (!isStart) setIsStart(true);
        // 기본 플리 재생중인지 아닌지 체크할 수 있도록
        isSubmitPlayingRef.current = !!submitList.length;
        // 신청곡이 없다면 기본 곡 에서 랜덤재생
        if (!isSubmitPlayingRef.current) {
            return defaultPlayer();
        }
        // 신청곡이 있다면 차례로 재생
        const firstItem = submitList[0];
        // 리스트에서 삭제
        const isDeleted = deletePlayList(firstItem.id);
        if (!isDeleted) return alert("삭제에 실패하였습니다, 서버를 점검해주세요.");
        // currentURL state를 변경하여 즉시 플레이어 실행
        setCurrentURL(firstItem.link);
    }

    // 이전곡을 재생할 함수
    const playPrevMusic = () => {
        console.log("아직은 미구현!")
    }

    // 온라인 함수
    const onFunc = () => {
        if (isStart && !isReady) setIsReady(true);
    }

    // 오프라인 함수
    const offFunc = () => {
        if (isStart && isReady) setIsReady(false);
    }

    // 동영상이 준비된 상태를 체크하여 실행
    useEffect(() => {
        if (isReady) setIsPlay(true);
        else setIsPlay(false);
    }, [isReady]);

    // 신청곡을 감지하여 기본 플리 재생중일 땐 즉시 신청곡을 재생하도록 구성
    useEffect(() => {
        if (isStart && !isSubmitPlayingRef.current) playYoutubeMusic();
    }, [submitList]);

    // init effect
    useEffect(() => {
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
           setSubmitList(contentArr);
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
                <button
                     type="button"
                     className="fixed left-[20px] top-[20px] border-4 border-gray-800 rounded-lg"
                     onClick={() => setIsShowSavedListModal(true)}
                >
                    <SavedPlayList width={50} height={50}/>
                </button>

                {/* 플레이어 컨텐츠 섹션 */}
                <PlayerSection
                    currentURL={currentURL}
                    playYoutubeMusic={playYoutubeMusic}
                    isPlay={isPlay}
                    isStart={isStart}
                    prevDisabled={prevDisabled}
                    setIsReady={setIsReady}
                />

                {/* 어사이드 바 */}
                <PlayerAside
                    setCurrentData={setCurrentData}
                    setIsShowEditModal={setIsShowEditModal}
                    setIsShowPreViewModal={setIsShowPreViewModal}
                    submitList={submitList}
                    submitMax={submitMaxRef.current}
                    logout={logout}
                    submitMusic={submitMusic}
                />
            </div>

            {/* 신청/수정 모달 */}
            <EditModal
                setIsShow={setIsShowEditModal}
                isShow={isShowEditModal}
                setCurrentData={setCurrentData}
                currentData={currentData}
                listLength={submitList.length}
                listMax={submitMaxRef.current}
            />
            {/* 미리보기 모달 */}
            <PreViewModal
                setIsShow={setIsShowPreViewModal}
                isShow={isShowPreViewModal}
                preViewData={currentData}
                setPreviewData={setCurrentData}
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