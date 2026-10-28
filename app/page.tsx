import { Hero } from "@/components/home/hero";
import { Courts } from "@/components/home/courts";
import { Messages } from "@/components/home/messages";
import { About, BookBand, Questions, Rates } from "@/components/home/sections";
import { Stage, StageProvider } from "@/components/home/stage";
import { getVisibleTestimonials, type Testimonial } from "@/lib/supabase/testimonials";
import type { PhotoId } from "@/lib/site";

export const dynamic = "force-dynamic";

const STAGE_PHOTOS: PhotoId[] = ["twinView", "twinCourt", "stillwater", "indoorHard", "clayPark", "indoorClub", "net", "twinLakes", "twinEvening"];

export default async function Home() {
  let testimonials: Testimonial[] = [];
  try {
    testimonials = await getVisibleTestimonials(12);
  } catch {
    // The page still works if the messages database is unreachable.
  }

  return (
    <>
      <Hero />
      <StageProvider initial="twinView">
        <div className="lg:grid lg:grid-cols-[47%_53%]">
          <aside
            aria-hidden
            className="sticky top-[var(--header-h)] hidden h-[calc(100svh-var(--header-h))] self-start pb-5 pl-5 lg:block"
          >
            <Stage photos={STAGE_PHOTOS} />
          </aside>
          <div data-reading-column className="min-w-0">
            <About />
            <Courts />
            <Rates />
            <Messages testimonials={testimonials} />
            <Questions />
          </div>
        </div>
      </StageProvider>
      <BookBand />
    </>
  );
}
