'use client';

import { User, Settings } from 'lucide-react';
import RoleSwitcher from './RoleSwitcher';
import { UserRole } from '@/lib/dashboard/types';
import { ROLES } from '@/lib/dashboard/constants';

interface DashboardHeaderProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function DashboardHeader({ activeRole, onRoleChange }: DashboardHeaderProps) {
  const currentRole = ROLES.find(r => r.id === activeRole);

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-4 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Профиль пользователя */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Иван Петров</h1>
            <p className="text-xs text-slate-500">
              {currentRole?.label}, СИБУР
            </p>
          </div>
        </div>

        {/* Переключатель ролей */}
        <div className="flex items-center gap-4">
          <RoleSwitcher activeRole={activeRole} onRoleChange={onRoleChange} />

          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
