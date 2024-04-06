import React, {useEffect} from "react";
import Router from "./routes/Router";
import {add, format} from "date-fns";
import {getAuthStorage, setAuthStorage} from "./utils";


function App() {
    const getNow = format(Date.now(), "yyyy-MM-dd");
    const getConvert = format(getNow, "yyyyMMdd");
    const getExpire = add(getNow, {months: 1});

    useEffect(() => {
        console.log("오늘", getNow);
        console.log("오늘을 다시 포멧", getConvert);
        console.log("유효기간", getExpire);
    }, []);
  return (
      <>
          <div onClick={getAuthStorage}>겟 어스 스토리지</div>
          <div onClick={() => {
              setAuthStorage("dd");
          }}>셋 어스 스토리지</div>
          <Router/>
      </>
  );
}

export default App;
