import React, {useEffect} from "react";
import Router from "./routes/Router";
import {format} from "date-fns";
import Toasts, {useToastsStore} from "./modules/common/components/Toasts";


function App() {
    const getNow = format(Date.now(), "yyyy-MM-dd");
    const toastStore = useToastsStore();


    useEffect(() => {
    }, []);
  return (
      <>
          <Router/>
          <Toasts/>
      </>
  );
}

export default App;
