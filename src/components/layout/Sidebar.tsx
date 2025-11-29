import { BarChart3, Clock, FileText, Home, Settings, TrendingUp } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: BarChart3, label: 'Compare', path: '/compare' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Clock, label: 'History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">SocialPulse</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="sidebar-link"
              activeClassName="active"
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-sm font-medium text-foreground">Pro Tip</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Schedule automated reports to stay ahead of your competition.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
