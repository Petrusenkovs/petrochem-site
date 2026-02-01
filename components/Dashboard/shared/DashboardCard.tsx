'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  animate?: boolean;
}

export default function DashboardCard({
  children,
  className,
  hover = false,
  onClick,
  animate = true,
}: DashboardCardProps) {
  const Component = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <Component
      {...animationProps}
      className={cn(
        'bg-slate-900/60 border border-slate-800 rounded-2xl p-6',
        hover && 'hover:border-sky-500/50 hover:shadow-[0_0_30px_rgba(14,165,233,0.1)] transition-all cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}
