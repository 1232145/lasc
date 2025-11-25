// components/Hero.tsx
import { readdir } from 'fs/promises';
import Image from "next/image";
import Link from "next/link";
import path from 'path';

// Function to get all hero images dynamically
async function getHeroImages() {
  try {
    const imagesDirectory = path.join(process.cwd(), 'public/images/hero-images');
    const files = await readdir(imagesDirectory);
    
    // Filter for image files and return with proper paths
    return files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => `/images/hero-images/${file}`);
  } catch (error) {
    console.error('Error loading hero images:', error);
    return [];
  }
}

export default async function Hero() {
  const heroImages = await getHeroImages();
  
  // Calculate grid size dynamically based on number of images
  const totalImages = heroImages.length;
  const gridSize = totalImages < 20 ? 6 : totalImages < 40 ? 8 : 10;
  const totalTiles = gridSize * Math.ceil(gridSize * 0.7); // Roughly 70% height ratio
  
  // Create mosaic tiles with repetitions if needed
  const mosaicTiles = Array.from({ length: totalTiles }, (_, index) => 
    heroImages[index % heroImages.length] || '/images/hero-images/placeholder.jpg'
  );

  // Dynamic grid classes based on calculated size
  const gridCols = `grid-cols-${gridSize}`;
  const gridRows = `grid-rows-${Math.ceil(gridSize * 0.7)}`;

  return (
    <section className="mt-4 relative h-[90vh] overflow-hidden rounded-b-3xl shadow-xl">
      {/* Dynamic Grid Mosaic */}
      <div 
        className={`absolute inset-0 grid gap-0`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${Math.ceil(gridSize * 0.7)}, 1fr)`
        }}
      >
        {mosaicTiles.map((imagePath, index) => (
          <div
            key={index}
            className="relative group overflow-hidden"
          >
            <Image
              src={imagePath}
              alt={`Community member ${(index % heroImages.length) + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              priority={index < gridSize * 2}
              sizes={`${100 / gridSize}vw`}
            />
          </div>
        ))}
      </div>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Centered content */}
      <div className="relative z-20 h-full flex items-center justify-center px-6">
        <div className="bg-white/75 backdrop-blur-md px-12 py-14 rounded-3xl shadow-2xl max-w-5xl mx-auto border border-white/50">
          <h1 className="text-5xl md:text-7xl font-bold text-[var(--primary-800)] mb-6 leading-tight tracking-tight text-center">
            Littlestown Area<br />
            <span className="text-[var(--primary-600)]">Senior Center</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 leading-relaxed max-w-3xl mx-auto font-medium text-center">
            A welcoming place where our community's seniors connect, share stories, and create lasting friendships together.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/events"
              className="btn-primary inline-flex items-center px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              See Upcoming Events
            </Link>
            <Link
              href="/gallery"
              className="btn-secondary inline-flex items-center px-8 py-4 text-lg font-semibold"
            >
              View Our Community
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
