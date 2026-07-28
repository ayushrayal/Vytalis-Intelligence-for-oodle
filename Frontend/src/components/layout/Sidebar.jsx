import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Globe2,
  Users,
  Settings
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/countries', label: 'Countries', icon: Globe2 },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 sticky top-0 h-screen shrink-0 bg-surface border-r border-card-border flex flex-col justify-between p-4 transition-colors overflow-y-auto z-20">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-primary text-surface flex items-center justify-center font-black text-sm tracking-wider shadow-xs shrink-0 select-none">
            VM
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-sm text-text-primary tracking-tight">
              Vytalis Intelligence
            </span>
            <span className="text-[11px] font-medium text-text-secondary mt-1">
              for Oodle
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                    isActive
                      ? 'bg-primary/10 text-primary font-bold shadow-2xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-canvas'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding Card */}
      <div className="p-3.5 bg-canvas rounded-card border border-card-border">
        <div className="text-xs font-bold text-text-primary">Vytalis Intelligence</div>
        <div className="text-[11px] font-medium text-text-secondary mt-0.5">for Oodle</div>
      </div>
    </aside>
  );
}
