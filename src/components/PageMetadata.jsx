import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { business, socialLinks } from "../config/business";

const pages = {
  "/": ["Car Rentals in Thiruvananthapuram | Millennium Group", "Explore Millennium Group car rentals in Kumarapuram, Thiruvananthapuram. Browse vehicles and enquire about daily, monthly and airport rentals."],
  "/about": ["About Millennium Group | Thiruvananthapuram Car Rentals", "Learn about Millennium Group Rent A Car in Kumarapuram, Thiruvananthapuram, Kerala."],
  "/contact": ["Contact Millennium Group | Car Rental Enquiries", "Contact Millennium Group Rent A Car for vehicle availability, rental enquiries and booking support in Thiruvananthapuram."],
  "/fleet-available": ["Available Rental Cars | Millennium Group", "Browse available rental vehicles from Millennium Group in Thiruvananthapuram and enquire about your preferred dates."],
};

export default function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = pages[pathname];
    const [title, description] = page || ["Millennium Group", "Millennium Group Rent A Car."];
    const origin = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
    const url = `${origin}${pathname}`;
    document.title = title;
    const meta = (key, content, attribute = "name") => {
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };
    meta("description", description);
    meta("robots", page ? "index,follow" : "noindex,nofollow");
    meta("og:title", title, "property");
    meta("og:description", description, "property");
    meta("og:url", url, "property");
    meta("og:type", "website", "property");
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
    let schema = document.getElementById("business-schema");
    if (!schema) {
      schema = document.createElement("script");
      schema.id = "business-schema";
      schema.type = "application/ld+json";
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "AutoRental",
      "@id": `${origin}/#business`,
      name: business.name,
      url: origin,
      email: business.email,
      telephone: business.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "1st Floor, Capital Tower, Kumarapuram",
        addressLocality: "Thiruvananthapuram",
        addressRegion: "Kerala",
        postalCode: "695011",
        addressCountry: "IN",
      },
      sameAs: socialLinks.map(({ url }) => url),
    });
  }, [pathname]);
  return null;
}
