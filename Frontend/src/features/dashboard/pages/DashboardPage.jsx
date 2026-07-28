import { useState, useMemo } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard.js';
import { useDashboardLayout } from '../hooks/useDashboardLayout.js';
import { CATEGORIES } from '../utils/normalizeDashboardData.js';
import {
  StatCard,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
  CustomizeDashboardDrawer
} from '../components/index.js';

export default function DashboardPage() {
  const { data, loading, error, refresh } = useDashboard();
  const {
    visibleWidgets,
    widgetOrder,
    toggleWidget,
    toggleCategoryWidgets,
    reorderWidgets,
    resetLayout
  } = useDashboardLayout();

  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [draggedWidgetId, setDraggedWidgetId] = useState(null);

  // Filter and sort active widgets based on user layout preferences
  const activeWidgets = useMemo(() => {
    if (!data || !data.widgets) return [];
    return data.widgets
      .filter((w) => visibleWidgets.includes(w.id))
      .sort((a, b) => {
        const indexA = widgetOrder.indexOf(a.id);
        const indexB = widgetOrder.indexOf(b.id);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });
  }, [data, visibleWidgets, widgetOrder]);

  // Group active widgets by category
  const activeWidgetsByCategory = useMemo(() => {
    const grouped = {};
    CATEGORIES.forEach((cat) => {
      grouped[cat.id] = activeWidgets.filter((w) => w.categoryId === cat.id);
    });
    return grouped;
  }, [activeWidgets]);

  // Drag & Drop Handlers
  const handleDragStart = (e, id) => {
    setDraggedWidgetId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedWidgetId && targetId && draggedWidgetId !== targetId) {
      reorderWidgets(draggedWidgetId, targetId);
    }
    setDraggedWidgetId(null);
  };

  const handleDragEnd = () => {
    setDraggedWidgetId(null);
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={4} />
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-6">
        <ErrorState message={error} onRetry={refresh} />
      </div>
    );
  }

  if (!data || data.isEmpty) {
    return (
      <div className="space-y-6">
        <EmptyState title="No Analytics Data Available" description="We couldn't find any performance metrics for the selected range." />
      </div>
    );
  }

  const hasNoVisibleWidgets = activeWidgets.length === 0;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Section Header with Customize Dashboard Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-5 rounded-card border border-card-border shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
            Analytics Overview
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Configurable SaaS KPI metrics and real-time revenue performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCustomizeOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-surface bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Customize Dashboard</span>
          </button>
        </div>
      </div>

      {/* Hidden Widgets Notice if User Hydro-Hides All Cards */}
      {hasNoVisibleWidgets && (
        <div className="p-8 bg-surface rounded-card border border-dashed border-card-border text-center space-y-3">
          <h3 className="text-sm font-bold text-text-primary">All KPI Widgets Hidden</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            You have hidden all KPI cards. Use the Customize Dashboard menu to enable widgets or reset layout defaults.
          </p>
          <button
            type="button"
            onClick={resetLayout}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Dashboard</span>
          </button>
        </div>
      )}

      {/* Dynamic Categorized Widget Sections */}
      {CATEGORIES.map((category) => {
        const categoryWidgets = activeWidgetsByCategory[category.id] || [];
        if (categoryWidgets.length === 0) return null;

        // Grid Column Spacing based on Category
        const gridCols =
          category.id === 'users'
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

        return (
          <section key={category.id} className="space-y-3">
            {/* Section Header */}
            <div>
              <h2 className="text-sm font-extrabold text-text-primary tracking-tight">
                {category.title}
              </h2>
              <p className="text-[11px] font-medium text-text-secondary mt-0.5">
                {category.subtitle}
              </p>
            </div>

            {/* Draggable Responsive Widget Grid */}
            <div className={`grid ${gridCols} gap-4`}>
              {categoryWidgets.map((widget) => (
                <StatCard
                  key={widget.id}
                  id={widget.id}
                  title={widget.title}
                  value={widget.value}
                  trend={widget.trend}
                  isPositive={widget.isPositive}
                  subtitle={widget.subtitle}
                  icon={widget.icon}
                  draggable={true}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedWidgetId === widget.id}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Customize Dashboard Drawer Modal */}
      <CustomizeDashboardDrawer
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        widgets={data.widgets || []}
        visibleWidgets={visibleWidgets}
        toggleWidget={toggleWidget}
        toggleCategoryWidgets={toggleCategoryWidgets}
        resetLayout={resetLayout}
      />
    </div>
  );
}
