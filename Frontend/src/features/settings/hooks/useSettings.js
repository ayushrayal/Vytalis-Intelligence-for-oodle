import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useDateFilter } from '../../../context/DateFilterContext.jsx';
import {
  saveAccount as saveAccountApi,
  saveDashboardPreferences as saveDashboardPreferencesApi
} from '../services/settings.service.js';

export function useSettings() {
  const { user, updateUser } = useAuth();
  const { selectedPreset, setPreset } = useDateFilter();

  // Account State
  const initialName = useMemo(() => user?.name || user?.username || 'Admin User', [user]);
  const initialEmail = useMemo(() => user?.email || 'admin@oodle.com', [user]);

  const [name, setName] = useState(initialName);
  const [savedName, setSavedName] = useState(initialName);
  const [email] = useState(initialEmail);
  const [savingAccount, setSavingAccount] = useState(false);

  useEffect(() => {
    setName(initialName);
    setSavedName(initialName);
  }, [initialName]);

  const isAccountDirty = name.trim() !== '' && name !== savedName;

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Save Account Handler
  const handleSaveAccount = async (e) => {
    if (e) e.preventDefault();
    if (!isAccountDirty || savingAccount) return;

    setSavingAccount(true);
    try {
      const res = await saveAccountApi({ name: name.trim(), email });
      if (res && res.success) {
        setSavedName(name.trim());
        if (updateUser) {
          updateUser({ name: name.trim() });
        }
        showToast('Account details saved successfully.', 'success');
      } else {
        showToast(res?.message || 'Failed to save account details.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'An error occurred while saving account.', 'error');
    } finally {
      setSavingAccount(false);
    }
  };

  // Date Preset Change Handler
  const handleDatePresetChange = async (presetKey) => {
    setPreset(presetKey);
    try {
      await saveDashboardPreferencesApi({ datePreset: presetKey });
      showToast('Default date preset updated.', 'success');
    } catch (err) {
      showToast('Failed to save date preset preference.', 'error');
    }
  };

  return {
    // Account
    name,
    setName,
    email,
    isAccountDirty,
    savingAccount,
    handleSaveAccount,

    // Dashboard Preferences
    datePreset: selectedPreset,
    handleDatePresetChange,

    // Toast
    toast,
    closeToast
  };
}

export default useSettings;
