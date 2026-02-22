import { useCallback } from "react";
import { usePlayerStore } from "@/entities/player/model";
import { useToastsStore } from "@/shared/hooks/useToastsStore";
import { usePlayerModalStore } from "./usePlayerModalStore";

/**
 * 현재 재생 음악 저장 모달을 여는 검증 훅
 * - 기본 음악 저장 불가
 * - 저장 최대 개수 초과 불가
 */
export const useOpenSaveMusicModal = () => {
  const { isSubmitPlaying, savedMusic, saveMusicMaxLength } = usePlayerStore();
  const { setIsShowSaveCurrentMusicModal } = usePlayerModalStore();
  const { addToast } = useToastsStore();

  const openSaveMusicModal = useCallback(() => {
    if (!isSubmitPlaying) return addToast("기본 음악은 저장할 수 없습니다.");
    if (savedMusic.length >= saveMusicMaxLength) {
      return addToast(
        `플레이리스트 저장은 최대 ${saveMusicMaxLength}개까지 가능합니다.`,
      );
    }
    setIsShowSaveCurrentMusicModal(true);
  }, [
    isSubmitPlaying,
    savedMusic.length,
    saveMusicMaxLength,
    addToast,
    setIsShowSaveCurrentMusicModal,
  ]);

  return { openSaveMusicModal };
};

/**
 * 유튜브 음악 신청 모달을 여는 검증 훅
 * - 신청 최대 개수 초과 불가
 */
export const useOpenSubmitMusicModal = () => {
  const { submitMusic, submitMaxLength } = usePlayerStore();
  const { setIsShowEditModal } = usePlayerModalStore();
  const { addToast } = useToastsStore();

  const openSubmitMusicModal = useCallback(() => {
    if (submitMaxLength <= submitMusic.length) {
      return addToast(
        `신청 가능한 플레이리스트는 최대 ${submitMaxLength}개입니다.`,
      );
    }
    setIsShowEditModal(true);
  }, [submitMaxLength, submitMusic.length, addToast, setIsShowEditModal]);

  return { openSubmitMusicModal };
};
