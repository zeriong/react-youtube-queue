/// <reference types="vite/client" />

import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import Toasts from "@/entities/toast/ui/Toasts";
import { useRootAuth } from "@/features/auth/model";
import appCss from "@/shared/assets/styles/global.css?url";

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
        name: "robots",
        content: "noindex,nofollow",
      },
      {
        title: "Z-Space",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),

  component: RootDocument,
});

function RootDocument() {
  const { isLoading } = useRootAuth();

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
