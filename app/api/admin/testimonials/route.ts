import { NextResponse } from "next/server";
import {
  listAllTestimonials,
  setTestimonialHidden,
  deleteTestimonial,
} from "@/lib/supabase/testimonials-admin";

function isAuthorized(request: Request): boolean {
  const secret = request.headers.get("x-admin-secret");
  return typeof secret === "string" && secret.length > 0 && secret === process.env.ADMIN_SECRET;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  const testimonials = await listAllTestimonials();
  return NextResponse.json({ testimonials });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const { id, hidden } = (body ?? {}) as Record<string, unknown>;
  if (typeof id !== "string" || typeof hidden !== "boolean") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  await setTestimonialHidden(id, hidden);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const { id } = (body ?? {}) as Record<string, unknown>;
  if (typeof id !== "string") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  await deleteTestimonial(id);
  return NextResponse.json({ ok: true });
}
