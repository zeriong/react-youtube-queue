import {useToastsStore} from "../common/components/Toasts";
import ReactPlayer from "react-player";
import {useEffect, useRef, useState} from "react";
import {DEFAULT_PLAYLIST} from "../../constants/defaultPlaylist";
import {collection, onSnapshot, query, orderBy} from "firebase/firestore";
import {initFireStore} from "../../libs/firebase";
import PreViewModal from "./components/modal/PreView.modal";
import {deletePlayList, deleteUser} from "../../utils/firebase";
import {useTokenStore} from "../../App";
import SubmitListItem from "./components/SubmitListItem";
import {LogoutIcon, PlayIcon} from "../svgComponents";
import Cursor from "../common/components/Cursor";
import EditModal from "./components/modal/Edit.modal";

const YoutubeQueuePlay = () => {
    const playerRef = useRef(null);
    const shuffleRef = useRef([]);
    const isSubmitPlaying = useRef(false);

    const [currentURL, setCurrentURL] = useState("");
    const [submitList, setSubmitList] = useState([]);

    const [currentData, setCurrentData] = useState(null);
    const [isShowPreViewModal, setIsShowPreViewModal] = useState(false);
    const [isShowEditModal, setIsShowEditModal] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [isPlay, setIsPlay] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const toastStore = useToastsStore();
    const tokenStore = useTokenStore();
    
    // 접속 종료
    const logout = async () => {
        await deleteUser(tokenStore.token.id);
        tokenStore.deleteToken();
        toastStore.addToast("로그아웃 되었습니다.");
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
        isSubmitPlaying.current = !!submitList.length;
        // 신청곡이 없다면 기본 곡 에서 랜덤재생
        if (!isSubmitPlaying.current) return defaultPlayer();
        // 신청곡이 있다면 차례로 재생
        const firstItem = submitList[0];
        const isDeleted = deletePlayList(firstItem.id);
        if (!isDeleted) return alert("삭제에 실패하였습니다, 서버를 점검해주세요.");
        // currentURL state를 변경하여 즉시 플레이어 실행
        setCurrentURL(firstItem.link);
    }

    // 동영상이 준비된 상태를 체크하여 실행
    useEffect(() => {
        if (isReady) setIsPlay(true);
        else setIsPlay(false);
    }, [isReady]);

    // 신청곡을 감지하여 기본 플리 재생중일 땐 즉시 신청곡을 재생하도록 구성
    useEffect(() => {
        if (isStart && !isSubmitPlaying.current) playYoutubeMusic();
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
    }, []);

    return (
        <>
            <div className="flex w-full h-full cursor-default">

                {/* 플레이어 컨텐츠 섹션 */}
                <section className="w-full flex flex-col items-center mt-[100px] gap-12">
                    {
                        // 어드민인 경우 플레이어 렌더링
                        (tokenStore.token?.role === 1
                        ) ? (
                            <div className="w-[600px] h-[330px]">
                                {isStart ?
                                    <ReactPlayer
                                        url={currentURL}
                                        width='100%'
                                        height='100%'
                                        controls={true}
                                        playing={isPlay}
                                        onEnded={() => {
                                            playYoutubeMusic();
                                            setIsReady(false);
                                        }}
                                        onReady={() => setIsReady(true)}
                                        className="react-player"
                                        ref={playerRef}
                                    />
                                    :
                                    <div onClick={playYoutubeMusic} className="group w-full h-full bg-black text-white flex justify-center items-center cursor-pointer">
                                        <div className="flex flex-col justify-center items-center gap-4 group-hover:scale-105">
                                            <p className="text-4xl">플레이리스트 재생하기</p>
                                            <PlayIcon fill="#fff" width={100} height={100}/>
                                        </div>
                                    </div>
                                }
                            </div>
                        ) : (
                            // 일반 인증자인 경우 블랙보드 렌더링
                            <div className="border-2 border-gray-500 rounded-lg p-5">
                                <div
                                    className="flex flex-col justify-center items-center w-[600px] h-[330px] bg-black text-white text-center gap-4 rounded-lg">
                                    <p className="text-[24px]">
                                        음악 재생은 어드민 유저에게 맡겨주세요!
                                    </p>
                                    <p>
                                        일반 인증 유저는 원하는 유튜브 음악을<br/>
                                        신청, 삭제, 수정할 수 있습니다.
                                    </p>
                                </div>
                            </div>
                        )
                    }
                    <div className="p-10 grow w-full">
                        <div className="border-4 border-gray-500 w-full h-full rounded-2xl p-4">
                            <div className="text-2xl">
                                준비중인 기능입니다.
                                <Cursor/>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 어사이드 바 */}
                <section className="flex flex-col relative right-0 pt-4 px-6 pb-6 border-l-[5px] border-gray-700">

                    {/* 헤더 */}
                    <header className="flex flex-col gap-6 mb-4">
                        {/* 상단 헤드라인 */}
                        <div className="flex gap-4 items-center">
                            <p className="font-bold text-4xl">
                                Youtube Queue Player!
                            </p>
                            <button
                                type="button"
                                className="bg-gray-300 px-3 py-2 rounded-md text-[20px] hover:scale-110"
                                onClick={logout}
                            >
                                <LogoutIcon/>
                            </button>
                        </div>

                        {/* 신청 버튼 */}
                        <button type="button" onClick={() => setIsShowEditModal(true)} className="rounded-[12px] p-[3px] border-2 border-gray-500 bg-gray-300">
                            <p className="font-bold text-white bg-red-500/85 py-3 text-[20px] rounded-[9px] text-line border-2 border-gray-500">
                                유튜브음악 신청하기
                            </p>
                        </button>
                    </header>

                    {/* 신청 리스트 */}
                    <section className="p-2 bg-gray-100 rounded-md grow overflow-hidden">
                        <ul className="flex flex-col gap-1 h-full overflow-auto customScroll-vertical">
                            {submitList?.map((list, idx) =>
                                <SubmitListItem
                                    key={idx}
                                    // 미리보기 모달을 띄울 setState
                                    setIsShowPreViewModal={setIsShowPreViewModal}
                                    // 클릭한 데이터를 전달 하는 setState
                                    setCurrentData={setCurrentData}
                                    // 에디트 모달을 띄울 setState
                                    setIsShowEditModal={setIsShowEditModal}
                                    tokenStore={tokenStore}
                                    item={list}
                                    idx={idx}
                                />
                            )}
                        </ul>
                    </section>
                </section>
            </div>

            {/* 신청/수정 모달 */}
            <EditModal
                setIsShow={setIsShowEditModal}
                isShow={isShowEditModal}
                setCurrentData={setCurrentData}
                currentData={currentData}
            />
            {/* 미리보기 모달 */}
            <PreViewModal
                setIsShow={setIsShowPreViewModal}
                isShow={isShowPreViewModal}
                preViewData={currentData}
                setPreviewData={setCurrentData}
            />
        </>
    )
}

export default YoutubeQueuePlay;