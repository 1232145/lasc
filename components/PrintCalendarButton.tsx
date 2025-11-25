"use client";

import { useState } from "react";

export default function PrintCalendarButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePrint = async () => {
    setIsLoading(true);
    
    // Add class to body for print-specific styling
    document.body.classList.add("calendar-print");
    
    try {
      // Small delay to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Trigger print
      window.print();
    } finally {
      // Remove the print class after printing
      document.body.classList.remove("calendar-print");
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePrint}
      disabled={isLoading}
      className="btn-secondary print-calendar-button no-print mb-4 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Preparing..." : "🖨️ Print Calendar"}
    </button>
  );
}