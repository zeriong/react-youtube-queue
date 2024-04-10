import React, {useEffect} from "react";
import Router from "./routes/Router";
import Toasts from "./modules/common/components/Toasts";
import {TOKEN_NAME} from "./constants";


function App() {
    // 스토리지에서 직접적으로 변경, 삭제 시도하거나
    // 새로운 브라우저로 페이지 접속 시 일괄 로그아웃
    const autoLocalStorageClear = () => {
        localStorage.removeItem(TOKEN_NAME);
        // refresh 하여 private route로 튕겨냄
        window.location.reload();
    }

    // 앱 전역에 storage 감지 이벤트 등록
    useEffect(() => {
        window.addEventListener('storage', autoLocalStorageClear);
        return () => window.removeEventListener('storage', autoLocalStorageClear);
    }, []);

    return (
      <>
          <Router/>
          <Toasts/>
      </>
    );
}

export default App;
