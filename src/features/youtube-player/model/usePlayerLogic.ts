import { addDoc, collection } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useModeStore } from "@/entities/mode/model";
import { usePlayerStore } from "@/entities/player/model";
import { useToastsStore } from "@/entities/toast/model";
import { useTokenStore } from "@/entities/user/model";
import { initFireStore } from "@/shared/config/firebase";
import {
  deleteFireStore,
  getFireStoreData,
  updateFireStoreData,
} from "@/shared/lib/firebase";
import {
  addLocalPlayList,
  addLocalSavedList,
  deleteLocalPlayList,
  getLocalPlayList,
  getLocalSavedList,
  getLocalVolume,
  setLocalVolume,
} from "@/shared/lib/single-mode-storage";
import type { Music } from "@/shared/types";
import { defaultPlayer } from "@/shared/utils/common";

/**
 * @description 플레이어 핵심 비즈니스 로직 훅
 * - 재생/이전/다음곡 제어
 * - 유저 요청 처리 (일시정지, 재생, 다음곡, 저장, 볼륨)
 * - 네트워크 상태 핸들링
 * - 볼륨 Firestore 동기화
 */
export const usePlayerLogic = () => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const shuffleRef = useRef<number[]>([]);
  const shouldAutoPlayRef = useRef(false);

  const [isStart, setIsStart] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [prevDisabled, _setPrevDisabled] = useState(true);

  const { isSingleMode } = useModeStore();
  const { addToast } = useToastsStore();
  const { token } = useTokenStore();

  const {
    submitMusic,
    isSubmitPlaying,
    accessedUserReq,
    saveMusicMaxLength,
    savedMusic,
    currentMusic,
    setCurrentMusic,
    setIsSubmitPlaying,
    setAccessedUserReq,
    setSubmitMusic,
    setSavedMusic,
  } = usePlayerStore();

  // 재생상태를 지정하고 상태에 따른 플레이어 재생
  const playYoutubeMusic = () => {
    // 첫 재생을 위한 컴포넌트 변경
    if (!isStart) setIsStart(true);
    shouldAutoPlayRef.current = true;

    // 기본 플리 재생중인지 아닌지 체크할 수 있도록
    const isSubmitPlayingVar = !!submitMusic.length;
    setIsSubmitPlaying(isSubmitPlayingVar);

    // 신청곡이 없다면 기본 곡 에서 랜덤재생
    if (!isSubmitPlayingVar) return defaultPlayer(shuffleRef, setCurrentMusic);

    // 신청곡이 있다면 차례로 재생
    const firstItem = submitMusic[0];

    // 리스트에서 삭제
    if (isSingleMode) {
      // biome-ignore lint/style/noNonNullAssertion: submitMusic[0]에 id가 항상 존재
      deleteLocalPlayList(firstItem.id!);
      setSubmitMusic(getLocalPlayList());
    } else {
      // biome-ignore lint/style/noNonNullAssertion: 레거시 코드 - submitMusic[0]에 id가 항상 존재
      const isDeleted = deleteFireStore(firstItem.id!, "playList");
      if (!isDeleted)
        return alert("삭제에 실패하였습니다, 서버를 점검해주세요.");
    }

    // setCurrentMusic -> link state를 변경하여 즉시 플레이어 실행
    setCurrentMusic(firstItem);
  };

  // 이전곡을 재생할 함수
  const playPrevMusic = () => {
    console.log("아직은 미구현!");
  };

  // 재생중인 음악 저장 요청 함수
  const handleSaveRequest = () => {
    (async () => {
      if (!isSubmitPlaying) return addToast("기본 음악은 저장할 수 없습니다.");
      if (savedMusic.length >= saveMusicMaxLength) {
        return addToast(
          `플레이리스트 저장은 최대 ${saveMusicMaxLength}개까지 가능합니다.`,
        );
      }

      if (isSingleMode) {
        const localSavedList = getLocalSavedList();
        if (localSavedList.some((list) => list.link === currentMusic.link)) {
          return addToast("이미 저장된 플레이리스트입니다.");
        }
        // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - accessedUserReq 동적 필드
        currentMusic.title = (accessedUserReq as any)?.musicTitle;
        addLocalSavedList(currentMusic);
        setSavedMusic(getLocalSavedList());
        return;
      }

      const getSavedLists = await getFireStoreData<Music>("savedList");
      if (getSavedLists.some((list) => list.link === currentMusic.link)) {
        return addToast("이미 저장된 플레이리스트입니다.");
      }
      try {
        // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - accessedUserReq 동적 필드
        currentMusic.title = (accessedUserReq as any)?.musicTitle;
        await addDoc(collection(initFireStore, "savedList"), currentMusic);
      } catch (e) {
        console.log("재생중인 플레이리스트 저장에 실패했습니다. \nerror: ", e);
      }
    })();
  };

  // 저장된 플리를 현재 플리에 추가 요청
  const handleAddCurrentPlayListRequest = (item: Music) => {
    if (isSingleMode) {
      addLocalPlayList({
        // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - Music 타입에 createAt 미정의
        createAt: (item as any).createAt,
        title: item.title,
        link: item.link,
      });
      setSubmitMusic(getLocalPlayList());
      addToast("플레이리스트에 추가되었습니다.");
      return;
    }

    (async () => {
      await addDoc(collection(initFireStore, "playList"), {
        // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - Music 타입에 createAt 미정의
        createAt: (item as any).createAt,
        title: item.title,
        link: item.link,
      })
        .then(() => {
          addToast("플레이리스트에 추가되었습니다.");
        })
        .catch((e) => {
          alert("플레이리스트 추가에 실패하였습니다.");
          console.log(e);
        });
    })();
  };

  // 유저 요청 처리
  const handleUserRequest = () => {
    // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - accessedUserReq 동적 필드
    if ((accessedUserReq as any).id) {
      if (!playerRef.current) return addToast("플레이어가 없는 상태입니다.");
      setAccessedUserReq({});
      // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - accessedUserReq 동적 필드
      const { request } = accessedUserReq as any;
      if (request === "pause") {
        playerRef.current?.pause();
      } else if (request === "play") {
        playerRef.current?.play();
      } else if (request === "next") {
        playYoutubeMusic();
      } else if (request === "save") {
        handleSaveRequest();
      } else if (request === "playSavedMusic") {
        // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - accessedUserReq를 Music으로 캐스팅
        handleAddCurrentPlayListRequest(accessedUserReq as any);
      } else if (request === "volume") {
        // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - accessedUserReq 동적 필드
        const newVolume = (accessedUserReq as any).volume / 100;
        setVolumeState(newVolume);
        if (playerRef.current) {
          playerRef.current.volume = newVolume;
        }

        if (isSingleMode) {
          // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - accessedUserReq 동적 필드
          setLocalVolume((accessedUserReq as any).volume);
        } else {
          (async () => {
            const getVolume = await getFireStoreData("currentVolume");
            await updateFireStoreData(
              // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - Firestore 문서 동적 id
              (getVolume[0] as any).id,
              // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - accessedUserReq 동적 필드
              { volume: (accessedUserReq as any).volume },
              "currentVolume",
            );
          })();
        }
      }
    }
  };

  // 네트워크 온/오프라인 함수
  const onFunc = () => {
    if (isStart) playerRef.current?.play();
  };
  const offFunc = () => {
    if (isStart) playerRef.current?.pause();
  };

  // onReady handler
  const onReady = () => {
    if (shouldAutoPlayRef.current) {
      shouldAutoPlayRef.current = false;
      playerRef.current?.play();
    }
  };

  // 요청사항 처리 effect
  // biome-ignore lint/correctness/useExhaustiveDependencies: 원본과 동일하게 accessedUserReq 변경 시에만 실행
  useEffect(() => {
    handleUserRequest();
  }, [accessedUserReq]);

  // 신청곡을 감지하여 기본 플리 재생중일 땐 즉시 신청곡을 재생하도록 구성
  // biome-ignore lint/correctness/useExhaustiveDependencies: 원본과 동일하게 submitMusic 변경 시에만 실행
  useEffect(() => {
    if (isStart && !isSubmitPlaying) playYoutubeMusic();
  }, [submitMusic]);

  // 영상이 존재했을 때 현재 볼륨 저장
  // biome-ignore lint/correctness/useExhaustiveDependencies: isStart 변경 시에만 실행
  useEffect(() => {
    if (!isStart || !playerRef.current) return;

    // Single Mode: localStorage에서 볼륨 로드 및 적용
    if (isSingleMode) {
      const localVolume = getLocalVolume() / 100;
      setVolumeState(localVolume);
      if (playerRef.current) playerRef.current.volume = localVolume;
      return;
    }

    (async () => {
      const getVolume = await getFireStoreData("currentVolume");
      const playerVolume = Math.round((playerRef.current?.volume ?? 1) * 100);
      if (getVolume.length) {
        updateFireStoreData(
          // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - Firestore 문서 동적 id
          (getVolume[0] as any).id,
          { volume: playerVolume },
          "currentVolume",
        )
          .then((res) => console.log(res))
          .catch((e) => console.log(e));
      } else {
        addDoc(collection(initFireStore, "currentVolume"), {
          volume: playerVolume,
        })
          .then((res) => console.log(res))
          .catch((e) => console.log(e));
      }
    })();
  }, [isStart]);

  // 네트워크 이벤트 등록
  // biome-ignore lint/correctness/useExhaustiveDependencies: 원본과 동일하게 마운트 시 1회만 실행
  useEffect(() => {
    window.addEventListener("online", onFunc);
    window.addEventListener("offline", offFunc);

    return () => {
      window.removeEventListener("online", onFunc);
      window.removeEventListener("offline", offFunc);
    };
  }, []);

  const isAdmin = token?.role === 1;

  return {
    playerRef,
    isAdmin,
    isStart,
    volume,
    prevDisabled,
    currentMusic,
    playYoutubeMusic,
    playPrevMusic,
    onReady,
  };
};
