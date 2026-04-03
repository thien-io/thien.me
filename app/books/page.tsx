import { ScrollReveal } from "@/components/scroll-reveal";
import { ParallaxSection } from "@/components/parallax-section";

type Status = "read" | "reading" | "next";

const books: {
  title: string; author: string; year: number;
  category: string; status: Status; note: string;
}[] = [
  // ── Currently reading ──
  { title: "The Name of the Wind",       author: "Patrick Rothfuss",      year: 2007, category: "Fantasy",             status: "reading", note: "Kvothe's voice is unlike anything else in fantasy. I keep reading past midnight." },
  { title: "Finding Ultra",              author: "Rich Roll",             year: 2012, category: "Memoir",              status: "reading", note: "A story about reinvention that hits differently at 30+." },

  // ── Tennis shelf ──
  { title: "Open",                       author: "Andre Agassi",          year: 2009, category: "Memoir / Tennis",     status: "read",    note: "The most honest sports memoir I've read. He hated tennis. Complicated and brilliant." },
  { title: "The Inner Game of Tennis",   author: "W. Timothy Gallwey",    year: 1974, category: "Sport / Psychology",  status: "read",    note: "The book I give every student. Changed how I think about coaching." },
  { title: "Bounce",                     author: "Matthew Syed",          year: 2010, category: "Sport Science",       status: "read",    note: "The myth of talent. Practice is everything — this book proves it." },
  { title: "The Art of Learning",        author: "Josh Waitzkin",         year: 2007, category: "Sport / Mindset",     status: "read",    note: "From chess to martial arts. The principles of deep practice transfer everywhere." },
  { title: "Breaking Back",             author: "James Blake",           year: 2007, category: "Memoir / Tennis",     status: "read",    note: "Blake's comeback story is one of the most remarkable in the sport." },
  { title: "Acing It",                  author: "Judy Murray",           year: 2018, category: "Coaching / Tennis",   status: "read",    note: "Everything you need to know about teaching the game to beginners." },

  // ── Fiction ──
  { title: "The Lord of the Rings",      author: "J.R.R. Tolkien",        year: 1954, category: "Fantasy",             status: "read",    note: "Read it three times. Different book every time. The appendices are not optional." },
  { title: "Harry Potter (series)",      author: "J.K. Rowling",          year: 1997, category: "Fantasy",             status: "read",    note: "Grew up with these. They shaped more than just my reading." },
  { title: "Pachinko",                   author: "Min Jin Lee",            year: 2017, category: "Historical Fiction",  status: "read",    note: "Four generations of one family. Devastating and beautiful in equal measure." },
  { title: "The Hunger Games (trilogy)", author: "Suzanne Collins",        year: 2008, category: "Dystopian Fiction",   status: "read",    note: "Still one of the best YA series ever written. Katniss is a great protagonist." },

  // ── Non-fiction / Ideas ──
  { title: "Educated",                   author: "Tara Westover",         year: 2018, category: "Memoir",              status: "read",    note: "Extraordinary. The definition of an unreliable narrator done right." },
  { title: "How to Talk to Anyone",      author: "Leil Lowndes",          year: 1998, category: "Communication",       status: "read",    note: "Surprisingly not cheesy. Changed how I open sessions with new students." },
  { title: "Outliers",                   author: "Malcolm Gladwell",      year: 2008, category: "Science / Ideas",     status: "read",    note: "The 10,000 hours idea. Oversimplified in pop culture, more nuanced in the book." },
  { title: "Sapiens",                    author: "Yuval Noah Harari",     year: 2011, category: "History / Ideas",     status: "read",    note: "A history of everything. Made me feel small and fascinated simultaneously." },
  { title: "Atomic Habits",              author: "James Clear",           year: 2018, category: "Self-Improvement",    status: "read",    note: "Systems over goals. I apply this to how I structure training plans." },
  { title: "Range",                      author: "David Epstein",         year: 2019, category: "Science / Thinking",  status: "read",    note: "Why generalists thrive. Counterintuitive and convincing." },
  { title: "Peak",                       author: "Anders Ericsson",       year: 2016, category: "Sport Science",       status: "read",    note: "Deliberate practice explained properly. The foundation under everything I teach." },
  { title: "The Score Takes Care of Itself", author: "Bill Walsh",        year: 2009, category: "Leadership",          status: "read",    note: "Process over outcome. For coaches, leaders, anyone building something." },
  { title: "Quiet",                      author: "Susan Cain",            year: 2012, category: "Psychology",          status: "read",    note: "Changed how I work with introverted students. There are more than you'd expect." },
  { title: "When Breath Becomes Air",    author: "Paul Kalanithi",        year: 2016, category: "Memoir",              status: "read",    note: "Finished it on a plane. Could not stop crying. Read it anyway." },
  { title: "Surely You're Joking, Mr. Feynman!", author: "Richard Feynman", year: 1985, category: "Memoir / Science", status: "read",    note: "Curiosity as a way of life. Every page is delightful." },
  { title: "The Midnight Library",       author: "Matt Haig",             year: 2020, category: "Fiction",             status: "read",    note: "Simple premise, quietly profound. Good for a down week." },

  // ── Up next ──
  { title: "The Body Keeps the Score",   author: "Bessel van der Kolk",   year: 2014, category: "Psychology",          status: "next",    note: "Been on the list for two years. Starting next month for real this time." },
  { title: "Endure",                     author: "Alex Hutchinson",       year: 2018, category: "Sport Science",       status: "next",    note: "How far can the human body actually go? The answer is: further than your mind." },
  { title: "The Wise Man's Fear",        author: "Patrick Rothfuss",      year: 2011, category: "Fantasy",             status: "next",    note: "Book 2 of Kingkiller. Right after I finish book 1." },
];

