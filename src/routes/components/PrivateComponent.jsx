import React, {useEffect, useState} from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useToastsStore} from "../../modules/common/Toasts";
import {useTokenStore} from "../../store/commonStore";
import {firebaseAuth} from "../../libs/firebase";

/**@param { boolean } isOnlyNonCertificate 비인증 접속자만 연결 가능한 경우 추가 */
const PrivateComponent = ({ isOnlyNonCertificate }) => {
    const toastStore = useToastsStore();
    const tokenStore = useTokenStore();

    const [component, setComponent] = useState();

    // 토스트 함수
    const toast = (msg) => {
        // 중복 토스트를 방지하기 위한 조건문
        if (toastStore.toasts.length === 0) toastStore.addToast(msg);
    }

    // 스토리지에 토큰 체크 후 컴포넌트 리턴하는 함수
    const renderComponent = () => {

    }

    // 로그인 토큰 체크
    useEffect(() => {
        // firebase를 활용한 로그인상태 체크
        firebaseAuth.onAuthStateChanged((user) => {
            // if (user) {
            //     console.log("유저: ",user)
            //     console.log("유저 uid", user.uid)
            // } else {
            //     console.log('로그인상태 아님')
            // }

            // 스토리지에 토큰이 없어 null 반환인 경우
            if (!user) {
                // 비인증 상태에서만 접속 가능한 컴포넌트인 경우
                if (isOnlyNonCertificate) return <Outlet/>

                // 인증 상태에서만 접속 가능한 경우
                toast("사용자 인증 후 이용 가능한 페이지입니다.");
                return <Navigate to="/"/>;
            }

            // 로그인 상태에서 비인증자만 접속 가능한 페이지인 경우
            if (isOnlyNonCertificate) return <Navigate to="/main"/>;

            // 토큰이 있다면 routing
            return <Outlet />

        })
    }, []);

    return component && renderComponent();
}

export default PrivateComponent;
