import {Outlet} from "react-router-dom";
import Header from "./Header";
import React, {Suspense} from "react";

const Layout = () => {
    return (
     <div className="w-full h-full flex flex-col">
         <Header/>
         <main className="overflow-hidden w-full grow">
             <div className="w-full h-full">
                 <Suspense>
                     <Outlet/>
                 </Suspense>
             </div>
         </main>
     </div>
    )
}

export default React.memo(Layout);