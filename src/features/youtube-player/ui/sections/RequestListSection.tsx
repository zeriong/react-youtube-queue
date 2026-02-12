import { twMerge } from "tailwind-merge";
import { useRequestQueue } from "@/features/youtube-player/model";
import { USER_REQUEST_LIST } from "@/shared/constants/userRequestList";

const RequestListSection = () => {
  const { count, userRequestList, accessReq, cancelReq } = useRequestQueue();

  return (
    <nav
      className={twMerge(
        "fixed left-[20px] -bottom-[400px] w-[250px] h-[400px]",
        "border-4 border-gray-500 rounded-lg z-[200] bg-white p-3",
        "flex flex-col gap-3 overflow-auto shadow-2xl",
        "ease-in-out duration-500",
        userRequestList.length && "bottom-[20px]",
      )}
    >
      <div className="flex justify-between">
        <p className="text-[18px] font-bold text_line text-white">
          {"< 요청 리스트 >"}
        </p>
      </div>
      <div className="flex font-bold text-[18px]">
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
              className="whitespace-break-spaces rounded border-2 border-gray-500 p-[8px]"
            >
              <p className="border-b-2 border-gray-400">{`${idx + 1}. ${req.nickName}`}</p>
              <p className="text-center my-[4px]">{reqMsg}</p>
              <div className="flex w-full gap-[4px]">
                <button
                  type="button"
                  className="w-full py-[4px] hover:bg-gray-200"
                  onClick={() => accessReq(req)}
                >
                  허용
                </button>
                |
                <button
                  type="button"
                  className="w-full py-[4px] hover:bg-gray-200"
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
