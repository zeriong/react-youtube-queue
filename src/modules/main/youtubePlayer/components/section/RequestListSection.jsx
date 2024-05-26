import {useEffect, useRef, useState} from "react";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {initFireStore} from "../../../../../libs/firebase";
import {isDev} from "../../../../../App";
import {deleteFireStore} from "../../../../../utils/firebase";
import {useTokenStore} from "../../../../../store/commonStore";
import {useToastsStore} from "../../../../common/Toasts";

const RequestListSection = () => {
    const countTimeoutRef = useRef(null);
    const onSectionRef = useRef(false);
    const countRef = useRef(5);
    const [count, setCount] = useState(5);
    const [userRequestList, setUserRequestList] = useState([]);
    const {addToast} = useToastsStore();

    const accessReq = (id) => {

    }

    const cancelReq = (id) => {
        const isDel = deleteFireStore(id, "userRequest");
        if (isDel) addToast("해당 요청이 삭제되었습니다.");
        else addToast("해당 요청 삭제에 실패하였습니다.");
    }

    // 카운트 + 자동 승인 함수
    const secCounting = () => {
        // 카운트가 0 이하일 때 재귀에서 벗어남
        if (countRef.current <= 0) {
            countTimeoutRef.current = setTimeout(() => {
                countRef.current = 5;
                setCount(countRef.current);

                // 타임아웃 해제(중복 가능성을 염두)
                clearTimeout(countTimeoutRef.current);
                countTimeoutRef.current = null;
            }, 1000);
            return;
        }
        // 1초마다 카운트를 감소시키면서 count setState
        countTimeoutRef.current = setTimeout(() => {
            countRef.current -= 1;
            setCount(countRef.current);
            secCounting();
        }, 1000);
    }

    // 요청이 있는 경우 카운팅
    useEffect(() => {
        if (userRequestList.length > 0) secCounting();

    }, [userRequestList.length]);

    // init state
    useEffect(() => {
        // 데이터 쿼리를 생성 날짜 오름차순으로 정렬 (queue 형태를 구현하기 위함)
        const playListQuery = query(
            collection(initFireStore, "userRequest"),
            orderBy("createAt", "asc")
        );

        // onSnapshot을 활용하여 실시간 데이터를 받음
        onSnapshot(playListQuery, (snapshot) => {
            const contentArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUserRequestList(contentArr);
        });

        // 언마운트 시 타임아웃 해제
        return () => {
            clearTimeout(countTimeoutRef.current);
            countTimeoutRef.current = null;
        }
    }, []);

    return (
        <nav
            className={
                `fixed left-[20px] -bottom-[400px] w-[250px] h-[400px] border-4 border-gray-500 rounded-lg z-[200] bg-white p-3 flex flex-col gap-3 overflow-auto
                ease-in-out duration-500
                ${userRequestList.length && "bottom-[20px]"}`
            }
        >

            {/* todo: 테스트 박스 dev애서만 보임, 테스트 후 삭제 */}
            {isDev &&
                <div className="bg-black text-white p-5 fixed left-1/2 top-1/2"
                     onClick={() => {
                         if (onSectionRef.current) {
                             setUserRequestList([]);
                             onSectionRef.current = false;
                         } else {
                             setUserRequestList([1]);
                             onSectionRef.current = true;
                         }

                     }}
                >
                    테스트
                </div>
            }


            <div className="flex justify-between">
                <p className="text-[18px] font-bold text-line text-white ">
                    {'< 요청 리스트 >'}
                </p>
            </div>
            <div className="flex font-bold text-[18px]">
                <p>자동 승인 {`${userRequestList.length && count}초`}</p>
                <div>
                    <button></button>
                    <button></button>
                </div>
            </div>
            <ul className="overflow-x-hidden flex flex-col gap-4 customScroll-vertical">
                {userRequestList?.map((req, idx) => {
                    let reqMsg = "";
                    if (req.request === "pause") reqMsg = "일시 정지";
                    return (
                        <li key={idx} className="whitespace-break-spaces rounded border-2 border-gray-500 p-[8px]">
                            <p className="border-b-2 border-gray-400">{`${idx + 1}. ${req.nickName}`}</p>
                            <p className="text-center my-[4px]">{reqMsg}</p>
                            <div className="flex w-full gap-[4px]">
                                <button
                                    type="button"
                                    className="w-full py-[4px] hover:bg-gray-200"
                                    onClick={() => console.log("버튼~")}
                                >
                                    허용
                                </button>
                                |
                                <button
                                    type="button"
                                    className="w-full py-[4px] hover:bg-gray-200"
                                    onClick={() => console.log("버튼~")}

                                >
                                    취소
                                </button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

export default RequestListSection;