import { useEffect, useRef, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Frequent Corporate Traveler",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    rating: 5,
    quote:
      "I've booked through Millennium Group multiple times for client visits across Bengaluru and Hyderabad. Pickup is always prompt, cars are spotless, and driver verification gives total peace of mind.",
  },
  {
    name: "Priya Sundaram",
    role: "Family Outstation Trip",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
    rating: 5,
    quote:
      "We needed an Innova last-minute for a family trip to Ooty. They got us on the road in under thirty minutes with clear toll and Fastag pricing—no hidden driver charges at drop-off.",
  },
  {
    name: "Varun Vasanthan",
    role: "Weekend Getaway",
    image:
      "https://media.licdn.com/dms/image/v2/C5603AQFvm8ZM1QAqmQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1601720474813?e=2147483647&v=beta&t=VCwMpDcWtKhdFCPfkvK8QCMQTiy0bRpNpDaAor1knOw",
    rating: 4,
    quote:
      "Solid experience overall for our road trip to Lonavala. App booking was seamless and car condition was top-notch. Wish weekend discounts applied to luxury sedans too!",
  },
  {
    name: "Ananya Iyer",
    role: "Monthly Rental",
    image:
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&h=300&fit=crop",
    rating: 5,
    quote:
      "Rented a car for a full month during my temporary relocation to Pune. Their support team proactively checked in to ensure smooth maintenance—such service quality is hard to find.",
  },
  {
    name: "Vikram Malhotra",
    role: "Late-Night Airport Pickup",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop",
    rating: 5,
    quote:
      "Landed at Delhi airport at 2 AM and the driver was already waiting near arrivals with the AC on. A quick, smooth drop home after a long flight made a huge difference.",
  },
];

const ratingBreakdown = [
  { stars: 5, pct: 82 },
  { stars: 4, pct: 13 },
  { stars: 3, pct: 3 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function Stars({ count, size = "h-4 w-4" }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < count ? "fill-amber-400 text-amber-400" : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [sectionRef, inView] = useReveal(0.15);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  const goTo = (i) => setActive((i + testimonials.length) % testimonials.length);

  const avgRating = (
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
  ).toFixed(1);

  const current = testimonials[active];

  return (
    <section ref={sectionRef} className="bg-[#F8F9FA] py-20">
      <style>{`
        .ts-fade { transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
        @keyframes ts-bar-grow { from { width: 0; } }
        .ts-bar { animation: ts-bar-grow 1.1s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes ts-slide-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ts-quote { animation: ts-slide-in 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .ts-fade, .ts-bar, .ts-quote { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; width: auto !important; }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#E53E3E]">
            Customer Reviews
          </span>
          <h2 className="mb-4 mt-3 text-4xl font-bold text-gray-900">
            Trusted by Travelers Across India
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Real feedback from riders who choose Millennium Group every day — transparent, reliable, and verified.
          </p>
        </div>

        {/* Rating summary */}
        <div
          className="ts-fade mb-14 grid gap-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:grid-cols-[auto_1fr] md:items-center"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div className="text-center md:border-r md:border-gray-100 md:pr-8 md:text-left">
            <div className="text-5xl font-extrabold text-gray-900">{avgRating}</div>
            <Stars count={5} size="h-5 w-5" />
            <p className="mt-2 text-sm text-gray-500">
              Based on {testimonials.length * 520} verified reviews
            </p>
          </div>

          <div className="space-y-2">
            {ratingBreakdown.map((row, i) => (
              <div key={row.stars} className="flex items-center gap-3 text-sm">
                <span className="w-10 shrink-0 text-gray-500">{row.stars} star</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="ts-bar h-full rounded-full bg-amber-400"
                    style={{ width: inView ? `${row.pct}%` : "0%", animationDelay: `${i * 100}ms` }}
                  />
                </div>
                <span className="w-9 shrink-0 text-right text-gray-400">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured carousel */}
        <div
          className="ts-fade relative mb-12 overflow-hidden rounded-2xl bg-white p-8 shadow-sm sm:p-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "150ms",
          }}
        >
          <Quote className="absolute right-8 top-8 h-12 w-12 text-red-50" />

          <div key={active} className="ts-quote relative mx-auto max-w-2xl text-center">
            <img
              src={current.image}
              alt={current.name}
              className="mx-auto mb-5 h-16 w-16 rounded-full object-cover ring-4 ring-red-50"
            />
            <Stars count={current.rating} />
            <p className="mt-5 text-lg leading-relaxed text-gray-700 sm:text-xl">
              "{current.quote}"
            </p>
            <div className="mt-5 flex items-center justify-center gap-1.5">
              <h3 className="font-bold text-gray-900">{current.name}</h3>
              <BadgeCheck className="h-4 w-4 text-[#E53E3E]" />
            </div>
            <p className="text-sm text-gray-500">{current.role}</p>
          </div>

          {/* Arrows */}
          <button
            onClick={() => goTo(active - 1)}
            aria-label="Previous review"
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => goTo(active + 1)}
            aria-label="Next review"
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-6 bg-[#E53E3E]" : "w-2 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Supporting grid of quick reviews */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials
            .filter((_, i) => i !== active)
            .slice(0, 4)
            .map((t) => (
              <button
                key={t.name}
                onClick={() => goTo(testimonials.indexOf(t))}
                className="ts-fade group rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(20px)",
                }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <Stars count={t.rating} size="h-3.5 w-3.5" />
                <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                  "{t.quote}"
                </p>
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}