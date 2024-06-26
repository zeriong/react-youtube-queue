import {ModalStandard} from "../../../../common/ModalStandard";
import React from "react";
import {usePlayerStore} from "../../../../../store/playerStore";

const UserCenterModal = () => {
    const {setIsShowUserCenterModal, isShowUserCenterModal} = usePlayerStore();

    const editUserInfo = (e) => {
        (async () => {
            e.preventDefault();
            console.log('서브밋~')
        })()
    }

    return (
        <ModalStandard
            setIsShow={setIsShowUserCenterModal}
            isShow={isShowUserCenterModal}
            headerTitle={"계정 센터"}
            isFit={true}
            contentArea={
                <form className="flex gap-2 px-2 mb-3" onSubmit={editUserInfo}>
                    <button className="border px-2 rounded-md bg-gray-300 font-bold hover:scale-105" type="submit">
                        저장하기
                    </button>
                </form>
            }
        />
    )
}

export default UserCenterModal;
