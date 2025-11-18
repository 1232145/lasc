// components/Hero.tsx
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mt-4 relative h-[90vh] flex items-center justify-center text-center overflow-hidden rounded-b-3xl shadow-xl">
      <Image
        src="/images/lasc-building.jpg"
        alt="Littlestown Area Senior Center building"
        fill
        priority
        className="object-cover object-center"
      />
      {/* Enhanced layered gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-900)]/50 via-[var(--secondary-800)]/40 to-[var(--primary-800)]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--neutral-900)]/20 to-transparent" />

      {/* Enhanced text container with layered styling */}
      <div className="relative z-10 bg-white/85 backdrop-blur-md px-10 py-12 rounded-3xl shadow-2xl max-w-5xl mx-auto border border-[var(--border-accent)]/50 card-elevated">
        <h1 className="text-5xl md:text-7xl font-serif text-[var(--primary-800)] font-bold mb-6 leading-tight tracking-tight">
          Littlestown Area Senior Center
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 leading-relaxed max-w-3xl mx-auto font-medium">
          A welcoming place for older adults to connect, share, and thrive together in our warm community.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/events"
            className="btn-primary inline-flex items-center px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            See Upcoming Events
          </Link>
          <Link
            href="/about"
            className="btn-secondary inline-flex items-center px-8 py-4 text-lg font-semibold"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}
