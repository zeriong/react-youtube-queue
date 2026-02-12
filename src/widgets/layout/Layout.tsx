import { memo } from "react";
import Header from "../header/Header";
import SlideContainer from "../slide-container/SlideContainer";

const Layout = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <Header />

      {/* 메인 컨테이너 */}
      <main className="overflow-hidden w-full grow">
        <div className="relative w-full h-full overflow-hidden customScroll-vertical main">
          <SlideContainer />
        </div>
      </main>
    </div>
  );
};

export default memo(Layout);
