import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/contexts/ToastContext";
import { ConfirmationProvider } from "@/contexts/ConfirmationContext";
import type { Metadata } from "next";
import CenterClosedPopup from "@/components/CenterClosedPopup";

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
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        <ToastProvider>
          <ConfirmationProvider>
            <Navbar />
            <CenterClosedPopup />
            <main>{children}</main>
            <Footer />
          </ConfirmationProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
