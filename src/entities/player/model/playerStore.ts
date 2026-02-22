import { create } from "zustand";
import type { AccessedUserReq, Music } from "@/shared/types";

interface PlayerStore {
  // constants
  submitMaxLength: number;
  saveMusicMaxLength: number;

  // boolean types
  isSubmitPlaying: boolean;

  // literals
  currentMusic: Music;
  savedMusic: Music[];
  submitMusic: Music[];
  selectedCurrentMusic: Music | null;
  accessedUserReq: AccessedUserReq | Record<string, never>;

  // actions
  setIsSubmitPlaying: (payload: boolean) => void;
  setCurrentMusic: (payload: Music) => void;
  setSavedMusic: (payload: Music[]) => void;
  setSubmitMusic: (payload: Music[]) => void;
  setSelectedCurrentMusic: (payload: Music | null) => void;
  setAccessedUserReq: (
    payload: AccessedUserReq | Record<string, never>,
  ) => void;
}

/**
 * @description 플레이어 도메인 데이터 스토어
 * - 음악 큐, 재생 상태, 저장 목록 등 비즈니스 데이터만 관리
 * - 모달 UI 상태는 features/youtube-player/model/usePlayerModalStore.ts에서 관리
 */
export const usePlayerStore = create<PlayerStore>((set) => ({
  // constants
  submitMaxLength: 20, // 신청 가능한 음악 최대 개수
  saveMusicMaxLength: 50, // 저장 가능한 음악 최대 개수

  // boolean types
  isSubmitPlaying: true, // 신청곡 재생 여부

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
