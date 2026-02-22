import { twMerge } from "tailwind-merge";
import { useToastSequencer } from "@/entities/toast/model";
import { AlarmIcon } from "@/shared/ui/icons";

const Toasts = () => {
  const { currentToast, isShow } = useToastSequencer();

  return (
    <div
      className={twMerge(
        "fixed flex items-center justify-center z-[99999]",
        "left-1/2 -translate-x-1/2 bg-black/80 rounded",
        "duration-300 ease-in-out",
        isShow ? "top-[26px] opacity-100" : "opacity-0 top-0",
      )}
    >
      {currentToast && (
        <div className="flex p-2.5 md:p-[18px]">
          <AlarmIcon className="fill-white h-[22px] mr-1.5" />
          <p
            className="w-full font-normal text-white max-md:text-sm"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: 레거시 코드 - 내부 토스트 메시지만 사용
            dangerouslySetInnerHTML={{ __html: currentToast }}
          />
        </div>
      )}
    </div>
  );
};

export default Toasts;
