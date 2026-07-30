import { Exercise, WorkoutResponse, WorkoutHistoryResponse, Achievement, SpotifyTrack } from '../types';

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 1,
    name: 'Bench Press',
    description: 'A classic compound chest exercise using a barbell to build upper body pushing power.',
    category: 'STRENGTH',
    muscleGroup: 'CHEST',
    equipment: 'Barbell & Bench',
    difficulty: 'INTERMEDIATE',
    caloriesBurned: 8,
    instructions: 'Lie flat on bench, grip bar slightly wider than shoulder width. Lower bar smoothly to mid-chest, then press explosively upward until arms are locked out.'
  },
  {
    id: 2,
    name: 'Barbell Back Squat',
    description: 'The king of lower body exercises targeting quadriceps, glutes, and core stability.',
    category: 'STRENGTH',
    muscleGroup: 'LEGS',
    equipment: 'Barbell & Squat Rack',
    difficulty: 'INTERMEDIATE',
    caloriesBurned: 10,
    instructions: 'Place barbell across upper traps. Unrack, step back, keep chest up. Bend knees and hips until thighs are parallel to ground, then drive up through heels.'
  },
  {
    id: 3,
    name: 'Conventional Deadlift',
    description: 'Full body pull targeting posterior chain: hamstrings, glutes, lower back, and traps.',
    category: 'STRENGTH',
    muscleGroup: 'BACK',
    equipment: 'Barbell & Plates',
    difficulty: 'ADVANCED',
    caloriesBurned: 12,
    instructions: 'Stand with shins touching bar. Hinge at hips, grip bar. Engage lats, pull chest up, drive through legs and extend hips to lock out at the top.'
  },
  {
    id: 4,
    name: 'Overhead Shoulder Press',
    description: 'Strict vertical pressing movement for shoulder strength and core stability.',
    category: 'STRENGTH',
    muscleGroup: 'SHOULDERS',
    equipment: 'Barbell or Dumbbells',
    difficulty: 'INTERMEDIATE',
    caloriesBurned: 7,
    instructions: 'Hold weight at upper chest/shoulders. Brace core and glutes, press bar straight overhead without arching back excessively.'
  },
  {
    id: 5,
    name: 'Pull-Ups',
    description: 'Bodyweight vertical pull for lats, upper back, and biceps strength.',
    category: 'STRENGTH',
    muscleGroup: 'BACK',
    equipment: 'Pull-Up Bar',
    difficulty: 'INTERMEDIATE',
    caloriesBurned: 8,
    instructions: 'Grip bar overhand slightly wider than shoulders. Pull chest up to the bar driving elbows down. Lower under full control.'
  },
  {
    id: 6,
    name: 'Dumbbell Incline Press',
    description: 'Target upper chest and triceps with a greater range of motion on an inclined bench.',
    category: 'STRENGTH',
    muscleGroup: 'CHEST',
    equipment: 'Dumbbells & Incline Bench',
    difficulty: 'BEGINNER',
    caloriesBurned: 7,
    instructions: 'Set bench to 30-45 degree angle. Hold dumbbells at chest height, press up bringing weights slightly closer at top.'
  },
  {
    id: 7,
    name: 'Plank Hold',
    description: 'Isometric core strengthening movement for abdominal endurance and stability.',
    category: 'BALANCE',
    muscleGroup: 'CORE',
    equipment: 'Mat',
    difficulty: 'BEGINNER',
    caloriesBurned: 4,
    instructions: 'Rest on forearms and toes. Keep shoulders directly above elbows, squeeze glutes and abs to form a straight line from head to heels.'
  },
  {
    id: 8,
    name: 'Treadmill Interval Run',
    description: 'High intensity cardio training to maximize calorie burn and aerobic capacity.',
    category: 'CARDIO',
    muscleGroup: 'CARDIO',
    equipment: 'Treadmill',
    difficulty: 'INTERMEDIATE',
    caloriesBurned: 14,
    instructions: 'Warm up 3 mins at light jog. Alternate between 60 seconds high speed sprint and 60 seconds recovery walk for 20 minutes.'
  },
  {
    id: 9,
    name: 'Plyometric Box Jumps',
    description: 'Explosive jump training for lower body power and fast-twitch fiber activation.',
    category: 'PLYOMETRIC',
    muscleGroup: 'LEGS',
    equipment: 'Plyo Box',
    difficulty: 'INTERMEDIATE',
    caloriesBurned: 11,
    instructions: 'Stand facing box, bend knees and swing arms back. Jump explosively onto box landing softly in a partial squat.'
  },
  {
    id: 10,
    name: 'Full Body Dynamic Flow',
    description: 'Flexibility and mobility flow sequence targeting hip openers and thoracic spine.',
    category: 'FLEXIBILITY',
    muscleGroup: 'FULL_BODY',
    equipment: 'Yoga Mat',
    difficulty: 'BEGINNER',
    caloriesBurned: 5,
    instructions: 'Move continuously between world greatest stretch, downward dog, and cobra stretch with deep rhythmic breathing.'
  },
  {
    id: 11,
    name: 'Dumbbell Bicep Curls',
    description: 'Isolated pulling movement targeting biceps brachii.',
    category: 'STRENGTH',
    muscleGroup: 'ARMS',
    equipment: 'Dumbbells',
    difficulty: 'BEGINNER',
    caloriesBurned: 5,
    instructions: 'Stand tall with dumbbells at sides. Keep elbows pinned to torso, curl weights toward shoulders squeezing biceps at top.'
  },
  {
    id: 12,
    name: 'Tricep Rope Pushdowns',
    description: 'Isolated pushing exercise for all three heads of the triceps.',
    category: 'STRENGTH',
    muscleGroup: 'ARMS',
    equipment: 'Cable Machine & Rope Attachment',
    difficulty: 'BEGINNER',
    caloriesBurned: 6,
    instructions: 'Grip rope attachment at chest level. Push handles down extending arms fully while spreading ends of rope apart at bottom.'
  }
];

