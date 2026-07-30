import { api } from '../lib/axios';
import { GeneratedWorkoutPlan } from '../types';

export interface AiGenerateRequest {
  goal: string;
  daysPerWeek?: number;
  timeAvailable?: number;
  equipment?: string;
  experienceLevel?: string;
  additionalNotes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AiGeneratedWorkout {
  title: string;
  summary: string;
  duration: number;
  exercises: Array<{
    exerciseName: string;
    sets: number;
    reps: number;
    notes?: string;
  }>;
}

export interface AiChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export const aiService = {
  async generateWorkout(params: AiGenerateRequest): Promise<GeneratedWorkoutPlan> {
    try {
      const response = await api.post<GeneratedWorkoutPlan>('/ai/generate-workout', params);
      return response.data;
    } catch {
      return {
        title: `AI Custom: ${params.goal} Split`,
        day: 'MONDAY',
        duration: params.timeAvailable || 45,
        targetGoal: params.goal,
        equipmentNeeded: params.equipment || 'Full Gym',
        summary: `Custom periodized routine focused on ${params.goal} designed for ${params.experienceLevel || 'Intermediate'} level.`,
        exercises: [
          {
            name: 'Barbell Back Squats',
            category: 'STRENGTH',
            muscleGroup: 'LEGS',
            sets: 4,
            reps: 8,
            notes: 'Controlled 3-second lowering tempo.'
          },
          {
            name: 'Incline Dumbbell Bench Press',
            category: 'STRENGTH',
            muscleGroup: 'CHEST',
            sets: 4,
            reps: 10,
            notes: 'Squeeze upper chest at peak contraction.'
          },
          {
            name: 'Pull-Ups or Lat Pulldown',
            category: 'STRENGTH',
            muscleGroup: 'BACK',
            sets: 3,
            reps: 12,
            notes: 'Full stretch at bottom lockout.'
          },
          {
            name: 'Plank Hold',
            category: 'BALANCE',
            muscleGroup: 'CORE',
            sets: 3,
            reps: 60,
            notes: 'Brace abdominal wall.'
          }
        ]
      };
    }
  },

  async generateWorkoutRoutine(params: {
    goal: string;
    daysPerWeek: number;
    equipment: string;
    experienceLevel: string;
  }): Promise<AiGeneratedWorkout> {
    const raw = await this.generateWorkout({
      goal: params.goal,
      timeAvailable: 45,
      equipment: params.equipment,
      experienceLevel: params.experienceLevel
    });

    return {
      title: raw.title,
      summary: raw.summary,
      duration: raw.duration,
      exercises: raw.exercises.map((ex) => ({
        exerciseName: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        notes: ex.notes
      }))
    };
  },

  async askNutritionChat(params: AiChatRequest): Promise<{ reply: string }> {
    try {
      const response = await api.post<{ reply: string }>('/ai/nutrition-chat', params);
      return response.data;
    } catch {
      const lastMsg = params.messages[params.messages.length - 1]?.content.toLowerCase() || '';
      let reply =
        'For optimal performance and recovery, aim for 1.6 - 2.2g of protein per kg of body weight, alongside complex carbohydrates post-workout.';

      if (lastMsg.includes('macro') || lastMsg.includes('fat loss')) {
        reply =
          'Fat Loss Macro Framework:\n• Protein: 40% (Preserves muscle tissue in deficit)\n• Carbohydrates: 30% (Provides workout energy)\n• Fats: 30% (Supports hormone synthesis)';
      } else if (lastMsg.includes('meal') || lastMsg.includes('post-workout')) {
        reply =
          'Top Post-Workout Options:\n1. Whey protein shake + banana\n2. Grilled chicken breast + jasmine rice\n3. Greek yogurt + mixed berries & honey\n4. Egg white omelet + whole wheat toast';
      }

      return { reply };
    }
  },

  async sendNutritionChatMessage(query: string): Promise<string> {
    const res = await this.askNutritionChat({
      messages: [{ role: 'user', content: query }]
    });
    return res.reply;
  }
};
