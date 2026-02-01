'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateGoalFormData } from '@/lib/dashboard/types';
import { SOURCE_TYPES, NOTIFICATION_FREQUENCIES } from '@/lib/dashboard/constants';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGoalFormData) => void;
}

export default function CreateGoalModal({ isOpen, onClose, onSubmit }: CreateGoalModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [sourceTypes, setSourceTypes] = useState<string[]>(['journals', 'patents']);
  const [notificationFrequency, setNotificationFrequency] = useState<'immediate' | 'daily' | 'weekly'>('immediate');

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleToggleSourceType = (id: string) => {
    if (sourceTypes.includes(id)) {
      setSourceTypes(sourceTypes.filter((s) => s !== id));
    } else {
      setSourceTypes([...sourceTypes, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      technologies,
      sourceTypes,
      notificationFrequency,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setTechnologies([]);
    setSourceTypes(['journals', 'patents']);
    setNotificationFrequency('immediate');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">Создать новую цель</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Название цели:
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Повышение выхода бензола на установке риформинга"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Подробное описание <span className="text-slate-500">(чем детальнее, тем точнее AI)</span>:
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Нужно найти современные подходы к увеличению выхода бензола..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors resize-none"
                  />
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Ключевые слова <span className="text-slate-500">(опционально)</span>:
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {technologies.map((tech) => (
                      <span
                        key={tech}
                        className="flex items-center gap-1 px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="ml-1 hover:text-sky-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTech();
                        }
                      }}
                      placeholder="reforming, benzene, catalyst..."
                      className="flex-1 px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleAddTech}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Source types */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Типы источников:
                  </label>
                  <div className="space-y-2">
                    {SOURCE_TYPES.map((source) => (
                      <label
                        key={source.id}
                        className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={sourceTypes.includes(source.id)}
                          onChange={() => handleToggleSourceType(source.id)}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-slate-300">{source.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notification frequency */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Частота уведомлений:
                  </label>
                  <div className="space-y-2">
                    {NOTIFICATION_FREQUENCIES.map((freq) => (
                      <label
                        key={freq.id}
                        className={cn(
                          'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                          notificationFrequency === freq.id
                            ? 'bg-sky-500/10 border-sky-500/30'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        )}
                      >
                        <input
                          type="radio"
                          name="frequency"
                          checked={notificationFrequency === freq.id}
                          onChange={() => setNotificationFrequency(freq.id as 'immediate' | 'daily' | 'weekly')}
                          className="w-4 h-4 border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-500 focus:ring-offset-0"
                        />
                        <span className={cn(
                          'text-sm',
                          notificationFrequency === freq.id ? 'text-sky-400' : 'text-slate-300'
                        )}>
                          {freq.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 font-medium transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 rounded-xl text-white font-medium transition-colors shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                  >
                    Создать цель
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
