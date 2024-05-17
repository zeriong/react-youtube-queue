import {useEffect, useRef} from "react";

const Cursor = ({ bg = "bg-black", w = "w-[14px]", h = "h-[4px]" }) => {
    const interval = useRef(null);
    const targetRef = useRef(null);

    useEffect(() => {
        if (interval.current === null) {
            interval.current = setInterval(() => {
                targetRef.current?.classList?.toggle("hidden");
            }, 500);
        } else {
            clearInterval(interval.current);
            interval.current = null
            interval.current = setInterval(() => {
                targetRef.current?.classList?.toggle("hidden");
            }, 500);
        }
        return () => clearInterval(interval.current);
    }, []);
    return (
        <div ref={targetRef} className={`inline-block top-[3px] relative ${bg} ${w} ${h}`}/>
    )
}

export default Cursor;