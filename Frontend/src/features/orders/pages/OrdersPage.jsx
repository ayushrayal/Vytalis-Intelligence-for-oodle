import { useState } from 'react';
import { useOrders } from '../hooks/useOrders.js';
import {
  SectionHeader,
  SearchBar,
  FilterBar,
  OrdersTable,
  Pagination,
  OrderDetailsDrawer,
  LoadingSkeleton,
  ErrorState,
  EmptyState
} from '../components/index.js';

export default function OrdersPage() {
  const {
    data,
    loading,
    error,
    refresh,
    search,
    setSearch,
    filters,
    setFilters,
    pagination,
    sorting
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState(null);

  const hasActiveFilters = Boolean(search.trim() || (filters.platform && filters.platform !== 'all'));

  const handleResetFilters = () => {
    setSearch('');
    setFilters({ platform: 'all' });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Summary KPI Banner */}
      <SectionHeader
        summary={data?.summary}
        onRefresh={refresh}
        loading={loading}
      />

      {/* Control Bar: Search & Platform Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-card border border-card-border shadow-xs">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          sorting={sorting}
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
        />
      </div>

      {/* Main Table Content */}
      {loading ? (
        <LoadingSkeleton rows={10} />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : data?.isEmpty ? (
        <EmptyState
          title="No Orders Match Your Filters"
          description="Try clearing your search query or changing the platform filter."
          onReset={hasActiveFilters ? handleResetFilters : undefined}
        />
      ) : (
        <div className="bg-surface rounded-card border border-card-border shadow-xs overflow-hidden space-y-4 p-4">
          <OrdersTable
            orders={data.orders}
            sorting={sorting}
            onSelectOrder={setSelectedOrder}
          />
          <Pagination pagination={pagination} />
        </div>
      )}

      {/* Order Details Side Drawer */}
      {selectedOrder && (
        <OrderDetailsDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
