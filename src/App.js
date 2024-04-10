import React, {useEffect} from "react";
import Router from "./routes/Router";
import {format} from "date-fns";
import Toasts, {useToastsStore} from "./modules/common/components/Toasts";
import {getAuthStorage} from "./utils/common";


function App() {
    const getNow = format(Date.now(), "yyyy-MM-dd");
    const toastStore = useToastsStore();

    // 스토리지에 토큰이 없다면 fireStore 에서 등록된 유저 리스트에서 삭제
    const checkIsUser = () => {
        const isToken = getAuthStorage();
        if (isToken) return;
        // todo: fireStore에 등록된 유저 삭제

        // refresh 하여 private route로 튕겨냄
        window.location.reload();

    }

    // 앱 전역에 storage 감지 이벤트 등록
    useEffect(() => {
        window.addEventListener('storage', checkIsUser);
        return () => window.removeEventListener('storage', checkIsUser);
    }, []);

  return (
      <>
          <Router/>
          <Toasts/>
      </>
  );
}

export default App;
