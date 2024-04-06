import React, {useEffect} from "react";
import Router from "./routes/Router";
import {add, format} from "date-fns";
import {getAuthStorage, setAuthStorage} from "./utils/common";
import {cipher, decipher} from "./utils/crypto";
import Toasts, {useToastsStore} from "./modules/common/Toasts";


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
