"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ExternalLink } from "lucide-react";

export default function ResourcesClient() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("resources")
          .select("*")
          .order("category", { ascending: true })
          .order("title", { ascending: true });

        if (fetchError) {
          console.error("Supabase error:", fetchError.message);
          setError("Unable to load resources right now. Please try again later.");
          return;
        }

        setResources(data || []);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError("Unable to load resources right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        <p className="mt-4 text-stone-600">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-stone-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-16 text-stone-600">
        <p>No resources available yet.</p>
      </div>
    );
  }

  // group by category
  const grouped = resources.reduce((acc: any, resource: any) => {
    const cat = resource.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(resource);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(grouped).map(([category, categoryResources]: any) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-stone-800 border-b border-orange-300 pb-2">
            {category}
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {categoryResources.map((res: any) => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card block border border-orange-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white p-6 group hover:transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-stone-900 group-hover:text-orange-600 transition-colors">
                    {res.title}
                  </h3>
                  <ExternalLink
                    className="w-4 h-4 text-stone-500 group-hover:text-orange-600 transition-colors"
                    strokeWidth={1.8}
                  />
                </div>
                {res.description && (
                  <p className="text-sm text-stone-600 mt-3 line-clamp-3">
                    {res.description}
                  </p>
                )}
              </a>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
