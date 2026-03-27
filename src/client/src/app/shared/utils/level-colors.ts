import { SkillLevel } from '../../core/models/domain.models';

export function getLevelColor(level: SkillLevel): string {
  switch (level) {
    case 'начинающий':
      return 'bg-amber-100 text-amber-700 border-amber-300';
    case 'базовый':
      return 'bg-indigo-100 text-indigo-700 border-indigo-300';
    case 'опытный':
      return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}
