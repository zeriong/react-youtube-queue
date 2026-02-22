import { twMerge } from "tailwind-merge";
import { useUserRequest } from "@/features/youtube-player/model";
import { USER_REQUEST_LIST } from "@/shared/constants/userRequestList";
import RequestEditVolumeModal from "../modals/RequestEditVolume.modal";
import SaveCurrentMusicModal from "../modals/SaveCurrentMusic.modal";

const UserRequestSection = () => {
  const { handleRequest } = useUserRequest();

  return (
    <div className="border-2 border-gray-500 rounded-lg p-3 md:p-5 w-full">
      <div
        className={twMerge(
          "flex flex-col justify-center items-center",
          "w-full md:w-[600px] h-auto md:h-[330px] py-6 md:py-0",
          "bg-black text-white text-center gap-3 md:gap-4 rounded-lg",
        )}
      >
        <p className="text-lg md:text-2xl">음악 재생은 어드민 유저에게 맡겨주세요!</p>
        <p>
          일반 인증 유저는 원하는 유튜브 음악을
          <br />
          신청, 삭제, 수정할 수 있습니다.
        </p>
        <section className="px-4">
          <div className="border border-dashed p-4 rounded-lg flex flex-col gap-4">
            <p>아래 버튼을 통해 관리자에게 요청할 수 있습니다</p>
            <div className="flex justify-center px-4">
              <div className="flex gap-4 flex-wrap justify-center">
                {USER_REQUEST_LIST.map((item) => {
                  return (
                    <button
                      key={item.request}
                      onClick={() => handleRequest(item)}
                      className="px-4 py-2 bg-white rounded-md text-black"
                      type="button"
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 볼륨변경 요청 모달 */}
      <RequestEditVolumeModal />

      {/* 저장 요청 모달 */}
      <SaveCurrentMusicModal isAdmin={false} />
    </div>
  );
};

export default UserRequestSection;
