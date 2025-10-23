import ContactForm from "@/components/ContactForm";

export default function ContactSection() {
    return (
      <section
        id="contact"
        className="py-20 bg-gray-50 border-t border-gray-200 scroll-mt-16"
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Contact Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We’d love to hear from you or see you at the center. Whether you’d
              like to join, volunteer, or just stop by — you’re always welcome.
            </p>
          </div>

          {/* Contact Form */}
          <ContactForm />
  
          {/* Grid layout */}
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Info card */}
            <div className="bg-white shadow-md rounded-xl p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Littlestown Area Senior Center
              </h3>
  
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Address:</strong>{" "}
                  <span className="block">
                    10 East Locust Street, Littlestown, PA 17340
                  </span>
                </li>
  
                <li>
                  <strong>Phone:</strong>{" "}
                  <a
                    href="tel:717-359-7743"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    (717) 359-7743
                  </a>
                </li>
  
                <li>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:lascinfo@example.com"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    lascinfo@example.com
                  </a>
                </li>
  
                <li>
                  <strong>Hours:</strong> Mon–Fri, 8:00 AM – 12:30 PM
                </li>
  
                <li>
                  <strong>Meetings:</strong> 1st Wednesday of each month at 11:00
                  AM
                </li>
              </ul>
            </div>
  
            {/* Map */}
            <div className="w-full h-72 md:h-80 rounded-xl overflow-hidden shadow-md border border-gray-100">
              <iframe
                title="LASC location"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d766.9325861208231!2d-77.08900883034137!3d39.7457076982222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c84e1dcbf72d11%3A0x823ab3b8c55fa9ad!2sLittlestown%20Area%20Senior%20Center!5e0!3m2!1sen!2sus!4v1760628703687!5m2!1sen!2sus"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    );
  }
  