import { useEffect, useRef, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";

const testimonials = [
  {
    name: "James Wilson",
    role: "Frequent Business Traveler",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop",
    rating: 5,
    quote:
      "I've booked through Millennium Group a dozen times for client visits. Pickup is always under ten minutes and the cars are spotless every time.",
  },
  {
    name: "Sarah Anderson",
    role: "Family Road Trip",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
    rating: 5,
    quote:
      "We needed a last-minute SUV for a family trip and they had us on the road in twenty minutes. Transparent pricing, no surprise fees at drop-off.",
  },
  {
    name: "Michael Chen",
    role: "Weekend Getaway",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    rating: 4,
    quote:
      "Solid experience overall — easy app booking and friendly staff. Only wish the weekend deals applied to more vehicle classes.",
  },
  {
    name: "Emily Rodriguez",
    role: "Relocation Rental",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
    rating: 5,
    quote:
      "Rented for a full month during my move across the state. The team proactively called to check everything was working — that kind of follow-up is rare.",
  },
  {
    name: "Daniela Ruiz",
    role: "Airport Pickup",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    rating: 5,
    quote:
      "Landed at midnight and the counter was still open with my car ready. Small thing, but it made a long travel day so much easier.",
  },
];

const ratingBreakdown = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 16 },
  { stars: 3, pct: 4 },
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
            Trusted by Renters Across the Region
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Real feedback from people who've rented with Millennium Group —
            no edits, no cherry-picking.
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
              Based on {testimonials.length * 412} verified reviews
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