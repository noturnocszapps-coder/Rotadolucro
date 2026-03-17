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
  Calculator,
  Instagram,
  Truck
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/work-logs', icon: ClipboardList, label: 'Registros' },
  { path: '/freight-calculator', icon: Truck, label: 'Frete' },
  { path: '/simulator', icon: Calculator, label: 'Simulador' },
  { path: '/relatorios', icon: BarChart3, label: 'Relatórios' },
  { path: '/expenses', icon: Receipt, label: 'Gastos' },
  { path: '/settings', icon: Settings, label: 'Ajustes' },
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
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-white tracking-tight">RotaLucro</h1>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-black border border-emerald-500/20 uppercase tracking-widest">
              Alpha
            </span>
            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-tighter">v1.0.6</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 h-screen sticky top-0 shrink-0">
      <div className="p-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white tracking-tight">RotaLucro</h1>
          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-black border border-emerald-500/20 uppercase tracking-widest">
            Alpha
          </span>
        </div>
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-2">Premium Platform</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 font-bold shadow-lg shadow-emerald-500/5" 
                  : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-200"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-zinc-800/50">
        <div className="space-y-4">
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            Desenvolvido por
          </div>
          <a 
            href="https://www.ntaplicacoes.com.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors group"
          >
            <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
              <Instagram size={14} />
            </div>
            <span className="text-xs font-bold">NT Aplicações</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export const Footer = () => {
  return (
    <footer className="py-8 border-t border-zinc-800/50">
      <div className="flex justify-center items-center text-center">
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">© 2026 RotaLucro</p>
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
        <main className="flex-1 p-4 md:p-8 pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto">
            <Outlet />
            <div className="mt-12 md:mt-20">
              <Footer />
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};
