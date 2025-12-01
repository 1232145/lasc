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
      className="py-20 bg-amber-50 border-t border-orange-200 scroll-mt-16 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-stone-900 mb-3">
            Our Sponsors
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
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
                className="card bg-white rounded-xl shadow-lg border border-orange-200 p-6 text-center hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300"
              >
                {sponsor.logo_url && (
                  <div className="w-full h-24 relative mb-4">
                    <Image
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      fill
                      className="object-contain mx-auto"
                    />
                  </div>
                )}

                <h3 className="font-semibold text-lg text-stone-900 mb-1">
                  {sponsor.name}
                </h3>

                {sponsor.description && (
                  <p className="text-sm text-stone-600 mb-3 line-clamp-3 leading-relaxed">
                    {sponsor.description}
                  </p>
                )}

                {sponsor.website && (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-800 text-sm font-medium transition-colors"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white border border-orange-200 rounded-xl shadow-lg p-10">
            <h3 className="text-xl font-semibold text-stone-900 mb-3">
              No sponsors yet
            </h3>
            <p className="text-stone-600 mb-6 leading-relaxed">
              We're always grateful for community support. If you or your
              organization would like to sponsor the Littlestown Area Senior
              Center, please reach out or visit our Donate page to learn more.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/donate"
                className="btn-primary bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
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
