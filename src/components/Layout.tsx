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
  { path: '/dashboard', icon: LayoutDashboard, label: 'Início' },
  { path: '/work-logs', icon: ClipboardList, label: 'Registros' },
  { path: '/expenses', icon: Receipt, label: 'Gastos' },
  { path: '/fuel', icon: Fuel, label: 'Combustível' },
  { path: '/maintenance', icon: Wrench, label: 'Manutenção' },
  { path: '/reports', icon: BarChart3, label: 'Relatórios' },
  { path: '/goals', icon: Target, label: 'Metas' },
  { path: '/settings', icon: Settings, label: 'Ajustes' },
];

export const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-2 py-1 flex justify-around items-center z-50 md:hidden">
      {navItems.slice(0, 5).map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-colors",
              isActive ? "text-emerald-500" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 h-screen sticky top-0 shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-emerald-500 tracking-tight">RotaLucro</h1>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Alpha Version 1.0</p>
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
                  ? "bg-emerald-500/10 text-emerald-500 font-medium" 
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
        <div className="text-[10px] text-zinc-500 space-y-1">
          <p>Version 1.0</p>
          <p className="leading-tight">Aplicativo em desenvolvimento, estamos em teste Alpha, podendo haver bugs e erros.</p>
          <p className="pt-2">
            Desenvolvido por{' '}
            <a 
              href="https://instagram.com/onoturnocsz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-500 hover:underline"
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
    <footer className="p-8 border-t border-zinc-800 mt-auto text-center md:text-left hidden md:block">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-zinc-500">
          <p>© 2026 RotaLucro. Todos os direitos reservados.</p>
          <p className="text-xs mt-1">Version 1.0 - Alpha</p>
        </div>
        <div className="text-sm text-zinc-500">
          <p>
            Desenvolvido por{' '}
            <a 
              href="https://instagram.com/onoturnocsz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-500 hover:underline font-medium"
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
        <main className="flex-1 pb-24 md:pb-0">
          <Outlet />
        </main>
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
};
