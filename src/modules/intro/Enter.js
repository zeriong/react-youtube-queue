import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {setAuthStorage} from "../../utils/common";
import {useToastsStore} from "../common/components/Toasts";
import {addDoc, collection} from "firebase/firestore";
import {initFireStore} from "../../libs/firebase";
import {add, format} from "date-fns";
import {useTokenStore} from "../../App";

const Enter = () => {
    const nickNameRef = useRef(null);
    const certificateRef = useRef(null);

    const toastStore = useToastsStore();
    const tokenStore = useTokenStore();

    const [nickName, setNickName] = useState("");
    const [certificate, setCertificate] = useState("");

    const navigate = useNavigate();

    const submitCertificateNumber = (e) => {
        (async () => {
            e.preventDefault();

            if (nickName.trim() === "") return toastStore.addToast("닉네임을 입력해주세요.");

            const isAdmin = certificate === process.env.REACT_APP_CERTIFICATE_ADMIN;
            const isAccess = certificate === process.env.REACT_APP_CERTIFICATE_NUMBER;

            if (isAccess || isAdmin) {
                // 로컬스토리지에 저장할 유저데이터 생성
                const expire = format(add(Date.now(), {months: 1}), "yyyy-MM-dd");

                // 유효기간 지나도록 설정 test
                // const dateGet = new Date(Date.now());
                // const expire = format(dateGet.setDate(dateGet.getDate() - 1), "yyyy-MM-dd");

                const role = isAdmin ? 1 : 0;
                let userData = { nickName, expire, role };

                // 이미 등록된 닉네임의 경우

                // fireStore db에 users에 nickName 저장
                await addDoc(collection(initFireStore, "users"), {nickName})
                    .then((res) => {
                        // 토큰에 fireStore 에 지정된 id 저장
                        userData.id = res.id;
                    })
                    .catch((e) => {
                        console.log("error: ",e);
                        return toastStore.addToast("유저데이터 저장에 실패하였습니다.");
                    });

                // 로컬스토리지에 암호화하여 토큰형태로 저장
                setAuthStorage(userData);
                // 이후 스토어에도 저장
                tokenStore.setToken(userData);

                return navigate("/queuePlayer");
            }

            return toastStore.addToast("인증번호가 일치하지 않습니다.");
        })()
    }

    useEffect(() => {

    }, []);

    return (
        <div className="w-full h-full flex flex-col gap-[60px] justify-center items-center">

            {/*<div className="p-5 fixed left-1/2 top-1/2 bg-black text-white" onClick={() =>  console.log("이거슨 토큰", tokenStore.token)}> test </div>*/}

            <div className="flex flex-col gap-[40px] text-center">
                <h1 className="text-7xl">YouTube Queue Player!</h1>
                <p className="text-xl">원하는 유튜브 음악의 URL을 요청하면 플레이리스트에 등록되고<br/> 순차적으로 재생시켜주는 웹앱이에요</p>
            </div>
            <form className="flex flex-col gap-5" onSubmit={submitCertificateNumber} >
                <div className="flex gap-5 items-center">
                    <p className="w-[146px] text-[24px] text-center" onClick={() => nickNameRef.current.focus()}>
                        Nick Name
                    </p>
                    <input
                        className="py-1 px-4 bg-gray-100 text-[18px] rounded-[8px]"
                        ref={nickNameRef}
                        type="text"
                        onChange={(e) => setNickName(e.target.value)}
                        value={nickName}
                    />
                </div>

                <div className="flex gap-5 items-center">
                    <p className="w-[146px] text-[24px] text-center" onClick={() => certificateRef.current.focus()}>
                        Certificate
                    </p>
                    <input
                        className="py-1 px-4 bg-gray-100 text-[18px] rounded-[8px]"
                        ref={certificateRef}
                        type="password"
                        onChange={(e) => setCertificate(e.target.value)}
                        value={certificate}
                        autoComplete="new-password"
                    />
                </div>

                <button className="text-6xl hover:scale-110 hover:bg-gray-100 mt-4" type="submit">
                    Enter
                </button>
            </form>
        </div>
    )
}

export default Enter;