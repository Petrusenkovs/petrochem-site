// lib/dashboard/storage.ts

import { UserRole, TechGoal } from './types';
import { STORAGE_KEYS } from './constants';

// Проверка доступности localStorage
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Получить сохраненную роль
export function getStoredRole(): UserRole | null {
  if (!isLocalStorageAvailable()) return null;

  const stored = localStorage.getItem(STORAGE_KEYS.ROLE);
  if (stored && ['technologist', 'economist', 'procurement', 'executive'].includes(stored)) {
    return stored as UserRole;
  }
  return null;
}

// Сохранить роль
export function setStoredRole(role: UserRole): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(STORAGE_KEYS.ROLE, role);
}

// Получить сохраненные цели
export function getStoredGoals(): TechGoal[] {
  if (!isLocalStorageAvailable()) return [];

  const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed as TechGoal[];
    }
  } catch {
    // Игнорируем ошибки парсинга
  }
  return [];
}

// Сохранить цели
export function setStoredGoals(goals: TechGoal[]): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
}

// Добавить цель
export function addStoredGoal(goal: TechGoal): void {
  const goals = getStoredGoals();
  goals.push(goal);
  setStoredGoals(goals);
}

// Обновить цель
export function updateStoredGoal(id: string, updates: Partial<TechGoal>): void {
  const goals = getStoredGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index !== -1) {
    goals[index] = { ...goals[index], ...updates, updatedAt: new Date().toISOString() };
    setStoredGoals(goals);
  }
}

// Удалить цель
export function deleteStoredGoal(id: string): void {
  const goals = getStoredGoals();
  const filtered = goals.filter(g => g.id !== id);
  setStoredGoals(filtered);
}

// Очистить все данные dashboard
export function clearDashboardStorage(): void {
  if (!isLocalStorageAvailable()) return;

  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

// Генерация уникального ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
