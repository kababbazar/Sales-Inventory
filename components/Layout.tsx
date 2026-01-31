
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  BarChart3, 
  LogOut, 
  Globe,
  Menu,
  X,
  User as UserIcon
} from 'lucide-react';
import { useApp } from '../AppContext';
import { translations } from '../translations';

const Layout: React.FC = () => {
  const { language, toggleLanguage, logout, currentUser } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const t = translations[language];

  const menuItems = [
    { name: t.dashboard, icon: LayoutDashboard, path: '/' },
    { name: t.pos, icon: ShoppingCart, path: '/pos' },
    { name: t.inventory, icon: Package, path: '/inventory' },
    { name: t.customers, icon: Users, path: '/customers' },
    { name: t.invoices, icon: FileText, path: '/invoices' },
    { name: t.reports, icon: BarChart3, path: '/reports' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-indigo-900 text-white transform transition-transform duration-300 z-50 lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">B</div>
            <span className="text-xl font-bold tracking-tight">BMS Pro</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive ? 'bg-indigo-700 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-indigo-800 space-y-2">
            <button 
              onClick={toggleLanguage}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-200 hover:bg-indigo-800 transition"
            >
              <Globe className="w-5 h-5" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-rose-300 hover:bg-rose-900/50 hover:text-rose-100 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm z-30">
          <button 
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 lg:flex-none">
            <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">
              {menuItems.find(item => window.location.hash.endsWith(item.path))?.name || t.dashboard}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800 leading-tight">{currentUser?.name}</p>
              <p className="text-xs text-gray-500">{currentUser?.role}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-200">
              <UserIcon className="w-6 h-6" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
