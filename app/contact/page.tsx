import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact | Littlestown Area Senior Center",
  description:
    "Get in touch with the Littlestown Area Senior Center for questions, programs, or membership information.",
};

export default function ContactPage() {
  return (
    <section className="py-16 bg-[var(--background)] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-3 text-center text-gray-800 dark:text-gray-100">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 mb-12">
          We’d love to hear from you! Please reach out with any questions,
          comments, or program inquiries.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Visit or Call
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Address:</strong> 10 Elm Street, Littlestown, PA 17340
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Phone:</strong>{" "}
              <a
                href="tel:717-359-7743"
                className="text-blue-600 hover:text-blue-700"
              >
                (717) 359-7743
              </a>
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:lascinfo@example.com"
                className="text-blue-600 hover:text-blue-700"
              >
                lascinfo@example.com
              </a>
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Hours:</strong> Mon–Fri, 8:30 AM – 4:30 PM
            </p>
          </div>

          <div className="w-full h-56 rounded-lg overflow-hidden shadow-md">
            <iframe
              title="LASC location"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6135.460688808277!2d-77.08836509999996!3d39.745707700000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c84e1dcbf72d11%3A0x823ab3b8c55fa9ad!2sLittlestown%20Area%20Senior%20Center!5e0!3m2!1sen!2sus!4v1759708939079!5m2!1sen!2sus"
            ></iframe>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
