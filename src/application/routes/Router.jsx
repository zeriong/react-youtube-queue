import {BrowserRouter, Route, Routes} from "react-router-dom";

// init import
import PrivateComponent from "./components/PrivateComponent";
import NotFound from "../modules/common/NotFound";
import Layout from "../modules/main/layout/Layout";
import Enter from "../modules/intro/Enter";
import Poll from "../modules/main/games/poll/Poll";
import GhostLeg from "../modules/main/games/ghostLeg/GhostLeg";
import YoutubeQueuePlay from "../modules/main/youtubePlayer/YoutubeQueuePlay";
import DashBoard from "../modules/main/dashBoard/DashBoard";
import Main from "../modules/main";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 초기 접속 페이지 */}
                <Route element={<PrivateComponent isOnlyNonCertificate={true}/>}>
                    <Route path="/" element={<Enter/>}/>
                </Route>

                {/* 인증 컨텐츠 모두 비공개 */}
                <Route path="main/*" element={<PrivateComponent/>}>
                    {/* Layout Style */}
                    <Route element={<Layout/>}>
                        <Route path="*" element={<Main/>}/>
                    </Route>
                </Route>

                {/* Not Found */}
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;