import { supabase } from "@/lib/supabaseClient";

export default async function AboutSection() {
  const { data: board, error } = await supabase
    .from("board_members")
    .select("*")
    .eq('status', 'visible')
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Supabase error:", error.message);
  }

  return (
    <section
      id="about"
      className="py-20 bg-white border-t border-gray-100 scroll-mt-16"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            About the Center
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The Littlestown Area Senior Center has been serving older adults in
            Littlestown Borough and surrounding townships since 1975 — providing
            meals, transportation, social activities, and connection for the
            community.
          </p>
        </div>

        {/* History Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Our History
          </h3>
          <div className="space-y-2 text-gray-700 leading-relaxed">
            <p>
              The Senior Center of Littlestown was established in 1975 as a
              program for senior citizens of the Littlestown Borough and the
              townships of Germany, Mt. Joy, Mt. Pleasant, and Union. It began
              with the support of the Office of Aging, renting space at
              Centenary United Methodist Church Hall.
            </p>
            <p>
              In 1983, the center sought a permanent home and was incorporated
              as a non-profit organization. By September 1985, the Board
              purchased the building at <strong>10 E Locust Street</strong>, and
              renovations began under the direction of John Jacobs in January
              1986.
            </p>
            <p>
              The grand opening was held in May 1986 in celebration of Senior
              Citizens Month — featuring a ribbon cutting on May 1st at 11:30 AM
              and an Open House on May 4th. That summer, the Office of Aging
              approved installation of central air conditioning, improving the
              center’s comfort for members and guests.
            </p>
          </div>
        </div>

        {/* Dynamic Board of Directors */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Board of Directors
          </h3>

          {board && board.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
              {board.map((member) => (
                <div key={member.id}>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Board information coming soon.</p>
          )}
        </div>
      </div>
    </section>
  );
}
