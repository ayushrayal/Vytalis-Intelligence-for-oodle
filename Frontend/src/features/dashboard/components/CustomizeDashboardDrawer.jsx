import { useState } from 'react';
import { X, ChevronDown, RotateCcw, CheckSquare, Square, Eye, EyeOff } from 'lucide-react';
import { CATEGORIES } from '../utils/normalizeDashboardData.js';

export default function CustomizeDashboardDrawer({
  isOpen,
  onClose,
  widgets,
  visibleWidgets,
  toggleWidget,
  toggleCategoryWidgets,
  resetLayout
}) {
  // Category expanded state map
  const [expandedCategories, setExpandedCategories] = useState({
    revenue: true,
    orders: true,
    users: true,
    platform_revenue: true
  });

  if (!isOpen) return null;

  const toggleCategoryExpand = (catId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-surface h-full shadow-2xl flex flex-col border-l border-card-border z-10 animate-slideLeft">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-card-border/80 bg-canvas">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Dashboard Layout
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-text-primary mt-0.5">
              Customize Dashboard
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Toggle widget visibility & section preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body - Category Accordions */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {CATEGORIES.map((category) => {
            const isExpanded = expandedCategories[category.id] !== false;
            const categoryWidgets = widgets.filter((w) => w.categoryId === category.id);
            const categoryWidgetIds = categoryWidgets.map((w) => w.id);
            const allSelected = categoryWidgetIds.every((id) => visibleWidgets.includes(id));
            const noneSelected = categoryWidgetIds.every((id) => !visibleWidgets.includes(id));

            return (
              <div
                key={category.id}
                className="bg-canvas/60 rounded-card border border-card-border overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <div className="p-3.5 bg-surface/80 flex items-center justify-between gap-2 border-b border-card-border/60">
                  <button
                    type="button"
                    onClick={() => toggleCategoryExpand(category.id)}
                    className="flex items-center gap-2 text-xs font-bold text-text-primary hover:text-primary transition-colors cursor-pointer text-left flex-1"
                  >
                    <ChevronDown
                      className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
                        isExpanded ? '' : '-rotate-90'
                      }`}
                    />
                    <span>{category.title}</span>
                    <span className="text-[11px] font-semibold text-text-secondary bg-canvas px-2 py-0.5 rounded-full border border-card-border">
                      {categoryWidgets.filter((w) => visibleWidgets.includes(w.id)).length}/{categoryWidgets.length}
                    </span>
                  </button>

                  {/* Batch Selection Action Links */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!allSelected && (
                      <button
                        type="button"
                        onClick={() => toggleCategoryWidgets(categoryWidgetIds, true)}
                        className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Select All</span>
                      </button>
                    )}
                    {!noneSelected && (
                      <button
                        type="button"
                        onClick={() => toggleCategoryWidgets(categoryWidgetIds, false)}
                        className="text-[11px] font-semibold text-text-secondary hover:text-status-danger hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <EyeOff className="w-3 h-3" />
                        <span>Hide All</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Widget Checkboxes List */}
                {isExpanded && (
                  <div className="p-3 space-y-2 bg-surface/40">
                    {categoryWidgets.map((widget) => {
                      const isChecked = visibleWidgets.includes(widget.id);

                      return (
                        <label
                          key={widget.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-primary/5 border-primary/30 text-text-primary font-semibold'
                              : 'bg-surface hover:bg-canvas border-card-border/60 text-text-secondary'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleWidget(widget.id)}
                              className="sr-only"
                            />
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-primary shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-text-secondary/60 shrink-0" />
                            )}
                            <span className="text-xs">{widget.title}</span>
                          </div>

                          <span className="text-[11px] font-mono text-text-secondary">
                            {widget.value}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-card-border bg-canvas flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={resetLayout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary bg-surface hover:bg-canvas border border-card-border rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Dashboard</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-surface bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
