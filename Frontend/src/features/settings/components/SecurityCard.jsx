import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';

export const SecurityCard = React.memo(function SecurityCard({
  onLogoutClick
}) {
  return (
    <div className="bg-surface rounded-card border border-card-border p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-card-border">
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-text-primary tracking-tight">Security</h2>
          <p className="text-xs text-text-secondary font-medium">
            Manage session authentication and security authorization
          </p>
        </div>
      </div>

      {/* Logout Section */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="text-xs font-bold text-text-primary">Sign Out</div>
          <div className="text-[11px] text-text-secondary mt-0.5 font-medium">
            Safely end your current active session on Vytalis Intelligence
          </div>
        </div>
        <button
          type="button"
          onClick={onLogoutClick}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-status-danger/10 hover:bg-status-danger/20 text-status-danger border border-status-danger/20 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-status-danger focus-visible:outline-none"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
});

export default SecurityCard;
