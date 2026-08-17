import {
  Car,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const quickLinks = [
    "Home",
    "About Us",
    "Fleet-Available",
    "How it Works",
    "Blog",
    "Contact",
  ];
  const toForItem = (item) => {
    if (item === "Home") return "/";
    if (item === "About Us") return "/about";
    if (item === "Contact") return "/contact";
    return `/#${item.toLowerCase().replace(/\s+/g, "-")}`;
  };

  return (
    <footer id="contact" className="bg-gray-900 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#E53E3E] p-2.5 rounded-xl">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Millennium</span>
            </div>
            <p className="text-gray-500 leading-relaxed mb-6 max-w-sm">
              Your trusted partner for affordable and secure car rentals.
              Premium vehicles, exceptional service, unbeatable prices.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-gray-800 p-2.5 rounded-lg hover:bg-[#E53E3E] transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2.5 rounded-lg hover:bg-[#E53E3E] transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2.5 rounded-lg hover:bg-[#E53E3E] transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2.5 rounded-lg hover:bg-[#E53E3E] transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item}>
                  <Link
                    to={toForItem(item)}
                    className="hover:text-[#E53E3E] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              {[
                "Daily Rentals",
                "Monthly Plans",
                "Corporate Rentals",
                "Airport Pickup",
                "Long-Term Lease",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-[#E53E3E] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E53E3E] flex-shrink-0 mt-0.5" />
                <a
                  href="https://maps.google.com/?q=1st+Floor,+Capital+Tower,+Kumarapuram,+Thiruvananthapuram,+Kerala+695011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  1st Floor, Capital Tower, Kumarapuram, Thiruvananthapuram,
                  Kerala 695011
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#E53E3E] flex-shrink-0" />
                <a
                  href="tel:+919947000500"
                  className="hover:text-white transition-colors"
                >
                  +91 99470 00500
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#E53E3E] flex-shrink-0" />
                <a
                  href="mailto:info@millennium.com"
                  className="hover:text-white transition-colors"
                >
                  abhilashgomez@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2026 Millennium. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-500">
            Powered by{" "}
            <span className="font-semibold text-gray-400">Careergize LLP</span>
          </p>
        </div>
      </div>
    </footer>
  );
}