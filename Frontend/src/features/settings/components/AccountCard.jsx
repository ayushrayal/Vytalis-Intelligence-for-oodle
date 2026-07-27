import React from 'react';
import { User, Loader2 } from 'lucide-react';

export const AccountCard = React.memo(function AccountCard({
  name,
  setName,
  email,
  isAccountDirty,
  savingAccount,
  onSave
}) {
  const getInitials = (str) => {
    if (!str) return 'AU';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-surface rounded-card border border-card-border p-6 shadow-xs space-y-6">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-card-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary tracking-tight">Account</h2>
            <p className="text-xs text-text-secondary font-medium">
              Update your account details and information
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-5">
        {/* Avatar Display */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-extrabold text-lg shadow-2xs">
            {getInitials(name || email)}
          </div>
          <div>
            <div className="text-xs font-semibold text-text-primary">{name || 'User Profile'}</div>
            <div className="text-[11px] text-text-secondary mt-0.5">{email}</div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Editor Name */}
          <div>
            <label
              htmlFor="editor-name"
              className="block text-xs font-bold text-text-primary mb-1.5"
            >
              Editor Name
            </label>
            <input
              id="editor-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3.5 py-2.5 bg-surface text-text-primary text-xs font-medium rounded-xl border border-card-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-text-secondary/60"
            />
          </div>

          {/* Email Address (Read-only) */}
          <div>
            <label
              htmlFor="email-address"
              className="block text-xs font-bold text-text-primary mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email-address"
              type="email"
              value={email}
              readOnly
              disabled
              tabIndex={-1}
              className="w-full px-3.5 py-2.5 bg-canvas/80 text-text-secondary text-xs font-medium rounded-xl border border-card-border cursor-not-allowed select-none opacity-80"
            />
            <span className="text-[11px] text-text-secondary/80 mt-1 block">
              Email address cannot be modified directly.
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={!isAccountDirty || savingAccount}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${!isAccountDirty || savingAccount
                ? 'bg-canvas text-text-secondary border border-card-border cursor-not-allowed opacity-60'
                : 'bg-primary hover:bg-primary-hover text-surface cursor-pointer'
              }`}
          >
            {savingAccount && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
});

export default AccountCard;
