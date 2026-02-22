import { addDoc, collection } from "firebase/firestore";
import type { FormEvent, RefObject } from "react";
import { useModeStore } from "@/entities/mode/model";
import { usePlayerStore } from "@/entities/player/model";
import { useToastsStore } from "@/shared/hooks/useToastsStore";
import { useTokenStore } from "@/entities/user/model";
import { initFireStore } from "@/shared/config/firebase";
import { CANCEL_USER_REQ } from "@/shared/constants/message";
import { getFireStoreData } from "@/shared/lib/firebase";
import {
  addLocalSavedList,
  getLocalSavedList,
} from "@/shared/lib/single-mode-storage";
import { usePlayerModalStore } from "./usePlayerModalStore";

/**
 * @description 현재 재생 음악 저장 비즈니스 로직 훅
 * - 어드민: 직접 savedList에 저장
 * - 일반 유저: userRequest로 저장 요청
 * - Single Mode: localStorage에 저장
 */
export const useSaveCurrentMusic = (
  isAdmin: boolean,
  titleInputRef: RefObject<HTMLInputElement | null>,
) => {
  const { isSingleMode } = useModeStore();
  const { addToast } = useToastsStore();
  const { token } = useTokenStore();
  const {
    saveMusicMaxLength,
    isSubmitPlaying,
    currentMusic,
    savedMusic,
    setSavedMusic,
  } = usePlayerStore();
  const {
    isShowSaveCurrentMusicModal,
    setIsShowSaveCurrentMusicModal,
    isShowSaveCurrentMusicRequestModal,
    setIsShowSaveCurrentMusicRequestModal,
  } = usePlayerModalStore();

  const saveCurrentPlayMusic = (e: FormEvent) => {
    (async () => {
      e.preventDefault();
      if (!titleInputRef.current?.value)
        return addToast("타이틀을 입력해주세요!");

      // 어드민이 저장하는 경우 (싱글모드 포함)
      if (isAdmin) {
        if (!isSubmitPlaying)
          return addToast("기본 음악은 저장할 수 없습니다.");
        if (savedMusic.length >= saveMusicMaxLength) {
          return addToast(
            `플레이리스트 저장은 최대 ${saveMusicMaxLength}개까지 가능합니다.`,
          );
        }

        const confirmSubmit = window.confirm(
          "재생중인 플레이리스트를 저장하시겠습니까?",
        );
        if (!confirmSubmit)
          return addToast("플레이리스트 저장이 취소되었습니다.");
      }

      // Single Mode: localStorage로 저장
      if (isSingleMode) {
        const localSavedList = getLocalSavedList();
        if (localSavedList.some((list) => list.link === currentMusic.link)) {
          return addToast("이미 저장된 플레이리스트입니다.");
        }
        currentMusic.title = titleInputRef.current?.value;
        addLocalSavedList(currentMusic);
        setSavedMusic(getLocalSavedList());
        setIsShowSaveCurrentMusicModal(false);
        return;
      }

      // 링크가 이미 존재한다면 추가하지 않음
      const getSavedLists = await getFireStoreData("savedList");
      // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - Firestore 문서 타입 미정의
      if (getSavedLists.some((list: any) => list.link === currentMusic.link)) {
        return addToast("이미 저장된 플레이리스트입니다.");
      }

      // 어드민이 저장할 때
      if (isAdmin) {
        try {
          currentMusic.title = titleInputRef.current?.value;
          await addDoc(collection(initFireStore, "savedList"), currentMusic);
        } catch (e) {
          console.log(
            "재생중인 플레이리스트 저장에 실패했습니다. \nerror: ",
            e,
          );
        } finally {
          setIsShowSaveCurrentMusicModal(false);
        }
      } else {
        // 유저가 요청한 저장일 때
        const isConfirm = window.confirm("현재 음악 저장을 요청하시겠습니까?");
        if (!isConfirm) return addToast(CANCEL_USER_REQ);

        await addDoc(collection(initFireStore, "userRequest"), {
          nickName: token?.nickName,
          createAt: Date.now(),
          request: "save",
          musicTitle: titleInputRef.current?.value,
        })
          .then(() => {
            addToast("현재 음악 저장을 요청하였습니다.");
          })
          .catch((e) => {
            alert("요청에 실패하였습니다.");
            console.log("유저 요청실패 error:", e);
          })
          .finally(() => {
            setIsShowSaveCurrentMusicRequestModal(false);
          });
      }
    })();
  };

  return {
    saveCurrentPlayMusic,
    isShowSaveCurrentMusicModal,
    setIsShowSaveCurrentMusicModal,
    isShowSaveCurrentMusicRequestModal,
    setIsShowSaveCurrentMusicRequestModal,
  };
};
