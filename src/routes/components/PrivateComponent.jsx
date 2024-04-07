import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import {getAuthStorage} from "../../utils/common";
import {useToastsStore} from "../../modules/common/components/Toasts";

/**@param { boolean } isOnlyNonCertificate 비인증 접속자만 연결 가능한 경우 추가 */
const PrivateComponent = ({ isOnlyNonCertificate }) => {
    const toastStore = useToastsStore();

    // 토스트 함수
    const toast = (msg) => {
        // 중복 토스트를 방지하기 위한 조건문
        if (toastStore.toasts.length === 0) {
            toastStore.addToast(msg);
        }
    }

    // 스토리지에 토큰 체크 후 컴포넌트 리턴하는 함수
    const validateToken = () => {
        const isSignIn = getAuthStorage();
        // 스토리지에 토큰이 없어 null 반환인 경우
        if (!isSignIn) {
            // 비인증 상태에서만 접속 가능한 컴포넌트인 경우
            if (isOnlyNonCertificate) return <Outlet/>
            // 인증 상태에서만 접속 가능한 경우
            toast("사용자 인증 후 이용 가능한 페이지입니다.");
            return <Navigate to="/"/>;
        }
        // 로그인 상태에서 비인증자만 접속 가능한 페이지인 경우
        if (isOnlyNonCertificate) {
            return <Navigate to="/queuePlayer"/>;
        }
        // 토큰이 있다면 routing
        return <Outlet />
    }

    return validateToken();
}

export default PrivateComponent;