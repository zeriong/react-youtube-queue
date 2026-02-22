import { useNavigate } from "@tanstack/react-router";
import { add, format } from "date-fns";
import { addDoc, collection } from "firebase/firestore";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useModeStore } from "@/entities/mode/model";
import { useToastsStore } from "@/shared/hooks/useToastsStore";
import {
  getAuthStorage,
  setAuthStorage,
  useTokenStore,
  useUserStore,
} from "@/entities/user/model";
import { firebaseAuth, initFireStore } from "@/shared/config/firebase";
import usePreventSpam from "@/shared/hooks/usePreventSpam";
import { deleteUser, getFireStoreData } from "@/shared/lib/firebase";
import { validateByteFormLength } from "@/shared/utils/validation";

/**
 * @description 루트 레이아웃 인증 초기화 훅
 * - Firebase 로그인 상태 리스너
 * - 토큰 초기화 및 deep copy
 * - 자동 로그아웃 (storage 이벤트 감지)
 */
export const useRootAuth = () => {
  // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - 토큰 구조가 동적
  const tokenRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isSingleMode } = useModeStore();
  const { setLogin } = useUserStore();
  const tokenStore = useTokenStore();

  // 토큰이 있는 경우에만 별도 ref에 깊은 복사하여 보존
  useEffect(() => {
    if (!tokenStore.token) return;
    const stringify = JSON.stringify(tokenStore.token);
    tokenRef.current = JSON.parse(stringify);
  }, [tokenStore.token]);

  // init effect
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 실행
  useEffect(() => {
    // 싱글모드에서는 Firebase 인증을 건너뜀
    if (isSingleMode) {
      setIsLoading(false);
      return;
    }

    // firebase를 활용한 로그인상태 체크
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) setLogin(user);
    });

    // 초기 토큰 세팅 후 페이지 렌더링
    const initSetToken = async () => {
      const getToken = await getAuthStorage();
      tokenStore.setToken(getToken);
    };
    initSetToken().then(() => setIsLoading(false));

    // 로컬스토리지 변경 감지 함수 (자동 로그아웃)
    const autoLogout = () => {
      if (!tokenRef.current) return;
      deleteUser(tokenRef.current.id).then(() => tokenStore.deleteToken());
    };

    // 전역에 로컬스토리지 변경 감지 이벤트 등록
    window.addEventListener("storage", autoLogout);

    // 언마운트 시 이벤트 해제
    return () => window.removeEventListener("storage", autoLogout);
  }, []);

  return { isLoading };
};

/**
 * @description 닉네임 입력 상태 및 바이트 유효성 검증 훅
 */
export const useNickNameInput = () => {
  const [nickName, setNickName] = useState("");
  const [byteCount, setByteCount] = useState(0);

  const onChangeNickName = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    const { isValidate, byte } = validateByteFormLength(value, 16);
    if (isValidate) {
      setByteCount(byte);
      setNickName(value);
    }
  };

  return { nickName, byteCount, onChangeNickName };
};

/**
 * @description 인증번호 로그인 훅
 * - 인증번호 검증, 닉네임 중복 체크, 유저 생성, 토큰 저장
 */
export const useCertificateLogin = () => {
  const navigate = useNavigate();
  const { addToast } = useToastsStore();
  const tokenStore = useTokenStore();
  const { isPrevent, preventSpamTrigger, preventCounting } = usePreventSpam();

  const submitCertificateNumber = async (
    nickName: string,
    certificate: string,
  ) => {
    if (isPrevent) return preventCounting();
    preventSpamTrigger();

    const trimNickName = nickName.trim();

    if (trimNickName === "") return addToast("닉네임을 입력해주세요.");

    const isAdmin = certificate === import.meta.env.VITE_CERTIFICATE_ADMIN;
    const isAccess = certificate === import.meta.env.VITE_CERTIFICATE_NUMBER;

    if (isAccess || isAdmin) {
      const expire = format(add(Date.now(), { months: 1 }), "yyyy-MM-dd");

      const role = isAdmin ? 1 : 0;
      // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - Firestore 동적 필드(id) 추가
      const userData: any = { nickName: trimNickName, expire, role };

      const users = await getFireStoreData("users");
      // biome-ignore lint/suspicious/noExplicitAny: 레거시 코드 - Firestore 문서 타입 미정의
      if (users.some((user: any) => user.nickName === trimNickName)) {
        return addToast(
          "이미 접속중인 닉네임입니다, 다른 닉네임으로 접속해주세요!",
        );
      }

      await addDoc(collection(initFireStore, "users"), {
        nickName: trimNickName,
      })
        .then((res) => {
          userData.id = res.id;
        })
        .catch((e) => {
          console.log("error: ", e);
          return addToast("유저데이터 저장에 실패하였습니다.");
        });

      setAuthStorage(userData);
      tokenStore.setToken(userData);

      return navigate({ to: "/main/player" });
    }

    return addToast("인증번호가 일치하지 않습니다.");
  };

  return { submitCertificateNumber };
};

/**
 * @description 로그아웃 훅
 * - Firebase 로그아웃 + Firestore 유저 삭제 + 토큰/상태 초기화
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const { token, deleteToken } = useTokenStore();
  const { isSingleMode, setIsSingleMode } = useModeStore();
  const { setLogout } = useUserStore();
  const { addToast } = useToastsStore();

  const logout = async () => {
    if (isSingleMode) {
      if (!window.confirm("싱글모드를 종료하시겠습니까?")) return;
      setIsSingleMode(false);
      deleteToken();
      addToast("싱글모드가 종료되었습니다.");
      navigate({ to: "/" });
      return;
    }

    if (!window.confirm("로그아웃 하시겠습니까?")) return;
    await firebaseAuth.signOut();
    await deleteUser(token?.id);
    deleteToken();
    setLogout();
    addToast("로그아웃 되었습니다.");
    navigate({ to: "/" });
  };

  return { logout };
};
