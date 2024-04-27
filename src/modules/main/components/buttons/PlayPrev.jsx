const PlayPrev = ({onClick, disabled, classNames}) => {
    // todo: 버튼 구현 시 disabled에 따른 스타일 변경 필요
    return (
        <button
            disabled={disabled}
            type="button"
            // className="border-2 border-gray-700 play-prev bg-black text-white h-[80px] w-[110px] text-[18px] font-bold hover:scale-110"
            className={`border-2 border-gray-300 play-prev bg-gray-300 text-white h-[80px] w-[110px] text-[18px] font-bold ${classNames}`}
            onClick={onClick}
        >
            <p className="relative translate-x-[5px]">
                이전 곡
            </p>
        </button>
    )
}

export default PlayPrev;