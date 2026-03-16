import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { ROLES } from '@/constants';

/**
 * ADMIN BOOTSTRAP API
 * Usage: POST /api/admin/bootstrap with secret key
 * Purpose: One-time setup for the first production admin.
 */
export async function POST(request: Request) {
  try {
    const { secret, email } = await request.json();

    // In production, this should be a complex secret set in env
    const bootstrapSecret = process.env.ADMIN_BOOTSTRAP_SECRET;
    
    if (!bootstrapSecret || secret !== bootstrapSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    
    // Update the profile to admin role
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: ROLES.ADMIN })
      .eq('email', email)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: `User ${email} is now an ADMIN.`,
      user: data 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
