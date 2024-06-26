import React, {useEffect, useRef, useState} from 'react';
import {create} from 'zustand';
import {AlarmIcon} from "../svgComponents/svgComponents";

/** 토스트알림에 대한 상태관리 store */
export const useToastsStore = create((setState) => ({
    toasts: [],
    addToast: (message) => setState((state) => {
        return { toasts: [...state.toasts, message] }
    }),
    removeToast: () => setState((state) => {
        state.toasts.shift();
        return { toasts: [...state.toasts] }
    }),
}))

const Toasts = () => {
    const isRunRef = useRef(false);
    const [isShow, setIsShow] = useState(false);
    const toastStore = useToastsStore();

    const show = () => {
        if (useToastsStore.getState().toasts.length > 0) {
            isRunRef.current = true;
            setIsShow(true);

            // 팝업 알람이기 때문에 일정 시간 후 알람을 다시 숨김
            setTimeout(() => {
                setIsShow(false);

                // 애니메이션이 종료되는 타이밍에 실행
                setTimeout(() => {
                    toastStore.removeToast();
                    show();
                }, 300);
            }, 2500);
        } else {
            isRunRef.current = false;
        }
    }

    useEffect(() => {
        if (!isRunRef.current) show();
    }, [toastStore.toasts]);

    return (
        <div className={`fixed flex items-center justify-center z-[99999] left-1/2 -translate-x-1/2 bg-black/80 rounded duration-300 ease-in-out ${ isShow ? 'top-[26px] opacity-100' : 'opacity-0 top-0' }`}>
            {toastStore.toasts.length > 0 && (
                <div className='flex p-[10px] md:p-[18px]'>
                    <AlarmIcon className='fill-white h-[22px] mr-[6px]'/>
                    <p className='w-full font-normal text-white max-md:text-[14px]' dangerouslySetInnerHTML={{ __html: toastStore.toasts[0]}}/>
                </div>
            )}
        </div>
    )
}

export default Toasts;