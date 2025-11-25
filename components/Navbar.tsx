import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-[var(--bg-elevated)]/95 border-b border-[var(--border-secondary)] sticky top-0 z-50 backdrop-blur-lg supports-[backdrop-filter]:bg-[var(--bg-elevated)]/90 shadow-[var(--shadow-sm)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="text-[var(--text-accent)] hover:text-[var(--primary-800)] transition-colors brand-text group self-center md:self-start"
        >
          <div className="flex flex-col items-center md:items-start leading-tight text-center md:text-left">
            <span className="text-xl font-bold tracking-tight">Littlestown Area</span>
            <span className="text-lg font-semibold text-[var(--primary-600)] group-hover:text-[var(--primary-700)] transition-colors tracking-wide ml-2">&nbsp;Senior Center</span>
          </div>
        </Link>

        <div className="flex flex-wrap gap-6 mt-4 md:mt-0 text-[var(--text-secondary)] font-medium items-center justify-center md:justify-end">
          <Link
            href="/"
            className="hover:text-[var(--text-accent)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--bg-secondary)] text-sm font-medium"
          >
            Home
          </Link>
          <Link
            href="/events"
            className="hover:text-[var(--text-accent)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--bg-secondary)] text-sm font-medium"
          >
            Events
          </Link>
          <Link
            href="/calendar"
            className="hover:text-[var(--text-accent)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--bg-secondary)] text-sm font-medium"
          >
            Calendar
          </Link>
          <Link
            href="/gallery"
            className="hover:text-[var(--text-accent)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--bg-secondary)] text-sm font-medium"
          >
            Gallery
          </Link>
          <Link
            href="/resources"
            className="hover:text-[var(--text-accent)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--bg-secondary)] text-sm font-medium"
          >
            Resources
          </Link>
          <Link 
            href="/#contact" 
            className="hover:text-[var(--text-accent)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--bg-secondary)] text-sm font-medium"
          >
            Contact
          </Link>
          <Link
            href="/donate"
            className="btn-accent text-sm px-1 py-0.5 font-medium"
          >
            Donate
          </Link>
          <Link
            href="/admin"
            className="text-[var(--text-muted)] hover:text-[var(--text-accent)] transition-colors text-sm px-2 py-1 rounded-lg hover:bg-[var(--bg-surface)]"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
