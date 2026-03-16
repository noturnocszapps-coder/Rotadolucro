import { getDriversByStatus, getAdminStats } from '@/actions/admin';
import { DRIVER_STATUS } from '@/constants';
import Link from 'next/link';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const currentStatus = params.status || DRIVER_STATUS.PENDING;
  
  // Fetch data in parallel
  const [drivers, stats] = await Promise.all([
    getDriversByStatus(currentStatus),
    getAdminStats()
  ]);

  return (
    <main className="min-h-screen bg-bg py-12 px-6 relative overflow-hidden selection:bg-roxou/30">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-roxou/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20">
          <div className="flex items-center gap-3 text-roxou mb-4">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Painel de Controle</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase font-display leading-[0.9] mb-10">Gestão de <br /><span className="text-roxou">Motoristas</span></h1>
          
          <nav className="flex items-center gap-10 border-b border-white/5">
            <Link 
              href="/admin/dashboard" 
              className="pb-5 text-[11px] font-black uppercase tracking-widest text-roxou border-b-2 border-roxou transition-all"
            >
              Aprovações
            </Link>
            <Link 
              href="/admin/reports" 
              className="pb-5 text-[11px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-all"
            >
              Denúncias
            </Link>
          </nav>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Link 
            href="?status=pending"
            className={`p-8 rounded-[32px] transition-all duration-500 group ${
              currentStatus === DRIVER_STATUS.PENDING 
                ? 'glass-card border-roxou/40 bg-roxou/5 shadow-2xl shadow-roxou/10' 
                : 'glass-card border-white/5 hover:border-roxou/20'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-amber-500/5 rounded-[24px] flex items-center justify-center text-amber-500 border border-amber-500/10 group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">Pendentes</p>
                <p className="text-4xl font-black text-white font-display">{stats.pending}</p>
              </div>
            </div>
          </Link>

          <Link 
            href="?status=approved"
            className={`p-8 rounded-[32px] transition-all duration-500 group ${
              currentStatus === DRIVER_STATUS.APPROVED 
                ? 'glass-card border-roxou/40 bg-roxou/5 shadow-2xl shadow-roxou/10' 
                : 'glass-card border-white/5 hover:border-roxou/20'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500/5 rounded-[24px] flex items-center justify-center text-emerald-400 border border-emerald-500/10 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">Aprovados</p>
                <p className="text-4xl font-black text-white font-display">{stats.approved}</p>
              </div>
            </div>
          </Link>

          <Link 
            href="?status=rejected"
            className={`p-8 rounded-[32px] transition-all duration-500 group ${
              currentStatus === DRIVER_STATUS.REJECTED 
                ? 'glass-card border-roxou/40 bg-roxou/5 shadow-2xl shadow-roxou/10' 
                : 'glass-card border-white/5 hover:border-roxou/20'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-rose-500/5 rounded-[24px] flex items-center justify-center text-rose-400 border border-rose-500/10 group-hover:scale-110 transition-transform">
                <XCircle className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">Rejeitados</p>
                <p className="text-4xl font-black text-white font-display">{stats.rejected}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Drivers List */}
        <div className="glass-card overflow-hidden">
          <div className="p-10 border-b border-white/5 bg-white/[0.01]">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 font-display">
              <Users className="w-7 h-7 text-roxou" />
              {currentStatus === DRIVER_STATUS.PENDING ? 'Aguardando Revisão' : 
               currentStatus === DRIVER_STATUS.APPROVED ? 'Motoristas Ativos' : 'Aplicações Recusadas'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-10 py-6 text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Motorista</th>
                  <th className="px-10 py-6 text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Email</th>
                  <th className="px-10 py-6 text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Solicitação</th>
                  <th className="px-10 py-6 text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {drivers.length > 0 ? (
                  drivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-roxou/[0.02] transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white/[0.03] rounded-2xl flex items-center justify-center text-sm font-black text-neutral-500 group-hover:bg-roxou group-hover:text-white transition-all duration-500 border border-white/5 group-hover:border-roxou/20">
                            {driver.full_name?.charAt(0)}
                          </div>
                          <span className="font-black text-white uppercase tracking-tight text-sm font-display">{driver.full_name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-xs text-neutral-400 font-bold">{driver.email}</td>
                      <td className="px-10 py-8 text-xs text-neutral-400 font-bold">
                        {new Date(driver.updated_at || driver.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-10 py-8 text-right">
                        <Link 
                          href={`/admin/drivers/${driver.id}`}
                          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-roxou hover:text-white transition-colors bg-roxou/5 px-4 py-2 rounded-xl border border-roxou/10 hover:bg-roxou"
                        >
                          Revisar <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-40 text-center">
                      <div className="w-20 h-20 bg-white/[0.02] rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/5">
                        <Users className="w-10 h-10 text-neutral-800" />
                      </div>
                      <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">Nenhum motorista encontrado</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
