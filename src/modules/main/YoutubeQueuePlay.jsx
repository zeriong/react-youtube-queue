import {getAuthStorage} from "../../utils/common";
import {TOKEN_NAME} from "../../constants";
import {useToastsStore} from "../common/components/Toasts";
import {useNavigate} from "react-router-dom";
import ReactPlayer from "react-player";
import {useEffect, useRef, useState} from "react";

const YoutubeQueuePlay = () => {
    const playerRef = useRef(null);

    const [currentURL, setCurrentURL] = useState("https://www.youtube.com/watch?v=_GNk6lSvH08");
    const [currentProgress, setCurrentProgress] = useState(0);
    const [submitList, setSubmitList] = useState([]);
    const [submitInput, setSubmitInput] = useState("");

    const token = getAuthStorage();
    const toastStore = useToastsStore();
    const navigate = useNavigate();
    
    // 접속 종료
    const logout = () => {
        localStorage.removeItem(TOKEN_NAME);
        navigate("/")
        toastStore.addToast("로그아웃 되었습니다.");
    }
    // 현재 재생시간
    const getCurrentProgress = (e) => setCurrentProgress(e.playedSeconds);
    // 신청곡 url submit
    const submitURL = (e) => {
        e.preventDefault();
        const list = {url: submitInput, from: token.nickName, timestamp: Date.now()}
        setSubmitList(prev => [...prev, list]);
    }

    useEffect(() => {
    }, [currentProgress]);

    return (
        <>
            <div className="flex w-full h-full">
                {/* 플레이어 래퍼 */}
                <section className="w-[500px] h-[300px]">
                    <ReactPlayer
                        url={currentURL}
                        width='100%'
                        height='100%'
                        controls={true}
                        onProgress={getCurrentProgress}
                        onEnded={() => {
                            // 동영상이 끝나면 실행할 함수
                            console.log("동영상 끝남")
                        }}
                        // onStart={()=>setPlayStart(true)}
                        className="react-player"
                        ref={playerRef}
                    />
                </section>
                {/* 신청 리스트 */}
                <div>
                    <form onSubmit={submitURL}>
                        <label className="flex gap-4">
                            <p>신청곡</p>
                            <input className="w-full" type="text" onChange={(e) => setSubmitInput(e.target.value)} placeholder="유튜브 음악 URL을 입력해주세요."/>
                        </label>
                    </form>
                    <ul>
                        {submitList?.map((list, idx) =>
                            <li className="flex" key={idx}>

                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* fixed box */}
            <button
                type="button"
                className="fixed right-[20px] top-[20px] bg-brand-blue-300 text-white p-3 rounded-xl text-[20px]"
                onClick={logout}
            >
                접속 종료
            </button>
        </>
    )
}

export default YoutubeQueuePlay;