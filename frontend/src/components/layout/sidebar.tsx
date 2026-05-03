import { CheckSquare, FolderKanban, LayoutDashboard, Settings, User } from 'lucide-react';
import { NavLink } from 'react-router';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../stores/uiStore';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { sidebarOpen } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-card transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent',
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                !sidebarOpen && 'justify-center'
              )
            }
            title={!sidebarOpen ? item.label : undefined}
          >
            <item.icon className="h-5 w-5" />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}