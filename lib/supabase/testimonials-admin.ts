import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Testimonial } from "@/lib/supabase/testimonials";

export interface AdminTestimonial extends Testimonial {
  hidden: boolean;
}

export async function listAllTestimonials(): Promise<AdminTestimonial[]> {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select("id, name, context, quote, hidden, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function setTestimonialHidden(id: string, hidden: boolean): Promise<void> {
  const { error } = await supabaseAdmin.from("testimonials").update({ hidden }).eq("id", id);
  if (error) throw error;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}
