export type Role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  enabled?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
  role: Role;
}

export type Category = 'STRENGTH' | 'CARDIO' | 'FLEXIBILITY' | 'BALANCE' | 'PLYOMETRIC';
export type MuscleGroup = 'CHEST' | 'BACK' | 'SHOULDERS' | 'ARMS' | 'LEGS' | 'CORE' | 'FULL_BODY' | 'CARDIO';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Exercise {
  id: number;
  name: string;
  description: string;
  category: Category;
  muscleGroup: MuscleGroup;
  equipment: string;
  difficulty: Difficulty;
  caloriesBurned: number;
  instructions: string;
}

export interface WorkoutExercise {
  exerciseId: number;
  exerciseName?: string;
  sets: number;
  reps: number;
  sequenceOrder: number;
}

export interface WorkoutRequest {
  title: string;
  day: string;
  duration: number;
  exercises: WorkoutExercise[];
}

export interface WorkoutResponse {
  id: number;
  userId: number;
  title: string;
  day: string;
  duration: number;
  exercises: WorkoutExercise[];
  isTemplate?: boolean;
  authorName?: string;
  likes?: number;
}

export interface WorkoutHistoryRequest {
  date: string;
  duration: number;
  calories: number;
  completed: boolean;
}

export interface WorkoutHistoryResponse {
  id: number;
  workoutId: number;
  workoutTitle?: string;
  userId: number;
  date: string;
  duration: number;
  calories: number;
  completed: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: Record<string, string>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'STREAK' | 'WORKOUTS' | 'STRENGTH' | 'VOLUME';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  durationMs: number;
  uri: string;
}

export interface GeneratedWorkoutPlan {
  title: string;
  day: string;
  duration: number;
  targetGoal: string;
  equipmentNeeded: string;
  summary: string;
  exercises: {
    exerciseId?: number;
    name: string;
    category: Category;
    muscleGroup: MuscleGroup;
    sets: number;
    reps: number;
    notes: string;
  }[];
}
