import { create } from "zustand";

interface PlayerModalStore {
  isShowEditModal: boolean;
  isShowPreViewModal: boolean;
  isShowSavedListModal: boolean;
  isShowSaveCurrentMusicModal: boolean;
  isShowEditVolumeModal: boolean;
  isShowSaveCurrentMusicRequestModal: boolean;

  setIsShowEditModal: (payload: boolean) => void;
  setIsShowPreViewModal: (payload: boolean) => void;
  setIsShowSavedListModal: (payload: boolean) => void;
  setIsShowSaveCurrentMusicModal: (payload: boolean) => void;
  setIsShowEditVolumeModal: (payload: boolean) => void;
  setIsShowSaveCurrentMusicRequestModal: (payload: boolean) => void;
}

/**
 * @description 플레이어 관련 모달 UI 상태 관리 store
 * - 도메인 데이터(entities/player)와 UI 표시 상태를 분리
 */
export const usePlayerModalStore = create<PlayerModalStore>((set) => ({
  isShowEditModal: false,
  isShowPreViewModal: false,
  isShowSavedListModal: false,
  isShowSaveCurrentMusicModal: false,
  isShowEditVolumeModal: false,
  isShowSaveCurrentMusicRequestModal: false,

  setIsShowEditModal: (payload) => set({ isShowEditModal: payload }),
  setIsShowPreViewModal: (payload) => set({ isShowPreViewModal: payload }),
  setIsShowSavedListModal: (payload) => set({ isShowSavedListModal: payload }),
  setIsShowSaveCurrentMusicModal: (payload) =>
    set({ isShowSaveCurrentMusicModal: payload }),
  setIsShowEditVolumeModal: (payload) =>
    set({ isShowEditVolumeModal: payload }),
  setIsShowSaveCurrentMusicRequestModal: (payload) =>
    set({ isShowSaveCurrentMusicRequestModal: payload }),
}));
