import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No Analytics Data',
  description = 'There is currently no daily analytics data available to display.',
  icon: Icon = Inbox
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center shadow-sm">
      <div className="inline-flex items-center justify-center p-4 bg-slate-100 text-slate-400 rounded-full mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">{description}</p>
    </div>
  );
}
