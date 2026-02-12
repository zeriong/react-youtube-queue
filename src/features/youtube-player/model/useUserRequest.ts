import { addDoc, collection } from "firebase/firestore";
import { usePlayerStore } from "@/entities/player/model";
import { useToastsStore } from "@/entities/toast/model";
import { useTokenStore } from "@/entities/user/model";
import { initFireStore } from "@/shared/config/firebase";
import { CANCEL_USER_REQ } from "@/shared/constants/message";

/**
 * @description 일반 유저 요청 전송 비즈니스 로직 훅
 * - 일시정지, 재생, 다음곡 등 요청을 Firestore에 전송
 */
export const useUserRequest = () => {
  const { addToast } = useToastsStore();
  const { token } = useTokenStore();
  const { setIsShowEditVolumeModal, setIsShowSaveCurrentMusicRequestModal } =
    usePlayerStore();

  const handleRequest = (item: { name: string; request: string }) => {
    // 볼륨, 저장은 별도 모달로 처리
    if (item.request === "volume") {
      setIsShowEditVolumeModal(true);
      return;
    }
    if (item.request === "save") {
      setIsShowSaveCurrentMusicRequestModal(true);
      return;
    }

    (async () => {
      const { name, request } = item;
      const headMsg = `${name}${name === "일시정지" ? "를" : "을"}`;

      const isConfirm = window.confirm(`${headMsg} 요청하시겠습니까?`);
      if (!isConfirm) return addToast(CANCEL_USER_REQ);

      await addDoc(collection(initFireStore, "userRequest"), {
        nickName: token?.nickName,
        createAt: Date.now(),
        request,
      })
        .then(() => {
          addToast(`${headMsg} 요청하였습니다.`);
        })
        .catch((e) => {
          alert("요청에 실패하였습니다.");
          console.log("유저 요청실패 error:", e);
        });
    })();
  };

  return { handleRequest };
};
