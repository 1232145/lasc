"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const LIMIT = 9;

export default function GalleryClient() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  // fetch distinct years from photo dates automatically
  useEffect(() => {
    async function fetchYears() {
      const { data, error } = await supabase
        .from("photos")
        .select("taken_at, created_at")
        .order("taken_at", { ascending: false });

      if (!error && data) {
        const uniqueYears = Array.from(
          new Set(
            data
              .map((photo) => {
                // Use taken_at if available, otherwise fall back to created_at
                const dateToUse = photo.taken_at || photo.created_at;
                if (dateToUse) {
                  return new Date(dateToUse).getFullYear();
                }
                return null;
              })
              .filter((year) => year !== null)
          )
        ).sort((a, b) => b - a); // Sort descending (newest first)
        
        setYears(uniqueYears);
      }
    }

    fetchYears();
  }, []);

  // fetch photos (runs whenever selectedYear or offset changes)
  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);

      // Fetch all photos first, then filter client-side for more reliable results
      let query = supabase
        .from("photos")
        .select("*")
        .order("taken_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Supabase fetch error:", error.message);
        setLoading(false);
        return;
      }

      let filteredData = data;

      // Filter by year if selected
      if (selectedYear) {
        filteredData = data.filter((photo) => {
          // Use taken_at if available, otherwise fall back to created_at
          const dateToUse = photo.taken_at || photo.created_at;
          if (dateToUse) {
            const photoYear = new Date(dateToUse).getFullYear();
            return photoYear === selectedYear;
          }
          return false;
        });
      }

      // Apply pagination to filtered results
      const startIndex = offset;
      const endIndex = offset + LIMIT;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      if (offset === 0) {
        setPhotos(paginatedData);
      } else {
        setPhotos((prev) => [...prev, ...paginatedData]);
      }

      setHasMore(endIndex < filteredData.length);
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

  function openModal(photo: any) {
    const index = photos.findIndex(p => p.id === photo.id);
    setSelectedPhoto(photo);
    setCurrentPhotoIndex(index);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    setSelectedPhoto(null);
    setCurrentPhotoIndex(0);
    document.body.style.overflow = 'unset';
  }

  function navigatePhoto(direction: 'prev' | 'next') {
    const newIndex = direction === 'prev' 
      ? (currentPhotoIndex - 1 + photos.length) % photos.length
      : (currentPhotoIndex + 1) % photos.length;
    
    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  }

  // Close modal on escape key and handle arrow navigation
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (!selectedPhoto) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          navigatePhoto('prev');
          break;
        case 'ArrowRight':
          navigatePhoto('next');
          break;
      }
    }
    
    if (selectedPhoto) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedPhoto, currentPhotoIndex, photos]);

  return (
    <>
      {/* Year filter */}
      <div className="flex justify-center mb-8">
        <select
          value={selectedYear || "all"}
          onChange={handleFilterChange}
          className="border border-orange-300 bg-white text-stone-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-colors"
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
        <p className="text-center text-stone-600">Loading photos...</p>
      ) : photos.length === 0 ? (
        <p className="text-center text-stone-600">No photos found.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group overflow-hidden rounded-xl shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => openModal(photo)}
              >
                {photo.image_url ? (
                  <Image
                    src={photo.image_url}
                    alt={photo.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-64 transform group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-stone-500 rounded-xl">
                    No Image
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 to-orange-900/0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-end justify-center">
                  <div className="text-white text-center mb-4 px-3">
                    <p className="font-semibold text-lg">{photo.title}</p>
                    {photo.event_title && (
                      <p className="text-sm opacity-90">{photo.event_title}</p>
                    )}
                  </div>
                </div>

                {/* Click indicator */}
                <div className="absolute top-3 right-3 bg-black/20 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Modal with Navigation */}
          {selectedPhoto && (
            <div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <div className="relative max-w-7xl max-h-full flex items-center">
                {/* Previous Button */}
                {photos.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigatePhoto('prev');
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors duration-200 backdrop-blur-sm"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}

                {/* Next Button */}
                {photos.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigatePhoto('next');
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors duration-200 backdrop-blur-sm"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute -top-12 right-0 text-white hover:text-orange-300 transition-colors z-10"
                  aria-label="Close modal"
                >
                  <X size={32} />
                </button>

                {/* Photo Counter */}
                {photos.length > 1 && (
                  <div className="absolute -top-12 left-0 text-white text-sm bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm">
                    {currentPhotoIndex + 1} of {photos.length}
                  </div>
                )}
                
                <Image
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.title}
                  width={1200}
                  height={800}
                  className="object-contain max-h-[90vh] max-w-full"
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-white text-xl font-semibold mb-2">{selectedPhoto.title}</h3>
                  {selectedPhoto.event_title && (
                    <p className="text-white/90 text-sm mb-1">Event: {selectedPhoto.event_title}</p>
                  )}
                  {selectedPhoto.description && (
                    <p className="text-white/80 text-sm">{selectedPhoto.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className={`btn-primary px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                  loading
                    ? "bg-stone-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white transform hover:scale-105 shadow-lg"
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