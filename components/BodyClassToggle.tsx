"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function BodyClassToggle() {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;
    const className = "calendar-print";

    if (pathname === "/calendar") {
      body.classList.add(className);
    } else {
      body.classList.remove(className);
    }

    // Clean up on unmount or pathname change
    return () => {
      body.classList.remove(className);
    };
  }, [pathname]);

  return null; // No UI needed
}