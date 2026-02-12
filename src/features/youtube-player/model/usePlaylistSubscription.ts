import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect } from "react";
import { usePlayerStore } from "@/entities/player/model";
import { initFireStore } from "@/shared/config/firebase";
import type { Music } from "@/shared/types";

/**
 * @description playList 컬렉션 실시간 구독 훅
 * - onSnapshot으로 Firestore playList를 실시간 동기화
 */
export const usePlaylistSubscription = () => {
  const { setSubmitMusic } = usePlayerStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 실행
  useEffect(() => {
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
};
