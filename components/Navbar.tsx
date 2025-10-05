import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-[var(--background)] border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="text-xl font-semibold text-gray-800 hover:text-blue-700 transition-colors"
        >
          Littlestown Area Senior Center
        </Link>

        <div className="flex flex-wrap gap-4 mt-2 md:mt-0 text-gray-700 font-medium">
          <Link href="/events" className="hover:text-blue-700">
            Events
          </Link>
          <a href="/calendar" className="hover:text-blue-600 transition-colors">
            Calendar
          </a>
          <Link href="/photos" className="hover:text-blue-700">
            Photos
          </Link>
          <Link href="/resources" className="hover:text-blue-700">
            Resources
          </Link>
          <Link href="/contact" className="hover:text-blue-700">
            Contact
          </Link>
          <Link
            href="/donate"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Donate
          </Link>
        </div>
      </div>
    </nav>
  );
}
