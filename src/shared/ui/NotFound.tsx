import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * @description 페이지를 요청하는 경우(404) 초기 화면으로 이동시킴
 */
const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/" });
  }, [navigate]);

  return null;
};

export default NotFound;
