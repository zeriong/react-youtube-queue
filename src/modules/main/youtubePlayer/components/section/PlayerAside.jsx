import SubmitListItem from "../lists/SubmitListItem";
import {usePlayerStore} from "../../../../../store/playerStore";
import {useToastsStore} from "../../../../common/Toasts";

/**@desc 유튜브 음악 플레이어 화면 Aside
 * @param {any} logout 로그아웃
 * @param {any} submitMusic 유튜브음악 제출
 * @param {any} setIsShowPreViewModal 미리보기 모달 setState
 * @param {any} setIsShowEditModal 로그아웃
 *  */
const PlayerAside = () => {
    const { submitMusic, submitMaxLength, setIsShowEditModal,  } = usePlayerStore();
    const { addToast } = useToastsStore();



    // 신청하기 버튼 함수
    const handleEditMusicModal = () => {
        if (submitMaxLength <= submitMusic.length) {
            return addToast(`신청 가능한 플레이리스트는 최대 ${submitMaxLength}개입니다.`);
        }
        setIsShowEditModal(true);
    }

    return (
        <aside className="flex flex-col relative right-0 pt-4 px-6 pb-6 border-dashed max-pc:border-t-[5px] pc:border-l-[5px] pc:border-gray-700">

            {/* 헤더 */}
            <header className="flex flex-col gap-6 mb-4">
                {/* 상단 헤드라인 */}
                <div className="flex gap-4 items-center">
                    <p className="font-bold text-4xl">
                        Youtube Queue Player!
                    </p>
                </div>

                {/* 신청 버튼 */}
                <button type="button" onClick={handleEditMusicModal}
                        className="rounded-[12px] p-[3px] border-2 border-gray-500 bg-gray-300">
                    <p className="font-bold text-white bg-red-500/85 py-3 text-[20px] rounded-[9px] text-line border-2 border-gray-500">
                        유튜브음악 신청하기
                    </p>
                </button>
            </header>

            {/* 신청 리스트 */}
            <section className="h-full flex flex-col ">
                <div className="flex justify-between text-[20px] font-bold text-white text-line mb-2 mt-3">
                    <p>유튜브 음악 리스트</p>
                    <p>
                        {`${submitMusic.length + '/' + submitMaxLength}`}
                    </p>
                </div>
                <div className="p-2 bg-gray-100 rounded-md grow overflow-hidden h-full min-h-[200px]">
                    <ul className="flex flex-col gap-1 h-full overflow-auto customScroll-vertical">
                        {submitMusic?.map((list, idx) =>
                            <SubmitListItem
                                key={idx}
                                item={list}
                                idx={idx}
                            />
                        )}
                    </ul>
                </div>
            </section>
        </aside>
    )
}

export default PlayerAside;