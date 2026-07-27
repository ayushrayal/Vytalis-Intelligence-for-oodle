import OrderRow from './OrderRow.jsx';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function OrdersTable({ orders, sorting, onSelectOrder }) {
  const renderSortIndicator = (field) => {
    if (sorting.sortBy !== field) return null;
    return sorting.sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 inline-block ml-1 text-primary" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 inline-block ml-1 text-primary" />
    );
  };

  return (
    <div className="overflow-x-auto rounded-card border border-card-border bg-surface shadow-xs">
      <table className="w-full text-left border-collapse min-w-[768px]">
        <thead>
          <tr className="bg-canvas border-b border-card-border text-xs font-semibold text-text-secondary uppercase tracking-wider">
            <th
              onClick={() => sorting.handleSort('orderId')}
              className="px-6 py-3.5 cursor-pointer hover:text-text-primary transition-colors select-none"
            >
              Order ID {renderSortIndicator('orderId')}
            </th>

            <th className="px-6 py-3.5 select-none">
              Platform
            </th>

            <th className="px-6 py-3.5 select-none">
              Country
            </th>

            <th className="px-6 py-3.5 select-none">
              Product
            </th>

            <th
              onClick={() => sorting.handleSort('purchaseTimeRaw')}
              className="px-6 py-3.5 cursor-pointer hover:text-text-primary transition-colors select-none"
            >
              Purchase Date {renderSortIndicator('purchaseTimeRaw')}
            </th>

            <th
              onClick={() => sorting.handleSort('usdAmount')}
              className="px-6 py-3.5 text-right cursor-pointer hover:text-text-primary transition-colors select-none"
            >
              USD Revenue {renderSortIndicator('usdAmount')}
            </th>

            <th
              onClick={() => sorting.handleSort('estimatedNetUsd')}
              className="px-6 py-3.5 text-right cursor-pointer hover:text-text-primary transition-colors select-none"
            >
              USD Net Proceeds {renderSortIndicator('estimatedNetUsd')}
            </th>

            <th className="px-4 py-3.5 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-card-border/60">
          {orders.map((order) => (
            <OrderRow
              key={order.id || order.orderId}
              order={order}
              onSelectOrder={onSelectOrder}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
