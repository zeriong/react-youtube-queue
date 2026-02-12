import { addDoc, collection } from "firebase/firestore";
import { usePlayerStore } from "@/entities/player/model";
import { useToastsStore } from "@/entities/toast/model";
import { useTokenStore } from "@/entities/user/model";
import { initFireStore } from "@/shared/config/firebase";
import { CANCEL_USER_REQ } from "@/shared/constants/message";
import { deleteFireStore } from "@/shared/lib/firebase";
import type { Music } from "@/shared/types";

/**
 * @description 플레이리스트 CRUD 비즈니스 로직 훅
 * - 플레이리스트 삭제
 * - 저장된 플리를 현재 플리에 추가 (어드민)
 * - 저장된 음악 재생 요청 (일반 유저)
 */
export const usePlaylistCRUD = () => {
  const { addToast } = useToastsStore();
  const { token } = useTokenStore();
  const { setIsShowEditModal } = usePlayerStore();

  // 플레이리스트 삭제 함수
  const onDelete = async (item: Music, isSavedList?: boolean) => {
    const isConfirmed = window.confirm("해당 리스트를 삭제하시겠습니까?");
    let isDeleted: boolean | undefined;
    console.log("아이템의 아이디다~", item.id);
    if (isConfirmed && item.id) {
      isDeleted = await deleteFireStore(
        item.id,
        isSavedList ? "savedList" : "playList",
      );
    }
    if (isDeleted) {
      addToast(
        isDeleted
          ? "해당 플레이리스트가 삭제되었습니다."
          : "플레이리스트 삭제가 취소되었습니다.",
      );
    }
  };

  // 저장된 플리를 현재 플리에 추가
  const addCurrentPlayList = async (item: Music) => {
    try {
      await addDoc(collection(initFireStore, "playList"), {
        createAt: Date.now(),
        title: item.title,
        link: item.link,
      });
      addToast("플레이리스트에 추가되었습니다.");
      setIsShowEditModal(false);
    } catch (e) {
      alert("플레이리스트 추가에 실패하였습니다.");
      console.log(e);
    }
  };

  // 저장된 플레이리스트를 현재 플레이리스트에 추가
  const submitCurrentSavedMusic = async (item: Music) => {
    // 어드민인 경우
    if (token?.role === 1) {
      const confirmSubmit = window.confirm("플레이리스트에 추가하시겠습니까?");

      if (confirmSubmit) {
        addCurrentPlayList(item);
      } else {
        addToast("플레이리스트 신청이 취소되었습니다.");
      }
    } else {
      // 일반 유저인 경우
      const isConfirm = window.confirm("저장된 해당 음악을 요청하시겠습니까?");
      if (!isConfirm) return addToast(CANCEL_USER_REQ);

      try {
        await addDoc(collection(initFireStore, "userRequest"), {
          nickName: token?.nickName,
          createAt: Date.now(),
          request: "playSavedMusic",
          title: item.title,
          link: item.link,
        });
        addToast("저장된 해당 음악을 요청하였습니다.");
      } catch (e) {
        alert("요청에 실패하였습니다.");
        console.log("유저 요청실패 error:", e);
      }
    }
  };

  return { onDelete, addCurrentPlayList, submitCurrentSavedMusic };
};
