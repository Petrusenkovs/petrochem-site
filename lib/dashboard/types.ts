// lib/dashboard/types.ts

// Роли пользователей
export type UserRole = 'technologist' | 'economist' | 'procurement' | 'executive';

export interface RoleConfig {
  id: UserRole;
  label: string;
  icon: string;
  color: string;
}

// Статус цели
export type GoalStatus = 'active' | 'completed' | 'paused';

// Цель технолога
export interface TechGoal {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  sourceTypes: string[];
  notificationFrequency: 'immediate' | 'daily' | 'weekly';
  status: GoalStatus;
  newMaterials: number;
  relevance: number;
  lastUpdate: string;
  createdAt: string;
  updatedAt: string;
}

// Отслеживаемая технология
export interface TrackedTechnology {
  id: string;
  name: string;
  publicationsPerMonth: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

// Уровень релевантности
export type RelevanceLevel = 'high' | 'medium' | 'low';

// AI Инсайт
export interface AIInsight {
  id: string;
  title: string;
  source: string;
  sourceType: 'patent' | 'article' | 'case' | 'conference';
  summary: string;
  keyPoints: string[];
  relevance: RelevanceLevel;
  relevancePercent: number;
  linkedGoalId?: string;
  linkedGoalTitle?: string;
  date: string;
  tags: string[];
}

// Данные о цене
export interface PriceData {
  id: string;
  name: string;
  code: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  history: { date: string; value: number }[];
}

// Тип события
export type EventType = 'market' | 'regulation' | 'technology' | 'logistics' | 'sanction';

// Влияние события
export type EventImpact = 'positive' | 'negative' | 'neutral';

// Событие хронологии
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: EventType;
  impact: EventImpact;
  priceEffect?: string;
}

// Уровень риска санкции
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

// Санкционный алерт
export interface SanctionAlert {
  id: string;
  supplier: string;
  country: string;
  riskLevel: RiskLevel;
  listType: string;
  description: string;
  affectedOrders: string[];
  alternatives: string[];
  date: string;
}

// Поставщик
export interface Supplier {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  products: string[];
  rating: number;
  leadTime: string;
  priceAdvantage?: string;
  notes?: string;
  isSanctioned: boolean;
  isAlternative: boolean;
  jurisdictionStatus: 'friendly' | 'neutral' | 'restricted';
}

// Доступность логистики
export type LogisticsAvailability = 'open' | 'limited' | 'closed';

// Логистическое окно
export interface LogisticsWindow {
  id: string;
  route: string;
  carrier: string;
  availability: LogisticsAvailability;
  transitTime: string;
  delay?: string;
  reason?: string;
  alternatives?: string;
}

// Статистика пользователя
export interface UserStats {
  materialsRead: number;
  savedToBase: number;
  searchQueries: number;
  activeGoals: number;
}

// Горячая тема
export interface HotTopic {
  id: string;
  name: string;
  publications: number;
}

// Эксперт
export interface Expert {
  id: string;
  name: string;
  company: string;
  lastActivity: string;
  activityType: 'patent' | 'article' | 'conference';
}

// AI Резюме для экономиста
export interface AISummaryData {
  date: string;
  summary: string;
  recommendations: string[];
}

// Форма создания цели
export interface CreateGoalFormData {
  title: string;
  description: string;
  technologies: string[];
  sourceTypes: string[];
  notificationFrequency: 'immediate' | 'daily' | 'weekly';
}
