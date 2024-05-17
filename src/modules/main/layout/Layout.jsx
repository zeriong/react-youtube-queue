import {Outlet} from "react-router-dom";

const Layout = () => {
    return (
     <main className="pt-[60px]">
         <div className="overflow-hidden">
             <Outlet/>
         </div>
     </main>
    )
}

export default Layout;