const statusLabel: Record<Status, string> = { read: "Read", reading: "Reading now", next: "Up next" };
const statusColor: Record<Status, string> = {
  read:    "text-muted-foreground",
  reading: "text-primary",
  next:    "text-muted-foreground/50",
};

export default function BooksPage() {
  const reading = books.filter(b => b.status === "reading");
  const read    = books.filter(b => b.status === "read");
  const next    = books.filter(b => b.status === "next");

  const BookCard = ({ book, i }: { book: typeof books[0]; i: number }) => (
    <ScrollReveal delay={i * 35}>
      <div className="p-5 border border-border rounded-xl bg-card hover:border-primary/25 transition-colors group">
        <div className="flex items-start justify-between gap-4 mb-1.5">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
              {book.title}
            </h3>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              {book.author} · {book.year} · {book.category}
            </p>
          </div>
          <span className={`font-mono text-[9px] uppercase tracking-widest shrink-0 pt-0.5 ${statusColor[book.status]}`}>
            {statusLabel[book.status]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{book.note}</p>
      </div>
    </ScrollReveal>
  );

  const Section = ({ title, sub, items }: { title: string; sub: string; items: typeof books }) => (
    <section className="px-8 md:px-16 py-14">

      <ScrollReveal className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">{sub}</p>
        <h2 className="font-display text-3xl font-light">{title}</h2>
      </ScrollReveal>
      <div className="max-w-xl space-y-3">
        {items.map((b, i) => <BookCard key={b.title} book={b} i={i} />)}
      </div>
    </section>
  );

  return (
    <div>
      <section className="relative px-8 md:px-16 pt-28 pb-10 md:pt-32 md:pb-20 overflow-hidden">
        <ParallaxSection
          speed={0.12}
          className="absolute inset-0 flex items-start justify-end pointer-events-none select-none pr-6 md:pr-12 pt-12 overflow-hidden"
        >
          <span
            className="font-display text-[22vw] font-light leading-none whitespace-nowrap opacity-[0.03]"
          >
            read
          </span>
        </ParallaxSection>

        <div className="relative z-10">
        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">Books</p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            What I'm<br /><em className="text-primary">reading.</em>
          </h1>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Sport science, fiction, memoir, ideas. Some I loved, some I just needed to finish. All worth something.
          </p>
        </ScrollReveal>
        </div>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <Section title="Reading now" sub="Currently" items={reading} />
      <div className="h-px bg-border/50 mx-8 md:mx-16" />
      <Section title="Already read" sub="Shelf" items={read} />
      <div className="h-px bg-border/50 mx-8 md:mx-16" />
      <Section title="Up next" sub="Queue" items={next} />
    </div>
  );
}
