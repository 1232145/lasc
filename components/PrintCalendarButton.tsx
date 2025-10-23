"use client";

import { useState } from "react";

export default function PrintCalendarButton() {
  const [printing, setPrinting] = useState(false);

  const handlePrint = () => {
    const body = document.body;
    body.classList.add("calendar-print");
    setPrinting(true);

    // Print the page
    window.print();

    // After printing, remove the class
    // Use a small timeout because window.print() is blocking in most browsers,
    // but some may behave differently
    setTimeout(() => {
      body.classList.remove("calendar-print");
      setPrinting(false);
    }, 1000);
  };

  return (
    <button
      onClick={handlePrint}
      disabled={printing}
      className="print-calendar-button no-print mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      type="button"
    >
      Print Calendar
    </button>
  );
}