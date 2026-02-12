import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect } from "react";
import { usePlayerStore } from "@/entities/player/model";
import { initFireStore } from "@/shared/config/firebase";

/**
 * @description savedList 컬렉션 실시간 구독 훅
 * - onSnapshot으로 Firestore savedList를 실시간 동기화
 */
export const useSavedMusicSubscription = () => {
  const { setSavedMusic } = usePlayerStore();

  useEffect(() => {
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
  }, [setSavedMusic]);
};
