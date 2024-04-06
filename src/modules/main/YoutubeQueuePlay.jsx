import {getAuthStorage} from "../../utils/common";

const YoutubeQueuePlay = () => {
    const token = getAuthStorage();
    return (
        <div>
            <p>유튜브 플레이어</p>
            <button type="button" className="bg-">
                로그아웃
            </button>
        </div>
    )
}

export default YoutubeQueuePlay;