import {BrowserRouter, Route, Routes} from "react-router-dom";

// init import
import PrivateComponent from "./components/PrivateComponent";
import NotFound from "../../presentation/components/common/NotFound";
import Layout from "../../presentation/layouts/Layout";
import Enter from "../../presentation/pages/Enter";
import Poll from "../../presentation/pages/games/poll/Poll";
import GhostLeg from "../../presentation/pages/games/ghostLeg/GhostLeg";
import YoutubeQueuePlay from "../../presentation/pages/youtubePlayer/YoutubeQueuePlay";
import DashBoard from "../../presentation/pages/dashBoard/DashBoard";
import Main from "../../presentation/pages";

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