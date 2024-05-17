import {Outlet} from "react-router-dom";
import Header from "./Header";

const Layout = () => {
    return (
     <div className="w-full h-full flex flex-col">
         <Header/>
         <main className="overflow-hidden w-full grow">
             <div className="w-full h-full">
                 <Outlet/>
             </div>
         </main>
     </div>
    )
}

export default Layout;