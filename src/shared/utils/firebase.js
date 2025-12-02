import {collection, deleteDoc, doc, getDoc, getDocs, updateDoc} from "firebase/firestore";
import {initFireStore} from "../libs/firebase";

/** 매개변수에 타겟 데이터 path를 입력하면 fireStore 저장된 해당 path를 가진 모든 데이터를 배열로 반환하고 별도의 query를 넣어주고 싶은 경우 두번째 매개변수에 query를 추가한다. */
export const getFireStoreData = async (dataPath, query) => {
    let setQuery;

    // 조건에 따른 get 데이터
    if (dataPath && !query) setQuery = collection(initFireStore, dataPath);
    if (query) setQuery =  query;

    const getUsersData = await getDocs(setQuery);
    const data = [];
    getUsersData.forEach((doc) => {
        const dataParse = doc.data();
        dataParse.id = doc.id;
        data.push(dataParse);
    });
    return data;
}

/**@desc fireStore 에 저장 된 특정 데이터 업데이트
 * @param {string} id fireStore에 등록된 고유 id <br>
 * @param {any} updateObj 업데이트할 데이터의 key를 선언하고 value에 업데이트 하고자 하는 내용 입력<br> example: { link: "유두부링크" }
 * @param {any} dataPath 업데이트할 데이터의 path */
export const updateFireStoreData = async (id, updateObj, dataPath) => {
    const targetDoc = doc(initFireStore, dataPath, id);
    const update = await updateDoc(targetDoc, updateObj);
    return !!update;
}

/** 매개변수에 fireStore에 저장되어있는 id와 데이터 path를  기입 시 삭제 후 boolean형으로 반환 */
export const deleteFireStore = async (id, dataPath) => {
    const targetDoc = doc(initFireStore, dataPath, id);
    const isDeleted = await deleteDoc(targetDoc);
    return !!isDeleted;
}

/** fireStore 내에 유저를 검색 후 있다면 삭제 */
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