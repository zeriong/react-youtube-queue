import {BrowserRouter, Route, Routes} from "react-router-dom";
import Enter from "../modules/intro/Enter";
import PrivateComponent from "./components/PrivateComponent";
import YoutubeQueuePlay from "../modules/main/youtubePlayer/YoutubeQueuePlay";
import {lazy, Suspense} from "react";
import NotFound from "../modules/common/notFound/NotFound";

const GhostLeg = lazy(import("../modules/main/games/ghostLeg/GhostLeg"))

const Router = () => {
    return (
        <BrowserRouter>
            <Suspense>
                <Routes>
                    <Route element={<PrivateComponent isOnlyNonCertificate={true}/>}>
                        <Route path="/" element={<Enter/>}/>
                    </Route>

                    {/* contents */}
                    <Route element={<PrivateComponent/>}>
                        <Route path="/queuePlayer" element={<YoutubeQueuePlay/>}/>
                    </Route>

                    {/* games */}
                    <Route path="games">
                        <Route index element={<NotFound/>} />
                        <Route path="ghostLeg" element={<GhostLeg/>}/>
                    </Route>

                    {/* NotFound */}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default Router;