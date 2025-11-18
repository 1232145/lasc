export default function Footer() {
    return (
      <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)] py-8 mt-20 text-center text-[var(--text-tertiary)] shadow-[var(--shadow-sm)]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-base font-medium mb-2">
            © {new Date().getFullYear()} Littlestown Area Senior Center. All rights reserved.
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            10 E Locust Street, Littlestown, PA 17340 · (717) 359-7743
          </p>
        </div>
      </footer>
    );
  }
