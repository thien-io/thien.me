import { ScrollReveal } from "@/components/scroll-reveal";

type Status = "read" | "reading" | "next";

const books: { title: string; author: string; year: number; category: string; status: Status; note: string }[] = [
  { title: "The Inner Game of Tennis",    author: "W. Timothy Gallwey",  year: 1974, category: "Sport / Psychology", status: "read",    note: "The book I recommend to every student. Changed how I think about coaching." },
  { title: "Endure",                      author: "Alex Hutchinson",     year: 2018, category: "Sport Science",      status: "read",    note: "How far can the human body really go? The answer is further than your mind allows." },
  { title: "Open",                        author: "Andre Agassi",        year: 2009, category: "Memoir",             status: "read",    note: "The most honest sports memoir I've read. He hated tennis. Complicated." },
  { title: "Atomic Habits",               author: "James Clear",         year: 2018, category: "Self-Improvement",   status: "read",    note: "Systems over goals. I apply this to how I structure training programs." },
  { title: "The Art of Learning",         author: "Josh Waitzkin",       year: 2007, category: "Sport / Mindset",    status: "read",    note: "From chess prodigy to martial arts champion. The principles transfer." },
  { title: "Bounce",                      author: "Matthew Syed",        year: 2010, category: "Sport Science",      status: "read",    note: "The myth of talent. Practice is everything. Everything." },
  { title: "Range",                       author: "David Epstein",       year: 2019, category: "Science / Thinking", status: "read",    note: "Why generalists thrive in a specialized world. Counterintuitive and convincing." },
  { title: "The Score Takes Care of Itself", author: "Bill Walsh",       year: 2009, category: "Leadership",         status: "read",    note: "Process over outcome. For coaches, for leaders, for anyone." },
  { title: "Peak",                        author: "Anders Ericsson",     year: 2016, category: "Sport Science",      status: "read",    note: "Deliberate practice explained properly. Essential for understanding how skill works." },
  { title: "Quiet",                       author: "Susan Cain",          year: 2012, category: "Psychology",         status: "read",    note: "Changed how I work with introverted students. There are more than you'd expect." },
  { title: "Finding Ultra",               author: "Rich Roll",           year: 2012, category: "Memoir",             status: "reading", note: "Midway through. A story about reinvention that hits differently at 30+." },
  { title: "The Body Keeps the Score",    author: "Bessel van der Kolk", year: 2014, category: "Psychology",         status: "next",    note: "Been on my list for two years. Finally starting it next month." },
];

const statusLabel: Record<Status, string> = {
  read: "Read",
  reading: "Reading now",
  next: "Up next",
};
const statusColor: Record<Status, string> = {
  read:    "text-muted-foreground",
  reading: "text-primary",
  next:    "text-muted-foreground/60",
};

export default function BooksPage() {
  const reading = books.filter(b => b.status === "reading");
  const read    = books.filter(b => b.status === "read");
  const next    = books.filter(b => b.status === "next");

  const BookCard = ({ book, i }: { book: typeof books[0]; i: number }) => (
    <ScrollReveal delay={i * 45}>
      <div className="p-6 border border-border rounded-md bg-card hover:border-primary/25 transition-colors group">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
              {book.title}
            </h3>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              {book.author} · {book.year} · {book.category}
            </p>
          </div>
          <span className={`font-mono text-[9px] uppercase tracking-widest shrink-0 ${statusColor[book.status]}`}>
            {statusLabel[book.status]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{book.note}</p>
      </div>
    </ScrollReveal>
  );

  return (
    <div>
      <section className="px-8 md:px-16 pt-24 pb-16 md:pt-32 md:pb-20">
        <ScrollReveal>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">Books</p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            What I'm<br /><em className="text-primary">reading.</em>
          </h1>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Mostly sport science, psychology, and memoir. Everything connects back to the court somehow.
          </p>
        </ScrollReveal>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {reading.length > 0 && (
        <section className="px-8 md:px-16 py-14">
          <ScrollReveal className="mb-8">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">Currently</p>
            <h2 className="font-display text-3xl font-light">Reading now</h2>
          </ScrollReveal>
          <div className="max-w-xl space-y-4">
            {reading.map((b, i) => <BookCard key={b.title} book={b} i={i} />)}
          </div>
        </section>
      )}

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      <section className="px-8 md:px-16 py-16">
        <ScrollReveal className="mb-8">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">Shelf</p>
          <h2 className="font-display text-3xl font-light">Already read</h2>
        </ScrollReveal>
        <div className="max-w-xl space-y-4">
          {read.map((b, i) => <BookCard key={b.title} book={b} i={i} />)}
        </div>
      </section>

      {next.length > 0 && (
        <>
          <div className="h-px bg-border/50 mx-8 md:mx-16" />
          <section className="px-8 md:px-16 py-14">
            <ScrollReveal className="mb-8">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">Queue</p>
              <h2 className="font-display text-3xl font-light">Up next</h2>
            </ScrollReveal>
            <div className="max-w-xl space-y-4">
              {next.map((b, i) => <BookCard key={b.title} book={b} i={i} />)}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
