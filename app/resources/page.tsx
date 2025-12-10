import ResourcesClient from "./ResourcesClient";

export const metadata = {
  title: "Resources | Littlestown Area Senior Center",
  description:
    "Helpful links, programs, and services for community members 60+ in the Littlestown area.",
};

export default function ResourcesPage() {
  return (
    <section className="py-16 bg-orange-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-3 text-center text-stone-900">
          Community Resources
        </h1>
        <p className="text-center text-stone-600 mb-12">
          Helpful links and programs for community members 60+ in the Littlestown area.
        </p>

        <ResourcesClient />
      </div>
    </section>
  );
}
