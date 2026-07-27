/**
 * Settings Service
 * Transport-agnostic service layer returning resolved promises for settings operations.
 * Future-ready for replacement with real backend API endpoints.
 */

export const getSettings = async () => {
  return Promise.resolve({
    success: true,
    data: {
      account: {
        name: '',
        email: ''
      },
      dashboardPreferences: {
        datePreset: 'Last 7 Days'
      }
    }
  });
};

export const saveAccount = async (accountData) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return Promise.resolve({
    success: true,
    data: accountData,
    message: 'Account details updated successfully.'
  });
};

export const saveDashboardPreferences = async (preferencesData) => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return Promise.resolve({
    success: true,
    data: preferencesData,
    message: 'Dashboard preferences updated.'
  });
};

export default {
  getSettings,
  saveAccount,
  saveDashboardPreferences
};
