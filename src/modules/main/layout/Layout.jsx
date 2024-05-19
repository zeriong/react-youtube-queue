import {Outlet} from "react-router-dom";
import Header from "./Header";
import React, {Suspense} from "react";

const Layout = () => {
    return (
     <div className="w-full h-full flex flex-col">
         <Header/>

         {/* 메인 컨테이너 */}
         <main className="overflow-hidden w-full grow ">
             <div className="w-full h-full overflow-auto customScroll-vertical main">

                 {/* 레이아웃을 제외한 내부 컨텐츠만 fallback 되어 전체깜빡임 -> 내부컨텐츠만 깜빡임 */}
                 <Suspense>
                     <Outlet/>
                 </Suspense>

             </div>
         </main>
     </div>
    )
}

export default React.memo(Layout);