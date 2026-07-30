import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Dumbbell } from 'lucide-react';
import {
  useMyWorkouts,
  useCreateWorkout,
  useUpdateWorkout,
  useDeleteWorkout
} from '../hooks/useWorkouts';
import { WorkoutCard } from '../components/workout/WorkoutCard';
import { WorkoutBuilder } from '../components/workout/WorkoutBuilder';
import { Modal } from '../components/ui/Modal';
import { CardSkeleton } from '../components/ui/Skeleton';
import { WorkoutRequest, WorkoutResponse } from '../types';
import { useToast } from '../components/ui/Toast';

export const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutResponse | null>(null);

  const { data, isLoading } = useMyWorkouts(page, 12);
  const createMutation = useCreateWorkout();
  const updateMutation = useUpdateWorkout();
  const deleteMutation = useDeleteWorkout();

  const workouts = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const handleCreateNew = () => {
    setEditingWorkout(null);
    setIsModalOpen(true);
  };

  const handleEdit = (workout: WorkoutResponse) => {
    setEditingWorkout(workout);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this workout routine?')) {
      try {
        await deleteMutation.mutateAsync(id);
        showSuccess('Workout deleted');
      } catch (err: any) {
        showError(err?.message || 'Failed to delete workout');
      }
    }
  };

  const handleSave = async (formData: WorkoutRequest) => {
    try {
      if (editingWorkout) {
        await updateMutation.mutateAsync({ id: editingWorkout.id, data: formData });
        showSuccess('Workout routine updated successfully!');
      } else {
        await createMutation.mutateAsync(formData);
        showSuccess('New workout routine created!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showError(err?.message || 'Failed to save workout');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-orange-500" />
            <span>My Workout Routines</span>
          </h2>
          <p className="text-sm text-zinc-400">
            Manage your customized splits, set schemes, and session routines.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="py-3 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-900/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Workout</span>
        </button>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : workouts.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/40 space-y-4">
          <Dumbbell className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-300">No workouts created yet</h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            Build your first custom workout split with exercises from the catalog or start with an AI generated template.
          </p>
          <button
            onClick={handleCreateNew}
            className="py-2.5 px-5 rounded-xl bg-orange-500 text-zinc-950 font-bold text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Build First Workout</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onStart={(id) => navigate(`/workouts/${id}`)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-zinc-400">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal for Workout Builder */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWorkout ? 'Edit Workout Routine' : 'Create New Workout Routine'}
        maxWidth="max-w-3xl"
      >
        <WorkoutBuilder
          initialWorkout={editingWorkout}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
};
