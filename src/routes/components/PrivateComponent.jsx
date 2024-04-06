import React from "react";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {getAuthStorage} from "../../utils";
const PrivateComponent = () => {

    // 스토리지에 토큰 체크 후 컴포넌트 리턴하는 함수
    const validateToken = () => {
        const isSignIn = getAuthStorage();
        // 스토리지에 토큰이 없어 null 반환인 경우
        if (!isSignIn) {
            alert("사용자인증 후 이용 가능합니다.");
            return <Navigate to="/"/>
        }
        // 토큰이 있다면 routing
        return <Outlet/>
    }

    return validateToken();
}

export default PrivateComponent;