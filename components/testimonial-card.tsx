import type { Testimonial } from "@/lib/supabase/testimonials";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="p-6 border border-border rounded-xl bg-card h-full flex flex-col">
      <p className="font-display text-lg md:text-xl font-light text-foreground leading-relaxed mb-4 flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
        {testimonial.name}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
        {testimonial.context}
      </p>
    </div>
  );
}
