import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {setAuthStorage} from "../../utils/common";
import {useToastsStore} from "../common/components/Toasts";
import {cipher, decipher} from "../../utils/crypto";

const Enter = () => {
    const nickNameRef = useRef(null);
    const certificateRef = useRef(null);

    const toastStore = useToastsStore();

    const [nickName, setNickName] = useState("");
    const [certificate, setCertificate] = useState("");

    const navigate = useNavigate();

    const submitCertificateNumber = (e) => {
        e.preventDefault();

        if (nickName.trim() === "") return toastStore.addToast("닉네임을 입력해주세요.");

        const isAdmin = certificate === process.env.REACT_APP_CERTIFICATE_ADMIN;
        const isAccess = certificate === process.env.REACT_APP_CERTIFICATE_NUMBER;

        if (isAccess || isAdmin) {
            setAuthStorage(nickName, isAdmin);
            return navigate("/queuePlayer");
        }

        return toastStore.addToast("인증번호가 맞지않습니다.");
    }

    useEffect(() => {
        const amho = cipher("sdf");
        const bocho = decipher(amho)
        console.log("암호화?", amho)
        console.log("복호?", bocho)
        console.log(process.env.REACT_APP_CERTIFICATE_NUMBER)
    }, []);

    return (
        <div className="w-full h-full flex flex-col gap-[100px] justify-center items-center">
            <div className="flex flex-col gap-[40px] text-center">
                <h1 className="text-7xl">YouTube Queue Player!</h1>
                <p>원하는 유튜브 음악의 URL을 요청하면 플레이리스트에 등록되고,<br/> 순차적으로 재생시켜주는 웹앱이에요</p>
            </div>
            <form className="flex flex-col gap-5" onSubmit={submitCertificateNumber} autoComplete="off">
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
                        autoComplete="off"
                    />
                </div>

                <div className="flex gap-5 items-center">
                    <p className="w-[146px] text-[24px] text-center" onClick={() => certificateRef.current.focus()}>
                        Certificate
                    </p>
                    <input
                        className="py-1 px-4 bg-gray-100 text-[18px] rounded-[8px]"
                        ref={certificateRef}
                        type="new-password"
                        onChange={(e) => setCertificate(e.target.value)}
                        value={certificate}
                        autoComplete="off"
                    />
                </div>

                <button className="text-6xl hover:scale-110 hover:bg-gray-50" type="submit">
                    Enter
                </button>
            </form>
        </div>
    )
}

export default Enter;