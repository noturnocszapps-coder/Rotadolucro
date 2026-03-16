import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { ROUTES, ROLES, DRIVER_STATUS } from '@/constants';
import { DriverConnectionCard } from '@/components/dashboard/DriverConnectionCard';
import { LeadCard } from '@/components/driver/LeadCard';
import { Car, Zap, MessageSquare, Search } from 'lucide-react';
import Link from 'next/link';

export default async function DriverDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.LOGIN);

  // 1. Fetch user profile to verify role and status
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, driver_status')
    .eq('id', user.id)
    .single();

  if (profile?.role !== ROLES.DRIVER) redirect(ROUTES.PASSENGER_DASHBOARD);
  if (profile?.driver_status !== DRIVER_STATUS.APPROVED) redirect(ROUTES.DRIVER_ONBOARDING);

  // 2. Fetch active connections (My Chats)
  const { data: connections } = await supabase
    .from('connections')
    .select(`
      id,
      created_at,
      passenger:profiles!passenger_id(full_name),
      request:transport_requests(status, description)
    `)
    .eq('driver_id', user.id)
    .order('created_at', { ascending: false });

  // 3. Fetch available leads (Open requests user hasn't connected to)
  // Note: In a real app, we'd filter out requests the driver already connected to.
  // For MVP, we'll just show all open requests.
  const { data: leads } = await supabase
    .from('transport_requests')
    .select('*')
    .eq('status', 'open')
    .neq('user_id', user.id) // Don't show own requests if any
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <main className="min-h-screen bg-bg py-12 px-6 relative overflow-hidden selection:bg-roxou/30">
      {/* Background Glow */}
      <div className="fixed bottom-0 left-0 w-[700px] h-[700px] bg-roxou/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20">
          <div className="flex items-center gap-3 text-roxou mb-4">
            <Car className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Painel do Motorista</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase font-display leading-[0.9]">Central de <br /><span className="text-roxou">Operações</span></h1>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Active Chats Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 font-display">
                <MessageSquare className="w-6 h-6 text-roxou" />
                Conversas
              </h2>
              <span className="bg-roxou/10 text-roxou-light px-3 py-1 rounded-xl text-[10px] font-black border border-roxou/20">
                {connections?.length || 0}
              </span>
            </div>

            {connections && connections.length > 0 ? (
              <div className="grid gap-3">
                {connections.map((conn) => (
                  <DriverConnectionCard key={conn.id} connection={conn as any} />
                ))}
              </div>
            ) : (
              <div className="p-14 text-center glass-card border-dashed border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Silêncio no rádio...</p>
              </div>
            )}
          </div>

          {/* Leads Section */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 font-display">
                <Zap className="w-6 h-6 text-amber-500" />
                Oportunidades
              </h2>
              <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-black uppercase tracking-widest bg-white/[0.02] px-4 py-2 rounded-full border border-white/5">
                <Search className="w-4 h-4" />
                Filtrar Leads
              </div>
            </div>

            {leads && leads.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {leads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
            ) : (
              <div className="p-32 text-center glass-card border-dashed border-white/5">
                <div className="w-20 h-20 bg-white/[0.02] rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/5">
                  <Zap className="w-10 h-10 text-neutral-800" />
                </div>
                <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">Não há novos leads disponíveis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