export const INITIAL_WORKOUTS: WorkoutResponse[] = [
  {
    id: 1,
    userId: 1,
    title: 'Push Day Hypertrophy',
    day: 'MONDAY',
    duration: 50,
    isTemplate: false,
    exercises: [
      { exerciseId: 1, exerciseName: 'Bench Press', sets: 4, reps: 10, sequenceOrder: 1 },
      { exerciseId: 6, exerciseName: 'Dumbbell Incline Press', sets: 3, reps: 12, sequenceOrder: 2 },
      { exerciseId: 4, exerciseName: 'Overhead Shoulder Press', sets: 4, reps: 8, sequenceOrder: 3 },
      { exerciseId: 12, exerciseName: 'Tricep Rope Pushdowns', sets: 3, reps: 15, sequenceOrder: 4 }
    ]
  },
  {
    id: 2,
    userId: 1,
    title: 'Pull Day Strength & Back',
    day: 'TUESDAY',
    duration: 55,
    isTemplate: false,
    exercises: [
      { exerciseId: 3, exerciseName: 'Conventional Deadlift', sets: 4, reps: 6, sequenceOrder: 1 },
      { exerciseId: 5, exerciseName: 'Pull-Ups', sets: 4, reps: 10, sequenceOrder: 2 },
      { exerciseId: 11, exerciseName: 'Dumbbell Bicep Curls', sets: 3, reps: 12, sequenceOrder: 3 }
    ]
  },
  {
    id: 3,
    userId: 1,
    title: 'Legs & Core Power',
    day: 'THURSDAY',
    duration: 45,
    isTemplate: false,
    exercises: [
      { exerciseId: 2, exerciseName: 'Barbell Back Squat', sets: 4, reps: 8, sequenceOrder: 1 },
      { exerciseId: 9, exerciseName: 'Plyometric Box Jumps', sets: 3, reps: 10, sequenceOrder: 2 },
      { exerciseId: 7, exerciseName: 'Plank Hold', sets: 3, reps: 60, sequenceOrder: 3 }
    ]
  },
  {
    id: 4,
    userId: 1,
    title: 'High Intensity HIIT & Mobility',
    day: 'FRIDAY',
    duration: 35,
    isTemplate: false,
    exercises: [
      { exerciseId: 8, exerciseName: 'Treadmill Interval Run', sets: 1, reps: 20, sequenceOrder: 1 },
      { exerciseId: 10, exerciseName: 'Full Body Dynamic Flow', sets: 2, reps: 15, sequenceOrder: 2 }
    ]
  }
];

// Generate history entries for the past 14 days
const generateInitialHistory = (): WorkoutHistoryResponse[] => {
  const history: WorkoutHistoryResponse[] = [];
  const today = new Date();
  
  // Last 10 consecutive days with workout sessions
  for (let i = 0; i < 10; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const workout = INITIAL_WORKOUTS[i % INITIAL_WORKOUTS.length];
    history.push({
      id: 100 + i,
      workoutId: workout.id,
      workoutTitle: workout.title,
      userId: 1,
      date: dateStr,
      duration: workout.duration,
      calories: Math.round(workout.duration * 8.5) + (i * 12),
      completed: true
    });
  }
  return history;
};

export const INITIAL_HISTORY: WorkoutHistoryResponse[] = generateInitialHistory();

