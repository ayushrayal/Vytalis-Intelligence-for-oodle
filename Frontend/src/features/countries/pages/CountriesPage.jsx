import { useState } from 'react';
import { useCountries } from '../hooks/useCountries.js';
import {
  SectionHeader,
  SearchBar,
  FilterBar,
  CountryCard,
  CountriesChart,
  CountriesTable,
  CountryDetailsDrawer,
  LoadingSkeleton,
  ErrorState,
  EmptyState
} from '../components/index.js';

export default function CountriesPage() {
  const {
    data,
    loading,
    error,
    refresh,
    search,
    setSearch,
    filters,
    setFilters,
    sorting
  } = useCountries();

  const [selectedCountry, setSelectedCountry] = useState(null);

  const hasActiveFilters = Boolean(search.trim() || (filters.salesOnly && filters.salesOnly !== 'all'));

  const handleResetFilters = () => {
    setSearch('');
    setFilters({ salesOnly: 'all' });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Header Summary Banner */}
      <SectionHeader
        summary={data?.summary}
        onRefresh={refresh}
        loading={loading}
      />

      {/* Main Content Area */}
      {loading ? (
        <LoadingSkeleton rows={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <div className="space-y-6">
          {/* Top Country Highlight Cards */}
          <CountryCard
            topCountryByRevenue={data?.summary?.topCountryByRevenue}
            topCountryByOrders={data?.summary?.topCountryByOrders}
          />

          {/* Market Distribution Chart */}
          <CountriesChart charts={data?.charts} />

          {/* Control Bar: Search & Filters */}
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

          {/* Countries Table / Empty State */}
          {data?.isEmpty ? (
            <EmptyState
              title="No Countries Match Your Search"
              description="Try clearing your search query or switching back to All Countries filter."
              onReset={hasActiveFilters ? handleResetFilters : undefined}
            />
          ) : (
            <div className="bg-surface rounded-card border border-card-border shadow-xs overflow-hidden p-4">
              <CountriesTable
                countries={data.countries}
                sorting={sorting}
                onSelectCountry={setSelectedCountry}
              />
            </div>
          )}
        </div>
      )}

      {/* Country Details Side Drawer */}
      {selectedCountry && (
        <CountryDetailsDrawer
          countryData={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
