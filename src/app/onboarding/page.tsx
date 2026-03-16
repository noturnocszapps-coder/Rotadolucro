import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants';
import { OnboardingContent } from '@/components/onboarding/OnboardingContent';
import { Package } from 'lucide-react';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.LOGIN);

  // Fetch profile to check if already completed
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed, full_name, phone')
    .eq('id', user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect(ROUTES.DASHBOARD);
  }

  return (
    <main className="min-h-screen bg-bg py-12 px-6 relative overflow-hidden selection:bg-primary/30">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <header className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-2xl">
            <Package className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase font-display leading-none">
            Configuração <span className="text-primary">Inicial</span>
          </h1>
          <p className="text-neutral-500 max-w-md mx-auto font-bold text-sm uppercase tracking-widest leading-relaxed">
            Personalize sua experiência no RotaLucro para maximizar seus resultados.
          </p>
        </header>

        <div className="glass-card p-1">
          <OnboardingContent 
            initialName={profile?.full_name || ''} 
            initialPhone={profile?.phone || ''} 
          />
        </div>
      </div>
    </main>
  );
}
