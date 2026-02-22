import { twMerge } from "tailwind-merge";
import { usePlayerStore } from "@/entities/player/model";
import { useToastsStore } from "@/entities/toast/model";
import SubmitListItem from "../lists/SubmitListItem";

interface PlayerAsideProps {
  variant?: "default" | "sheet";
}

const PlayerAside = ({ variant = "default" }: PlayerAsideProps) => {
  const { submitMusic, submitMaxLength, setIsShowEditModal } = usePlayerStore();
  const { addToast } = useToastsStore();

  const isSheet = variant === "sheet";

  // 신청하기 버튼 함수
  const handleEditMusicModal = () => {
    if (submitMaxLength <= submitMusic.length) {
      return addToast(
        `신청 가능한 플레이리스트는 최대 ${submitMaxLength}개입니다.`,
      );
    }
    setIsShowEditModal(true);
  };

  return (
    <aside
      className={twMerge(
        "flex flex-col relative right-0 pt-3 px-4 pb-4 md:pt-4 md:px-6 md:pb-6",
        !isSheet && "border-dashed",
        !isSheet &&
          "max-pc:border-t-[5px] pc:border-l-[5px] pc:border-gray-700",
        !isSheet && "pc:max-w-[430px] pc:w-full max-pc:hidden",
        isSheet && "h-full",
      )}
    >
      {/* 헤더 */}
      <header className="flex flex-col gap-4 md:gap-6 mb-4">
        {/* 상단 헤드라인 */}
        <div className="flex gap-4 items-center">
          <p className="font-bold text-2xl md:text-4xl whitespace-nowrap">
            Youtube Queue Player!
          </p>
        </div>

        {/* 신청 버튼 */}
        <button
          type="button"
          onClick={handleEditMusicModal}
          className={twMerge(
            "rounded-xl p-[3px] border-2 border-gray-500 bg-gray-300",
          )}
        >
          <p
            className={twMerge(
              "font-bold text-white bg-red-500/85 py-2 md:py-3 text-base md:text-xl",
              "rounded-[9px] text_line border-2 border-gray-500",
            )}
          >
            유튜브음악 신청하기
          </p>
        </button>
      </header>

      {/* 신청 리스트 */}
      <section className="h-full flex flex-col min-h-0">
        <div
          className={twMerge(
            "flex justify-between text-base md:text-xl font-bold text-white",
            "text_line mb-2 mt-3",
          )}
        >
          <p>유튜브 음악 리스트</p>
          <p>{`${`${submitMusic.length}/${submitMaxLength}`}`}</p>
        </div>
        <div
          className={twMerge(
            "p-2 bg-gray-100 rounded-md grow overflow-hidden",
            isSheet ? "min-h-0" : "h-full min-h-[200px]",
          )}
        >
          <ul
            className={twMerge(
              "flex flex-col gap-1 h-full overflow-auto",
              "customScroll-vertical",
            )}
          >
            {submitMusic?.map((list, idx) => (
              <SubmitListItem key={list.id ?? idx} item={list} idx={idx} />
            ))}
          </ul>
        </div>
      </section>
    </aside>
  );
};

export default PlayerAside;
