import GalleryClient from "./GalleryClient";

export const metadata = {
  title: "Photo Gallery | Littlestown Area Senior Center",
  description: "Memories and moments from our community events.",
};

export default function GalleryPage() {
  return (
    <section className="py-16 bg-orange-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-stone-900">
          Photo Gallery
        </h1>

        <GalleryClient />
      </div>
    </section>
  );
}
