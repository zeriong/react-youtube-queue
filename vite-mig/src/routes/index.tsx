import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { add, format } from "date-fns";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useToastsStore } from "@/entities/toast/model";
import { useTokenStore, useUserStore } from "@/entities/user/model";
import { firebaseAuth, initFireStore } from "@/shared/config/firebase";
import usePreventSpam from "@/shared/hooks/usePreventSpam";
import { getFireStoreData } from "@/shared/lib/firebase";
import { GithubIcon, GoogleIcon } from "@/shared/ui/icons";
import PrivateRoute from "@/shared/ui/PrivateRoute";
import { setAuthStorage } from "@/shared/utils/auth";
import { validateByteFormLength } from "@/shared/utils/validation";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // SSR 환경에서는 localStorage 접근 불가 → 클라이언트에서만 인증 체크
    if (typeof window === "undefined") return;

    const user = useUserStore.getState().user;
    const token = useTokenStore.getState().token;
    if (user || token) {
      throw redirect({ to: "/main" });
    }
  },
  component: () => (
    <PrivateRoute isOnlyNonCertificate>
      <Enter />
    </PrivateRoute>
  ),
});

function Enter() {
  const nickNameInputRef = useRef<HTMLInputElement>(null);
  const certificateInputRef = useRef<HTMLInputElement>(null);
  const { isPrevent, preventSpamTrigger, preventCounting } = usePreventSpam();

  const toastStore = useToastsStore();
  const tokenStore = useTokenStore();

  const [nickName, setNickName] = useState("");
  const [byteCount, setByteCount] = useState(0);
  const [certificate, setCertificate] = useState("");

  const navigate = useNavigate();

  // OAuth 함수
  const onSocialClick = async (authCategory: "google" | "github") => {
    let provider;

    if (authCategory === "google") {
      provider = new GoogleAuthProvider();
    } else if (authCategory === "github") {
      provider = new GithubAuthProvider();
    }

    if (provider) {
      const data = await signInWithPopup(firebaseAuth, provider);
      console.log(data);
    }
  };

  const onChangeNickName = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    const { isValidate, byte } = validateByteFormLength(value, 16);
    if (isValidate) {
      setByteCount(byte);
      setNickName(value);
    }
  };

  const submitCertificateNumber = (e: FormEvent) => {
    (async () => {
      e.preventDefault();

      if (isPrevent) return preventCounting();
      preventSpamTrigger();

      const trimNickName = nickName.trim();

      if (trimNickName === "")
        return toastStore.addToast("닉네임을 입력해주세요.");

      const isAdmin = certificate === import.meta.env.VITE_CERTIFICATE_ADMIN;
      const isAccess = certificate === import.meta.env.VITE_CERTIFICATE_NUMBER;

      if (isAccess || isAdmin) {
        const expire = format(add(Date.now(), { months: 1 }), "yyyy-MM-dd");

        const role = isAdmin ? 1 : 0;
        const userData: any = { nickName: trimNickName, expire, role };

        const users = await getFireStoreData("users");
        if (users.some((user: any) => user.nickName === trimNickName)) {
          return toastStore.addToast(
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
            return toastStore.addToast("유저데이터 저장에 실패하였습니다.");
          });

        setAuthStorage(userData);
        tokenStore.setToken(userData);

        return navigate({ to: "/main/player" });
      }

      return toastStore.addToast("인증번호가 일치하지 않습니다.");
    })();
  };

  return (
    <div
      className={twMerge(
        "w-full h-full flex flex-col gap-[60px] justify-center items-center",
      )}
    >
      <div className="flex flex-col gap-[40px] text-center mx-auto">
        <div className="text-7xl font-[800] flex gap-[24px]">
          <div>우리의 공간</div>
          <div className="font-[900] text_line text-amber-400">
            {"< Z-Space />"}
          </div>
        </div>
      </div>

      <ul className="flex flex-col text-[15px] gap-4">
        <div className="flex gap-4 mx-auto">
          <li
            className={twMerge(
              "px-[16px] font-[500] py-[8px] border-[3px] shadow-lg",
              "border-gray-300 rounded-md w-fit",
            )}
          >
            # 자유롭게 신청하고 듣자! ♬
          </li>
          <li
            className={twMerge(
              "px-[16px] font-[500] py-[8px] border-[3px] shadow-lg",
              "border-gray-300 rounded-md w-fit",
            )}
          >
            # 사다리타기 걸린 사람이 오늘 커피 쏘는거야 ^^
          </li>
        </div>
        <div className="flex gap-4 mx-auto font-[500]">
          <li
            className={twMerge(
              "px-[16px] py-[8px] border-[3px] shadow-lg",
              "border-gray-300 rounded-md w-fit",
            )}
          >
            # 불공정해? 민주주의 국가 국민으로서 투표 ㄱㄱ
          </li>
          <li
            className={twMerge(
              "px-[16px] font-[500] py-[8px] border-[3px] shadow-lg",
              "border-gray-300 rounded-md w-fit",
            )}
          >
            # 네가 그렇게 테트리스를 잘해? 사무실로 따라와.
          </li>
        </div>
      </ul>

      <form className="flex flex-col gap-5" onSubmit={submitCertificateNumber}>
        <div className="flex gap-5 items-center">
          <p
            className="w-[160px] text-[24px] text-center"
            onClick={() => nickNameInputRef.current?.focus()}
          >
            Nick Name
          </p>
          <div className="relative">
            <input
              className="py-1 pl-4 pr-12 bg-gray-100 text-[18px] rounded-[8px] w-[300px]"
              ref={nickNameInputRef}
              type="text"
              onChange={onChangeNickName}
              value={nickName}
            />
            <p className="absolute right-2 top-1/2 -translate-y-1/2 text-[14px]">
              {`${byteCount}/16 byte`}
            </p>
          </div>
        </div>

        <div className="flex gap-5 items-center">
          <p
            className="w-[160px] text-[24px] text-center"
            onClick={() => certificateInputRef.current?.focus()}
          >
            Certificate
          </p>
          <input
            className="py-1 px-4 bg-gray-100 text-[18px] rounded-[8px] w-[300px]"
            ref={certificateInputRef}
            type="password"
            onChange={(e) => setCertificate(e.target.value)}
            value={certificate}
            autoComplete="new-password"
          />
        </div>

        <button
          className="text-6xl hover:scale-110 hover:bg-gray-100 mt-4"
          type="submit"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
