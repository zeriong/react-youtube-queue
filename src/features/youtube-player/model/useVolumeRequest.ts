import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useModeStore } from "@/entities/mode/model";
import { useToastsStore } from "@/shared/hooks/useToastsStore";
import { useTokenStore } from "@/entities/user/model";
import { initFireStore } from "@/shared/config/firebase";
import { CANCEL_USER_REQ } from "@/shared/constants/message";
import { usePlayerModalStore } from "./usePlayerModalStore";

/**
 * @description 볼륨 변경 요청 비즈니스 로직 훅
 * - Firestore currentVolume 실시간 구독
 * - 볼륨 입력 핸들링 (직접입력 + 버튼)
 * - 볼륨 변경 요청 Firestore 전송
 */
export const useVolumeRequest = () => {
  const [currentVolume, setCurrentVolume] = useState(100);
  const [submitVolume, setSubmitVolume] = useState(100);
  const { isSingleMode } = useModeStore();
  const { token } = useTokenStore();
  const { addToast } = useToastsStore();
  const { isShowEditVolumeModal, setIsShowEditVolumeModal } =
    usePlayerModalStore();

  // 직접입력 시 onChange 함수
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reg = /^[0-9]*$/;
    if (!e.target.value) {
      setSubmitVolume(0);
    } else if (reg.test(e.target.value)) {
      if (Number(e.target.value) > 100) {
        setSubmitVolume(100);
      } else {
        setSubmitVolume(Number(e.target.value));
      }
    }
  };

  // 볼륨 변경 버튼 함수
  const handleVolumeChangeButton = (size: number) => {
    let calc = submitVolume + size;
    if (calc < 0) calc = 0;
    if (calc > 100) calc = 100;
    setSubmitVolume(calc);
  };

  // 볼륨 변경 요청 서브밋 함수
  const requestEditVolume = (e: FormEvent) => {
    e.preventDefault();
    (async () => {
      if (submitVolume === currentVolume) {
        return addToast("현재 볼륨과 동일합니다.");
      }
      const isConfirm = window.confirm("볼륨 변경을 요청하시겠습니까?");
      if (!isConfirm) return addToast(CANCEL_USER_REQ);

      await addDoc(collection(initFireStore, "userRequest"), {
        nickName: token?.nickName,
        createAt: Date.now(),
        request: "volume",
        volume: submitVolume,
      })
        .then(() => {
          addToast("볼륨 변경을 요청하였습니다.");
        })
        .catch((e) => {
          alert("요청에 실패하였습니다.");
          console.log("유저 요청실패 error:", e);
        })
        .finally(() => {
          setIsShowEditVolumeModal(false);
        });
    })();
  };

  // 모달 열릴 때 현재 볼륨으로 초기화
  useEffect(() => {
    if (isShowEditVolumeModal) setSubmitVolume(currentVolume);
  }, [isShowEditVolumeModal, currentVolume]);

  // Firestore currentVolume 실시간 구독
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 실행
  useEffect(() => {
    if (isSingleMode) return;

    const volumeQuery = query(collection(initFireStore, "currentVolume"));

    const unsubscribe = onSnapshot(volumeQuery, (snapshot) => {
      const contentArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - Firestore 문서 타입 미정의
      setCurrentVolume((contentArr[0] as any).volume);
    });

    return () => unsubscribe();
  }, []);

  return {
    submitVolume,
    isShowEditVolumeModal,
    setIsShowEditVolumeModal,
    handleOnChange,
    handleVolumeChangeButton,
    requestEditVolume,
  };
};
