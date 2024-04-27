import {useTokenStore} from "../../../../App";
import PlayPrev from "../buttons/PlayPrev";
import playPrev from "../buttons/PlayPrev";
import ReactPlayer from "react-player";
import PlayNext from "../buttons/PlayNext";
import {PlayIcon} from "../../../svgComponents/svgComponents";
import Cursor from "../../../common/components/Cursor";

const PlayerSection = ({ isStart, prevDisabled, currentURL, isPlay, playYoutubeMusic, setIsReady,  }) => {
    const tokenStore = useTokenStore();

    return (
        <section className="w-full flex flex-col items-center mt-[100px] gap-12 p-10">
            {
                // 어드민인 경우 플레이어 렌더링
                (tokenStore.token?.role === 1
                ) ? (
                    <div className="w-full min-h-[330px] relative flex items-center justify-center gap-4">
                        {isStart ?
                            <>
                                {/* todo: 이전 곡 버튼 구현예정 */}
                                <PlayPrev onClick={playPrev} disabled={prevDisabled}/>

                                {/* 플레이어 */}
                                <div className="w-full h-full max-w-[580px]">
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
                                        onPause={() => setIsReady(false)}
                                        onReady={() => setIsReady(true)}
                                    />
                                </div>

                                {/* 다음 곡 버튼 */}
                                <PlayNext onClick={playYoutubeMusic}/>
                            </>
                            :
                            <div className=" w-full h-full text-white flex justify-center items-center">
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
            <div className="py-10 grow w-full">
                <div className="border-4 border-gray-500 w-full h-full rounded-2xl p-4">
                    <div className="text-2xl">
                        준비중인 기능입니다.
                        <Cursor/>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PlayerSection;