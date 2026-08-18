// ==============================================================================
// app/api/admin/employees/route.ts
// Secure Server-side API Route for Inviting / Creating Employee Profiles
// Creates Supabase Auth User & records into public.employee_profiles
// ==============================================================================
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase configuration." },
        { status: 500 }
      );
    }

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      department,
      jobTitle,
      employmentStartDate,
      password,
    } = body;

    if (!email || !fullName || !password || password.trim().length < 6) {
      return NextResponse.json(
        { error: "Full Name, Email, and Password (at least 6 characters) are required." },
        { status: 400 }
      );
    }

    // 1. Create or invite user in Supabase Auth
    let authUserId: string | null = null;
    const userPassword = password.trim();

    const { data: authUser, error: createAuthError } = await adminSupabase.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: userPassword,
      email_confirm: true,
      user_metadata: {
        full_name: fullName.trim(),
        role: "employee",
      },
    });

    if (createAuthError) {
      // If user already exists in auth, retrieve them
      const { data: listData } = await adminSupabase.auth.admin.listUsers();
      const existingUser = listData?.users?.find(
        (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
      );
      if (existingUser) {
        authUserId = existingUser.id;
      } else {
        return NextResponse.json(
          { error: createAuthError.message },
          { status: 400 }
        );
      }
    } else if (authUser?.user) {
      authUserId = authUser.user.id;
    }

    if (!authUserId) {
      return NextResponse.json(
        { error: "Failed to resolve Auth user ID." },
        { status: 500 }
      );
    }

    // 2. Insert or update employee profile in public.employee_profiles
    const profilePayload = {
      auth_user_id: authUserId,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      department: department?.trim() || null,
      job_title: jobTitle?.trim() || null,
      employment_start_date: employmentStartDate || null,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    const { data: profile, error: profileError } = await adminSupabase
      .from("employee_profiles")
      .upsert(profilePayload, { onConflict: "auth_user_id" })
      .select()
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
      message: "Employee profile created successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
