import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.LOGIN);

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, onboarding_completed')
    .eq('id', user.id)
    .single();

  const isCompleted = profile?.onboarding_completed || (profile?.full_name && profile?.phone);

  if (!isCompleted) {
    redirect(ROUTES.ONBOARDING);
  }

  return (
    <main className="min-h-screen bg-bg py-12 px-6 relative overflow-hidden selection:bg-primary/30">
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <DashboardContent userName={profile?.full_name || 'Usuário'} />
      </div>
    </main>
  );
}
