import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTokenStore, useUserStore } from "@/entities/user/model";
import PrivateRoute from "@/shared/ui/PrivateRoute";
import Layout from "@/widgets/layout/Layout";

export const Route = createFileRoute("/main")({
  beforeLoad: () => {
    // SSR 환경에서는 localStorage 접근 불가 → 클라이언트에서만 인증 체크
    if (typeof window === "undefined") return;

    const user = useUserStore.getState().user;
    const token = useTokenStore.getState().token;
    if (!user && !token) {
      throw redirect({ to: "/" });
    }
  },
  component: () => (
    <PrivateRoute>
      <Layout />
    </PrivateRoute>
  ),
});
