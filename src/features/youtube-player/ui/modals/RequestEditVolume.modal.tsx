import { useVolumeRequest } from "@/features/youtube-player/model";
import { ModalStandard } from "@/shared/ui";

const RequestEditVolumeModal = () => {
  const {
    submitVolume,
    isShowEditVolumeModal,
    setIsShowEditVolumeModal,
    handleOnChange,
    handleVolumeChangeButton,
    requestEditVolume,
  } = useVolumeRequest();

  return (
    <ModalStandard
      setIsShow={setIsShowEditVolumeModal}
      isShow={isShowEditVolumeModal}
      isFit={true}
      headerTitle={"볼륨 변경 요청"}
      contentArea={
        <section className="grow px-2 pb-2">
          <form
            className="rounded-xl overflow-hidden h-full w-full flex flex-col
              justify-center items-center gap-4"
            onSubmit={requestEditVolume}
          >
            <div className="flex items-center gap-4">
              {/* 마이너스 */}
              <div className="flex gap-4 items-center">
                <button
                  type="button"
                  className="p-1 rounded-md bg-gray-200 h-fit w-[32px]"
                  onClick={() => handleVolumeChangeButton(-10)}
                >
                  -10
                </button>
                <button
                  type="button"
                  className="p-1 rounded-md bg-gray-200 h-fit w-[32px]"
                  onClick={() => handleVolumeChangeButton(-5)}
                >
                  -5
                </button>
                <button
                  type="button"
                  className="px-2 py-1 rounded-md bg-gray-200 h-fit w-[32px]"
                  onClick={() => handleVolumeChangeButton(-1)}
                >
                  -
                </button>
              </div>

              {/* 요청할 볼륨 */}
              <p className="font-bold text-center w-[60px] text-xl">
                {submitVolume}
              </p>

              {/* 플러스 */}
              <div className="flex gap-4 items-center">
                <button
                  type="button"
                  className="px-2 py-1 rounded-md bg-gray-200 h-fit w-[32px]"
                  onClick={() => handleVolumeChangeButton(1)}
                >
                  +
                </button>
                <button
                  type="button"
                  className="p-1 rounded-md bg-gray-200 h-fit w-[32px]"
                  onClick={() => handleVolumeChangeButton(5)}
                >
                  +5
                </button>
                <button
                  type="button"
                  className="p-1 rounded-md bg-gray-200 h-fit w-[32px]"
                  onClick={() => handleVolumeChangeButton(10)}
                >
                  +10
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2">
              <p>직접 입력: </p>
              <input
                className="bg-gray-100 rounded-md px-4 py-1 text-lg w-full"
                type="text"
                value={submitVolume}
                onChange={handleOnChange}
              />
              <button type="submit" className="border-2 rounded-md p-1">
                요청하기
              </button>
            </div>
          </form>
        </section>
      }
    />
  );
};

export default RequestEditVolumeModal;
