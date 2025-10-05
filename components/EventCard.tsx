export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  image_url?: string;
}

export default function EventCard({ event }: { event: Event }) {
  const formattedDate = new Date(event.date).toLocaleDateString();

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition">
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}

      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-2">{formattedDate}</p>
      {event.location && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          📍 {event.location}
        </p>
      )}
      <p className="text-gray-700 dark:text-gray-200">{event.description}</p>
    </div>
  );
}
