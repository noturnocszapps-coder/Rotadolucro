import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Receipt, 
  Fuel, 
  Wrench, 
  BarChart3, 
  Settings,
  Target,
  Instagram
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/work-logs', icon: ClipboardList, label: 'Registros' },
  { path: '/expenses', icon: Receipt, label: 'Gastos' },
  { path: '/fuel', icon: Fuel, label: 'Combustível' },
  { path: '/goals', icon: Target, label: 'Metas' },
  { path: '/settings', icon: Settings, label: 'Configurações' },
];

export const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-lg border-t border-zinc-800 px-2 py-2 flex justify-around items-center z-50 md:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-1 rounded-lg transition-colors",
              isActive ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <item.icon size={20} />
            <span className="text-[9px] mt-1 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export const Header = () => {
  return (
    <header className="bg-zinc-950 border-b border-zinc-800 p-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">RotaLucro</h1>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
              Alpha
            </span>
            <span className="text-zinc-500 text-[10px] font-medium">Version 1.0</span>
          </div>
        </div>
        <p className="text-[10px] text-zinc-500 leading-tight">
          Aplicativo em desenvolvimento, estamos em teste Alpha, podendo haver bugs e erros.
        </p>
      </div>
    </header>
  );
};

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 h-screen sticky top-0 shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">RotaLucro</h1>
          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
            Alpha
          </span>
        </div>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Version 1.0</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 font-medium" 
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-zinc-800">
        <div className="text-[10px] text-zinc-500 space-y-2">
          <p className="leading-tight">Aplicativo em desenvolvimento, estamos em teste Alpha, podendo haver bugs e erros.</p>
          <p>
            Desenvolvido por{' '}
            <a 
              href="https://instagram.com/onoturnocsz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline"
            >
              @onoturnocsz
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
};

export const Footer = () => {
  return (
    <footer className="p-8 border-t border-zinc-800 mt-auto text-center md:text-left">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xs text-zinc-500 max-w-xs">
          <p>Aplicativo em desenvolvimento, estamos em teste Alpha, podendo haver bugs e erros.</p>
          <p className="mt-2">© 2026 RotaLucro. Version 1.0</p>
        </div>
        <div className="text-sm text-zinc-500">
          <p>
            Desenvolvido por{' '}
            <a 
              href="https://instagram.com/onoturnocsz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline font-medium"
            >
              <span className="flex items-center gap-1"><Instagram size={14} /> @onoturnocsz</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export const Layout = () => {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <Header />
        <main className="flex-1 pb-24 md:pb-8 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
};
