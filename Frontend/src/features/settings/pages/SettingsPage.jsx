import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useSettings } from '../hooks/useSettings.js';
import {
  AccountCard,
  DashboardPreferencesCard,
  SecurityCard
} from '../components/index.js';
import { ToastNotification } from '../../../components/common/ToastNotification.jsx';
import { LogoutModal } from '../../../components/common/LogoutModal.jsx';

export default function SettingsPage() {
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const {
    name,
    setName,
    email,
    isAccountDirty,
    savingAccount,
    handleSaveAccount,
    datePreset,
    handleDatePresetChange,
    toast,
    closeToast
  } = useSettings();

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Feedback Notification */}
      <ToastNotification toast={toast} onClose={closeToast} />

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
      />

      {/* Page Header */}
      <div className="bg-surface p-6 rounded-card border border-card-border shadow-xs flex flex-col gap-1">
        <h1 className="text-xl font-bold text-text-primary tracking-tight">Settings</h1>
        <p className="text-xs text-text-secondary font-medium">
          Manage your account and application preferences.
        </p>
      </div>

      {/* Settings Grid Layout: Balanced 2-Column Grid on Desktop, Single-Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Account Details */}
        <div>
          <AccountCard
            name={name}
            setName={setName}
            email={email}
            isAccountDirty={isAccountDirty}
            savingAccount={savingAccount}
            onSave={handleSaveAccount}
          />
        </div>

        {/* Right Column: Preferences & Security */}
        <div className="space-y-6">
          <DashboardPreferencesCard
            datePreset={datePreset}
            onDatePresetChange={handleDatePresetChange}
          />

          <SecurityCard onLogoutClick={() => setIsLogoutModalOpen(true)} />
        </div>
      </div>
    </div>
  );
}
