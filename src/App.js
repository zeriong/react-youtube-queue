import React, {useEffect, useRef, useState} from "react";
import Router from "./routes/Router";
import Toasts from "./modules/common/Toasts";
import {getAuthStorage} from "./utils/common";
import {deleteUser} from "./utils/firebase";
import {useTokenStore} from "./store/commonStore";
import {firebaseAuth} from "./libs/firebase";
import {useUserStore} from "./store/userStore";

// 빌드 모드 검증 변수
export const isDev = process.env.NODE_ENV === "development";

function App() {
    const tokenRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    const { setLogin } = useUserStore();

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
    }

    // 토큰이 있는 경우에만 지속적으로 별도의 DOM 에 깊은 복사하여 보존
    useEffect(() => {
        if (!tokenStore.token) return;
        const stringify = JSON.stringify(tokenStore.token);
        tokenRef.current = JSON.parse(stringify);
    }, [tokenStore.token]);

    // init effect
    useEffect(() => {

        // firebase를 활용한 로그인상태 체크
        firebaseAuth.onAuthStateChanged((user) => {
            // todo: 적용시키기 위해선 토큰으로 사용하던걸 모두 삭제해야 함.
            //      1. 로컬스토리지 활용 안하는걸로 컨버팅
            //      2. 상태관리 로그인로직 체크 필
            //      3. 자동 로그아웃 되는 부분 체크
            //      4. privateElement 체크

            if (user) setLogin(user);
            // setIsLoading(false); // todo: 배포서비스 정상화를 위한 임시 주석
        })



        // 초기 토큰 세팅 후 페이지 렌더링
        initSetToken().then(() => setIsLoading(false)) // todo: 배포서비스 정상화를 위한 임시 활성화
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
