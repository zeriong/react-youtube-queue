import type { ReactNode } from "react";
import { CloseIcon } from "./icons";

interface ModalStandardProps {
  isShow: boolean;
  setIsShow: (show: boolean) => void;
  headerTitle: ReactNode;
  contentArea?: ReactNode;
  isFit?: boolean;
}

export const ModalStandard = ({
  isShow,
  setIsShow,
  headerTitle,
  contentArea,
  isFit,
}: ModalStandardProps) => {
  return (
    isShow && (
      // biome-ignore lint/a11y/useKeyWithClickEvents: 모달 오버레이 클릭 닫기 패턴
      // biome-ignore lint/a11y/noStaticElementInteractions: 모달 오버레이
      <div
        onClick={() => setIsShow(false)}
        className="fixed top-0 left-0 z-[100] w-full h-full bg-black/50
          flex justify-center items-center"
      >
        {/* 컨텐츠 박스 */}
        <section
          className={`p-3 max-w-[500px] max-h-[500px] w-full
            ${isFit ? "h-fit" : " h-full"}`}
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation 용도 */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: 모달 컨텐츠 영역 */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full h-full flex flex-col rounded-2xl z-10"
          >
            {/* 모달 헤더 */}
            <header className="py-2 px-2 flex justify-between">
              <div>{headerTitle}</div>
              <button type="button" onClick={() => setIsShow(false)}>
                <CloseIcon />
              </button>
            </header>
            {/* 컨텐츠 영역 */}
            {contentArea && contentArea}
          </div>
        </section>
      </div>
    )
  );
};
