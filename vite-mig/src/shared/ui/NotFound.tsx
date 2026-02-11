import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useToastsStore } from "@/entities/toast/model";

/**
 * @description 페이지를 요청하는 경우(404) 초기 화면으로 이동시킴
 */
const NotFound = () => {
	const { addToast } = useToastsStore();
	const navigate = useNavigate();

	const toHome = () => {
		addToast("페이지를 찾을 수 없어 초기화면으로 이동합니다.");
		navigate({ to: "/" });
	};

	useEffect(() => {
		toHome();
	}, [toHome]);

	return null;
};

export default NotFound;
