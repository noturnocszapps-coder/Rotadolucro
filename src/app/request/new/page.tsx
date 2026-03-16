import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants';
import { RequestForm } from '@/components/passenger/RequestForm';
import { CalendarPlus } from 'lucide-react';

export default async function NewRequestPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.LOGIN);

  return (
    <main className="min-h-screen bg-bg py-16 px-6 relative overflow-hidden selection:bg-roxou/30">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-roxou/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <header className="mb-16">
          <div className="flex items-center gap-3 text-roxou mb-4">
            <CalendarPlus className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Planejamento</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase font-display leading-[0.9]">Para onde <br /><span className="text-roxou">vamos?</span></h1>
          <p className="text-neutral-500 mt-6 text-lg font-medium leading-relaxed max-w-md">
            Preencha os detalhes do evento para que os motoristas premium da nossa rede possam te encontrar.
          </p>
        </header>

        <div className="glass-card p-10 md:p-16">
          <RequestForm />
        </div>
      </div>
    </main>
  );
}
