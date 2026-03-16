'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { ROLES, REPORT_STATUS, MODERATION_ACTIONS } from '@/constants';

/**
 * VERIFY ADMIN
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
    throw new Error("Acesso negado");
  }

  return { supabase, user };
}

/**
 * CREATE REPORT
 * Allows any authenticated user to report another user.
 */
export async function createReport(payload: {
  reported_id: string;
  reason: string;
  details?: string;
  context_type: 'chat' | 'connection' | 'request';
  context_id: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Você precisa estar logado para denunciar.");

  const { error } = await supabase
    .from('reports')
    .insert({
      reporter_id: user.id,
      reported_id: payload.reported_id,
      reason: payload.reason,
      details: payload.details,
      context_type: payload.context_type,
      context_id: payload.context_id,
      status: REPORT_STATUS.PENDING
    });

  if (error) throw error;

  return { success: true };
}

/**
 * GET REPORTS (Admin only)
 */
export async function getReports(status?: string) {
  const { supabase } = await verifyAdmin();

  let query = supabase
    .from('reports')
    .select(`
      *,
      reporter:profiles!reporter_id(full_name, email),
      reported:profiles!reported_id(full_name, email)
    `)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * GET REPORT DETAIL (Admin only)
 */
export async function getReportDetail(id: string) {
  const { supabase } = await verifyAdmin();

  const { data: report, error } = await supabase
    .from('reports')
    .select(`
      *,
      reporter:profiles!reporter_id(*),
      reported:profiles!reported_id(*),
      moderation_logs(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  // Fetch context based on type
  let contextData = null;
  if (report.context_type === 'chat' || report.context_type === 'connection') {
    const { data } = await supabase
      .from('connections')
      .select(`
        *,
        request:transport_requests(*),
        messages:chat_messages(*)
      `)
      .eq('id', report.context_id)
      .single();
    contextData = data;
  } else if (report.context_type === 'request') {
    const { data } = await supabase
      .from('transport_requests')
      .select('*')
      .eq('id', report.context_id)
      .single();
    contextData = data;
  }

  return { report, contextData };
}

/**
 * RESOLVE REPORT (Admin only)
 */
export async function resolveReport(payload: {
  report_id: string;
  action: typeof MODERATION_ACTIONS[keyof typeof MODERATION_ACTIONS];
  notes: string;
}) {
  const { supabase, user: admin } = await verifyAdmin();

  // 1. Create moderation log
  const { error: logError } = await supabase
    .from('moderation_logs')
    .insert({
      report_id: payload.report_id,
      admin_id: admin.id,
      action: payload.action,
      notes: payload.notes
    });

  if (logError) throw logError;

  // 2. Update report status
  const { error: reportError } = await supabase
    .from('reports')
    .update({ 
      status: payload.action === MODERATION_ACTIONS.RESOLVE ? REPORT_STATUS.RESOLVED : REPORT_STATUS.DISMISSED 
    })
    .eq('id', payload.report_id);

  if (reportError) throw reportError;

  // 3. If action is BLOCK, update user profile
  if (payload.action === MODERATION_ACTIONS.BLOCK) {
    const { data: report } = await supabase
      .from('reports')
      .select('reported_id')
      .eq('id', payload.report_id)
      .single();
    
    if (report) {
      await supabase
        .from('profiles')
        .update({ is_blocked: true })
        .eq('id', report.reported_id);
    }
  }

  revalidatePath('/admin/reports');
  revalidatePath(`/admin/reports/${payload.report_id}`);
  return { success: true };
}
