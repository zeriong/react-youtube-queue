import { addDoc, collection } from "firebase/firestore";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactPlayer from "react-player";
import { useModeStore } from "@/entities/mode/model";
import { usePlayerStore } from "@/entities/player/model";
import { useTokenStore } from "@/entities/user/model";
import { initFireStore } from "@/shared/config/firebase";
import { YOUTUBE_BASE_URL } from "@/shared/constants";
import { useToastsStore } from "@/shared/hooks/useToastsStore";
import { updateFireStoreData } from "@/shared/lib/firebase";
import {
  addLocalPlayList,
  getLocalPlayList,
  updateLocalPlayList,
} from "@/shared/lib/single-mode-storage";
import { usePlayerModalStore } from "./usePlayerModalStore";

/**
 * @description 음악 신청/수정 비즈니스 로직 훅
 * - 디바운스 URL 입력 핸들링
 * - URL 유효성 검증 (유튜브 링크, 재생 가능 여부)
 * - Firestore 추가/수정
 * - 모달 상태 연동
 */
export const useSubmitMusic = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const submitInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [submitURLInput, setSubmitURLInput] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [isOnce, setIsOnce] = useState(false);

  const { isSingleMode } = useModeStore();
  const { addToast } = useToastsStore();
  const tokenStore = useTokenStore();
  const {
    submitMaxLength,
    submitMusic,
    selectedCurrentMusic,
    setSelectedCurrentMusic,
    setSubmitMusic,
  } = usePlayerStore();
  const { isShowEditModal, setIsShowEditModal } = usePlayerModalStore();

  // submit URL onChange (디바운스)
  const handleSubmitOnChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setCanSubmit(false);

    // 기존 디바운스 타이머 정리
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (value.trim() === "") {
      setSubmitURLInput("");
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setSubmitURLInput(value);
    }, 1000);
  };

  // 신청곡 url submit
  const submitURL = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (submitURLInput.trim() === "") {
      return addToast("신청하실 유튜브 음악 링크를 입력해주세요.");
    }
    if (!submitURLInput.includes(YOUTUBE_BASE_URL)) {
      return addToast("유튜브 링크를 입력해주세요.");
    }
    if (ReactPlayer.canPlay && !ReactPlayer.canPlay(submitURLInput)) {
      return addToast("재생가능한 동영상 링크가 아닙니다!");
    }

    // 새로 추가인 경우
    if (!selectedCurrentMusic) {
      if (submitMaxLength <= submitMusic.length) {
        setIsShowEditModal(false);
        return addToast(
          `신청 가능한 플레이리스트는 최대 ${submitMaxLength}개입니다.`,
        );
      }
      const confirmSubmit = window.confirm("플레이리스트에 추가하시겠습니까?");
      if (confirmSubmit) {
        if (isSingleMode) {
          addLocalPlayList({
            nickName: tokenStore.token?.nickName,
            createAt: Date.now(),
            link: submitURLInput,
            title: titleInputRef.current?.value,
          });
          setSubmitMusic(getLocalPlayList());
          addToast("플레이리스트에 추가되었습니다.");
          setIsShowEditModal(false);
        } else {
          await addDoc(collection(initFireStore, "playList"), {
            nickName: tokenStore.token?.nickName,
            createAt: Date.now(),
            link: submitURLInput,
            title: titleInputRef.current?.value,
          })
            .then(() => {
              addToast("플레이리스트에 추가되었습니다.");
              setIsShowEditModal(false);
            })
            .catch((e) => {
              alert("플레이리스트 추가에 실패하였습니다.");
              console.log(e);
            });
        }
      } else {
        addToast("플레이리스트 신청이 취소되었습니다.");
      }
    } else {
      // 수정하는 경우
      if (selectedCurrentMusic.link === submitURLInput.trim()) {
        addToast("이전 URL과 동일하여 수정을 취소합니다.");
        return setIsShowEditModal(false);
      }

      if (isSingleMode) {
        // biome-ignore lint/style/noNonNullAssertion: selectedCurrentMusic 존재 시 id 보장
        const isUpdate = updateLocalPlayList(selectedCurrentMusic.id!, {
          link: submitURLInput.trim(),
        });
        if (isUpdate) {
          setSubmitMusic(getLocalPlayList());
          setIsShowEditModal(false);
        }
        addToast(
          isUpdate ? "링크가 수정되었습니다." : "링크 수정에 실패하였습니다.",
        );
      } else {
        const isUpdate = await updateFireStoreData(
          // biome-ignore lint/style/noNonNullAssertion: selectedCurrentMusic 존재 시 id 보장
          selectedCurrentMusic.id!,
          { link: submitURLInput.trim() },
          "playList",
        );
        if (isUpdate) setIsShowEditModal(false);
        addToast(
          isUpdate ? "링크가 수정되었습니다." : "링크 수정에 실패하였습니다.",
        );
      }
    }
  };

  // URL input 초기화
  const clearSubmitInput = () => {
    if (submitInputRef.current) {
      submitInputRef.current.value = "";
      setSubmitURLInput("");
      setCanSubmit(false);
      submitInputRef.current.focus();
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // 타이틀 input 초기화
  const clearTitleInput = () => {
    if (titleInputRef.current) {
      titleInputRef.current.value = "";
      titleInputRef.current.focus();
    }
  };

  // ReactPlayer 이벤트 핸들러 (onLoadedMetadata / onError)
  // - canSubmit 상태는 오직 플레이어 이벤트로만 제어
  const handlePlayerReady = useCallback(() => setCanSubmit(true), []);
  const handlePlayerError = useCallback(() => setCanSubmit(false), []);

  // 모달 창이 닫히면 state 초기화
  useEffect(() => {
    if (!isShowEditModal) {
      setSelectedCurrentMusic(null);
      setSubmitURLInput("");
      setCanSubmit(false);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else if (!isOnce) {
      setIsOnce(true);
      addToast(
        "제목은 필수 입력이 아닙니다.<br/> 미입력 시 (닉네임 + 신청곡)으로 표기됩니다.",
      );
    }
  }, [isShowEditModal, addToast, isOnce, setSelectedCurrentMusic]);

  // 수정인 경우 setState
  useEffect(() => {
    if (selectedCurrentMusic && submitInputRef.current) {
      submitInputRef.current.value = selectedCurrentMusic.link;
      setSubmitURLInput(selectedCurrentMusic.link);
    }
  }, [selectedCurrentMusic]);

  return {
    submitInputRef,
    titleInputRef,
    submitURLInput,
    canSubmit,
    selectedCurrentMusic,
    isShowEditModal,
    setIsShowEditModal,
    handleSubmitOnChange,
    submitURL,
    handlePlayerReady,
    handlePlayerError,
    clearSubmitInput,
    clearTitleInput,
  };
};
