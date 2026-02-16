import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect } from "react";
import { useModeStore } from "@/entities/mode/model";
import { usePlayerStore } from "@/entities/player/model";
import { initFireStore } from "@/shared/config/firebase";
import { getLocalSavedList } from "@/shared/lib/single-mode-storage";

/**
 * @description savedList 컬렉션 실시간 구독 훅
 * - onSnapshot으로 Firestore savedList를 실시간 동기화
 * - Single Mode: localStorage에서 savedList 로드
 */
export const useSavedMusicSubscription = () => {
  const { isSingleMode } = useModeStore();
  const { setSavedMusic } = usePlayerStore();

  // Firebase 실시간 구독 (일반 모드)
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 실행
  useEffect(() => {
    if (isSingleMode) return;

    const setFireStoreQuery = query(
      collection(initFireStore, "savedList"),
      orderBy("createAt", "asc"),
    );

    const unsubscribe = onSnapshot(setFireStoreQuery, (snapshot) => {
      const contentArr = snapshot.docs.map((doc) => {
        const data = { ...doc.data() };
        // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - Firestore 문서에 id 동적 할당
        (data as any).id = doc.id;
        // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - Music 타입으로 캐스팅
        return data as any;
      });
      setSavedMusic(contentArr);
    });

    return () => unsubscribe();
  }, []);

  // Single Mode: localStorage에서 savedList 로드
  // biome-ignore lint/correctness/useExhaustiveDependencies: 싱글모드 진입 시 1회만 실행
  useEffect(() => {
    if (!isSingleMode) return;
    setSavedMusic(getLocalSavedList());
  }, [isSingleMode]);
};
