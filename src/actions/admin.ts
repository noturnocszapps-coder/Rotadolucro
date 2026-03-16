'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { ROLES, DRIVER_STATUS } from '@/constants';

/**
 * VERIFY ADMIN
 * Utility to ensure the current user is an admin.
 */
async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado");

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== ROLES.ADMIN) {
    throw new Error("Acesso negado: Apenas administradores podem realizar esta ação.");
  }

  return { supabase, user };
}

/**
 * GET DRIVERS BY STATUS
 */
export async function getDriversByStatus(status: string) {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, driver_status, created_at, updated_at')
    .eq('role', ROLES.DRIVER)
    .eq('driver_status', status)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * GET ADMIN STATS
 * Fetches counts for all driver statuses in a single call.
 */
export async function getAdminStats() {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from('profiles')
    .select('driver_status')
    .eq('role', ROLES.DRIVER);

  if (error) throw error;

  const stats = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  data.forEach((profile: any) => {
    if (profile.driver_status === DRIVER_STATUS.PENDING) stats.pending++;
    else if (profile.driver_status === DRIVER_STATUS.APPROVED) stats.approved++;
    else if (profile.driver_status === DRIVER_STATUS.REJECTED) stats.rejected++;
  });

  return stats;
}

/**
 * GET DRIVER DETAIL
 */
export async function getDriverDetail(id: string) {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('role', ROLES.DRIVER)
    .single();

  if (error) throw error;
  return data;
}

/**
 * UPDATE DRIVER APPLICATION
 * Approves or rejects a driver and adds internal notes.
 */
export async function updateDriverApplication(
  driverId: string, 
  status: typeof DRIVER_STATUS[keyof typeof DRIVER_STATUS], 
  notes: string
) {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from('profiles')
    .update({ 
      driver_status: status,
      admin_notes: notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', driverId);

  if (error) throw error;

  revalidatePath('/admin/dashboard');
  revalidatePath(`/admin/drivers/${driverId}`);
  return { success: true };
}
