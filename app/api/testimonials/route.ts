import { NextResponse } from "next/server";
import { insertTestimonial } from "@/lib/supabase/testimonials";

const MAX_LENGTHS = { name: 80, context: 120, quote: 600 };

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, context, quote, website } = body as Record<string, unknown>;

  // Honeypot: bots fill hidden fields, real visitors never see this one.
  if (typeof website === "string" && website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const nameOk = typeof name === "string" && name.trim().length >= 1 && name.length <= MAX_LENGTHS.name;
  const contextOk = typeof context === "string" && context.trim().length >= 1 && context.length <= MAX_LENGTHS.context;
  const quoteOk = typeof quote === "string" && quote.trim().length >= 1 && quote.length <= MAX_LENGTHS.quote;

  if (!nameOk || !contextOk || !quoteOk) {
    return NextResponse.json(
      { error: "Please fill out all fields within the length limits." },
      { status: 400 }
    );
  }

  try {
    await insertTestimonial({
      name: (name as string).trim(),
      context: (context as string).trim(),
      quote: (quote as string).trim(),
    });
  } catch (err) {
    console.error("Failed to insert testimonial", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
