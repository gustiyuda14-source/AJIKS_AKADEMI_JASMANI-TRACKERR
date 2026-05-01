export type Gender = 'L' | 'P';
export type UserRole = 'admin' | 'pelatih';
export type TestKey = 'run12' | 'fig8' | 'pushup' | 'situp' | 'pullup';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'TMS';
export type Category = 'ipdn' | 'tni-polri';

export interface Member {
  id: string;
  name: string;
  gender: Gender;
  weight_init: number;
  weight_now: number;
  height: number;
  run12: number;
  fig8: number;
  pushup: number;
  situp: number;
  pullup: number;
  category: Category;
  created_at: string;
}

export interface ExerciseLog {
  id: string;
  member_id: string;
  date: string;
  run12: number;
  fig8: number;
  pushup: number;
  situp: number;
  pullup: number;
  weight_now: number;
  score: number;
  grade: Grade;
  notes?: string;
  created_at: string;
  members?: Pick<Member, 'name' | 'gender' | 'category'>;
}

export interface ScoreBreakdown {
  nilaiA: number;
  nilaiB: number;
  score: number;
  isTms: boolean;
  grade: Grade;
  detail: {
    run12: number;
    fig8: number;
    pushup: number;
    situp: number;
    pullup: number;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
}

export interface TestDefinition {
  key: TestKey;
  name: string;
  icon: string;
  unit: string;
  targetM: number;
  targetF: number;
  higherBetter: boolean;
}
