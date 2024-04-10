import React from "react";
import {useEffect} from "react";

const PreViewModal = ({ isShow, setIsShow, preViewURL }) => {

    useEffect(() => {

    }, [isShow]);

    return isShow &&
        <>
            {/* 모달 배경 영역 */}
            <div onClick={() => setIsShow(false)} className="fixed top-0 left-0 z-50 w-full h-full bg-black/50"/>

            <div className="absolute left-1/2 top-1/2 z-[100] w-[300px] h-[300px] bg-white">
                호잇:
                {preViewURL}
            </div>
        </>
}

export default PreViewModal;