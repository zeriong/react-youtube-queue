import { createFileRoute, redirect } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useTokenStore, useUserStore } from "@/entities/user/model";
import { useCertificateLogin, useNickNameInput } from "@/features/auth/model";
import { SingleModeButton } from "@/features/single-mode/ui/SingleModeButton";
import PrivateRoute from "@/shared/ui/PrivateRoute";

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

  const { nickName, byteCount, onChangeNickName } = useNickNameInput();
  const { submitCertificateNumber } = useCertificateLogin();

  const [certificate, setCertificate] = useState("");

  return (
    <div
      className={twMerge(
        "relative w-full h-full flex flex-col gap-15 justify-center items-center",
      )}
    >
      <SingleModeButton />
      <div className="flex flex-col gap-10 text-center mx-auto">
        <div className="text-7xl font-extrabold flex gap-6">
          <div>우리의 공간</div>
          <div className="font-black text_line text-amber-400">
            {"< Z-Space />"}
          </div>
        </div>
      </div>

      <ul className="flex flex-col text-[15px] gap-4">
        <div className="flex gap-4 mx-auto">
          <li
            className={twMerge(
              "px-4 font-medium py-2 border-[3px] shadow-lg",
              "border-gray-300 rounded-md w-fit",
            )}
          >
            # 자유롭게 신청하고 듣자! ♬
          </li>
          <li
            className={twMerge(
              "px-4 font-medium py-2 border-[3px] shadow-lg",
              "border-gray-300 rounded-md w-fit",
            )}
          >
            # 사다리타기 걸린 사람이 오늘 커피 쏘는거야 ^^
          </li>
        </div>
        <div className="flex gap-4 mx-auto font-medium">
          <li
            className={twMerge(
              "px-4 py-2 border-[3px] shadow-lg",
              "border-gray-300 rounded-md w-fit",
            )}
          >
            # 불공정해? 민주주의 국가 국민으로서 투표 ㄱㄱ
          </li>
          <li
            className={twMerge(
              "px-4 font-medium py-2 border-[3px] shadow-lg",
              "border-gray-300 rounded-md w-fit",
            )}
          >
            # 네가 그렇게 테트리스를 잘해? 사무실로 따라와.
          </li>
        </div>
      </ul>

      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          submitCertificateNumber(nickName, certificate);
        }}
      >
        <div className="flex gap-5 items-center">
          <label
            className="w-[160px] text-2xl text-center"
            htmlFor="login-nickname"
          >
            Nick Name
          </label>
          <div className="relative">
            <input
              id="login-nickname"
              className="py-1 pl-4 pr-12 bg-gray-100 text-lg rounded-lg w-[300px]"
              ref={nickNameInputRef}
              type="text"
              onChange={onChangeNickName}
              value={nickName}
            />
            <p className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
              {`${byteCount}/16 byte`}
            </p>
          </div>
        </div>

        <div className="flex gap-5 items-center">
          <label
            className="w-[160px] text-2xl text-center"
            htmlFor="login-certificate"
          >
            Certificate
          </label>
          <input
            id="login-certificate"
            className="py-1 px-4 bg-gray-100 text-lg rounded-lg w-[300px]"
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
