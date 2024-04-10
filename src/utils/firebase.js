import {deleteDoc, doc, getDoc} from "firebase/firestore";
import {initFireStore} from "../libs/firebase";
import {TOKEN_NAME} from "../constants";

// fireStore 에 저장 된 유저 검색
export const getUser = async (userId) => {
    const userDoc = doc(initFireStore, "users", userId);
    const getUser = await getDoc(userDoc);
    return getUser.data();
}

// fireStore 내에 유저를 검색 후 있다면 삭제
export const deleteUser = async (userId) => {
    const userDoc = doc(initFireStore, "users", userId);
    const getUser = await getDoc(userDoc);
    const userData = getUser.data();

    if (userData) {
        const targetDoc = doc(initFireStore, "users", userId);
        await deleteDoc(targetDoc)
            .then()
            .catch(e => console.log(e))
            .finally(() => localStorage.removeItem(TOKEN_NAME));
    }
}