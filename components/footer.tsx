export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="w-full max-w-5xl mx-auto px-8 md:px-16 py-12 flex items-center justify-center text-muted-foreground">
        <span className="font-mono text-[11px] uppercase tracking-widest flex items-center gap-3" suppressHydrationWarning>
          <span>thien.me</span>
          <span>© {new Date().getFullYear()}</span>
        </span>
      </div>
    </footer>
  );
}
