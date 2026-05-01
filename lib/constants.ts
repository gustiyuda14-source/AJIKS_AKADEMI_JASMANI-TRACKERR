import type { TestDefinition } from './types';

export const TESTS: TestDefinition[] = [
  {
    key: 'run12',
    name: 'Lari 12 Menit',
    icon: '🏃',
    unit: 'm',
    targetM: 3444,
    targetF: 3095,
    higherBetter: true,
  },
  {
    key: 'fig8',
    name: 'Lari Angka 8',
    icon: '🔄',
    unit: 'dtk',
    targetM: 16.2,
    targetF: 17.6,
    higherBetter: false,
  },
  {
    key: 'pushup',
    name: 'Push Up',
    icon: '💪',
    unit: 'rep',
    targetM: 42,
    targetF: 37,
    higherBetter: true,
  },
  {
    key: 'situp',
    name: 'Sit Up',
    icon: '🤸',
    unit: 'rep',
    targetM: 40,
    targetF: 50,
    higherBetter: true,
  },
  {
    key: 'pullup',
    name: 'Pull Up / Chining',
    icon: '🏋️',
    unit: 'rep',
    targetM: 17,
    targetF: 72,
    higherBetter: true,
  },
];

export const GRADE_LABELS: Record<string, string> = {
  A:   'BAIK SEKALI',
  B:   'CUKUP / BATAS AMAN',
  C:   'KURANG / RAWAN',
  D:   'TIDAK MEMENUHI SYARAT',
  TMS: 'TIDAK MEMENUHI SYARAT',
};
