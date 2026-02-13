import {
  SINGLE_MODE_PLAYLIST_KEY,
  SINGLE_MODE_SAVED_LIST_KEY,
  SINGLE_MODE_VOLUME_KEY,
} from "@/shared/constants/single-mode";
import type { Music } from "@/shared/types";

// ---------- Generic helpers ----------

const getList = <T>(key: string): T[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const setList = <T>(key: string, list: T[]): void => {
  localStorage.setItem(key, JSON.stringify(list));
};

const generateId = (): string => crypto.randomUUID();

// ---------- PlayList CRUD ----------

export const getLocalPlayList = (): Music[] => {
  return getList<Music>(SINGLE_MODE_PLAYLIST_KEY);
};

export const addLocalPlayList = (
  music: Omit<Music, "id"> & { createAt?: number },
): Music => {
  const list = getLocalPlayList();
  const newItem = {
    ...music,
    id: generateId(),
    createAt: music.createAt ?? Date.now(),
  } as Music;
  list.push(newItem);
  setList(SINGLE_MODE_PLAYLIST_KEY, list);
  return newItem;
};

export const deleteLocalPlayList = (id: string): boolean => {
  const list = getLocalPlayList();
  const filtered = list.filter((item) => item.id !== id);
  if (filtered.length === list.length) return false;
  setList(SINGLE_MODE_PLAYLIST_KEY, filtered);
  return true;
};

export const updateLocalPlayList = (
  id: string,
  updateObj: Partial<Music>,
): boolean => {
  const list = getLocalPlayList();
  const idx = list.findIndex((item) => item.id === id);
  if (idx === -1) return false;
  list[idx] = { ...list[idx], ...updateObj };
  setList(SINGLE_MODE_PLAYLIST_KEY, list);
  return true;
};

// ---------- SavedList CRUD ----------

export const getLocalSavedList = (): Music[] => {
  return getList<Music>(SINGLE_MODE_SAVED_LIST_KEY);
};

export const addLocalSavedList = (music: Music): Music => {
  const list = getLocalSavedList();
  const newItem = { ...music, id: generateId() };
  list.push(newItem);
  setList(SINGLE_MODE_SAVED_LIST_KEY, list);
  return newItem;
};

export const deleteLocalSavedList = (id: string): boolean => {
  const list = getLocalSavedList();
  const filtered = list.filter((item) => item.id !== id);
  if (filtered.length === list.length) return false;
  setList(SINGLE_MODE_SAVED_LIST_KEY, filtered);
  return true;
};

// ---------- Volume ----------

export const getLocalVolume = (): number => {
  if (typeof window === "undefined") return 100;
  const raw = localStorage.getItem(SINGLE_MODE_VOLUME_KEY);
  return raw ? Number(raw) : 100;
};

export const setLocalVolume = (volume: number): void => {
  localStorage.setItem(SINGLE_MODE_VOLUME_KEY, String(volume));
};
