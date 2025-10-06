// components/Hero.tsx
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mt-4 relative h-[90vh] flex items-center justify-center text-center overflow-hidden rounded-b-3xl shadow-sm">
      <Image
        src="/images/lasc-building.jpg"
        alt="Littlestown Area Senior Center building"
        fill
        priority
        className="object-cover object-center"
      />
      {/* subtle blue filter for depth */}
      <div className="absolute inset-0 bg-blue-900/30" />

      {/* text container with translucent background */}
      <div className="relative z-10 bg-white/40 backdrop-blur-sm px-6 py-8 rounded-xl shadow-md max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-blue-900 font-semibold mb-3 leading-tight">
          Littlestown Area Senior Center
        </h1>
        <p className="text-base md:text-lg text-gray-700 mb-6">
          A welcoming place for older adults to connect, share, and thrive.
        </p>
        <Link
          href="/events"
          className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-md shadow-sm transition-colors"
        >
          See Upcoming Events
        </Link>
      </div>
    </section>
  );
}
