import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function MetaPixel() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const page = pathname + search;
    if (typeof window.fbq !== "function" || window.millenniumPixelPage === page) return;
    window.fbq("track", "PageView");
    window.millenniumPixelPage = page;
  }, [pathname, search]);

  return null;
}
