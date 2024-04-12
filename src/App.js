import React, {useEffect, useRef, useState} from "react";
import Router from "./routes/Router";
import Toasts from "./modules/common/components/Toasts";
import {TOKEN_NAME} from "./constants";
import {create} from "zustand";
import {getAuthStorage} from "./utils/common";
import {deleteUser, getUsers} from "./utils/firebase";

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
        alert("해당 페이지는 로컬스토리지 조작을 해킹시도로 인식합니다.\n로그인되어있다면 자동으로 로그아웃되며 초기페이지로 이동합니다.");
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
                    <div className="fixed left-1/2 top-1/3 bg-black text-white p-5"
                         onClick={() => getUsers().then(res => console.log("결과값",res))}>get users test
                    </div>

                    {/*<div className="fixed left-1/2 top-1/2 bg-black text-white p-5"*/}
                    {/*     onClick={() => console.log("토큰레프", tokenRef.current)}>tokenRef test*/}
                    {/*</div>*/}

                    <Router/>
                    <Toasts/>
                </>
            }
        </>
    );
}

export default App;
