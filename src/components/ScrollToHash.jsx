import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    // When path changes, if there's a hash, try to scroll to it.
    if (location.hash) {
      const id = location.hash.replace("#", "");
      // allow the target element to render
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // fallback to top
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 60);
    } else {
      // no hash — scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

  return null;
}
