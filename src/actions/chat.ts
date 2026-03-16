'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

/**
 * SEND MESSAGE ACTION
 * Securely inserts a message into the database.
 * RLS on the 'messages' table will ensure the user is part of the connection.
 */
export async function sendMessage(connectionId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autorizado");
  if (!content.trim()) throw new Error("Mensagem vazia");

  // 1. Verify connection exists and user is part of it
  const { data: connection, error: connError } = await supabase
    .from('connections')
    .select('id, passenger_id, driver_id')
    .eq('id', connectionId)
    .single();

  if (connError || !connection) throw new Error("Conexão não encontrada");
  
  const isParticipant = connection.passenger_id === user.id || connection.driver_id === user.id;
  if (!isParticipant) throw new Error("Você não faz parte desta conversa");

  // 2. Insert message
  const { error: msgError } = await supabase
    .from('messages')
    .insert({
      connection_id: connectionId,
      sender_id: user.id,
      content: content.trim()
    });

  if (msgError) throw msgError;

  // We don't necessarily need to revalidate path if we're using Realtime on the client,
  // but it's good practice for the initial load.
  return { success: true };
}
