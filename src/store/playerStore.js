import {create} from "zustand";

/** @desc 저장된 플레이리스트 스토어<br> setSavedMusic = 매개변수로 전달받은 배열을 savedMusic에 적용.<br>saveMusic = 페이로드로 전달받은 객체를 savedMusic에 추가.<br> deleteMusic = savedMusic state에서 해당 리스트 삭제. */
export const usePlayerStore = create((setState) => ({
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

    // literals
    currentMusic: {}, // 실행 음악 info
    savedMusic: [], // 저장된 음악
    submitMusic: [], // 신청곡 리스트
    selectedCurrentMusic: {}, // 선택된 현재 음악정보
    accessedUserReq: {}, // 승인된 유저 요청 data

    // 실행 참고 값 setState
    setIsSubmitPlaying: (payload) => setState(() => ({ isSubmitPlaying: payload })),

    // 실행될 음악 setState
    setCurrentMusic: (payload) => setState(() => ({ currentMusic: payload })),

    // 모달 setStates
    setIsShowEditModal: (payload) => setState(() => ({ isShowEditModal: payload })),
    setIsShowPreViewModal: (payload) => setState(() => ({ isShowPreViewModal: payload })),
    setIsShowSavedListModal: (payload) => setState(() => ({ isShowSavedListModal: payload })),
    setIsShowSaveCurrentMusicModal: (payload) => setState(() => ({ isShowSaveCurrentMusicModal: payload })),

    // 저장된 음악 setState
    setSavedMusic: (payload) => setState(() => ({ savedMusic: payload })),
    saveMusic: (payload) => setState((store) => ({ savedMusic: [...store.savedMusic, payload] })),

    // 신청곡 setState
    setSubmitMusic: (payload) => setState(() => ({ submitMusic: payload })),

    // 선택된 현재 음악정보 setState
    setSelectedCurrentMusic: (payload) => setState(() => ({ selectedCurrentMusic: payload })),

    // 승인된 data setState
    setAccessedUserReq: (payload) => setState(() => ({ accessedUserReq: payload })),
}));