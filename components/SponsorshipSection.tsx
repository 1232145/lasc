import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default async function SponsorshipSection() {
  const { data: sponsors, error } = await supabase
    .from("sponsorships")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
  }

  const hasSponsors = sponsors && sponsors.length > 0;

  return (
    <section
      id="sponsorships"
      className="py-20 bg-gray-50 border-t border-gray-200 scroll-mt-16"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Our Sponsors
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The Littlestown Area Senior Center is deeply grateful to our
            sponsors and community partners for their continued support.
          </p>
        </div>

        {/* Sponsors grid or CTA */}
        {hasSponsors ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow"
              >
                {sponsor.logo_url ? (
                  <div className="w-full h-24 relative mb-4">
                    <Image
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      fill
                      className="object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div className="h-24 flex items-center justify-center mb-4 text-gray-400 text-sm">
                    No Logo
                  </div>
                )}

                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {sponsor.name}
                </h3>

                {sponsor.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {sponsor.description}
                  </p>
                )}

                {sponsor.website && (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-xl shadow-sm p-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              No sponsors yet
            </h3>
            <p className="text-gray-600 mb-6">
              We’re always grateful for community support. If you or your
              organization would like to sponsor the Littlestown Area Senior
              Center, please reach out or visit our Donate page to learn more.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/donate"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
              >
                Become a Sponsor
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
