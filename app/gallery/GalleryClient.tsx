"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { supabase } from "@/lib/supabaseClient";

const LIMIT = 9;

export default function GalleryClient() {
  const [photos, setPhotos] = useState<any[]>([]);

  const [years, setYears] = useState<number[]>([]);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);

  // fetch distinct years once

  useEffect(() => {
    async function fetchYears() {
      const { data, error } = await supabase

        .from("photos")

        .select("year")

        .order("year", { ascending: false });

      if (!error && data) {
        const uniqueYears = Array.from(
          new Set(data.map((p) => p.year).filter(Boolean))
        );

        setYears(uniqueYears);
      }
    }

    fetchYears();
  }, []);

  // fetch photos (runs whenever selectedYear or offset changes)

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);

      const query = supabase

        .from("photos")

        .select("*")

        .order("taken_at", { ascending: false })

        .range(offset, offset + LIMIT - 1);

      if (selectedYear) query.eq("year", selectedYear);

      const { data, error } = await query;

      if (error) {
        console.error("Supabase fetch error:", error.message);

        setLoading(false);

        return;
      }

      if (offset === 0) {
        setPhotos(data);
      } else {
        setPhotos((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === LIMIT);

      setLoading(false);
    }

    fetchPhotos();
  }, [selectedYear, offset]);

  function handleLoadMore() {
    setOffset((prev) => prev + LIMIT);
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const year = e.target.value === "all" ? null : Number(e.target.value);

    setSelectedYear(year);

    setOffset(0);
  }

  return (
    <>
      {/* Year filter */}

      <div className="flex justify-center mb-8">
        <select
          value={selectedYear || "all"}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-100"
        >
          <option value="all">All Years</option>

          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Gallery grid */}

      {loading && offset === 0 ? (
        <p className="text-center text-gray-600">Loading photos...</p>
      ) : photos.length === 0 ? (
        <p className="text-center text-gray-600">No photos found.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group overflow-hidden rounded-xl shadow-md"
              >
                <Image
                  src={photo.image_url}
                  alt={photo.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-64 transform group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all z-10 flex items-end justify-center">
                  <div className="text-white text-center opacity-0 group-hover:opacity-100 mb-4 px-3 transition-opacity duration-300">
                    <p className="font-medium">{photo.title}</p>
                    {photo.event_title && (
                      <p className="text-sm opacity-80">{photo.event_title}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className={`px-5 py-2 rounded-md font-medium transition-colors ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
