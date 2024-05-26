import {Outlet} from "react-router-dom";
import Header from "./Header";
import React from "react";

const Layout = () => {
    return (
     <div className="w-full h-full flex flex-col">
         <Header/>

         {/* 메인 컨테이너 */}
         <main className="overflow-hidden w-full grow ">
             <div className="relative w-full h-full overflow-hidden customScroll-vertical main">
                 <Outlet/>
             </div>
         </main>
     </div>
    )
}

export default React.memo(Layout);