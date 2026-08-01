import type { Testimonial } from "@/lib/supabase/testimonials";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="p-6 rounded-md border border-border bg-card transition-colors hover:border-primary/50 h-full flex flex-col">
      <p className="text-lg md:text-xl text-foreground leading-relaxed mb-4 flex-1">
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
