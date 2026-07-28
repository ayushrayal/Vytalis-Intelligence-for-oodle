import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'vytalis_dashboard_layout';

export const DEFAULT_WIDGET_ORDER = [
  // Revenue
  'gross_sales_usd',
  'net_proceeds_usd',
  'gross_sales_inr',
  'net_proceeds_inr',
  // Orders
  'total_orders',
  'ios_orders',
  'android_orders',
  'avg_order_value',
  // Users
  'new_users_total',
  'new_users_ios',
  'new_users_android',
  'new_men',
  'new_women',
  // Platform Revenue
  'apple_sales_inr',
  'android_sales_inr',
  'apple_proceeds_inr',
  'android_proceeds_inr'
];

export function useDashboardLayout() {
  const [visibleWidgets, setVisibleWidgets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.visibleWidgets)) {
          return parsed.visibleWidgets;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_WIDGET_ORDER;
  });

  const [widgetOrder, setWidgetOrder] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.widgetOrder)) {
          // Merge any new widgets missing in saved order
          const existingSet = new Set(parsed.widgetOrder);
          const missing = DEFAULT_WIDGET_ORDER.filter((id) => !existingSet.has(id));
          return [...parsed.widgetOrder, ...missing];
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_WIDGET_ORDER;
  });

  // Auto-persist layout changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          visibleWidgets,
          widgetOrder
        })
      );
    } catch {
      // Ignore storage write failures
    }
  }, [visibleWidgets, widgetOrder]);

  const toggleWidget = useCallback((widgetId) => {
    setVisibleWidgets((prev) => {
      if (prev.includes(widgetId)) {
        return prev.filter((id) => id !== widgetId);
      } else {
        return [...prev, widgetId];
      }
    });
  }, []);

  const toggleCategoryWidgets = useCallback((widgetIds, shouldShow) => {
    setVisibleWidgets((prev) => {
      const prevSet = new Set(prev);
      if (shouldShow) {
        widgetIds.forEach((id) => prevSet.add(id));
      } else {
        widgetIds.forEach((id) => prevSet.delete(id));
      }
      return Array.from(prevSet);
    });
  }, []);

  const reorderWidgets = useCallback((draggedId, targetId) => {
    if (!draggedId || !targetId || draggedId === targetId) return;

    setWidgetOrder((prevOrder) => {
      const order = [...prevOrder];
      const fromIndex = order.indexOf(draggedId);
      const toIndex = order.indexOf(targetId);

      if (fromIndex === -1 || toIndex === -1) return prevOrder;

      // Remove dragged item and insert at target position
      order.splice(fromIndex, 1);
      order.splice(toIndex, 0, draggedId);
      return order;
    });
  }, []);

  const resetLayout = useCallback(() => {
    setVisibleWidgets(DEFAULT_WIDGET_ORDER);
    setWidgetOrder(DEFAULT_WIDGET_ORDER);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return {
    visibleWidgets,
    widgetOrder,
    toggleWidget,
    toggleCategoryWidgets,
    reorderWidgets,
    resetLayout
  };
}

export default useDashboardLayout;
