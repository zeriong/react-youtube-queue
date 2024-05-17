import {BrowserRouter, Route, Routes} from "react-router-dom";
import {lazy, Suspense} from "react";

// init import
import PrivateComponent from "./components/PrivateComponent";
import NotFound from "../modules/common/notFound/NotFound";

// Lazy Import
const Enter = lazy(() => import("../modules/intro/Enter"));
const GhostLeg = lazy(() => import("../modules/main/games/ghostLeg/GhostLeg"));
const DashBoard = lazy(() => import("../modules/main/dashBoard/DashBoard"));
const Layout = lazy(() => import("../modules/main/layout/Layout"));
const YoutubeQueuePlay = lazy(() => import("../modules/main/youtubePlayer/YoutubeQueuePlay"));

const Router = () => {
    return (
        <BrowserRouter>
            <Suspense>
                <Routes>
                    {/* 초기 접속 페이지 */}
                    <Route element={<PrivateComponent isOnlyNonCertificate={true}/>}>
                        <Route path="/" element={<Enter/>}/>
                    </Route>

                    {/* 인증 컨텐츠 모두 비공개 */}
                    <Route path="main" element={<PrivateComponent/>}>
                        {/* Layout Style */}
                        <Route element={<Layout/>}>

                            {/* Default: DashBoard */}
                            <Route path="" element={<DashBoard/>}/>

                            {/* contents */}
                            <Route path="player" element={<YoutubeQueuePlay/>}/>

                            {/* games */}
                            <Route path="ghostLeg" element={<GhostLeg/>}/>

                        </Route>
                    </Route>

                    {/* Not Found */}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default Router;