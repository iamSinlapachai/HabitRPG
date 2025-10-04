import AsyncStorage from '@react-native-async-storage/async-storage';

import type { InventorySnapshot } from './store/inventoryStore';
import type { UserSnapshot } from './store/userStore';

export interface TaskSnapshot {
  id: string;
  title: string;
  type: 'habit' | 'daily' | 'todo';
  completed: boolean;
  notes?: string;
}

const STORAGE_KEYS = {
  user: 'habit:user',
  inventory: 'habit:inventory',
  tasks: 'habit:tasks',
} as const;

const serialize = <T>(value: T) => JSON.stringify(value);

const deserialize = <T>(value: string | null): T | undefined => {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('Failed to parse persisted state', error);
    return undefined;
  }
};

export const loadUserState = async (): Promise<UserSnapshot | undefined> => {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.user);
  return deserialize<UserSnapshot>(value);
};

export const saveUserState = async (snapshot: UserSnapshot): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.user, serialize(snapshot));
};

export const loadInventoryState = async (): Promise<InventorySnapshot | undefined> => {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.inventory);
  return deserialize<InventorySnapshot>(value);
};

export const saveInventoryState = async (snapshot: InventorySnapshot): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.inventory, serialize(snapshot));
};

export const loadTasks = async (): Promise<TaskSnapshot[] | undefined> => {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.tasks);
  return deserialize<TaskSnapshot[]>(value);
};

export const saveTasks = async (tasks: TaskSnapshot[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.tasks, serialize(tasks));
};

export const clearPersistence = async () => {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
};
