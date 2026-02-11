import { usePlayerStore } from "@/entities/player/model";
import { SavedPlayList } from "@/shared/ui/icons";

const SavedMusicListButton = () => {
	const { setIsShowSavedListModal } = usePlayerStore();

	return (
		<button
			type="button"
			className="fixed left-[20px] top-[20px] border-4 border-gray-800 rounded-lg"
			onClick={() => setIsShowSavedListModal(true)}
		>
			<SavedPlayList width={50} height={50} />
		</button>
	);
};

export default SavedMusicListButton;
