import { ChevronRight, Smartphone, Apple } from 'lucide-react';

export default function OrderRow({ order, onSelectOrder }) {
  const getPlatformBadge = (platform) => {
    switch (platform) {
      case 'ios':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            <Apple className="w-3 h-3 mr-1 text-slate-700" />
            iOS
          </span>
        );
      case 'android':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <Smartphone className="w-3 h-3 mr-1 text-emerald-600" />
            Android
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            {platform}
          </span>
        );
    }
  };

  return (
    <tr
      onClick={() => onSelectOrder(order)}
      className="hover:bg-slate-50/80 cursor-pointer transition-colors group border-b border-slate-100 last:border-b-0"
    >
      {/* Order ID */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-xs font-mono font-semibold text-indigo-600 group-hover:text-indigo-700">
          {order.orderId}
        </span>
      </td>

      {/* Platform */}
      <td className="px-6 py-4 whitespace-nowrap">
        {getPlatformBadge(order.platform)}
      </td>

      {/* Country */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-slate-800">
          {order.country}
        </span>
      </td>

      {/* Product */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-xs font-medium text-slate-600 bg-slate-100/70 px-2 py-1 rounded-md">
          {order.product}
        </span>
      </td>

      {/* Purchase Date */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-xs text-slate-500">
          {order.purchaseTimeFormatted}
        </span>
      </td>

      {/* USD Gross Revenue */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="text-sm font-bold text-slate-900">
          {order.formattedUsdAmount}
        </div>
        {order.currency !== 'USD' && (
          <div className="text-[11px] text-slate-400">
            ({order.formattedOriginalAmount})
          </div>
        )}
      </td>

      {/* USD Net Proceeds */}
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="text-sm font-semibold text-emerald-600">
          {order.formattedEstimatedNetUsd}
        </div>
      </td>

      {/* Drawer Chevron indicator */}
      <td className="px-4 py-4 whitespace-nowrap text-right w-10">
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
      </td>
    </tr>
  );
}
