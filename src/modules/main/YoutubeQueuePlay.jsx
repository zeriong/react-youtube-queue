import {useToastsStore} from "../common/components/Toasts";
import ReactPlayer from "react-player";
import {useEffect, useRef, useState} from "react";
import {DEFAULT_PLAYLIST} from "../../constants/defaultPlaylist";
import {addDoc, collection, onSnapshot, query, orderBy} from "firebase/firestore";
import {initFireStore} from "../../libs/firebase";
import PreViewModal from "./components/modal/PreView.modal";
import {deleteUser} from "../../utils/firebase";
import {useTokenStore} from "../../App";
import SubmitListItem from "./components/SubmitListItem";
import EditModal from "./components/modal/Edit.modal";
import {YOUTUBE_BASE_URL} from "../../constants";
import {CloseIcon, LogoutIcon} from "../svgComponents";
import {vibrate} from "../../utils/common";
import Cursor from "../common/components/Cursor";

const YoutubeQueuePlay = () => {
    const playerRef = useRef(null);
    const submitInputRef = useRef(null);
    const submitInputAreaRef = useRef(null);
    const shuffleRef = useRef([]);


    const [currentURL, setCurrentURL] = useState("https://www.youtube.com/watch?v=_GNk6lSvH08");
    const [submitList, setSubmitList] = useState([]);
    const [submitInput, setSubmitInput] = useState("");
    const [currentData, setCurrentData] = useState({});
    const [isShowPreViewModal, setIsShowPreViewModal] = useState(false);
    const [isShowEditModal, setIsShowEditModal] = useState(false);

    const toastStore = useToastsStore();
    const tokenStore = useTokenStore();
    
    // 접속 종료
    const logout = async () => {
        await deleteUser(tokenStore.token.id);
        tokenStore.deleteToken();
        toastStore.addToast("로그아웃 되었습니다.");
    }

    // 신청곡 url submit
    const submitURL = async (e) => {
        e.preventDefault();

        // 유튜브 링크인지 체크 후 아니라면 toast 알림을 띄움
        if (!submitInput.includes(YOUTUBE_BASE_URL)) {
            vibrate(submitInputAreaRef);
            return toastStore.addToast("유튜브 링크를 입력해주세요.");
        }

        // 정상적인 비디오 링크인지 검증
        if (!ReactPlayer.canPlay(submitInput)) return toastStore.addToast("재생가능한 동영상 링크가 아닙니다!");

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
                    setSubmitInput("");
                })
                .catch((e) => {
                    alert("플레이리스트 추가에 실패하였습니다.");
                    console.log(e);
                });
        } else {
            toastStore.addToast("플레이리스트 신청이 취소되었습니다.");
        }
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

    // currentURL effect
    useEffect(() => {
        // currentURL이 변경되면 변경된 url 로드 후 즉시 재생되도록 구현
    }, [currentURL]);

    // init effect
    useEffect(() => {
        // todo: 아래 설계를 함수로 만든 후 실행되도록 설계 (onEnded 에 사용할 가능성 매우 높음)
        // 파이어베이스 데이터 가져와서 .shift() 사용해서 데이터를 셀렉트/잘라내기 하여
        // setCurrentURL(shiftObj.url)을 넣은 후 파이어베이스에서 해당 객체 삭제
        // 이 후에 currentURL state 변경으로 인해 바로 위 useEffect 가 감지하여 실행하도록 설계

        // 만약 받아온 데이터가 없다면 여기에서 즉시 랜덤플레이어 실행되도록 설정

        // 데이터 쿼리를 생성 날짜 오름차순으로 정렬 (queue 형태를 구현하기 위함)
        const setFireStoreQuery = query(
            collection(initFireStore, "playList"),
            orderBy("createAt", "asc"));

        // onSnapshot을 활용한 실시간 데이터 불러오기
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
                                <ReactPlayer
                                    url={currentURL}
                                    width='100%'
                                    height='100%'
                                    controls={true}
                                    onEnded={() => {
                                        // 동영상이 끝나면 실행할 함수
                                        console.log("동영상 끝남")
                                    }}
                                    // onStart={()=>setPlayStart(true)}
                                    className="react-player"
                                    ref={playerRef}
                                />
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

                        {/* 신청 폼 */}
                        <form className="flex gap-2" onSubmit={submitURL}>
                            <div ref={submitInputAreaRef} className="relative w-full">
                                <input
                                    ref={submitInputRef}
                                    type="text"
                                    className="w-full border-2 border-gray-500 pl-2 pr-6 py-1 rounded-md relative text-[15px] items-center"
                                    onChange={(e) => setSubmitInput(e.target.value)}
                                    placeholder="유튜브 음악 URL을 입력하여 신청해주세요!"
                                    value={submitInput}
                                />
                                <button
                                    type="button"
                                    className="bg-black absolute right-[7px] top-1/2 -translate-y-1/2 rounded-full p-[2px] opacity-80"
                                    onClick={() => {
                                        setSubmitInput("");
                                        submitInputRef.current.focus();
                                    }}
                                >
                                    <CloseIcon fill="#fff" width={12} height={12}/>
                                </button>
                            </div>
                            <button className="border px-2 rounded-md bg-gray-200 hover:scale-105" type="submit">
                                신청하기
                            </button>
                        </form>
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

            {/* fixed box */}


            {/* 미리보기 모달 */}
            <PreViewModal
                setIsShow={setIsShowPreViewModal}
                isShow={isShowPreViewModal}
                preViewData={currentData}
            />
            {/* 에디트 모달 */}
            <EditModal
                currentData={currentData}
                setIsShow={setIsShowEditModal}
                isShow={isShowEditModal}
            />
        </>
    )
}

export default YoutubeQueuePlay;