import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { ROUTES, ROLES } from '@/constants';
import { OnboardingForm } from '@/components/driver/OnboardingForm';
import { Car } from 'lucide-react';

export default async function DriverOnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.LOGIN);

  // Fetch profile and driver status
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, driver_status')
    .eq('id', user.id)
    .single();

  if (profile?.role !== ROLES.DRIVER) {
    // If not a driver, maybe they want to become one? 
    // For now, redirect to passenger dashboard if they are a passenger
    if (profile?.role === ROLES.PASSENGER) redirect(ROUTES.PASSENGER_DASHBOARD);
  }

  return (
    <main className="min-h-screen bg-bg py-12 px-6 relative overflow-hidden selection:bg-roxou/30">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-roxou/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <header className="text-center mb-16">
          <div className="w-20 h-20 bg-white/[0.03] rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl">
            <Car className="w-10 h-10 text-roxou" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase font-display">Seja um Motorista <span className="text-roxou">Roxou</span></h1>
          <p className="text-neutral-500 max-w-md mx-auto font-bold text-sm uppercase tracking-widest leading-relaxed">
            Complete seu cadastro para começar a operar nos melhores eventos da cidade.
          </p>
        </header>

        <div className="glass-card p-1">
          <OnboardingForm 
            initialStatus={profile?.driver_status as any} 
            userEmail={user.email || ''} 
          />
        </div>
      </div>
    </main>
  );
}
