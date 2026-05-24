import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const res = await auth.api.signInEmail({
      body: {
        email: "admin@vidi.store",
        password: "Admin@123"
      },
      asResponse: true
    });
    
    // Convert Response to text
    const text = await res.text();
    return NextResponse.json({ success: true, status: res.status, body: text });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}
