import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  Query,
  DocumentData,
} from "firebase/firestore";
import { initFireStore } from "@/shared/config/firebase";

/**
 * @description 매개변수에 타겟 데이터 path를 입력하면 fireStore 저장된 해당 path를 가진 모든 데이터를 배열로 반환하고
 * 별도의 query를 넣어주고 싶은 경우 두번째 매개변수에 query를 추가한다.
 */
export const getFireStoreData = async <T extends DocumentData>(
  dataPath?: string,
  query?: Query<DocumentData>
): Promise<T[]> => {
  let setQuery: Query<DocumentData>;

  // 조건에 따른 get 데이터
  if (dataPath && !query) {
    setQuery = collection(initFireStore, dataPath);
  } else if (query) {
    setQuery = query;
  } else {
    throw new Error("dataPath or query is required");
  }

  const getUsersData = await getDocs(setQuery);
  const data: T[] = [];
  getUsersData.forEach((doc) => {
    const dataParse = doc.data() as T;
    (dataParse as any).id = doc.id;
    data.push(dataParse);
  });
  return data;
};

/**
 * @description fireStore 에 저장 된 특정 데이터 업데이트
 * @param id fireStore에 등록된 고유 id
 * @param updateObj 업데이트할 데이터의 key를 선언하고 value에 업데이트 하고자 하는 내용 입력
 * @param dataPath 업데이트할 데이터의 path
 */
export const updateFireStoreData = async (
  id: string,
  updateObj: Partial<DocumentData>,
  dataPath: string
): Promise<boolean> => {
  const targetDoc = doc(initFireStore, dataPath, id);
  const update = await updateDoc(targetDoc, updateObj);
  return !!update;
};

/**
 * @description 매개변수에 fireStore에 저장되어있는 id와 데이터 path를 기입 시 삭제 후 boolean형으로 반환
 */
export const deleteFireStore = async (
  id: string,
  dataPath: string
): Promise<boolean> => {
  const targetDoc = doc(initFireStore, dataPath, id);
  const isDeleted = await deleteDoc(targetDoc);
  return !!isDeleted;
};

/**
 * @description fireStore 내에 유저를 검색 후 있다면 삭제
 */
export const deleteUser = async (userId?: string): Promise<void> => {
  // 아이디가 있는 경우에만 삭제
  if (!userId) return;

  const userDoc = doc(initFireStore, "users", userId);
  const getUser = await getDoc(userDoc);
  const userData = getUser.data();

  if (userData) {
    const targetDoc = doc(initFireStore, "users", userId);
    await deleteDoc(targetDoc).catch((e) => console.log(e));
  }
};
