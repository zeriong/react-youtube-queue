import { useEffect, useRef } from "react";

interface UsePreventSpamReturn {
	isPrevent: boolean;
	preventCounting: (warnCount?: number) => void;
	preventSpamTrigger: (delay?: number) => void;
}

/**
 * @description 최소 실행시간을 정해두어 빠른 요청 및 클릭을 방지하고
 * 딜레이 시간 동안 10번 이상의 실행이 감지되면 alert을 띄움
 *
 * @example
 * const { isPrevent, preventSpamTrigger, preventCounting } = usePreventSpam();
 *
 * // 광클 방지가 필요한 함수
 * const submit = () => {
 *   // spam preventing
 *   if (isPrevent) return preventCounting();
 *   preventSpamTrigger();
 *
 *   ...
 *
 *   return response.data;
 * }
 */
const usePreventSpam = (): UsePreventSpamReturn => {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const countRef = useRef(0);
	const isPrevent = useRef(false);

	/**
	 * @description (isPrevent === true) 일때 클릭을 카운팅하여
	 * warnCount와 같거나 커지면 alert을 띄움
	 */
	const preventCounting = (warnCount = 10) => {
		countRef.current += 1;
		if (countRef.current >= warnCount) {
			countRef.current = 0;
			alert("지나친 클릭 또는 요청을 자제해주시기바랍니다.");
		}
	};

	/**
	 * @description 광클을 방지할 함수 마지막 라인에 넣는 함수
	 */
	const preventSpamTrigger = (delay = 1500) => {
		isPrevent.current = true;
		timeoutRef.current = setTimeout(() => {
			countRef.current = 0;
			isPrevent.current = false;
			timeoutRef.current = null;
		}, delay);
	};

	// 언마운트 시 타임아웃이 걸려있다면 해제
	useEffect(() => {
		return () => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, []);

	return { isPrevent: isPrevent.current, preventCounting, preventSpamTrigger };
};

export default usePreventSpam;
