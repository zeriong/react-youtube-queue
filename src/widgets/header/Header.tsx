import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import { useToastsStore } from "@/entities/toast/model";
import { useTokenStore, useUserStore } from "@/entities/user/model";
import { firebaseAuth } from "@/shared/config/firebase";
import { CONTENT_LIST } from "@/shared/constants/contentList";
import { deleteUser } from "@/shared/lib/firebase";
import { LogoutIcon } from "@/shared/ui/icons";

const Header = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { token, deleteToken } = useTokenStore();
	const { setLogout } = useUserStore();
	const { addToast } = useToastsStore();

	// pathname에서 활성 탭 이름 파생
	const activeName = (() => {
		const match = location.pathname
			.replace(/\/$/, "")
			.match(/^\/main\/(.+)$/);
		return match ? match[1] : undefined;
	})();

	// 접속 종료
	const logout = async () => {
		await firebaseAuth.signOut();
		await deleteUser(token?.id);
		deleteToken();
		setLogout();
		addToast("로그아웃 되었습니다.");
		navigate({ to: "/" });
	};

	return (
		<header
			className={twMerge(
				"w-full px-[20px] shadow-md flex items-center justify-between",
			)}
		>
			{/* Left Section */}
			<div className="flex gap-[80px]">
				<Link to="/main" className="text-[30px] font-black flex items-center">
					Z-Space
				</Link>
				<ul className="flex items-center gap-[8px] my-[8px]">
					{CONTENT_LIST.map((item, idx) => (
						<li
							key={idx}
							className={twMerge(
								"h-full rounded-md hover:bg-gray-200",
								activeName === item.path && "bg-gray-200",
							)}
						>
							<Link
								to={`/main/${item.path}`}
								className="h-full flex items-center px-[16px] py-[10px]"
							>
								{item.title}
							</Link>
						</li>
					))}
				</ul>
			</div>

			{/* Right Section */}
			<div>
				<button
					type="button"
					className="bg-gray-300 px-3 py-2 rounded-md text-[20px] hover:scale-110"
					onClick={logout}
				>
					<LogoutIcon />
				</button>
			</div>
		</header>
	);
};

export default Header;
