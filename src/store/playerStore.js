import {create} from "zustand";

/** @desc 저장된 플레이리스트 스토어<br> setSavedMusic = 매개변수로 전달받은 배열을 savedMusic에 적용.<br>saveMusic = 페이로드로 전달받은 객체를 savedMusic에 추가.<br> deleteMusic = savedMusic state에서 해당 리스트 삭제. */
export const usePlayerStore = create((setState) => ({
    savedMusic: [], // 저장된 음악
    submitMusic: [], // 신청곡 리스트
    selectedCurrentMusic: {}, // 선택된 현재 음악정보

    // 저장된 음악 setState
    setSavedMusic: (payload) => setState(() => ({ savedMusic: payload })),
    saveMusic: (payload) => setState((store) => ({ savedMusic: [...store.savedMusic, payload] })),
    deleteMusic: (payloadId) => setState((store) => {
        const leftSavedList = store.savedMusic.filter((list) => payloadId !== list.id);
        return { savedMusic: leftSavedList };
    }),

    // 신청곡 setState
    setSubmitMusic: (payload) => setState(() => ({ submitMusic: payload })),

    // 선택된 현재 음악정보 setState
    setSelectedCurrentMusic: (payload) => setState(() => ({ selectedCurrentMusic: payload }))
}));