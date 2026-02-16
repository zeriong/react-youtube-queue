import { memo, useEffect, useRef, useState } from "react";
import { ModalProvider } from "@/shared/ui";
import Header from "../header/Header";
import SlideContainer from "../slide-container/SlideContainer";

const Layout = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // 헤더 높이를 동적으로 측정하여 오버레이 inset에 반영
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setHeaderHeight(el.getBoundingClientRect().height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ModalProvider overlayInset={{ top: headerHeight }}>
      <div className="w-full h-full flex flex-col">
        <Header ref={headerRef} />

        {/* 메인 컨테이너 */}
        <main className="overflow-hidden w-full grow">
          <div className="relative w-full h-full overflow-hidden customScroll-vertical main">
            <SlideContainer />
          </div>
        </main>
      </div>
    </ModalProvider>
  );
};

export default memo(Layout);
