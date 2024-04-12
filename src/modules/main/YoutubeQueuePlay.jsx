import {getAuthStorage} from "../../utils/common";
import {useToastsStore} from "../common/components/Toasts";
import {useNavigate} from "react-router-dom";
import ReactPlayer from "react-player";
import {useEffect, useRef, useState} from "react";
import {DEFAULT_PLAYLIST} from "../../constants/defaultPlaylist";
import {addDoc, collection, onSnapshot, query, orderBy} from "firebase/firestore";
import {initFireStore} from "../../libs/firebase";
import PreViewModal from "../common/components/PreViewModal";
import {CloseIcon, EditIcon} from "../svgComponents";
import {deleteUser} from "../../utils/firebase";
import {useTokenStore} from "../../App";

const YoutubeQueuePlay = () => {
    const playerRef = useRef(null);
    const shuffleRef = useRef([]);

    const [currentURL, setCurrentURL] = useState("https://www.youtube.com/watch?v=_GNk6lSvH08");
    const [submitList, setSubmitList] = useState([]);
    const [submitInput, setSubmitInput] = useState("");
    const [preViewData, setPreViewData] = useState({});
    const [isShowPreViewModal, setIsShowPreViewModal] = useState(false);

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
        if (!submitInput.includes("https://www.youtube.com/watch")) {
            return toastStore.addToast("유튜브 링크를 입력해주세요.");
        }
        // fireStore에 저장
        await addDoc(collection(initFireStore, "playList"), {
            nickName: tokenStore.token.nickName,
            createAt: Date.now(),
            link: submitInput,
        })
            .then(() => {
                setSubmitInput("");
            })
            .catch((e) => {
                alert("플레이리스트 추가에 실패하였습니다.");
                console.log(e);
            });
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
            <div className="flex w-full h-full">

                {/* 플레이어 래퍼 */}
                <section className="w-[500px] h-[300px]">
                    {
                        (tokenStore.token?.role === 1
                        ) ? (
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
                        ) : (
                            <div className="flex flex-col justify-center items-center w-[500px] h-[200px] bg-black text-white text-center gap-4">
                                <p className="text-[24px]">
                                    음악 재생은 어드민 유저에게 맡겨주세요!
                                </p>
                                <p>
                                    일반 인증 유저는 원하는 유튜브 음악을<br/>
                                    신청, 삭제, 수정할 수 있습니다.
                                </p>
                            </div>
                        )
                    }

                </section>

                {/* 신청 리스트 */}
                <div>
                    <form onSubmit={submitURL}>
                        <label className="flex gap-4">
                            <p>신청곡</p>
                            <input
                                className="w-full"
                                type="text"
                                onChange={(e) => setSubmitInput(e.target.value)}
                                placeholder="유튜브 음악 URL을 입력해주세요."
                                value={submitInput}
                            />
                        </label>
                    </form>
                    <ul>
                        {submitList?.map((list, idx) =>
                            <li key={idx} className="flex">
                                <div className="flex">
                                    <p>{`${idx + 1}.`}</p>
                                    <p>{`${list?.nickName}님의 신청곡`}</p>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreViewData(list);
                                            setIsShowPreViewModal(true);
                                        }}
                                    >
                                        미리 보기
                                    </button>
                                    {((list?.nickName === tokenStore.token?.nickName) || (tokenStore.token?.role === 1)) &&
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => console.log("에디트!")}>
                                                <EditIcon/>
                                            </button>
                                            <button type="button" onClick={() => console.log("삭제!")}>
                                                <CloseIcon/>
                                            </button>
                                        </div>
                                    }
                                </div>

                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* fixed box */}
            <button
                type="button"
                className="fixed right-[20px] top-[20px] bg-black text-white p-3 rounded-xl text-[20px] hover:scale-110"
                onClick={logout}
            >
                접속 종료
            </button>

            {/* 미리보기 모달 */}
            <PreViewModal
                setIsShow={setIsShowPreViewModal}
                isShow={isShowPreViewModal}
                preViewData={preViewData}
            />
        </>
    )
}

export default YoutubeQueuePlay;