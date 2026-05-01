import type { Gender, TestKey, Grade, ScoreBreakdown } from './types';

interface ScoreRange {
  max: number;
  min: number;
  inverted?: boolean;
}

const POLRI_STANDARDS: Record<Gender, Record<TestKey, ScoreRange>> = {
  L: {
    run12:  { max: 3444, min: 1349 },
    pullup: { max: 17,   min: 1 },
    situp:  { max: 40,   min: 1 },
    pushup: { max: 42,   min: 1 },
    fig8:   { max: 16.2, min: 26.1, inverted: true },
  },
  P: {
    run12:  { max: 3095, min: 1013 },
    pullup: { max: 72,   min: 1 },
    situp:  { max: 50,   min: 1 },
    pushup: { max: 37,   min: 1 },
    fig8:   { max: 17.6, min: 27.5, inverted: true },
  },
};

export function getItemScore(gender: Gender, test: TestKey, value: number): number {
  if (!value || value <= 0) return 0;
  const range = POLRI_STANDARDS[gender][test];

  if (range.inverted) {
    if (value <= range.max) return 100;
    if (value >= range.min) return 1;
    return Math.round(1 + ((range.min - value) / (range.min - range.max)) * 99);
  } else {
    if (value >= range.max) return 100;
    if (value <= range.min) return 1;
    return Math.round(1 + ((value - range.min) / (range.max - range.min)) * 99);
  }
}

export function calcScore(
  gender: Gender,
  data: Record<TestKey, number>
): ScoreBreakdown {
  const sRun12  = getItemScore(gender, 'run12',  data.run12);
  const sFig8   = getItemScore(gender, 'fig8',   data.fig8);
  const sPushup = getItemScore(gender, 'pushup', data.pushup);
  const sSitup  = getItemScore(gender, 'situp',  data.situp);
  const sPullup = getItemScore(gender, 'pullup', data.pullup);

  const nilaiA = sRun12;
  const nilaiB = (sFig8 + sPushup + sSitup + sPullup) / 4;
  const score  = Math.round((nilaiA + nilaiB) / 2);
  const isTms  = [sRun12, sFig8, sPushup, sSitup, sPullup].some(s => s < 41);
  const grade  = getGrade(score, isTms);

  return {
    nilaiA,
    nilaiB: Math.round(nilaiB),
    score,
    isTms,
    grade,
    detail: {
      run12:  sRun12,
      fig8:   sFig8,
      pushup: sPushup,
      situp:  sSitup,
      pullup: sPullup,
    },
  };
}

export function getGrade(score: number, isTms: boolean): Grade {
  if (isTms)     return 'TMS';
  if (score >= 80) return 'A';
  if (score >= 61) return 'B';
  if (score >= 41) return 'C';
  return 'D';
}

export function getGradeColor(grade: Grade): string {
  switch (grade) {
    case 'A':   return 'text-green-400 bg-green-400/10 border-green-400/30';
    case 'B':   return 'text-gold border-gold/30 bg-gold/10';
    case 'C':   return 'text-fire border-fire/30 bg-fire/10';
    case 'D':
    case 'TMS': return 'text-red-500 border-red-500/30 bg-red-500/10';
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 61) return 'text-yellow-400';
  if (score >= 41) return 'text-orange-400';
  return 'text-red-500';
}

export function getTarget(test: TestKey, gender: Gender): number {
  return POLRI_STANDARDS[gender][test].max;
}
