import {BrowserRouter, Route, Routes} from "react-router-dom";
import Enter from "../modules/intro/Enter";
import PrivateComponent from "./components/PrivateComponent";
import YoutubeQueuePlay from "../modules/main/YoutubeQueuePlay";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateComponent isOnlyNonCertificate={true}/>}>
                    <Route path="/" element={<Enter/>}/>
                </Route>
                <Route element={<PrivateComponent/>}>
                    <Route path="/queuePlayer" element={<YoutubeQueuePlay/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;