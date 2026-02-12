import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import { useTokenStore, useUserStore } from "@/entities/user/model";

interface PrivateRouteProps {
	children: ReactNode;
	/** 비인증 접속자만 연결 가능한 경우 (로그인 페이지 등) */
	isOnlyNonCertificate?: boolean;
}

/**
 * @description 원본 PrivateComponent 패턴을 TanStack Start SSR 환경에 맞게 구현한 HOC.
 * __root.tsx의 isLoading이 initSetToken() 완료 전까지 Outlet을 차단하므로,
 * 이 컴포넌트가 렌더될 시점에는 token 상태가 확정적이다.
 * → 동기적 렌더 차단(return null)으로 권한 없는 페이지를 절대 노출하지 않음.
 */
const PrivateRoute = ({
	children,
	isOnlyNonCertificate = false,
}: PrivateRouteProps) => {
	const navigate = useNavigate();
	const { user } = useUserStore();
	const { token } = useTokenStore();
	const isAuthenticated = !!(user || token);

	useEffect(() => {
		if (!isAuthenticated && !isOnlyNonCertificate) {
			navigate({ to: "/" });
		}
		if (isAuthenticated && isOnlyNonCertificate) {
			navigate({ to: "/main" });
		}
	}, [isAuthenticated, isOnlyNonCertificate, navigate]);

	// 비인증 상태에서 인증 필요 페이지 → 렌더 차단
	if (!isAuthenticated && !isOnlyNonCertificate) return null;
	// 인증 상태에서 비인증 전용 페이지 → 렌더 차단
	if (isAuthenticated && isOnlyNonCertificate) return null;

	return <>{children}</>;
};

export default PrivateRoute;
