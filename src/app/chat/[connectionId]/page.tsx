import { createClient } from '@/lib/supabase-server';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { notFound, redirect } from 'next/navigation';
import { ROUTES } from '@/constants';

interface ChatPageProps {
  params: Promise<{
    connectionId: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { connectionId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.LOGIN);

  // 1. Fetch connection and verify access
  const { data: connection, error: connError } = await supabase
    .from('connections')
    .select(`
      id,
      passenger_id,
      driver_id,
      passenger:profiles!passenger_id(full_name),
      driver:profiles!driver_id(full_name)
    `)
    .eq('id', connectionId)
    .single();

  if (connError || !connection) notFound();

  const isPassenger = connection.passenger_id === user.id;
  const isDriver = connection.driver_id === user.id;

  if (!isPassenger && !isDriver) redirect(ROUTES.HOME);

  // 2. Fetch initial message history
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('connection_id', connectionId)
    .order('created_at', { ascending: true });

  const otherPartyName = isPassenger 
    ? (connection.driver as any).full_name 
    : (connection.passenger as any).full_name;
  const otherPartyId = isPassenger ? connection.driver_id : connection.passenger_id;
  const otherPartyRole = isPassenger ? 'driver' : 'passenger';

  return (
    <main className="min-h-screen bg-bg py-12 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-roxou/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-roxou/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <ChatRoom 
          connectionId={connectionId}
          currentUserId={user.id}
          otherPartyId={otherPartyId}
          otherPartyName={otherPartyName}
          otherPartyRole={otherPartyRole as any}
          initialMessages={messages || []}
        />
        
        <div className="mt-12 text-center">
          <p className="text-[9px] text-neutral-700 max-w-md mx-auto uppercase tracking-[0.3em] font-black leading-relaxed">
            Esta conversa está sendo gravada para fins de segurança e moderação. 
            Nunca compartilhe dados bancários ou senhas no chat.
          </p>
        </div>
      </div>
    </main>
  );
}
