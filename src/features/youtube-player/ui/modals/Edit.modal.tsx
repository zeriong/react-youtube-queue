import ReactPlayer from "react-player";
import { twMerge } from "tailwind-merge";
import { useSubmitMusic } from "@/features/youtube-player/model";
import { CloseIcon } from "@/shared/ui/icons";

const EditModal = () => {
  const {
    submitInputRef,
    titleInputRef,
    submitURLInput,
    canSubmit,
    selectedCurrentMusic,
    isShowEditModal,
    setIsShowEditModal,
    handleSubmitOnChange,
    submitURL,
    setCanSubmit,
    clearSubmitInput,
    clearTitleInput,
  } = useSubmitMusic();

  return (
    isShowEditModal && (
      // biome-ignore lint/a11y/useKeyWithClickEvents: 모달 오버레이 클릭 닫기 패턴
      // biome-ignore lint/a11y/noStaticElementInteractions: 모달 오버레이
      <div
        onClick={() => setIsShowEditModal(false)}
        className="fixed top-0 left-0 z-50 w-full h-full bg-black/50 flex
          justify-center items-center"
      >
        {/* 미리보기 영역 */}
        <section className="p-3 max-w-[500px] max-h-[500px] w-full h-full">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation 용도 */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: 모달 컨텐츠 영역 */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full h-full flex flex-col rounded-2xl"
          >
            {/* 모달 헤더 */}
            <header
              className="py-2 px-2 flex justify-between font-bold border-b-2
                mb-2"
            >
              {selectedCurrentMusic
                ? "신청곡 수정하기"
                : "유튜브 음악 신청하기"}
              <button type="button" onClick={() => setIsShowEditModal(false)}>
                <CloseIcon />
              </button>
            </header>
            {/* 신청 폼 */}
            <form className="flex gap-2 px-2 mb-3" onSubmit={submitURL}>
              <div className="relative w-full flex flex-col gap-2">
                {/* 신청곡 url input */}
                <div className="flex items-center gap-2">
                  <label htmlFor="edit-submit-url">Youtube URL:</label>
                  {/* 신청곡 url input */}
                  <div className="relative w-full">
                    <input
                      id="edit-submit-url"
                      ref={submitInputRef}
                      type="text"
                      className={twMerge(
                        "w-full border-2 border-gray-500 pl-2 pr-6 py-1",
                        "rounded-md relative text-[15px] items-center",
                      )}
                      onChange={handleSubmitOnChange}
                      placeholder="유튜브 URL을 입력해주세요!"
                    />
                    <button
                      type="button"
                      className={twMerge(
                        "bg-black absolute right-[7px] top-1/2",
                        "-translate-y-1/2 rounded-full p-[2px] opacity-80",
                      )}
                      onClick={clearSubmitInput}
                    >
                      <CloseIcon fill="#fff" width={12} height={12} />
                    </button>
                  </div>
                </div>

                {/* 신청곡 제목 input */}
                <div className="flex items-center gap-2">
                  <label className="relative top-[-5px]" htmlFor="edit-title">
                    <p>신청곡 제목:</p>
                    <p
                      className={twMerge(
                        "absolute text-[12px] left-1/2 -translate-x-1/2",
                        "bottom-[-12px] font-bold text-gray-400/85",
                      )}
                    >
                      ( 선택 사항 )
                    </p>
                  </label>
                  <div className="relative w-full">
                    <input
                      id="edit-title"
                      ref={titleInputRef}
                      type="text"
                      className={twMerge(
                        "w-full border-2 border-gray-500 pl-2 pr-6 py-1",
                        "rounded-md relative text-[15px] items-center",
                      )}
                      placeholder={
                        selectedCurrentMusic
                          ? "수정할 제목을 입력해주세요."
                          : "신청곡의 제목을 입력해주세요."
                      }
                    />
                    <button
                      type="button"
                      className={twMerge(
                        "bg-black absolute right-[7px] top-1/2",
                        "-translate-y-1/2 rounded-full p-[2px] opacity-80",
                      )}
                      onClick={clearTitleInput}
                    >
                      <CloseIcon fill="#fff" width={12} height={12} />
                    </button>
                  </div>
                </div>
              </div>
              <button
                className={twMerge(
                  "border px-2 rounded-md",
                  canSubmit
                    ? "bg-gray-300 font-bold hover:scale-105"
                    : "bg-gray-100 text-gray-400",
                )}
                type="submit"
              >
                {selectedCurrentMusic ? "수정하기" : "신청하기"}
              </button>
            </form>
            {/* 플레이어 영역 */}
            <section className="grow px-2 pb-2">
              <div className="rounded-xl overflow-hidden h-full w-full">
                {submitURLInput ? (
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    controls={true}
                    src={submitURLInput}
                    onReady={() => setCanSubmit(true)}
                  />
                ) : (
                  <div
                    className={twMerge(
                      "bg-black/80 h-full w-full text-3xl text-white",
                      "flex justify-center items-center",
                    )}
                  >
                    <div className="flex flex-col justify-center items-center gap-4">
                      <p>
                        {selectedCurrentMusic
                          ? "유튜브음악을 수정하기 전에"
                          : "유튜브음악을 신청하기 전에"}
                      </p>
                      <p>신청곡을 확인해보세요</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    )
  );
};

export default EditModal;
