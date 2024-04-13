import {collection, deleteDoc, doc, getDoc, getDocs, updateDoc} from "firebase/firestore";
import {initFireStore} from "../libs/firebase";

// fireStore 에 저장된 모든 유저 검색
export const getUsers = async () => {
    const getUsersData = await getDocs(collection(initFireStore, "users"));
    const users = [];
    getUsersData.forEach((doc) => {
        users.push(doc.data().nickName);
    });
    return users;
}

/**@desc fireStore 에 저장 된 특정 데이터 업데이트
 * @param {string} id fireStore에 등록된 고유 id <br>
 * @param {any} updateObj 업데이트할 데이터의 key를 선언하고 value에 업데이트 하고자 하는 내용 입력<br> example: { link: "유두부링크" } */
export const updatePlayLink = async (id, updateObj) => {
    const targetDoc = doc(initFireStore, "playList", id);
    const update = await updateDoc(targetDoc, updateObj);
    return !!update;
}

// 매개변수에 fireStore에 저장되어있는 playList의 id 기입 시 삭제
export const deletePlayList = async (id) => {
    const targetDoc = doc(initFireStore, "playList", id);
    const isDeleted = await deleteDoc(targetDoc);
    return !!isDeleted;
}

// fireStore 내에 유저를 검색 후 있다면 삭제
export const deleteUser = async (userId) => {
    // 아이디가 있는 경우에만 삭제
    if (!userId) return;

    const userDoc = doc(initFireStore, "users", userId);
    const getUser = await getDoc(userDoc);
    const userData = getUser.data();

    if (userData) {
        const targetDoc = doc(initFireStore, "users", userId);
        await deleteDoc(targetDoc)
            .then()
            .catch(e => console.log(e));
    }
}