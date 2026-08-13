import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/millennium-logo.jpg";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    "Home",
    "Fleet-Available",
    "How it Works",
    "About Us",
    "Contact",
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm transition-shadow ${
        scrolled ? "border-gray-100 shadow-sm" : "border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex shrink-0 items-center">
            <img
              src={logo}
              alt="Millennium Group Rent A Car"
              className="h-12 w-auto rounded-md object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-14"
            />
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {navItems.map((item) => {
              const slug = item.toLowerCase().replace(/\s+/g, "-");
              const to =
                item === "About Us"
                  ? "/about"
                  : item === "Contact"
                    ? "/contact"
                    : item === "Login"
                      ? "/login"
                    : item === "Fleet-Available"
                      ? "/#listings"
                      : item === "Home"
                        ? "/"
                        : `/#${slug}`;

              return (
                <Link
                  key={item}
                  to={to}
                  className="group relative font-medium text-gray-600 transition-colors hover:text-[#E53E3E]"
                >
                  {item}
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-[#E53E3E] transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to="/#listings"
              className="rounded-xl bg-[#E53E3E] px-7 py-3 font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-700 active:scale-[0.98]"
            >
              Choose Car
            </Link>
          </div>

          <button
            className="p-2 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const slug = item.toLowerCase().replace(/\s+/g, "-");
              const to =
                item === "About Us"
                  ? "/about"
                  : item === "Contact"
                    ? "/contact"
                    : item === "Login"
                      ? "/login"
                    : item === "Fleet-Available"
                      ? "/#listings"
                      : item === "Home"
                        ? "/"
                        : `/#${slug}`;

              return (
                <Link
                  key={item}
                  to={to}
                  className="py-2 font-medium text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              );
            })}
            <button className="mt-2 w-full rounded-xl bg-[#E53E3E] px-7 py-3 font-semibold text-white">
              Choose Car
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
