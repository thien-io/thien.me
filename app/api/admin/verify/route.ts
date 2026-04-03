import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const secret = process.env.ADMIN_SECRET;
    if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 500 });
    if (password !== secret) return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