export const INITIAL_TEMPLATES: WorkoutResponse[] = [
  {
    id: 501,
    userId: 99,
    authorName: 'Coach Marcus (Pro Trainer)',
    title: '5-Day Upper/Lower Strength Split',
    day: 'MONDAY',
    duration: 60,
    isTemplate: true,
    likes: 342,
    exercises: [
      { exerciseId: 1, exerciseName: 'Bench Press', sets: 5, reps: 5, sequenceOrder: 1 },
      { exerciseId: 2, exerciseName: 'Barbell Back Squat', sets: 5, reps: 5, sequenceOrder: 2 },
      { exerciseId: 3, exerciseName: 'Conventional Deadlift', sets: 3, reps: 5, sequenceOrder: 3 },
      { exerciseId: 5, exerciseName: 'Pull-Ups', sets: 4, reps: 8, sequenceOrder: 4 }
    ]
  },
  {
    id: 502,
    userId: 98,
    authorName: 'Sarah Jenkins (Endurance Specialist)',
    title: '30-Min Fat Shred HIIT Flow',
    day: 'WEDNESDAY',
    duration: 30,
    isTemplate: true,
    likes: 512,
    exercises: [
      { exerciseId: 8, exerciseName: 'Treadmill Interval Run', sets: 1, reps: 15, sequenceOrder: 1 },
      { exerciseId: 9, exerciseName: 'Plyometric Box Jumps', sets: 4, reps: 12, sequenceOrder: 2 },
      { exerciseId: 7, exerciseName: 'Plank Hold', sets: 4, reps: 45, sequenceOrder: 3 }
    ]
  },
  {
    id: 503,
    userId: 97,
    authorName: 'Alex Thorne (Bodybuilding Coach)',
    title: 'Chest & Arms Hypertrophy Blitz',
    day: 'FRIDAY',
    duration: 45,
    isTemplate: true,
    likes: 289,
    exercises: [
      { exerciseId: 1, exerciseName: 'Bench Press', sets: 4, reps: 12, sequenceOrder: 1 },
      { exerciseId: 6, exerciseName: 'Dumbbell Incline Press', sets: 4, reps: 12, sequenceOrder: 2 },
      { exerciseId: 11, exerciseName: 'Dumbbell Bicep Curls', sets: 4, reps: 15, sequenceOrder: 3 },
      { exerciseId: 12, exerciseName: 'Tricep Rope Pushdowns', sets: 4, reps: 15, sequenceOrder: 4 }
    ]
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_workout',
    title: 'First Step',
    description: 'Log your very first workout session in FitTrack Pro.',
    icon: 'Flame',
    category: 'WORKOUTS',
    unlocked: true,
    unlockedAt: '2026-07-20',
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'streak_7',
    title: '7-Day Iron Streak',
    description: 'Complete workouts 7 consecutive days in a row.',
    icon: 'Zap',
    category: 'STREAK',
    unlocked: true,
    unlockedAt: '2026-07-27',
    progress: 7,
    maxProgress: 7
  },
  {
    id: 'workouts_10',
    title: '10 Workouts Logged',
    description: 'Build consistency with 10 total completed workout sessions.',
    icon: 'Award',
    category: 'WORKOUTS',
    unlocked: true,
    unlockedAt: '2026-07-30',
    progress: 10,
    maxProgress: 10
  },
  {
    id: 'workouts_50',
    title: 'Century Club Challenger',
    description: 'Complete 50 workout sessions.',
    icon: 'Trophy',
    category: 'WORKOUTS',
    unlocked: false,
    progress: 10,
    maxProgress: 50
  },
  {
    id: 'bench_100',
    title: 'Bench Press Master',
    description: 'Log 5+ completed heavy pushing sessions.',
    icon: 'Dumbbell',
    category: 'STRENGTH',
    unlocked: true,
    unlockedAt: '2026-07-28',
    progress: 5,
    maxProgress: 5
  },
  {
    id: 'volume_10k',
    title: 'Volume Titan',
    description: 'Burn over 4,000 total active calories in your history.',
    icon: 'TrendingUp',
    category: 'VOLUME',
    unlocked: true,
    unlockedAt: '2026-07-29',
    progress: 4250,
    maxProgress: 4000
  }
];

export const INITIAL_SPOTIFY_TRACKS: SpotifyTrack[] = [
  {
    id: '1',
    title: 'Eye of the Tiger',
    artist: 'Survivor',
    album: 'Eye of the Tiger',
    albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
    durationMs: 245000,
    uri: 'spotify:track:2th9'
  },
  {
    id: '2',
    title: 'Till I Collapse',
    artist: 'Eminem',
    album: 'The Eminem Show',
    albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80',
    durationMs: 298000,
    uri: 'spotify:track:4001'
  },
  {
    id: '3',
    title: 'Can\'t Hold Us',
    artist: 'Macklemore & Ryan Lewis',
    album: 'The Heist',
    albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
    durationMs: 258000,
    uri: 'spotify:track:3702'
  },
  {
    id: '4',
    title: 'Stronger',
    artist: 'Kanye West',
    album: 'Graduation',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&q=80',
    durationMs: 312000,
    uri: 'spotify:track:5902'
  }
];

export const MOCK_ACHIEVEMENTS = INITIAL_ACHIEVEMENTS;
export const MOCK_WORKOUT_TEMPLATES = INITIAL_TEMPLATES;

