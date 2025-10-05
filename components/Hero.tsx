import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center px-4 py-16 md:py-24 gap-10">
        <div className="md:w-1/2">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            Welcome to the Littlestown Area Senior Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            A vibrant community supporting seniors through social connection,
            activities, and lifelong learning.
          </p>
          <Link
            href="/events"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
          >
            See Upcoming Events
          </Link>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/window.svg"
            alt="Community at Littlestown Area Senior Center"
            width={400}
            height={400}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
