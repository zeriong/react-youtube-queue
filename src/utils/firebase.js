import {collection, deleteDoc, doc, getDoc, getDocs} from "firebase/firestore";
import {initFireStore} from "../libs/firebase";
import {TOKEN_NAME} from "../constants";

// fireStore 에 저장된 모든 유저 검색
export const getUsers = async () => {
    const getUsersData = await getDocs(collection(initFireStore, "users"));
    console.log("유져들~~",getUsersData);
}

// fireStore 에 저장 된 특정 유저 검색
export const getUser = async (userId) => {
    const userDoc = doc(initFireStore, "users", userId);
    const getUser = await getDoc(userDoc);
    return getUser.data();
}

// fireStore 내에 유저를 검색 후 있다면 삭제
export const deleteUser = async (userId) => {
    // 스토리지에 있는 경우에만 삭제
    if (!localStorage.getItem(TOKEN_NAME)) return;

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