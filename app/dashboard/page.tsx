'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import TechnologistView from '@/components/Dashboard/Technologist/TechnologistView';
import EconomistView from '@/components/Dashboard/Economist/EconomistView';
import ProcurementView from '@/components/Dashboard/Procurement/ProcurementView';
import ExecutiveView from '@/components/Dashboard/Executive/ExecutiveView';
import { UserRole, TechGoal } from '@/lib/dashboard/types';
import {
  getStoredRole,
  setStoredRole,
  getStoredGoals,
  setStoredGoals,
} from '@/lib/dashboard/storage';
import {
  mockGoals,
  mockTrackedTechnologies,
  mockInsights,
  mockUserStats,
  mockHotTopics,
  mockExperts,
  mockPrices,
  mockEvents,
  mockAISummary,
  mockSanctions,
  mockSuppliers,
  mockLogistics,
} from '@/lib/dashboard/mockData';

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<UserRole>('technologist');
  const [goals, setGoals] = useState<TechGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const storedRole = getStoredRole();
    const storedGoals = getStoredGoals();

    if (storedRole) {
      setActiveRole(storedRole);
    }

    // Use stored goals if available, otherwise use mock goals
    if (storedGoals.length > 0) {
      setGoals(storedGoals);
    } else {
      setGoals(mockGoals);
      setStoredGoals(mockGoals);
    }

    setIsLoading(false);
  }, []);

  // Handle role change
  const handleRoleChange = useCallback((role: UserRole) => {
    setActiveRole(role);
    setStoredRole(role);
  }, []);

  // Handle goal creation
  const handleCreateGoal = useCallback((goal: TechGoal) => {
    const updated = [...goals, goal];
    setGoals(updated);
    setStoredGoals(updated);
  }, [goals]);

  // Handle goal update
  const handleUpdateGoal = useCallback((id: string, updates: Partial<TechGoal>) => {
    const updated = goals.map((g) =>
      g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
    );
    setGoals(updated);
    setStoredGoals(updated);
  }, [goals]);

  // Update stats based on current goals
  const currentStats = {
    ...mockUserStats,
    activeGoals: goals.filter((g) => g.status === 'active').length,
  };

  // Show loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Dashboard Header with role switcher */}
      <DashboardHeader activeRole={activeRole} onRoleChange={handleRoleChange} />

      {/* Role-specific views */}
      <AnimatePresence mode="wait">
        {activeRole === 'technologist' && (
          <TechnologistView
            key="technologist"
            goals={goals}
            technologies={mockTrackedTechnologies}
            insights={mockInsights}
            stats={currentStats}
            hotTopics={mockHotTopics}
            experts={mockExperts}
            onCreateGoal={handleCreateGoal}
            onUpdateGoal={handleUpdateGoal}
          />
        )}

        {activeRole === 'economist' && (
          <EconomistView
            key="economist"
            prices={mockPrices}
            events={mockEvents}
            summary={mockAISummary}
          />
        )}

        {activeRole === 'procurement' && (
          <ProcurementView
            key="procurement"
            sanctions={mockSanctions}
            suppliers={mockSuppliers}
            logistics={mockLogistics}
          />
        )}

        {activeRole === 'executive' && (
          <ExecutiveView
            key="executive"
            goals={goals}
            prices={mockPrices}
            sanctions={mockSanctions}
            insights={mockInsights}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
