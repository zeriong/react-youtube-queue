import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useModeStore } from "@/entities/mode/model";
import { usePlayerStore } from "@/entities/player/model";
import { initFireStore } from "@/shared/config/firebase";
import { useToastsStore } from "@/shared/hooks/useToastsStore";
import { deleteFireStore } from "@/shared/lib/firebase";

interface UserRequest {
  id: string;
  nickName: string;
  createAt: number;
  request: string;
  // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - Firestore 문서 동적 필드 허용
  [key: string]: any;
}

/**
 * @description 유저 요청 큐 비즈니스 로직 훅
 * - Firestore userRequest 실시간 구독
 * - 요청 승인/취소
 * - 자동 승인 카운트다운
 */
export const useRequestQueue = () => {
  const countTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countRef = useRef(5);
  const userRequestListRef = useRef<UserRequest[]>([]);
  const [count, setCount] = useState(5);
  const [userRequestList, setUserRequestList] = useState<UserRequest[]>([]);
  const { isSingleMode } = useModeStore();
  const { addToast } = useToastsStore();
  const { setAccessedUserReq } = usePlayerStore();

  // 카운팅 리세팅 함수
  const resetCount = () => {
    if (countTimeoutRef.current) {
      clearTimeout(countTimeoutRef.current);
      countTimeoutRef.current = null;
    }
    countRef.current = 5;
    setCount(countRef.current);
  };

  // 요청 승인 함수
  const accessReq = async (reqItem: UserRequest) => {
    resetCount();
    const isDel = await deleteFireStore(reqItem.id, "userRequest");
    if (isDel) {
      // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - UserRequest를 AccessedUserReq로 캐스팅
      setAccessedUserReq(reqItem as any);
      addToast("해당 요청이 승인되었습니다.");
    } else {
      addToast("요청 승인에 실패하였습니다.");
    }
  };

  // 요청 취소 함수
  const cancelReq = async (id: string) => {
    resetCount();
    const isDel = await deleteFireStore(id, "userRequest");
    if (isDel) addToast("해당 요청이 삭제되었습니다.");
    else addToast("해당 요청 삭제에 실패하였습니다.");
  };

  // 카운트 + 자동 승인 함수 (ref 기반으로 최신 리스트 참조)
  const secCounting = () => {
    if (countRef.current <= 0) {
      countTimeoutRef.current = setTimeout(() => {
        const currentList = userRequestListRef.current;
        if (currentList.length > 0) {
          accessReq(currentList[0]);
        }
        resetCount();
      }, 1000);
      return;
    }
    countTimeoutRef.current = setTimeout(() => {
      countRef.current -= 1;
      setCount(countRef.current);
      secCounting();
    }, 1000);
  };

  // 요청이 있는 경우 카운팅
  // biome-ignore lint/correctness/useExhaustiveDependencies: userRequestList.length 변경 시에만 실행
  useEffect(() => {
    if (isSingleMode) return;
    if (userRequestList.length > 0) secCounting();
  }, [userRequestList.length]);

  // Firestore userRequest 실시간 구독
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 실행
  useEffect(() => {
    if (isSingleMode) return;

    const playListQuery = query(
      collection(initFireStore, "userRequest"),
      orderBy("createAt", "asc"),
    );

    const unsubscribe = onSnapshot(playListQuery, (snapshot) => {
      const contentArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserRequest[];
      resetCount();
      userRequestListRef.current = contentArr;
      setUserRequestList(contentArr);
    });

    return () => {
      unsubscribe();
      if (countTimeoutRef.current) {
        clearTimeout(countTimeoutRef.current);
        countTimeoutRef.current = null;
      }
    };
  }, []);

  return { count, userRequestList, accessReq, cancelReq };
};
