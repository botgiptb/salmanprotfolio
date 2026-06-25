"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Disable smooth scrolling on the admin pages
    if (pathname?.startsWith("/admin")) return;

    const lenis = new Lenis({
      autoRaf: true, // Auto-run animation frame loops in modern versions of lenis
    });

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
