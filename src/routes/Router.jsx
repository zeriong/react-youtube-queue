import {BrowserRouter, Route, Routes} from "react-router-dom";
import Enter from "../modules/main/Enter";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Enter/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;