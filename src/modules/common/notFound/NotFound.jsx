import {Navigate} from "react-router-dom";
import {useEffect} from "react";
import {useToastsStore} from "../components/Toasts";

// 페이지를 요청하는 경우(404) 초기 화면으로 이동시킴
const NotFound = () => {
    const { addToast } = useToastsStore();

    const toHome = () => {
        addToast("페이지를 찾을 수 없어 초기화면으로 이동합니다.");
    }

    useEffect(() => toHome(), []);

    return <Navigate replace to="/"/>
}

export default NotFound;