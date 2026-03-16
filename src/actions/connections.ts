'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ROUTES, ROLES, DRIVER_STATUS } from '@/constants';

/**
 * UPDATE REQUEST STATUS
 * Allows passengers to mark their requests as filled, closed, or cancelled.
 */
export async function updateRequestStatus(requestId: string, status: 'open' | 'filled' | 'cancelled') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autorizado");

  const { error } = await supabase
    .from('transport_requests')
    .update({ status })
    .eq('id', requestId)
    .eq('user_id', user.id); // Security: only owner can update

  if (error) throw error;

  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * CONNECT TO REQUEST
 * Initiates a connection between a driver and a passenger request.
 * This is the "handshake" that unlocks the chat.
 */
export async function connectToRequest(requestId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.LOGIN);

  // 1. Verify driver is approved
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, driver_status')
    .eq('id', user.id)
    .single();

  if (profile?.role !== ROLES.DRIVER || profile?.driver_status !== DRIVER_STATUS.APPROVED) {
    throw new Error("Apenas motoristas aprovados podem se conectar a leads.");
  }

  // 2. Create connection
  const { data: request } = await supabase
    .from('transport_requests')
    .select('user_id, status')
    .eq('id', requestId)
    .single();

  if (!request) throw new Error("Solicitação não encontrada.");
  if (request.status !== 'open') throw new Error("Esta solicitação não está mais disponível.");

  const { data: connection, error } = await supabase
    .from('connections')
    .insert({
      request_id: requestId,
      driver_id: user.id,
      passenger_id: request.user_id
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new Error("Você já demonstrou interesse nesta corrida.");
    throw error;
  }

  revalidatePath(ROUTES.DRIVER_DASHBOARD);
  redirect(ROUTES.CHAT(connection.id));
}
