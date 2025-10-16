"use client";

import Image from "next/image";

export default function EventCard({ event }: { event: any }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      {event.image_url && (
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      {/* TEST - This should definitely show up */}
      <div className="bg-red-500 text-white p-4 text-center font-bold">
        TEST: IF YOU SEE THIS, THE COMPONENT IS RENDERING
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>

      <p className="text-gray-600 mb-1 text-lg">
        {event.date
          ? new Date(event.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })
          : "Date TBD"}
      </p>

      {event.location && (
        <p className="text-gray-500 mb-4">📍 {event.location}</p>
      )}

      <p className="text-gray-700 mb-6 leading-relaxed text-lg">
        {event.description || "Join us for this community event!"}
      </p>

      {/* TEST - This should definitely show up */}
      <div className="bg-red-500 text-white p-4 text-center font-bold">
        TEST: IF YOU SEE THIS, THE COMPONENT IS RENDERING
      </div>

      <button className="w-full bg-blue-700 text-white py-3 rounded-md mt-4">
        TEST BUTTON
      </button>
    </div>
  );
}
