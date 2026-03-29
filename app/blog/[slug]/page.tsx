import { getAllPosts, getPost } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

function renderMdx(content: string) {
  // Simple markdown-to-HTML renderer for MDX content
  const lines = content.split("\n");
  const html: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h2>${line.slice(3)}</h2>`);
    } else if (line.startsWith("### ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h3>${line.slice(4)}</h3>`);
    } else if (line.startsWith("- ")) {
      if (!inList) { html.push("<ul>"); inList = true; }
      html.push(`<li>${line.slice(2)}</li>`);
    } else if (line.trim() === "") {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push("");
    } else {
      if (inList) { html.push("</ul>"); inList = false; }
      // inline formatting
      const formatted = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`(.+?)`/g, "<code>$1</code>");
      html.push(`<p>${formatted}</p>`);
    }
  }
  if (inList) html.push("</ul>");
  return html.join("\n");
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = getPost(params.slug);
  } catch {
    notFound();
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });

  const bodyHtml = renderMdx(post.content);

  return (
    <div>
      {/* Header */}
      <section className="px-8 md:px-16 pt-24 pb-12 md:pt-32 md:pb-16 max-w-2xl">
        <Link
          href="/blog"
          className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 mb-10"
        >
          ← Blog
        </Link>

        <div className="flex gap-1.5 mb-6">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-light leading-tight mb-4 text-foreground">
          {post.title}
        </h1>
        <p className="font-mono text-[11px] text-muted-foreground tracking-wide">
          {formatDate(post.date)}
        </p>
      </section>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Body */}
      <article className="px-8 md:px-16 py-14 max-w-2xl">
        <div
          className="prose-thien"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </article>

      <div className="h-px bg-border/50 mx-8 md:mx-16" />

      {/* Footer nav */}
      <section className="px-8 md:px-16 py-12">
        <Link
          href="/blog"
          className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          ← All posts
        </Link>
      </section>
    </div>
  );
}
