// ==============================================================================
// app/api/admin/users/route.ts
// Secure Server-side API Route for Administrative Users (GET & POST)
// Queries auth.users emails securely via Supabase Auth Admin API
// ==============================================================================
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Missing Supabase configuration." }, { status: 500 });
    }

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Fetch auth users securely using service role admin client
    const { data: authData, error: authError } = await adminSupabase.auth.admin.listUsers();
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const emailMap = new Map<string, string>();
    authData.users.forEach((u) => {
      if (u.id && u.email) emailMap.set(u.id, u.email);
    });

    // 2. Fetch profiles with roles
    const { data: profileData, error: profileError } = await adminSupabase
      .from("admin_profiles")
      .select("*, admin_user_roles(role_id, roles(id, name, description))");

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    // 3. Merge real auth.users email into profiles
    const mergedProfiles = (profileData ?? []).map((prof: any) => ({
      ...prof,
      email: emailMap.get(prof.id) || prof.email || "",
    }));

    return NextResponse.json({ users: mergedProfiles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch users." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, roleId, isActive = true } = body;

    if (!email || !fullName || !roleId) {
      return NextResponse.json(
        { error: "Full Name, Email, and Role selection are required." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase environment variables are missing." },
        { status: 500 }
      );
    }

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Generate random secure temporary password
    const tempPassword = `P@ss_${Math.random().toString(36).substring(2, 10)}!${Date.now()}`;

    // 1. Create Auth User using Supabase Auth Admin API
    const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

    if (authError || !authUser.user) {
      // If user already exists in auth, find existing auth user
      const { data: listData } = await adminSupabase.auth.admin.listUsers();
      const existingUser = listData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

      if (!existingUser) {
        return NextResponse.json({ error: authError?.message || "Failed to create Auth User." }, { status: 400 });
      }

      const userId = existingUser.id;

      // 2. Create or Update admin_profiles record
      await adminSupabase.from("admin_profiles").upsert({
        id: userId,
        full_name: fullName,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      });

      // 3. Assign selected role in admin_user_roles table
      await adminSupabase.from("admin_user_roles").upsert({
        user_id: userId,
        role_id: roleId,
      });

      // 4. Send password recovery/setup email
      await adminSupabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${new URL(request.url).origin}/auth/callback?type=recovery`,
      });

      return NextResponse.json({
        success: true,
        user: { id: userId, email, fullName, roleId },
      });
    }

    const userId = authUser.user.id;

    // 2. Create admin_profiles record
    await adminSupabase.from("admin_profiles").insert({
      id: userId,
      full_name: fullName,
      is_active: isActive,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // 3. Assign selected role in admin_user_roles table
    await adminSupabase.from("admin_user_roles").insert({
      user_id: userId,
      role_id: roleId,
    });

    // 4. Send password setup email
    try {
      await adminSupabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${new URL(request.url).origin}/auth/callback?type=recovery`,
      });
    } catch {
      // Non-blocking password reset trigger
    }

    return NextResponse.json({
      success: true,
      user: { id: userId, email, fullName, roleId },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error during user creation." },
      { status: 500 }
    );
  }
}
