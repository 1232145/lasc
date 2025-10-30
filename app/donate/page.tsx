import { Metadata } from "next";
import Link from "next/link";
import { FaPaypal } from "react-icons/fa";
import { IoLogoVenmo } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Donate | Littlestown Area Senior Center",
  description:
    "Support the Littlestown Area Senior Center by donating via PayPal or Venmo.",
};

export default function DonatePage() {
  return (
    <section className="py-24 bg-gray-50 min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Support the Littlestown Area Senior Center
        </h1>
        <p className="text-gray-600 mb-10">
          Your donation helps us provide meals, activities, and vital support
          for community members 60+ in the Littlestown community.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {/* PayPal */}
          <a
            href="https://www.paypal.com/donate"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#0070BA] hover:bg-[#005C9E] text-white font-medium px-8 py-3 rounded-lg transition-colors w-full sm:w-auto"
          >
            <FaPaypal className="text-lg" />
            Donate with PayPal
          </a>

          {/* Venmo */}
          <a
            href="https://venmo.com/u/LittlestownSeniorCenter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#3D95CE] hover:bg-[#2E7BAD] text-white font-medium px-8 py-3 rounded-lg transition-colors w-full sm:w-auto"
          >
            <IoLogoVenmo className="text-lg" />
            Donate with Venmo
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-10">
          Prefer to give another way?{" "}
          <Link
            href="/#contact"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact us
          </Link>{" "}
          for other donation options.
        </p>
      </div>
    </section>
  );
}
