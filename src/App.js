import React, {useEffect, useRef, useState} from "react";
import Router from "./routes/Router";
import Toasts from "./modules/common/components/Toasts";
import {TOKEN_NAME} from "./constants";
import {create} from "zustand";
import {getAuthStorage} from "./utils/common";
import {deleteUser} from "./utils/firebase";

/** Token store */
export const useTokenStore = create((setState) => ({
    token: null,
    setToken: (getToken) => setState(() => {
        return { token: getToken };
    }),
    deleteToken: () => setState(() => {
        localStorage.removeItem(TOKEN_NAME);
        return { token: null };
    })
}));

function App() {
    const tokenRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    // 스토리지에서 직접적으로 변경, 삭제 시도하거나
    // 새로운 브라우저로 페이지 접속 시 일괄 로그아웃

    const tokenStore = useTokenStore();

    // 초기 토큰 set
    const initSetToken = async () => {
        const getToken = await getAuthStorage();
        tokenStore.setToken(getToken);
    }

    // 로컬스토리지 변경 감지 함수
    const autoLogout = () => {
        // 지속보존된 tokenRef.current 를 통해 fireStore data 삭제 후 로그아웃
        if (!tokenRef.current) return;
        deleteUser(tokenRef.current.id).then(() => tokenStore.deleteToken());
        alert("로컬스토리지 조작을 멈춰주세요!\n로그인되어있다면 자동으로 로그아웃합니다.");
    }

    // 토큰이 있는 경우에만 지속적으로 별도의 DOM 에 깊은 복사하여 보존
    useEffect(() => {
        if (!tokenStore.token) return;
        const stringify = JSON.stringify(tokenStore.token);
        tokenRef.current = JSON.parse(stringify);
    }, [tokenStore.token]);

    // init effect
    useEffect(() => {
        // 초기 토큰 세팅 후 페이지 렌더링
        initSetToken().then(() => setIsLoading(false));
        // 전역에 로컬스토리지 변경 감지 이벤트 등록
        window.addEventListener('storage', autoLogout);
        
        // 언마운트 시 이벤트 해제
        return () => window.removeEventListener('storage', autoLogout);
    }, []);

    return (
        <>
            {!isLoading &&
                <>
                    <Router/>
                    <Toasts/>
                </>
            }
        </>
    );
}

export default App;
