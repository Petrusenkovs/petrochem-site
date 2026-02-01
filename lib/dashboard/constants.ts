// lib/dashboard/constants.ts

import { RoleConfig } from './types';

// Конфигурация ролей
export const ROLES: RoleConfig[] = [
  { id: 'technologist', label: 'Технолог', icon: 'FlaskConical', color: 'sky' },
  { id: 'economist', label: 'Экономист', icon: 'TrendingUp', color: 'emerald' },
  { id: 'procurement', label: 'Закупщик', icon: 'Package', color: 'purple' },
  { id: 'executive', label: 'Руководитель', icon: 'Briefcase', color: 'amber' },
];

// Цвета для уровней релевантности
export const RELEVANCE_COLORS = {
  high: { bg: 'bg-sky-500/20', text: 'text-sky-400', border: 'border-sky-500/50' },
  medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
  low: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/50' },
};

// Цвета для уровней риска
export const RISK_COLORS = {
  critical: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' },
  high: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50' },
  medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
  low: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' },
};

// Цвета для доступности логистики
export const LOGISTICS_COLORS = {
  open: { bg: 'bg-green-500/20', text: 'text-green-400', icon: 'CheckCircle2' },
  limited: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: 'AlertCircle' },
  closed: { bg: 'bg-red-500/20', text: 'text-red-400', icon: 'XCircle' },
};

// Цвета для типов событий
export const EVENT_TYPE_COLORS = {
  market: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  regulation: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  technology: { bg: 'bg-sky-500/20', text: 'text-sky-400' },
  logistics: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  sanction: { bg: 'bg-red-500/20', text: 'text-red-400' },
};

// Цвета для влияния
export const IMPACT_COLORS = {
  positive: 'text-green-400',
  negative: 'text-red-400',
  neutral: 'text-slate-400',
};

// Цвета для трендов
export const TREND_COLORS = {
  up: { text: 'text-green-400', icon: 'TrendingUp' },
  down: { text: 'text-red-400', icon: 'TrendingDown' },
  stable: { text: 'text-slate-400', icon: 'Minus' },
};

// Цвета для статуса цели
export const GOAL_STATUS_COLORS = {
  active: { bg: 'bg-sky-500/20', text: 'text-sky-400' },
  completed: { bg: 'bg-green-500/20', text: 'text-green-400' },
  paused: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
};

// Типы источников для целей
export const SOURCE_TYPES = [
  { id: 'journals', label: 'Научные статьи (Journals)' },
  { id: 'patents', label: 'Патенты' },
  { id: 'conferences', label: 'Конференции (AIChE, ERTC, etc.)' },
  { id: 'cases', label: 'Кейсы внедрения (Case Studies)' },
  { id: 'press', label: 'Пресс-релизы производителей' },
];

// Частота уведомлений
export const NOTIFICATION_FREQUENCIES = [
  { id: 'immediate', label: 'Сразу при появлении релевантного материала' },
  { id: 'daily', label: 'Ежедневный дайджест (9:00)' },
  { id: 'weekly', label: 'Еженедельный дайджест (понедельник)' },
];

// Ключи для localStorage
export const STORAGE_KEYS = {
  ROLE: 'petrochem_dashboard_role',
  GOALS: 'petrochem_dashboard_goals',
  PREFERENCES: 'petrochem_dashboard_preferences',
};

// Цвета для ролей (для использования в tailwind классах)
export const ROLE_COLORS = {
  technologist: {
    primary: 'sky',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    hover: 'hover:bg-sky-500/20',
  },
  economist: {
    primary: 'emerald',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    hover: 'hover:bg-emerald-500/20',
  },
  procurement: {
    primary: 'purple',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    hover: 'hover:bg-purple-500/20',
  },
  executive: {
    primary: 'amber',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    hover: 'hover:bg-amber-500/20',
  },
};
