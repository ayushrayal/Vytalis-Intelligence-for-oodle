export default function LoadingSkeleton({ rows = 6 }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm animate-pulse">
      <table className="w-full text-left border-collapse min-w-[768px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <th className="px-6 py-3.5">Order ID</th>
            <th className="px-6 py-3.5">Platform</th>
            <th className="px-6 py-3.5">Country</th>
            <th className="px-6 py-3.5">Product</th>
            <th className="px-6 py-3.5">Purchase Date</th>
            <th className="px-6 py-3.5 text-right">USD Revenue</th>
            <th className="px-6 py-3.5 text-right">USD Net Proceeds</th>
            <th className="px-4 py-3.5 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, index) => (
            <tr key={index} className="bg-white">
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 rounded-md w-28"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-5 bg-slate-200 rounded-full w-16"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 rounded-md w-24"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 rounded-md w-32"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-200 rounded-md w-28"></div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="h-4 bg-slate-200 rounded-md w-16 ml-auto"></div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="h-4 bg-slate-200 rounded-md w-16 ml-auto"></div>
              </td>
              <td className="px-4 py-4 text-right">
                <div className="h-4 bg-slate-200 rounded-full w-4 ml-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
