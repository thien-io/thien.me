import type { Metadata } from "next";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxSection } from "@/components/parallax-section";
import { TestimonialCard } from "@/components/testimonial-card";
import { TestimonialForm } from "@/components/testimonial-form";
import { getVisibleTestimonials } from "@/lib/supabase/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What players I've coached have to say about their time on court.",
};

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const testimonials = await getVisibleTestimonials();

  return (
    <div>
      <section className="relative px-8 md:px-16 pt-28 pb-14 md:pt-32 md:pb-20 overflow-hidden">

        <div className="relative z-10">
          <ScrollReveal>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">
              Testimonials
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
              What players<br /><em className="text-primary">say.</em>
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-16">
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {testimonials.map((t) => (
              <ScrollReveal key={t.id}>
                <TestimonialCard testimonial={t} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mb-16">
            No testimonials yet — be the first to share your experience.
          </p>
        )}
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-16">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">
          Share yours
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-8">
          Leave a testimonial.
        </h2>
        <TestimonialForm />
      </section>
    </div>
  );
}
