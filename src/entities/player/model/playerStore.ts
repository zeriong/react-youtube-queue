import { create } from "zustand";
import type { AccessedUserReq, Music } from "@/shared/types";

interface PlayerStore {
  // constants
  submitMaxLength: number;
  saveMusicMaxLength: number;

  // boolean types
  isSubmitPlaying: boolean;

  // modals
  isShowEditModal: boolean;
  isShowPreViewModal: boolean;
  isShowSavedListModal: boolean;
  isShowSaveCurrentMusicModal: boolean;
  isShowEditVolumeModal: boolean;
  isShowSaveCurrentMusicRequestModal: boolean;

  // literals
  currentMusic: Music;
  savedMusic: Music[];
  submitMusic: Music[];
  selectedCurrentMusic: Music | null;
  accessedUserReq: AccessedUserReq | Record<string, never>;

  // actions
  setIsSubmitPlaying: (payload: boolean) => void;
  setCurrentMusic: (payload: Music) => void;
  setIsShowEditModal: (payload: boolean) => void;
  setIsShowPreViewModal: (payload: boolean) => void;
  setIsShowSavedListModal: (payload: boolean) => void;
  setIsShowSaveCurrentMusicModal: (payload: boolean) => void;
  setIsShowEditVolumeModal: (payload: boolean) => void;
  setIsShowSaveCurrentMusicRequestModal: (payload: boolean) => void;
  setSavedMusic: (payload: Music[]) => void;
  setSubmitMusic: (payload: Music[]) => void;
  setSelectedCurrentMusic: (payload: Music | null) => void;
  setAccessedUserReq: (
    payload: AccessedUserReq | Record<string, never>,
  ) => void;
}

/**
 * @description 저장된 플레이리스트 스토어
 * - setSavedMusic: 매개변수로 전달받은 배열을 savedMusic에 적용
 * - saveMusic: 페이로드로 전달받은 객체를 savedMusic에 추가
 * - deleteMusic: savedMusic state에서 해당 리스트 삭제
 */
export const usePlayerStore = create<PlayerStore>((set) => ({
  // constants
  submitMaxLength: 20, // 신청 가능한 음악 최대 개수
  saveMusicMaxLength: 50, // 저장 가능한 음악 최대 개수

  // boolean types
  isSubmitPlaying: true, // 신청곡 재생 여부

  // modals
  isShowEditModal: false,
  isShowPreViewModal: false,
  isShowSavedListModal: false,
  isShowSaveCurrentMusicModal: false,
  isShowEditVolumeModal: false,
  isShowSaveCurrentMusicRequestModal: false,

  // literals
  currentMusic: {} as Music, // 실행 음악 info
  savedMusic: [], // 저장된 음악
  submitMusic: [], // 신청곡 리스트
  selectedCurrentMusic: null, // 선택된 현재 음악정보
  accessedUserReq: {}, // 승인된 유저 요청 data

  // 실행 참고 값 setState
  setIsSubmitPlaying: (payload) => set(() => ({ isSubmitPlaying: payload })),

  // 실행될 음악 setState
  setCurrentMusic: (payload) => set(() => ({ currentMusic: payload })),

  // 모달 setStates
  setIsShowEditModal: (payload) => set(() => ({ isShowEditModal: payload })),
  setIsShowPreViewModal: (payload) =>
    set(() => ({ isShowPreViewModal: payload })),
  setIsShowSavedListModal: (payload) =>
    set(() => ({ isShowSavedListModal: payload })),
  setIsShowSaveCurrentMusicModal: (payload) =>
    set(() => ({ isShowSaveCurrentMusicModal: payload })),
  setIsShowEditVolumeModal: (payload) =>
    set(() => ({ isShowEditVolumeModal: payload })),
  setIsShowSaveCurrentMusicRequestModal: (payload) =>
    set(() => ({ isShowSaveCurrentMusicRequestModal: payload })),

  // 저장된 음악 setState
  setSavedMusic: (payload) => set(() => ({ savedMusic: payload })),

  // 신청곡 setState
  setSubmitMusic: (payload) => set(() => ({ submitMusic: payload })),

  // 선택된 현재 음악정보 setState
  setSelectedCurrentMusic: (payload) =>
    set(() => ({ selectedCurrentMusic: payload })),

  // 승인된 data setState
  setAccessedUserReq: (payload) => set(() => ({ accessedUserReq: payload })),
}));
