import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Menu, 
  X, 
  Home, 
  ClipboardList, 
  Send,
  FileText,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const userMenuItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/my-tests', icon: ClipboardList, label: 'My Tests' },
  ];

  const orgMenuItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/assign-test', icon: Send, label: 'Assign Test' },
    { path: '/manage-tests', icon: FileText, label: 'Manage Tests' },
  ];

  const menuItems = user?.type === 'ORGANIZATION' ? orgMenuItems : userMenuItems;

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-green-100 hover:bg-green-50 transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-foreground" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.photoURL} />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.type === 'ORGANIZATION' ? 'Company Admin' : 'Test Taker'}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200
                        ${isActive
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
