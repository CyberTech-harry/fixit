import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const normalizedEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    // Default admin credentials
    const validEmails = ["admin@itknowledgebase.io", "admin@cybertech.io", "admin", "lead@itknowledgebase.io"];
    const validPasswords = ["admin123", "cybertech2026", "admin", "password123"];

    const isEmailValid = validEmails.includes(normalizedEmail);
    const isPasswordValid = validPasswords.includes(cleanPassword);

    if (isEmailValid && isPasswordValid) {
      const user = {
        id: "user-admin",
        name: "IT Lead Administrator",
        email: "admin@itknowledgebase.io",
        role: "ADMIN",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        token: `session_${Date.now()}_admin_sec_token`,
        loginTime: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        user,
        message: "Authentication successful",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid email or master security password. Use demo credentials or contact Lead DevOps.",
      },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Authentication service error" },
      { status: 500 }
    );
  }
}
