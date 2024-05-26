import PlayPrevButton from "../buttons/PlayPrevButton";
import ReactPlayer from "react-player";
import PlayNextButton from "../buttons/PlayNextButton";
import {PlayIcon} from "../../../../svgComponents/svgComponents";
import Cursor from "../../../../common/Cursor";
import SaveCurrentMusicButton from "../buttons/SaveCurrentMusicButton";
import {useTokenStore} from "../../../../../store/commonStore";
import {usePlayerStore} from "../../../../../store/playerStore";
import {useEffect, useRef, useState} from "react";
import {defaultPlayer} from "../../../../../utils/common";
import {deleteFireStore} from "../../../../../utils/firebase";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {initFireStore} from "../../../../../libs/firebase";
import RequestListSection from "./RequestListSection";
import UserRequestSection from "./UserRequestSection";
import {useToastsStore} from "../../../../common/Toasts";

const PlayerSection = () => {
    const playerRef = useRef();

    const { token } = useTokenStore();
    const { currentMusic } = usePlayerStore();
    const { addToast } = useToastsStore();

    const shuffleRef = useRef([]);
    const [isStart, setIsStart] = useState(false);
    const [isPlay, setIsPlay] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // todo: 이전 버튼 구현 시 사용할 disabled state
    const [prevDisabled, setPrevDisabled] = useState(true);

    const {
        submitMusic, isSubmitPlaying, accessedUserReq,
        setSubmitMusic, setCurrentMusic, setIsSubmitPlaying,
        setAccessedUserReq,
    } = usePlayerStore();



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

    // 네트워크 온라인 함수
    const onFunc = () => {
        if (isStart && !isReady) setIsReady(true);
    }
    // 네트워크 오프라인 함수
    const offFunc = () => {
        if (isStart && isReady) setIsReady(false);
    }

    // 요청사항 처리 effect
    useEffect(() => {
        if (!playerRef.current) return addToast("플레이어가 없는 상태입니다.");
        if (playerRef.current && accessedUserReq.id) {
            // 유저 요청 초기화
            setAccessedUserReq({});
            const {request} = accessedUserReq;
            if (request === "pause") playerRef.current?.getInternalPlayer().pauseVideo();
        }
    }, [accessedUserReq])

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

        // 데이터 쿼리를 생성 날짜 오름차순으로 정렬 (queue 형태를 구현하기 위함)
        const playListQuery = query(
            collection(initFireStore, "playList"),
            orderBy("createAt", "asc")
        );

        // onSnapshot을 활용하여 실시간 데이터를 받음
        onSnapshot(playListQuery, (snapshot) => {
            const contentArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSubmitMusic(contentArr);
        });

        // 네트워크 상태 이벤트
        window.addEventListener("online", onFunc);
        window.addEventListener("offline", offFunc);

        return () => {
            window.removeEventListener("online", onFunc);
            window.removeEventListener("offline", offFunc);
        }
    }, []);

    return (
        <section className="w-full flex flex-col items-center mt-[100px] gap-6 p-10 overflow-hidden">

            {/* 플레이어 섹션 */}
            {
                // 어드민인 경우 플레이어 렌더링
                (token?.role === 1
                ) ? (
                    <div className="w-full  flex flex-col">
                        {isStart ?
                            <>
                                {/* Player area */}
                                <div className="relative flex items-center h-full justify-center gap-4">
                                    {/* todo: 이전 곡 버튼 구현예정 */}
                                    <div className="hidden pc:block">
                                        <PlayPrevButton onClick={playPrevMusic} disabled={prevDisabled}/>
                                    </div>

                                    {/* 플레이어 */}
                                    <div className="w-full max-w-[580px] h-[330px]">
                                        <ReactPlayer
                                            ref={playerRef}
                                            url={currentMusic.link}
                                            width='100%'
                                            height='100%'
                                            controls={true}
                                            playing={isPlay}
                                            onEnded={() => {
                                                playYoutubeMusic();
                                                setIsReady(false);
                                            }}
                                            onPause={() => setIsReady(false)}
                                            onReady={() => setIsReady(true)}
                                        />
                                    </div>

                                    {/* 다음 곡 버튼 */}
                                    <div className="hidden pc:block">
                                        <PlayNextButton onClick={playYoutubeMusic}/>
                                    </div>
                                </div>

                                {/* Buttons ([mobile: prev/next] + [default save current music]) */}
                                <div className="flex justify-center mt-[12px]">
                                    <div className="flex items-center gap-4">
                                        {/* 모바일버전 이전 곡 버튼 */}
                                        <div className="block pc:hidden">
                                            <PlayPrevButton onClick={playPrevMusic} disabled={prevDisabled}/>
                                        </div>

                                        {/* 현재 재생중인 음악 저장버튼 */}
                                        <SaveCurrentMusicButton/>

                                        {/* 모바일버전 다음 곡 버튼 */}
                                        <div className="block pc:hidden">
                                            <PlayNextButton classNames="h-[40px]" onClick={playYoutubeMusic}/>
                                        </div>
                                    </div>
                                </div>

                            </>
                            :
                            <div className=" w-[580px] h-[330px] m-auto text-white flex justify-center items-center">
                                <div
                                    className="group flex flex-col justify-center items-center bg-black max-w-[580px] w-full h-full cursor-pointer">
                                    <div onClick={playYoutubeMusic}
                                         className="w-full h-full group-hover:scale-105 flex flex-col items-center justify-center gap-4">
                                        <p className="text-4xl">플레이리스트 재생하기</p>
                                        <PlayIcon fill="#fff" width={100} height={100}/>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                ) : (
                    // 일반 인증자인 경우 요청기능이 있는 블랙보드 렌더링
                    <UserRequestSection/>
                )
            }

            {/* todo: 추가적인 컨텐츠 구상해보기 */}
            <div className="grow w-full">
                <div className="border-4 border-gray-500 w-full h-full rounded-2xl p-4">
                    <div className="text-2xl">
                        준비중인 기능입니다.
                        <Cursor/>
                    </div>
                </div>
            </div>

            {/* 일반유저 요청 nav */}
            {token.role === 1 && <RequestListSection/>}
        </section>
    )
}

export default PlayerSection;