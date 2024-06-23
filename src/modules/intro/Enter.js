import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {setAuthStorage, validateByteFormLength} from "../../utils/common";
import {useToastsStore} from "../common/Toasts";
import {addDoc, collection} from "firebase/firestore";
import {firebaseAuth, initFireStore} from "../../libs/firebase";
import {add, format} from "date-fns";
import {getFireStoreData} from "../../utils/firebase";
import usePreventSpam from "../../hooks/usePreventSpam";
import {useTokenStore} from "../../store/commonStore";
import {GithubIcon, GoogleIcon} from "../svgComponents/svgComponents";
import { GithubAuthProvider, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {isDev} from "../../App";

const Enter = () => {
    const nickNameInputRef = useRef(null);
    const certificateInputRef = useRef(null);
    const { isPrevent, preventSpamTrigger, preventCounting } = usePreventSpam();

    const toastStore = useToastsStore();
    const tokenStore = useTokenStore();

    const [nickName, setNickName] = useState("");
    const [byteCount, setByteCount] = useState(0);
    const [certificate, setCertificate] = useState("");

    const navigate = useNavigate();

    // OAuth 함수
    const onSocialClick = async (authCategory)=> {
        let provider;

        if (authCategory === "google") {
            provider = new GoogleAuthProvider();
        } else if (authCategory === "github") {
            provider = new GithubAuthProvider();
        }

        const data = await signInWithPopup(firebaseAuth, provider);
        console.log(data);
    };

    const onChangeNickName = ({ target: { value } }) => {
        const { isValidate, byte } = validateByteFormLength(value, 16);
        if (isValidate) {
            setByteCount(byte);
            setNickName(value);
        }
    }

    // todo: 별도로 어드민 (로그인 / 회원가입) 창을 만들고 회원가입 요청을 하면
    //       총 책임자(내걸로다가) 계정에서 수락할 수 있도록 마이그레이션
    const submitCertificateNumber = (e) => {
        (async () => {
            e.preventDefault();

            // 광클방지
            if (isPrevent) return preventCounting();
            preventSpamTrigger();

            const trimNickName = nickName.trim();

            if (trimNickName === "") return toastStore.addToast("닉네임을 입력해주세요.");

            const isAdmin = certificate === process.env.REACT_APP_CERTIFICATE_ADMIN;
            const isAccess = certificate === process.env.REACT_APP_CERTIFICATE_NUMBER;

            if (isAccess || isAdmin) {
                // 로컬스토리지에 저장할 유저데이터 생성
                const expire = format(add(Date.now(), {months: 1}), "yyyy-MM-dd");

                // 유효기간 지나도록 설정 test
                // const dateGet = new Date(Date.now());
                // const expire = format(dateGet.setDate(dateGet.getDate() - 1), "yyyy-MM-dd");

                const role = isAdmin ? 1 : 0;
                let userData = { nickName: trimNickName, expire, role };

                // 이미 등록된 닉네임의 경우
                const users = await getFireStoreData("users");
                if (users.some(user => user.nickName === trimNickName)) return toastStore.addToast("이미 접속중인 닉네임입니다, 다른 닉네임으로 접속해주세요!")

                // fireStore db에 users에 nickName 저장
                await addDoc(collection(initFireStore, "users"), {nickName: trimNickName})
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

                return navigate("/player");
            }

            return toastStore.addToast("인증번호가 일치하지 않습니다.");
        })()
    }

    useEffect(() => {

    }, []);

    return (
        <div className="w-full h-full flex flex-col gap-[60px] justify-center items-center">

            {/*<div className="p-5 fixed left-1/2 top-1/2 bg-black text-white" onClick={() =>  console.log("이거슨 토큰", tokenStore.token)}> test </div>*/}

            <div className="flex flex-col gap-[40px] text-center mx-auto">
                <h1 className="text-7xl font-[800]">우리의 공간 <sapn
                    className="font-[900] text-line text-amber-400">{'< Z-Space />'}</sapn></h1>
            </div>

            <ul className="flex flex-col text-[15px] gap-4">
                <div className="flex gap-4 mx-auto">
                    <li className="px-[16px] font-[500] py-[8px] border-[3px] shadow-lg border-gray-300 rounded-md w-fit">
                        # 듣고 싶은 노래를 말만해 Everything ♬
                    </li>
                    <li className="px-[16px] font-[500] py-[8px] border-[3px] shadow-lg border-gray-300 rounded-md w-fit">
                        # 대표님: 사다리타기 걸린 사람이 오늘 커피 쏘는거야 ^^
                    </li>

                </div>
                <div className="flex gap-4 mx-auto font-[500]">
                    <li className="px-[16px]  py-[8px] border-[3px] shadow-lg border-gray-300 rounded-md w-fit">
                        # 불공정해? 투표만큼 공정한게 없지
                    </li>
                    <li className="px-[16px] font-[500] py-[8px] border-[3px] shadow-lg border-gray-300 rounded-md w-fit">
                        # 네가 그렇게 테트리스를 잘해? 옥땅으로 따라와.
                    </li>
                </div>

            </ul>

            <form className="flex flex-col gap-5" onSubmit={submitCertificateNumber}>
                <div className="flex gap-5 items-center">
                    <p className="w-[160px] text-[24px] text-center" onClick={() => nickNameInputRef.current.focus()}>
                        Nick Name
                    </p>
                    <div className="relative">
                        <input
                            className="py-1 pl-4 pr-12 bg-gray-100 text-[18px] rounded-[8px] w-[300px]"
                            ref={nickNameInputRef}
                            type="text"
                            onChange={onChangeNickName}
                            value={nickName}
                        />
                        <p className="absolute right-2 top-1/2 -translate-y-1/2 text-[14px]">{`${byteCount}/16 byte`}</p>
                    </div>
                </div>

                <div className="flex gap-5 items-center">
                    <p className="w-[160px] text-[24px] text-center"
                       onClick={() => certificateInputRef.current.focus()}>
                        Certificate
                    </p>
                    <input
                        className="py-1 px-4 bg-gray-100 text-[18px] rounded-[8px] w-[300px]"
                        ref={certificateInputRef}
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

            {/* todo: 테스트 및 개발중이므로 개발 빌드중에만 보이도록 */}
            {isDev &&
                <>
                    <div className="flex w-full justify-center gap-10">
                        <button
                            onClick={() => onSocialClick("google")}
                            className="flex px-[18px] py-[12px] bg-black text-white gap-3 hover:scale-110"
                        >
                            <GoogleIcon/>
                            <p>구글 로그인</p>
                        </button>
                        <button
                            onClick={() => onSocialClick("github")}
                            className="flex px-[18px] py-[12px] bg-black text-white gap-3 hover:scale-110"
                        >
                            <GithubIcon/>
                            <p>깃허브 로그인</p>
                        </button>
                    </div>
                    <button type="button" className="p-[50px] text-[30px] bg-black text-white"
                            onClick={() => firebaseAuth.signOut()}>
                        로그아웃 테스트
                    </button>
                </>
            }
        </div>
    )
}

export default Enter;
