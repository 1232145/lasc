import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-[var(--background)] border-b border-gray-200 sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="text-xl font-semibold text-gray-800 hover:text-blue-700 transition-colors"
        >
          Littlestown Area Senior Center
        </Link>

        <div className="flex flex-wrap gap-5 mt-2 md:mt-0 text-gray-700 font-medium items-center">
          <Link
            href="/"
            className="hover:text-blue-700 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/events"
            className="hover:text-blue-700 transition-colors"
          >
            Events
          </Link>

          <Link
            href="/calendar"
            className="hover:text-blue-700 transition-colors"
          >
            Calendar
          </Link>

          <Link
            href="/gallery"
            className="hover:text-blue-700 transition-colors"
          >
            Gallery
          </Link>

          <Link
            href="/resources"
            className="hover:text-blue-700 transition-colors"
          >
            Resources
          </Link>

          <Link href="/#contact" className="hover:text-blue-700">
            Contact
          </Link>

          <Link
            href="/donate"
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Donate
          </Link>

          <Link
            href="/admin"
            className="text-gray-600 hover:text-blue-700 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
