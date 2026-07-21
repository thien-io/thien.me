import { supabase } from "@/lib/supabase/client";

export interface Testimonial {
  id: string;
  name: string;
  context: string;
  quote: string;
  created_at: string;
}

export async function getVisibleTestimonials(limit?: number): Promise<Testimonial[]> {
  let query = supabase
    .from("testimonials")
    .select("id, name, context, quote, created_at")
    .eq("hidden", false)
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function insertTestimonial(input: {
  name: string;
  context: string;
  quote: string;
}): Promise<void> {
  const { error } = await supabase.from("testimonials").insert({
    name: input.name,
    context: input.context,
    quote: input.quote,
  });
  if (error) throw error;
}
