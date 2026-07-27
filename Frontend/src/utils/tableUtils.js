/**
 * Generic reusable table utilities for sorting, filtering, and pagination.
 */

export const sortData = (items = [], sortBy = null, sortOrder = 'asc') => {
  if (!Array.isArray(items) || !sortBy) return items;

  return [...items].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (valA === null || valA === undefined) valA = '';
    if (valB === null || valB === undefined) valB = '';

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = String(valB).toLowerCase();
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterData = (items = [], predicateFn = null) => {
  if (!Array.isArray(items)) return [];
  if (typeof predicateFn !== 'function') return items;
  return items.filter(predicateFn);
};

export const paginateData = (items = [], page = 1, limit = 10) => {
  if (!Array.isArray(items)) return { data: [], totalPages: 0, totalItems: 0 };
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 10);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / safeLimit) || 1;
  const startIndex = (safePage - 1) * safeLimit;
  const paginatedItems = items.slice(startIndex, startIndex + safeLimit);

  return {
    data: paginatedItems,
    totalPages,
    totalItems,
    page: safePage,
    limit: safeLimit
  };
};
