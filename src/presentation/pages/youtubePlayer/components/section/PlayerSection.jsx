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
import {deleteFireStore, getFireStoreData, updateFireStoreData} from "../../../../../utils/firebase";
import {addDoc, collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {initFireStore} from "../../../../../libs/firebase";
import RequestListSection from "./RequestListSection";
import UserRequestSection from "./UserRequestSection";
import {useToastsStore} from "../../../../common/Toasts";

const PlayerSection = () => {
    const playerRef = useRef();

    const { token } = useTokenStore();
    const { addToast } = useToastsStore();

    const shuffleRef = useRef([]);
    const [isStart, setIsStart] = useState(false);
    const [isPlay, setIsPlay] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // todo: 이전 버튼 구현 시 사용할 disabled state
    const [prevDisabled, setPrevDisabled] = useState(true);

    const {
        submitMusic, isSubmitPlaying, accessedUserReq, saveMusicMaxLength,
        savedMusic, currentMusic,
        setSubmitMusic, setCurrentMusic, setIsSubmitPlaying,
        setAccessedUserReq,
    } = usePlayerStore();


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

    // 재생중인 음악 저장 요청 함수
    const handleSaveRequest = () => {
        (async () => {
            // 타이틀, 기본음악 저장불가, 최대 음악개수 validate
            if (!isSubmitPlaying) return addToast("기본 음악은 저장할 수 없습니다.");
            if (savedMusic.length >= saveMusicMaxLength) return addToast(`플레이리스트 저장은 최대 ${saveMusicMaxLength}개까지 가능합니다.`);

            // 링크가 같다면 추가하지 않음
            const getSavedLists = await getFireStoreData("savedList");
            if (getSavedLists.some(list => list.link === currentMusic.link)) {
                return addToast("이미 저장된 플레이리스트입니다.");
            }
            try {
                // 타이틀 추가 지정
                currentMusic.title = accessedUserReq?.musicTitle;
                // 링크가 다르다면 fireStore에 저장
                await addDoc(collection(initFireStore, "savedList"), currentMusic);
            } catch (e) {
                console.log("재생중인 플레이리스트 저장에 실패했습니다. \nerror: ", e);
            }
        })()
    }

    // 저장된 플리를 현재 플리에 추가 요청
    const handleAddCurrentPlayListRequest = (item) => {
        (async () => {
            await addDoc(collection(initFireStore, "playList"), {
                // ! 유저네임 불필요
                createAt: item.createAt,
                title: item.title,
                link: item.link,
            })
                .then(() => {
                    addToast("플레이리스트에 추가되었습니다.");
                })
                .catch((e) => {
                    alert("플레이리스트 추가에 실패하였습니다.");
                    console.log(e);
                });
        })()
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

    const handleUserRequest = () => {
        if (accessedUserReq.id) {
            if (!playerRef.current) return addToast("플레이어가 없는 상태입니다.");
            // 유저 요청 초기화
            setAccessedUserReq({});
            const {request} = accessedUserReq;
            if (request === "pause") playerRef.current?.getInternalPlayer().pauseVideo();
            else if (request === "play") playerRef.current?.getInternalPlayer().playVideo();
            else if (request === "next") playYoutubeMusic();
            else if (request === "save") handleSaveRequest();
            else if (request === "playSavedMusic") handleAddCurrentPlayListRequest(accessedUserReq);
            else if (request === "volume") {
                // 볼륨 세팅
                playerRef.current?.getInternalPlayer().setVolume(accessedUserReq.volume);
                // 현재 볼륨을 리세팅
                (async () => {
                    const getVolume = await getFireStoreData("currentVolume");
                    await updateFireStoreData(
                        getVolume[0].id,
                        {volume: accessedUserReq.volume},
                        "currentVolume"
                    );
                })()
            }
        }
    }

    // 요청사항 처리 effect
    useEffect(() => {
        handleUserRequest();
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

    // 영상이 존재했을 때 현재 볼륨 저장
    useEffect(() => {
        if (isStart && playerRef.current && isReady) {
            (async () => {
                const getVolume = await getFireStoreData("currentVolume");
                const playerVolume = playerRef.current?.getInternalPlayer().getVolume();
                // 볼륨데이터가 있다면 업데이트
                if (getVolume.length) {
                    updateFireStoreData(getVolume[0].id, {volume: playerVolume}, "currentVolume")
                        .then(res => console.log(res))
                        .catch(e => console.log(e));
                } else {
                    // 볼륨데이터가 없다면 새로 저장
                    addDoc(collection(initFireStore, "currentVolume"), {
                        volume: playerVolume,
                    })
                        .then(res => console.log(res))
                        .catch(e => console.log(e));
                }
            })()
        }
    }, [isStart, isReady]);

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
            {token?.role === 1 && <RequestListSection/>}
        </section>
    )
}

export default PlayerSection;
