import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect } from "react";
import { useModeStore } from "@/entities/mode/model";
import { usePlayerStore } from "@/entities/player/model";
import { initFireStore } from "@/shared/config/firebase";
import { getLocalPlayList } from "@/shared/lib/single-mode-storage";
import type { Music } from "@/shared/types";

/**
 * @description playList 컬렉션 실시간 구독 훅
 * - onSnapshot으로 Firestore playList를 실시간 동기화
 * - Single Mode: localStorage에서 playList 로드
 */
export const usePlaylistSubscription = () => {
  const { isSingleMode } = useModeStore();
  const { setSubmitMusic } = usePlayerStore();

  // Firebase 실시간 구독 (일반 모드)
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 실행
  useEffect(() => {
    if (isSingleMode) return;

    const playListQuery = query(
      collection(initFireStore, "playList"),
      orderBy("createAt", "asc"),
    );

    const unsubscribe = onSnapshot(playListQuery, (snapshot) => {
      const contentArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Music[];
      setSubmitMusic(contentArr);
    });

    return () => unsubscribe();
  }, []);

  // Single Mode: localStorage에서 playList 로드
  // biome-ignore lint/correctness/useExhaustiveDependencies: 싱글모드 진입 시 1회만 실행
  useEffect(() => {
    if (!isSingleMode) return;
    setSubmitMusic(getLocalPlayList());
  }, [isSingleMode]);
};
