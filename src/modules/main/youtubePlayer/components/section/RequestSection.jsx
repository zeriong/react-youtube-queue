import {useEffect, useRef, useState} from "react";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {initFireStore} from "../../../../../libs/firebase";
import {isDev} from "../../../../../App";

const RequestSection = () => {
    const onSectionRef = useRef(false);
    const [userRequestList, setUserRequestList] = useState([]);

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
    }, []);
    return (
        <nav
            className={
                `fixed left-[20px] -bottom-[400px] w-[250px] h-[400px] border-4 border-gray-500 rounded-lg z-[200] bg-white p-3 flex flex-col gap-3
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


            <p className="text-[18px] font-bold text-line text-white">{"< 요청 리스트 >"}</p>
            <ul>
                <li>1. 리스트</li>
            </ul>
        </nav>
    )
}

export default RequestSection;