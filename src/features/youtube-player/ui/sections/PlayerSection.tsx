import ReactPlayer from "react-player";
import { twMerge } from "tailwind-merge";
import { useModeStore } from "@/entities/mode/model";
import {
  usePlayerLogic,
  usePlaylistSubscription,
} from "@/features/youtube-player/model";
import SavedMusicListButton from "@/features/youtube-player/ui/buttons/SavedMusicListButton";
import Cursor from "@/shared/ui/Cursor";
import { PlayIcon } from "@/shared/ui/icons";
import PlayNextButton from "../buttons/PlayNextButton";
import PlayPrevButton from "../buttons/PlayPrevButton";
import SaveCurrentMusicButton from "../buttons/SaveCurrentMusicButton";
import RequestListSection from "./RequestListSection";
import UserRequestSection from "./UserRequestSection";

const PlayerSection = () => {
  usePlaylistSubscription();

  const { isSingleMode } = useModeStore();
  const {
    playerRef,
    isAdmin,
    isStart,
    volume,
    prevDisabled,
    currentMusic,
    playYoutubeMusic,
    playPrevMusic,
    onReady,
  } = usePlayerLogic();

  return (
    <section
      className={twMerge(
        "w-full h-full flex flex-col items-center",
        "p-4 md:p-10 overflow-hidden",
      )}
    >
      {/* 저장된 플레이리스트 버튼 */}
      <div className="w-full flex justify-start">
        <SavedMusicListButton />
      </div>

      <div
        className={twMerge(
          "w-full flex flex-col items-center gap-4 md:gap-6",
          "grow mt-16 md:mt-[100px]",
        )}
      >
        {/* 플레이어 섹션 */}
        {
          // 어드민인 경우 플레이어 렌더링
          isAdmin ? (
            <div className="w-full flex flex-col">
              {isStart ? (
                <>
                  {/* Player area */}
                  <div
                    className={twMerge(
                      "relative flex items-center h-full justify-center gap-4",
                    )}
                  >
                    {/* todo: 이전 곡 버튼 구현예정 */}
                    <div className="hidden pc:block">
                      <PlayPrevButton
                        onClick={playPrevMusic}
                        disabled={prevDisabled}
                      />
                    </div>

                    {/* 플레이어 */}
                    <div className="w-full max-w-[580px] h-[200px] md:h-[330px]">
                      <ReactPlayer
                        ref={playerRef}
                        src={currentMusic.link}
                        width="100%"
                        height="100%"
                        controls={true}
                        volume={volume}
                        onEnded={() => playYoutubeMusic()}
                        onReady={onReady}
                      />
                    </div>

                    {/* 다음 곡 버튼 */}
                    <div className="hidden pc:block">
                      <PlayNextButton onClick={playYoutubeMusic} />
                    </div>
                  </div>

                  {/* Buttons ([mobile: prev/next] + [default save current music]) */}
                  <div className="flex justify-center mt-3">
                    <div className="flex items-center gap-4">
                      {/* 모바일버전 이전 곡 버튼 */}
                      <div className="block pc:hidden">
                        <PlayPrevButton
                          onClick={playPrevMusic}
                          disabled={prevDisabled}
                        />
                      </div>

                      {/* 현재 재생중인 음악 저장버튼 */}
                      <SaveCurrentMusicButton />

                      {/* 모바일버전 다음 곡 버튼 */}
                      <div className="block pc:hidden">
                        <PlayNextButton
                          classNames="h-[40px]"
                          onClick={playYoutubeMusic}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={twMerge(
                    "w-full md:w-[580px] h-[200px] md:h-[330px] m-auto text-white flex",
                    "justify-center items-center",
                  )}
                >
                  <div
                    className={twMerge(
                      "group flex flex-col justify-center items-center",
                      "bg-black max-w-[580px] w-full h-full cursor-pointer",
                    )}
                  >
                    {/* biome-ignore lint/a11y/useKeyWithClickEvents: 플레이어 시작 영역 */}
                    {/* biome-ignore lint/a11y/noStaticElementInteractions: 플레이어 시작 영역 */}
                    <div
                      onClick={playYoutubeMusic}
                      className={twMerge(
                        "w-full h-full group-hover:scale-105 flex flex-col",
                        "items-center justify-center gap-4",
                      )}
                    >
                      <p className="text-xl md:text-4xl">
                        플레이리스트 재생하기
                      </p>
                      <PlayIcon fill="#fff" width={100} height={100} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // 일반 인증자인 경우 요청기능이 있는 블랙보드 렌더링
            <UserRequestSection />
          )
        }

        {/* todo: 추가적인 컨텐츠 구상해보기 */}
        <div className="grow w-full h-full max-h-[calc(100%-260px)] md:max-h-full">
          <div className="border-4 border-gray-500 w-full h-full rounded-2xl p-4">
            <div className="text-lg md:text-2xl">
              준비중인 기능입니다.
              <Cursor />
            </div>
          </div>
        </div>

        {/* 일반유저 요청 nav (싱글모드에서는 숨김) */}
        {isAdmin && !isSingleMode && <RequestListSection />}
      </div>
    </section>
  );
};

export default PlayerSection;
