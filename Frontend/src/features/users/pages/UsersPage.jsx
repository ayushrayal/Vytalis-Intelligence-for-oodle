import { useUsers } from '../hooks/useUsers.js';
import {
  UsersSummaryCards,
  UsersFilterBar,
  UsersTable,
  UsersCharts,
  UsersSkeleton,
  UsersErrorState,
  UsersEmptyState
} from '../components/index.js';

export default function UsersPage() {
  const { data, loading, error, refresh, filters, setFilters, sorting } = useUsers();

  const handleResetFilters = () => {
    setFilters({
      platform: 'all',
      gender: 'all'
    });
  };

  if (loading && !data) {
    return <UsersSkeleton />;
  }

  if (error && !data) {
    return <UsersErrorState message={error} onRetry={refresh} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {data && (
        <>
          {/* Summary Cards */}
          <UsersSummaryCards summary={data.summary} />

          {/* Charts Section */}
          <UsersCharts charts={data.charts} />

          {/* Control Bar: Filter Bar */}
          <div className="bg-surface p-4 rounded-card border border-card-border shadow-xs">
            <UsersFilterBar filters={filters} setFilters={setFilters} />
          </div>

          {/* Table Breakdown or Empty State */}
          {data.isEmpty ? (
            <UsersEmptyState onReset={handleResetFilters} />
          ) : (
            <div className="bg-surface rounded-card border border-card-border shadow-xs overflow-hidden p-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Detailed Segment Breakdown ({data.users.length} segments)
                </h3>
              </div>
              <UsersTable users={data.users} sorting={sorting} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
