import {isDev} from "../../../../App";
import Prepare from "../../../common/Prepare";
import {useEffect, useState} from "react";

const Poll = () => {
    const [pollData, setPollData] = useState();
    const [hasPoll, setHasPoll] = useState(false);

    // 투표 데이터 get fetcher
    const getPollData = () => {
        (async () => {
            console.log("가져왔다 투표데이터~");
        })()
    }

    useEffect(() => {
        getPollData();
    }, []);
    return (
        <div className="min-w-full p-[40px]">
            {(isDev) ? (
                <div className="mb-[24px]">
                    {hasPoll ?
                        <div className="">
                            더 이상 투표를 개설할 수 없습니다.
                        </div>
                        :
                        <button
                            type="button"
                            className="flex items-center justify-center p-[20px] border-4 border-gray-400/70 rounded-lg text-[24px]"
                        >
                            투표 생성하기
                        </button>
                    }
                </div>
            ) : (
                <Prepare/>
            )}
        </div>
    )
}

export default Poll;


// <button type="button">
//     누르면 모달 띄워지고 투표 생성 가능.<br/>
//     투표들은 마음껏 할 수 있지만 투표 기간은 반드시 정해야 함.<br/>
//     데이트픽커 사용할거고 최대 지정일은 1주일로 할 것임.<br/>
//     그리고 투표는 최대 5가지 선택 사항을 고를 수 있음<br/>
//     누가 투표를 시작했는지 알 수 있고 투표 제목도 보여져야 함<br/>
//     슬슬 회원제를 도입해야 할 것 같음... 이건 약용 가능성이 너무 커서<br/>
//     서버도 슬슬 만들기 시작해야할 것 같음...<br/>
//     점점 스케일이 커지네...<br/>
//     귀찮기도 함.<br/>
//     그냥 OAuth 구현하고... 그걸로 유저 하자.<br/>
//     추가적으로 닉네임은 변경 가능하도록 하고 닉네임 변경 시 중복검사.<br/>
//     파이어베이스 별도로 사용 가능하도록 설정도 고려해보기<br/>
// </button>
// <ul>
//     투표 리스트 뿌려줄 것임.
//     박스 형식 그리드로 정렬
// </ul>
