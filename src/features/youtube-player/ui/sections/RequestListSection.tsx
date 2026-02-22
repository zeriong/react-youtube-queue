import { twMerge } from "tailwind-merge";
import { useRequestQueue } from "@/features/youtube-player/model";
import { USER_REQUEST_LIST } from "@/shared/constants/userRequestList";

const RequestListSection = () => {
  const { count, userRequestList, accessReq, cancelReq } = useRequestQueue();

  return (
    <nav
      className={twMerge(
        "fixed left-2 md:left-5 -bottom-[350px] md:-bottom-[400px]",
        "w-[200px] md:w-[250px] h-[350px] md:h-[400px]",
        "border-4 border-gray-500 rounded-lg z-[200] bg-white p-2 md:p-3",
        "flex flex-col gap-2 md:gap-3 overflow-auto shadow-2xl",
        "ease-in-out duration-500",
        userRequestList.length && "bottom-3 md:bottom-5",
      )}
    >
      <div className="flex justify-between">
        <p className="text-lg font-bold text_line text-white">
          {"< 요청 리스트 >"}
        </p>
      </div>
      <div className="flex font-bold text-lg">
        <p>자동 승인 {`${userRequestList.length && count}초`}</p>
        <div>
          <button type="button" />
          <button type="button" />
        </div>
      </div>
      <ul className="overflow-x-hidden flex flex-col gap-4 customScroll-vertical">
        {userRequestList?.map((req, idx) => {
          let reqMsg: string | undefined = USER_REQUEST_LIST.find(
            (val) => val.request === req.request,
          )?.name;
          // 유저 요청 리스트에 없는 경우
          if (!reqMsg) {
            if (req.link) reqMsg = "저장된 음악 재생";
          }
          return (
            <li
              key={req.id}
              className="whitespace-break-spaces rounded border-2 border-gray-500 p-2"
            >
              <p className="border-b-2 border-gray-400">{`${idx + 1}. ${req.nickName}`}</p>
              <p className="text-center my-1">{reqMsg}</p>
              <div className="flex w-full gap-1">
                <button
                  type="button"
                  className="w-full py-1 hover:bg-gray-200"
                  onClick={() => accessReq(req)}
                >
                  허용
                </button>
                |
                <button
                  type="button"
                  className="w-full py-1 hover:bg-gray-200"
                  onClick={() => cancelReq(req.id)}
                >
                  취소
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default RequestListSection;
