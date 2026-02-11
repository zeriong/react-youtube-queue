/// <reference types="vite/client" />

import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect, useRef, useState } from "react";
import Toasts from "@/entities/toast/ui/Toasts";
import { useTokenStore, useUserStore } from "@/entities/user/model";
import appCss from "@/shared/assets/styles/global.css?url";
import { firebaseAuth } from "@/shared/config/firebase";
import { deleteUser } from "@/shared/lib/firebase";
import { getAuthStorage } from "@/shared/utils/auth";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Z-Space",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),

  component: RootDocument,
});

function RootDocument() {
  const tokenRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { setLogin } = useUserStore();
  const tokenStore = useTokenStore();

  // 초기 토큰 set
  const initSetToken = async () => {
    const getToken = await getAuthStorage();
    tokenStore.setToken(getToken);
  };

  // 로컬스토리지 변경 감지 함수 (자동 로그아웃)
  const autoLogout = () => {
    if (!tokenRef.current) return;
    deleteUser(tokenRef.current.id).then(() => tokenStore.deleteToken());
  };

  // 토큰이 있는 경우에만 지속적으로 별도의 DOM에 깊은 복사하여 보존
  useEffect(() => {
    if (!tokenStore.token) return;
    const stringify = JSON.stringify(tokenStore.token);
    tokenRef.current = JSON.parse(stringify);
  }, [tokenStore.token]);

  // init effect
  useEffect(() => {
    // firebase를 활용한 로그인상태 체크
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) setLogin(user);
    });

    // 초기 토큰 세팅 후 페이지 렌더링
    initSetToken().then(() => setIsLoading(false));
    // 전역에 로컬스토리지 변경 감지 이벤트 등록
    window.addEventListener("storage", autoLogout);

    // 언마운트 시 이벤트 해제
    return () => window.removeEventListener("storage", autoLogout);
  }, []);

  return (
    <html lang="ko">
      <head>
        {/* HeadContent가 없으면 head 설정이 들어가지 않기 때문에 tailwindcss가 적용되지 않음 */}
        <HeadContent />
      </head>

      <body>
        {!isLoading && (
          <>
            <Outlet />
            <Toasts />
          </>
        )}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
