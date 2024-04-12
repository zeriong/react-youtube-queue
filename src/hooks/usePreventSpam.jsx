import {useEffect, useRef} from "react";

/**
 * @description 최소 실행시간을 정해두어 빠른 요청 및 클릭을 방지하고 딜레이 시간 동안 10번 이상의 실행이 감지되면 alert을 띄움<br>
 * @desc
 * * isPrevent: 광클방지할 함수 도입부에 조건문으로 preventCounting와 함께 사용한다.
 * * preventCounting: 위와 같이 함수 도입부에 isPrevent와 함께 사용하며 warnCount에 도달하면 alert으로 경고창을 띄운다.
 * * preventSpamTrigger: 함수 마지막 라인 또는 위 조건문 이후에 넣어주면 함수가 모두 처리 된 후 spam preventing이 시작된다.
 * @example:
 * const { isPrevent, preventSpamTrigger, preventCounting } = usePreventSpam();
 *
 * // 광클 방지가 필요한 함수
 * const submit = () => {
 *     // spam preventing
 *     if (isPrevent) return preventCounting();
 *     preventSpamTrigger();
 *
 *     ...
 *
 *     return response.data;
 * }
 *
 * @return {{ isPrevent: boolean, preventCounting: function, preventSpamTrigger: function }} isPrevent
 */
const usePreventSpam = () => {
  const timeoutRef = useRef(null);
  const countRef = useRef(0);
  const isPrevent = useRef(false);

  // (isPrevent === true) 일때 클릭을 카운팅하여 warnCount와 같거나 커지면 alert을 띄움
  const preventCounting = (warnCount = 10) => {
    countRef.current += 1;
    if (countRef.current >= warnCount) {
      countRef.current = 0;
      alert("지나친 클릭 또는 요청을 자제해주시기바랍니다.");
    }
  }

  // 광클을 방지할 함수 마지막 라인에 넣는 함수
  const preventSpamTrigger = (delay = 2000) => {
    isPrevent.current = true;
    timeoutRef.current = setTimeout(() => {
      isPrevent.current = false;
      timeoutRef.current = null;
    }, delay);
  }

  // 언마운트 시 타임아웃이 걸려있다면 해제
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return { isPrevent: isPrevent.current, preventCounting, preventSpamTrigger }
}

export default usePreventSpam;