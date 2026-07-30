import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Moon, Sun, LogOut, Trash2, Save, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { getStoredTheme, applyTheme, ThemeMode } from '../lib/theme';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { showSuccess, showError } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Theme state
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredTheme());

  // Delete account confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsUpdatingName(true);
    try {
      const updated = await userService.updateMe({ name: name.trim() });
      updateUser({ name: updated.name });
      showSuccess('Profile name updated successfully!');
    } catch (err: any) {
      showError(err?.message || 'Failed to update name');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setIsChangingPassword(true);
    try {
      await userService.changePassword({ currentPassword, newPassword });
      showSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      showError(err?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    applyTheme(mode);
    showSuccess(`Theme set to ${mode}`);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await userService.deleteMe();
      logout();
      navigate('/login');
      showSuccess('Your account has been deleted.');
    } catch (err: any) {
      showError(err?.message || 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-orange-500" />
          <span>Profile & Account Settings</span>
        </h2>
        <p className="text-sm text-zinc-400">
          Manage your personal information, security credentials, and application themes.
        </p>
      </div>

      {/* User Info Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-900/40 shrink-0">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{user?.name}</h3>
          <p className="text-sm text-zinc-400 font-mono">{user?.email}</p>
          <span className="inline-block mt-2 px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-orange-500/10 text-orange-500 border border-orange-500/20">
            {user?.role} ACCOUNT
          </span>
        </div>
      </div>

      {/* Edit Profile Name */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-orange-400" />
          <span>Display Name</span>
        </h3>

        <form onSubmit={handleUpdateName} className="flex flex-wrap md:flex-nowrap gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={isUpdatingName}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all"
          >
            <Save className="w-4 h-4 fill-zinc-950" />
            <span>{isUpdatingName ? 'Updating...' : 'Save Name'}</span>
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-orange-400" />
          <span>Security & Password</span>
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <Shield className="w-4 h-4" />
            <span>{isChangingPassword ? 'Changing...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* Theme Preference */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-400" />
          <span>Appearance Preference</span>
        </h3>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`flex-1 min-w-[120px] p-4 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-2 transition-all ${
              themeMode === 'dark'
                ? 'bg-orange-500/10 border-orange-500 text-orange-400 shadow-md shadow-orange-500/10'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span>Dark Mode</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`flex-1 min-w-[120px] p-4 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-2 transition-all ${
              themeMode === 'light'
                ? 'bg-orange-500/10 border-orange-500 text-orange-400 shadow-md shadow-orange-500/10'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span>Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('system')}
            className={`flex-1 min-w-[120px] p-4 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-2 transition-all ${
              themeMode === 'system'
                ? 'bg-orange-500/10 border-orange-500 text-orange-400 shadow-md shadow-orange-500/10'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>System Default</span>
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-white">Account Actions</h3>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="py-3 px-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="py-3 px-6 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-sm text-zinc-300">
          <p>
            Are you sure you want to permanently delete your FitTrack Pro account?
            This will wipe your workout routines and history.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-zinc-800 text-zinc-300 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              disabled={isDeleting}
              onClick={handleDeleteAccount}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
