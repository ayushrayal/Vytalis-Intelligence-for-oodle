import { X, Apple, Smartphone, Copy, Check, DollarSign, Globe, Calendar, Package } from 'lucide-react';
import { useState } from 'react';

export default function OrderDetailsDrawer({ order, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'ios':
        return <Apple className="w-4 h-4 text-slate-700 mr-1.5" />;
      case 'android':
        return <Smartphone className="w-4 h-4 text-emerald-600 mr-1.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 z-10 animate-slideLeft">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Order Details
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                {getPlatformIcon(order.platform)}
                {order.platform}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
              <span className="font-mono">{order.orderId}</span>
              <button
                onClick={() => copyToClipboard(order.orderId)}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
                title="Copy Order ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Overview Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
              <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider block mb-1">
                USD Revenue
              </span>
              <span className="text-xl font-bold text-indigo-950">
                {order.formattedUsdAmount}
              </span>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
              <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider block mb-1">
                Est. Net Proceeds
              </span>
              <span className="text-xl font-bold text-emerald-950">
                {order.formattedEstimatedNetUsd}
              </span>
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="space-y-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Transaction Info
            </h3>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-400" />
                Product
              </span>
              <span className="font-semibold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 text-xs">
                {order.product}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                Country
              </span>
              <span className="font-semibold text-slate-800">
                {order.country}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Purchase Date
              </span>
              <span className="font-semibold text-slate-800 text-xs">
                {order.purchaseTimeFormatted}
              </span>
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-slate-400" />
              Financial Breakdown
            </h3>

            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Original Currency</span>
                <span className="font-mono font-semibold text-slate-800">{order.currency}</span>
              </div>

              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Original Amount</span>
                <span className="font-semibold text-slate-800">{order.formattedOriginalAmount}</span>
              </div>

              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Exchange Rate</span>
                <span className="font-mono text-slate-700">{order.exchangeRate}</span>
              </div>

              <div className="py-2 flex justify-between">
                <span className="text-slate-500">INR Equivalent</span>
                <span className="font-semibold text-slate-800">{order.formattedInrAmount}</span>
              </div>

              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Est. Net (INR)</span>
                <span className="font-semibold text-emerald-700">{order.formattedEstimatedNetInr}</span>
              </div>
            </div>
          </div>

          {/* Full Raw Object Dump Inspection */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Raw Payload Attributes
            </h3>
            <pre className="bg-slate-900 text-slate-100 text-[11px] font-mono p-4 rounded-xl overflow-x-auto max-h-40">
              {JSON.stringify(order.rawOrder, null, 2)}
            </pre>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
