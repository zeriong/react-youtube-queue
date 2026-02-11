import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect } from "react";
import { usePlayerStore } from "@/entities/player/model";
import { initFireStore } from "@/shared/config/firebase";
import { ModalStandard } from "@/shared/ui";
import SubmitListItem from "../lists/SubmitListItem";

const SavedListModal = () => {
	const {
		saveMusicMaxLength,
		savedMusic,
		isShowSavedListModal,
		setIsShowSavedListModal,
		setSavedMusic,
	} = usePlayerStore();

	// init effect
	useEffect(() => {
		// 데이터 쿼리를 생성 날짜 오름차순으로 정렬 (queue 형태를 구현하기 위함)
		const setFireStoreQuery = query(
			collection(initFireStore, "savedList"),
			orderBy("createAt", "asc"),
		);

		// onSnapshot을 활용하여 실시간 데이터를 받음
		onSnapshot(setFireStoreQuery, (snapshot) => {
			const contentArr = snapshot.docs.map((doc) => {
				// 기존에 저장되어있던 id가 아닌 새로운 문서 id를 재할당하여 사용
				const data = { ...doc.data() };
				(data as any).id = doc.id;
				return data as any;
			});
			setSavedMusic(contentArr);
		});
	}, [setSavedMusic]);

	return (
		<ModalStandard
			isShow={isShowSavedListModal}
			setIsShow={setIsShowSavedListModal}
			headerTitle={
				<p>
					저장된 플레이리스트
					<span>{`${`${savedMusic?.length}/${saveMusicMaxLength}`}`}</span>
				</p>
			}
			contentArea={
				<section className="grow px-2 pb-2 overflow-hidden">
					<ul
						className="p-2 bg-gray-100 rounded-md h-full min-h-[200px]
              overflow-y-auto customScroll-vertical"
					>
						{savedMusic.length ? (
							savedMusic.map((item, idx) => (
								<div key={idx} className="flex w-full gap-2">
									<SubmitListItem item={item} idx={idx} isSavedList={true} />
								</div>
							))
						) : (
							<div
								className="flex h-full justify-center items-center
                  text-gray-400 text-2xl"
							>
								<p>저장된 플레이리스트가 없습니다.</p>
							</div>
						)}
					</ul>
				</section>
			}
		/>
	);
};

export default SavedListModal;
