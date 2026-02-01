'use client';

import { motion } from 'framer-motion';
import { FlaskConical, TrendingUp, Package, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/dashboard/types';
import { ROLES, ROLE_COLORS } from '@/lib/dashboard/constants';

const ICONS = {
  FlaskConical,
  TrendingUp,
  Package,
  Briefcase,
};

interface RoleSwitcherProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function RoleSwitcher({ activeRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="flex bg-slate-950 border border-white/10 rounded-xl p-1 gap-1">
      {ROLES.map((role) => {
        const IconComponent = ICONS[role.icon as keyof typeof ICONS];
        const isActive = activeRole === role.id;
        const colors = ROLE_COLORS[role.id];

        return (
          <button
            key={role.id}
            onClick={() => onRoleChange(role.id)}
            className={cn(
              'relative flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              isActive
                ? `${colors.text} ${colors.bg}`
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            )}
          >
            <IconComponent className="w-4 h-4" />
            <span className="hidden sm:inline">{role.label}</span>

            {isActive && (
              <motion.div
                layoutId="activeRole"
                className={cn('absolute inset-0 rounded-lg -z-10', colors.border, 'border')}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
