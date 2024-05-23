import {onNotYetToast} from "../../../../../utils/common";
import {useToastsStore} from "../../../../common/Toasts";
import {addDoc, collection} from "firebase/firestore";
import {initFireStore} from "../../../../../libs/firebase";
import {CANCEL_USER_REQ} from "../../../../../constants/message";
import {useTokenStore} from "../../../../../store/commonStore";

const UserRequestSection = () => {
    const {addToast} = useToastsStore();
    const {token} = useTokenStore();

    // 일시정지 요청
    const requestPause = () => {
        (async () => {
            const isConfirm = window.confirm("일시정지를 요청하시겠습니까?");
            if (!isConfirm) return addToast(CANCEL_USER_REQ);

            await addDoc(collection(initFireStore, "userRequest"), {
                nickName: token.nickName,
                createAt: Date.now(),
                request: "pause",
            })
                .then(() => {
                    addToast("일시정지를 요청하였습니다.");
                })
                .catch((e) => {
                    alert("요청에 실패하였습니다.");
                    console.log("유저 요청실패 error:",e);
                });
        })();
    }

    return (
        <div className="border-2 border-gray-500 rounded-lg p-5">
            <div
                className="flex flex-col justify-center items-center w-[600px] h-[330px] bg-black text-white text-center gap-4 rounded-lg">
                <p className="text-[24px]">
                    음악 재생은 어드민 유저에게 맡겨주세요!
                </p>
                <p>
                    일반 인증 유저는 원하는 유튜브 음악을<br/>
                    신청, 삭제, 수정할 수 있습니다.
                </p>
                <section className="border border-dashed p-4 rounded-lg flex flex-col gap-4">
                    <p>아래 버튼을 통해 관리자에게 요청할 수 있습니다</p>
                    <section className="flex justify-center">
                        <div className="flex gap-4">
                            <button onClick={onNotYetToast} className="px-4 py-2 bg-white rounded-md text-black"
                                    type="button">
                                볼륨 변경
                            </button>
                            <button onClick={requestPause} className="px-4 py-2 bg-white rounded-md text-black"
                                    type="button">
                                일시정지
                            </button>
                            <button onClick={onNotYetToast} className="px-4 py-2 bg-white rounded-md text-black"
                                    type="button">
                                재생
                            </button>
                            <button onClick={onNotYetToast} className="px-4 py-2 bg-white rounded-md text-black"
                                    type="button">
                                다음 음악 재생
                            </button>
                        </div>
                    </section>
                </section>

            </div>
        </div>
    )
}

export default UserRequestSection;