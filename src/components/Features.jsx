import { useEffect, useRef, useState } from "react";
import { Car, Clock, Shield, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: <Car className="w-7 h-7" />,
    title: "Wide Range of Vehicles",
    desc: "From economy to luxury, find the perfect car for every occasion and budget.",
    stat: "120+",
    statLabel: "models available",
  },
  {
    icon: <Clock className="w-7 h-7" />,
    title: "Flexible Rental Plans",
    desc: "Daily, weekly, or monthly — choose a plan that fits your schedule perfectly.",
    stat: "24h",
    statLabel: "min. booking time",
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: "24/7 Customer Support",
    desc: "Our dedicated team is always here to help you whenever you need assistance.",
    stat: "98%",
    statLabel: "issues resolved fast",
  },
];

/** Reveals children with a staggered fade/slide once they enter the viewport. */
function useInView(threshold = 0.25) {
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

function FeatureCard({ feature, index, inView }) {
  const cardRef = useRef(null);

  // Subtle pointer-driven tilt + glow-follow, disabled for touch/reduced-motion users.
  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -6;
    const rotateY = ((x / rect.width) - 0.5) * 6;
    card.style.setProperty("--rx", `${rotateX}deg`);
    card.style.setProperty("--ry", `${rotateY}deg`);
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", `0deg`);
    card.style.setProperty("--ry", `0deg`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="ftr-card group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow duration-500 hover:shadow-xl"
      style={{
        transitionDelay: inView ? `${index * 120}ms` : "0ms",
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translateY(0) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))"
          : "translateY(28px)",
      }}
    >
      {/* Glow that follows the cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(229,62,62,0.10), transparent 70%)",
        }}
      />

      {/* Animated corner arrow, appears on hover */}
      <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 -translate-y-1 translate-x-1 text-gray-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[#E53E3E] group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-[#E53E3E] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#E53E3E] group-hover:text-white group-hover:shadow-lg group-hover:shadow-red-200">
          {feature.icon}
        </div>

        <h3 className="mb-3 text-xl font-bold text-gray-900">
          {feature.title}
        </h3>
        <p className="leading-relaxed text-gray-600">{feature.desc}</p>

        <div className="mt-6 flex items-baseline gap-2 border-t border-gray-100 pt-5">
          <span className="text-2xl font-extrabold text-gray-900 transition-colors duration-300 group-hover:text-[#E53E3E]">
            {feature.stat}
          </span>
          <span className="text-xs uppercase tracking-wide text-gray-400">
            {feature.statLabel}
          </span>
        </div>
      </div>

      {/* Bottom accent bar that sweeps in on hover */}
      <span className="absolute bottom-0 left-0 h-1 w-0 bg-[#E53E3E] transition-all duration-500 ease-out group-hover:w-full" />
    </div>
  );
}

export default function Features() {
  const [headerRef, headerInView] = useInView(0.4);
  const [gridRef, gridInView] = useInView(0.15);

  return (
    <section className="relative overflow-hidden bg-[#F8F9FA] py-20">
      <style>{`
        .ftr-card { transition-property: opacity, transform, box-shadow; transition-timing-function: cubic-bezier(0.16,1,0.3,1); }
        .ftr-card { transform-style: preserve-3d; }
        .ftr-fade-up { transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        @keyframes ftr-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .ftr-blob { animation: ftr-float 9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ftr-card, .ftr-fade-up { transition: none !important; opacity: 1 !important; transform: none !important; }
          .ftr-blob { animation: none !important; }
        }
      `}</style>

      {/* Ambient background blobs */}
      <div className="ftr-blob pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-red-100/40 blur-3xl" />
      <div
        className="ftr-blob pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-red-100/30 blur-3xl"
        style={{ animationDelay: "3s" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className="ftr-fade-up mx-auto mb-14 max-w-2xl text-center"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <span className="mb-3 inline-block rounded-full bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#E53E3E]">
            Why Choose Us
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Built for Every Kind of Journey
          </h2>
          <p className="mt-3 text-gray-500">
            Everything you need for a smooth rental experience, from booking
            to drop-off.
          </p>
        </div>

        <div ref={gridRef} className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              inView={gridInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}