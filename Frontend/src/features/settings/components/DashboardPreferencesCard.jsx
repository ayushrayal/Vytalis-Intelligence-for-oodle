import React from 'react';
import { SlidersHorizontal, Calendar } from 'lucide-react';
import { DATE_PRESETS, DATE_PRESET_LABELS } from '../../../constants/datePresets.js';

const datePresetOptions = [
  { value: DATE_PRESETS.TODAY, label: DATE_PRESET_LABELS[DATE_PRESETS.TODAY] },
  { value: DATE_PRESETS.LAST_7_DAYS, label: DATE_PRESET_LABELS[DATE_PRESETS.LAST_7_DAYS] },
  { value: DATE_PRESETS.LAST_30_DAYS, label: DATE_PRESET_LABELS[DATE_PRESETS.LAST_30_DAYS] },
  { value: DATE_PRESETS.THIS_MONTH, label: DATE_PRESET_LABELS[DATE_PRESETS.THIS_MONTH] }
];

export const DashboardPreferencesCard = React.memo(function DashboardPreferencesCard({
  datePreset,
  onDatePresetChange
}) {
  return (
    <div className="bg-surface rounded-card border border-card-border p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-card-border">
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
          <SlidersHorizontal className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-text-primary tracking-tight">
            Dashboard Preferences
          </h2>
          <p className="text-xs text-text-secondary font-medium">
            Manage your default view filters and dashboard options
          </p>
        </div>
      </div>

      {/* Default Date Preset Dropdown */}
      <div className="space-y-2">
        <label
          htmlFor="default-date-preset"
          className="flex items-center gap-2 text-xs font-bold text-text-primary"
        >
          <Calendar className="w-4 h-4 text-primary" />
          <span>Default Date Preset</span>
        </label>
        <select
          id="default-date-preset"
          value={datePreset}
          onChange={(e) => onDatePresetChange(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-surface text-text-primary text-xs font-medium rounded-xl border border-card-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all cursor-pointer"
        >
          {datePresetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-text-secondary">
          Selected preset will automatically apply when loading analytics metrics.
        </p>
      </div>
    </div>
  );
});

export default DashboardPreferencesCard;
