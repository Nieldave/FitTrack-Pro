import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Dumbbell,
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  useExercises,
  useCreateExercise,
  useUpdateExercise,
  useDeleteExercise
} from '../hooks/useExercises';
import { useAdminUsers, useDisableUser, useEnableUser } from '../hooks/useAdmin';
import { Modal } from '../components/ui/Modal';
import { DifficultyBadge, CategoryBadge } from '../components/ui/Badge';
import { Exercise, Category, MuscleGroup, Difficulty } from '../types';
import { useToast } from '../components/ui/Toast';

const CATEGORIES: Category[] = ['STRENGTH', 'CARDIO', 'FLEXIBILITY', 'BALANCE', 'PLYOMETRIC'];
const MUSCLE_GROUPS: MuscleGroup[] = ['CHEST', 'BACK', 'SHOULDERS', 'ARMS', 'LEGS', 'CORE', 'FULL_BODY', 'CARDIO'];
const DIFFICULTIES: Difficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export const Admin: React.FC = () => {
  const { role } = useAuth();
  const { showSuccess, showError } = useToast();

  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const [activeTab, setActiveTab] = useState<'exercises' | 'users'>('exercises');

  // Exercise Management State
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const { data: exercisesData, isLoading: isLoadingExercises } = useExercises({
    keyword: exerciseSearch,
    size: 50
  });
  const createExerciseMutation = useCreateExercise();
  const updateExerciseMutation = useUpdateExercise();
  const deleteExerciseMutation = useDeleteExercise();

  const exercises = exercisesData?.content || [];

  // Exercise form state
  const [exName, setExName] = useState('');
  const [exDescription, setExDescription] = useState('');
  const [exCategory, setExCategory] = useState<Category>('STRENGTH');
  const [exMuscleGroup, setExMuscleGroup] = useState<MuscleGroup>('CHEST');
  const [exEquipment, setExEquipment] = useState('');
  const [exDifficulty, setExDifficulty] = useState<Difficulty>('BEGINNER');
  const [exCalories, setExCalories] = useState(8);
  const [exInstructions, setExInstructions] = useState('');

  // User Management State
  const [userPage, setUserPage] = useState(0);
  const { data: usersData, isLoading: isLoadingUsers } = useAdminUsers(userPage, 20);
  const disableUserMutation = useDisableUser();
  const enableUserMutation = useEnableUser();

  const users = usersData?.content || [];

  const handleOpenExerciseModal = (exercise?: Exercise) => {
    if (exercise) {
      setEditingExercise(exercise);
      setExName(exercise.name);
      setExDescription(exercise.description);
      setExCategory(exercise.category);
      setExMuscleGroup(exercise.muscleGroup);
      setExEquipment(exercise.equipment);
      setExDifficulty(exercise.difficulty);
      setExCalories(exercise.caloriesBurned);
      setExInstructions(exercise.instructions);
    } else {
      setEditingExercise(null);
      setExName('');
      setExDescription('');
      setExCategory('STRENGTH');
      setExMuscleGroup('CHEST');
      setExEquipment('Barbell');
      setExDifficulty('BEGINNER');
      setExCalories(8);
      setExInstructions('');
    }
    setIsExerciseModalOpen(true);
  };

  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exName.trim()) return;

    const payload = {
      name: exName.trim(),
      description: exDescription.trim(),
      category: exCategory,
      muscleGroup: exMuscleGroup,
      equipment: exEquipment.trim(),
      difficulty: exDifficulty,
      caloriesBurned: Number(exCalories),
      instructions: exInstructions.trim()
    };

    try {
      if (editingExercise) {
        await updateExerciseMutation.mutateAsync({ id: editingExercise.id, data: payload });
        showSuccess('Exercise catalog entry updated');
      } else {
        await createExerciseMutation.mutateAsync(payload);
        showSuccess('New exercise added to catalog');
      }
      setIsExerciseModalOpen(false);
    } catch (err: any) {
      showError(err?.message || 'Failed to save exercise');
    }
  };

  const handleDeleteExercise = async (id: number) => {
    if (confirm('Delete this exercise entry from catalog?')) {
      try {
        await deleteExerciseMutation.mutateAsync(id);
        showSuccess('Exercise deleted');
      } catch (err: any) {
        showError(err?.message || 'Failed to delete exercise');
      }
    }
  };

  const handleToggleUserStatus = async (userId: number, currentEnabled?: boolean) => {
    try {
      if (currentEnabled) {
        await disableUserMutation.mutateAsync(userId);
        showSuccess('User disabled');
      } else {
        await enableUserMutation.mutateAsync(userId);
        showSuccess('User enabled');
      }
    } catch (err: any) {
      showError(err?.message || 'Failed to update user status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Administrative Control
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            <span>FitTrack Admin Dashboard</span>
          </h2>
        </div>

        {/* Tab triggers */}
        <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'exercises'
                ? 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Manage Exercises</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'users'
                ? 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MANAGE EXERCISES */}
      {activeTab === 'exercises' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder="Search catalog..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              onClick={() => handleOpenExerciseModal()}
              className="py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Exercise</span>
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase font-semibold">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Muscle Group</th>
                    <th className="p-4">Difficulty</th>
                    <th className="p-4">Equipment</th>
                    <th className="p-4">Burn</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {exercises.map((ex) => (
                    <tr key={ex.id} className="hover:bg-zinc-800/40">
                      <td className="p-4 font-bold text-white">{ex.name}</td>
                      <td className="p-4">
                        <CategoryBadge category={ex.category} />
                      </td>
                      <td className="p-4 font-semibold">{ex.muscleGroup}</td>
                      <td className="p-4">
                        <DifficultyBadge difficulty={ex.difficulty} />
                      </td>
                      <td className="p-4 text-zinc-400">{ex.equipment}</td>
                      <td className="p-4 font-mono text-amber-400">{ex.caloriesBurned} kcal</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenExerciseModal(ex)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExercise(ex.id)}
                          className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE USERS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase font-semibold">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Toggle State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {users.map((u) => {
                    const isEnabled = u.enabled ?? true;
                    return (
                      <tr key={u.id} className="hover:bg-zinc-800/40">
                        <td className="p-4 font-mono text-zinc-500">#{u.id}</td>
                        <td className="p-4 font-bold text-white">{u.name}</td>
                        <td className="p-4 font-mono text-zinc-400">{u.email}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === 'ADMIN'
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isEnabled
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {isEnabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(u.id, isEnabled)}
                            className={`py-1.5 px-3 rounded-lg font-bold text-[11px] flex items-center gap-1.5 ml-auto transition-colors ${
                              isEnabled
                                ? 'bg-rose-950/60 text-rose-400 hover:bg-rose-900 border border-rose-800'
                                : 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900 border border-emerald-800'
                            }`}
                          >
                            {isEnabled ? (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                <span>Disable User</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Enable User</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Modal */}
      <Modal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        title={editingExercise ? 'Edit Exercise Catalog Entry' : 'Create New Exercise Entry'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveExercise} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Exercise Name *</label>
            <input
              type="text"
              required
              value={exName}
              onChange={(e) => setExName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              value={exDescription}
              onChange={(e) => setExDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Category</label>
              <select
                value={exCategory}
                onChange={(e) => setExCategory(e.target.value as Category)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-orange-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Muscle Group</label>
              <select
                value={exMuscleGroup}
                onChange={(e) => setExMuscleGroup(e.target.value as MuscleGroup)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-orange-500"
              >
                {MUSCLE_GROUPS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Difficulty</label>
              <select
                value={exDifficulty}
                onChange={(e) => setExDifficulty(e.target.value as Difficulty)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-orange-500"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Equipment</label>
              <input
                type="text"
                value={exEquipment}
                onChange={(e) => setExEquipment(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Calories Burned / Min</label>
              <input
                type="number"
                value={exCalories}
                onChange={(e) => setExCalories(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Instructions</label>
            <textarea
              rows={3}
              value={exInstructions}
              onChange={(e) => setExInstructions(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsExerciseModalOpen(false)}
              className="px-4 py-2 bg-zinc-800 text-zinc-300 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-500 text-zinc-950 font-bold rounded-xl shadow-md shadow-orange-500/20"
            >
              Save Exercise Entry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
