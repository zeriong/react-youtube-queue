import PlayPrevButton from "../buttons/PlayPrevButton";
import ReactPlayer from "react-player";
import PlayNextButton from "../buttons/PlayNextButton";
import {PlayIcon} from "../../../svgComponents/svgComponents";
import Cursor from "../../../common/components/Cursor";
import SaveCurrentMusicButton from "../buttons/SaveCurrentMusicButton";
import {useTokenStore} from "../../../../store/commonStore";
import {usePlayerStore} from "../../../../store/playerStore";

const PlayerSection = ({ isStart, prevDisabled, isPlay, playYoutubeMusic, setIsReady, playPrevMusic }) => {
    const tokenStore = useTokenStore();
    const { currentMusic } = usePlayerStore();

    return (
        <section className="w-full flex flex-col items-center mt-[100px] gap-6 p-10">

            {/* 플레이어 섹션 */}
            {
                // 어드민인 경우 플레이어 렌더링
                (tokenStore.token?.role === 1
                ) ? (
                    <div className="w-full  flex flex-col">
                        {isStart ?
                            <>
                                <div className="relative flex items-center h-full justify-center gap-4">
                                    {/* todo: 이전 곡 버튼 구현예정 */}
                                    <div className="hidden pc:block">
                                        <PlayPrevButton onClick={playPrevMusic} disabled={prevDisabled}/>
                                    </div>

                                    {/* 플레이어 */}
                                    <div className="w-full max-w-[580px] h-[330px]">
                                        <ReactPlayer
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

            {/* todo: 추가적인 컨텐츠 구상해보기 */}
            <div className="grow w-full">
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