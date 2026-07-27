import { useAuth } from '../../features/auth/hooks/useAuth.js';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
};

const getInitials = (str) => {
  if (!str) return 'AU';
  const parts = str.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return str.substring(0, 2).toUpperCase();
};

export default function Header() {
  const { user } = useAuth();
  const userName = user?.name || user?.username || 'Admin User';
  const greeting = getGreeting();

  return (
    <header className="bg-surface border-b border-card-border px-6 py-4 flex items-center justify-between transition-colors shrink-0">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-text-primary tracking-tight">
          Oodle Analytics Overview
        </h1>
        <p className="text-xs text-text-secondary mt-0.5 font-medium">
          {greeting}, {userName} • Welcome back! Let's analyze our growth.
        </p>
      </div>

      {/* Right Controls: User Profile Avatar */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-extrabold text-xs shadow-2xs">
          {getInitials(userName)}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-xs font-semibold text-text-primary leading-tight">
            {userName}
          </div>
          <div className="text-[10px] text-text-secondary leading-tight mt-0.5 font-medium">
            Active Editor
          </div>
        </div>
      </div>
    </header>
  );
}
