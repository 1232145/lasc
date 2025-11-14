import { supabase } from "@/lib/supabaseClient";
import { ExternalLink } from "lucide-react";

export const metadata = {
  title: "Resources | Littlestown Area Senior Center",
  description:
    "Helpful links, programs, and services for community members 60+ in the Littlestown area.",
};

export default async function ResourcesPage() {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("category", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
    return (
      <section className="py-16 text-center text-gray-600">
        <p>Unable to load resources right now. Please try again later.</p>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="py-16 text-center text-gray-600">
        <p>No resources available yet.</p>
      </section>
    );
  }

  // group by category
  const grouped = data.reduce((acc: any, resource: any) => {
    const cat = resource.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(resource);
    return acc;
  }, {});

  return (
    <section className="py-16 bg-[var(--background)] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-3 text-center text-gray-800">
          Community Resources
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Helpful links and programs for older adults in the Littlestown area.
        </p>

        {Object.entries(grouped).map(([category, resources]: any) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b border-gray-300 pb-2">
              {category}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {resources.map((res: any) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white p-6 group"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                      {res.title}
                    </h3>
                    <ExternalLink
                      className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors"
                      strokeWidth={1.8}
                    />
                  </div>
                  {res.description && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                      {res.description}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
