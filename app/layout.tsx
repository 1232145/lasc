import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BodyClassToggle from "@/components/BodyClassToggle"; // adjust path
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Littlestown Area Senior Center",
  description: "Community and connection for older adults in Littlestown, PA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <BodyClassToggle />
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
