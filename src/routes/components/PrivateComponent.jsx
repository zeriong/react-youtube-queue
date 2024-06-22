import React, {useEffect, useState} from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useToastsStore} from "../../modules/common/Toasts";
import {useTokenStore} from "../../store/commonStore";
import {firebaseAuth} from "../../libs/firebase";
import {useUserStore} from "../../store/userStore";

/**@param { boolean } isOnlyNonCertificate 비인증 접속자만 연결 가능한 경우 추가 */
const PrivateComponent = ({ isOnlyNonCertificate }) => {
    const { user } = useUserStore();

    const renderComponent = () => {
        if (!user) {
            // 비인증 상태에서만 접속 가능한 컴포넌트인 경우
            if (isOnlyNonCertificate) return <Outlet/>
            return <Navigate to="/"/>;
        }

        // 로그인 상태에서 비인증자만 접속 가능한 페이지인 경우
        if (isOnlyNonCertificate) return <Navigate to="/main"/>;

        // 토큰이 있다면 routing
        return <Outlet />
    }

    return renderComponent();
}

export default PrivateComponent;
