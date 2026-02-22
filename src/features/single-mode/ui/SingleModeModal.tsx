import { useSingleModeEntry } from "@/features/single-mode/model";
import { ModalStandard } from "@/shared/ui";

interface SingleModeModalProps {
  isShow: boolean;
  setIsShow: (show: boolean) => void;
}

export const SingleModeModal = ({
  isShow,
  setIsShow,
}: SingleModeModalProps) => {
  const { enterSingleMode } = useSingleModeEntry();

  const handleStart = () => {
    setIsShow(false);
    enterSingleMode();
  };

  return (
    <ModalStandard
      isShow={isShow}
      setIsShow={setIsShow}
      headerTitle={<h2 className="text-2xl font-bold px-2">Single Mode</h2>}
      isFit
      contentArea={
        <div className="flex flex-col gap-4 px-5 py-4">
          <div className="flex flex-col gap-2 text-gray-700">
            <p>혼자서 youtube player를 사용하는 'Single Mode'입니다.</p>
            <p>Music Player의 역할로 서비스를 이용할 수 있습니다.</p>
            <p>
              플레이리스트 저장, 요청 등 저장 내용은 사용중인 기기에서만
              저장됩니다.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setIsShow(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="px-4 py-2 text-white bg-amber-400 rounded-md hover:bg-amber-500"
            >
              싱글모드 시작
            </button>
          </div>
        </div>
      }
    />
  );
};
