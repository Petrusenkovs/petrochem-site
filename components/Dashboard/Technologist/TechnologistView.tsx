'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GoalsPanel from './GoalsPanel';
import InsightsPanel from './InsightsPanel';
import StatsPanel from './StatsPanel';
import CreateGoalModal from './CreateGoalModal';
import { TechGoal, TrackedTechnology, AIInsight, UserStats, HotTopic, Expert, CreateGoalFormData } from '@/lib/dashboard/types';
import { generateId } from '@/lib/dashboard/storage';

interface TechnologistViewProps {
  goals: TechGoal[];
  technologies: TrackedTechnology[];
  insights: AIInsight[];
  stats: UserStats;
  hotTopics: HotTopic[];
  experts: Expert[];
  onCreateGoal: (goal: TechGoal) => void;
  onUpdateGoal: (id: string, updates: Partial<TechGoal>) => void;
}

export default function TechnologistView({
  goals,
  technologies,
  insights,
  stats,
  hotTopics,
  experts,
  onCreateGoal,
  onUpdateGoal,
}: TechnologistViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateGoal = (data: CreateGoalFormData) => {
    const newGoal: TechGoal = {
      id: generateId(),
      title: data.title,
      description: data.description,
      technologies: data.technologies,
      sourceTypes: data.sourceTypes,
      notificationFrequency: data.notificationFrequency,
      status: 'active',
      newMaterials: 0,
      relevance: 0,
      lastUpdate: 'Только что',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onCreateGoal(newGoal);
    setIsModalOpen(false);
  };

  const handleToggleGoalStatus = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) {
      const newStatus = goal.status === 'paused' ? 'active' : 'paused';
      onUpdateGoal(id, { status: newStatus });
    }
  };

  const handleOpenGoal = (goal: TechGoal) => {
    // В MVP просто логируем
    console.log('Opening goal:', goal);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 min-h-[calc(100vh-180px)]"
      >
        {/* Левая панель - Мои Цели */}
        <aside className="w-full lg:w-[280px] shrink-0 order-2 lg:order-1">
          <GoalsPanel
            goals={goals}
            technologies={technologies}
            onAddGoal={() => setIsModalOpen(true)}
            onOpenGoal={handleOpenGoal}
            onToggleGoalStatus={handleToggleGoalStatus}
          />
        </aside>

        {/* Центр - AI Инсайты */}
        <main className="flex-1 min-w-0 order-1 lg:order-2">
          <InsightsPanel insights={insights} goals={goals} />
        </main>

        {/* Правая панель - Статистика */}
        <aside className="w-full lg:w-[300px] shrink-0 order-3">
          <StatsPanel stats={stats} hotTopics={hotTopics} experts={experts} />
        </aside>
      </motion.div>

      {/* Модальное окно создания цели */}
      <CreateGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateGoal}
      />
    </>
  );
}
