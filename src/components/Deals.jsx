import { useEffect, useRef, useState } from "react";
import { ArrowRight, Clock, Copy, Check, Flame, Tag } from "lucide-react";

const deals = [
  {
    id: "weekly",
    badge: "Limited Time",
    title: "Weekly Specials",
    desc: "Get up to 30% off on premium sedans and SUVs every week. Book early to secure the best rates!",
    discount: "30%",
    code: "WEEKLY30",
    claimed: 64,
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop",
    theme: "red",
    endsInHours: 52,
  },
  {
    id: "weekend",
    badge: "Exclusive",
    title: "Weekend Discounts",
    desc: "Plan your weekend getaway with our special rates. Economy cars starting at just $49/day!",
    discount: "$49/day",
    code: "WKND49",
    claimed: 41,
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=500&fit=crop",
    theme: "dark",
    endsInHours: 30,
  },
  {
    id: "flash",
    badge: "Flash Sale",
    title: "24-Hour Flash Drop",
    desc: "One day only — our entire SUV lineup at electric-fast pricing. Once it's gone, it's gone.",
    discount: "40%",
    code: "FLASH40",
    claimed: 88,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=500&fit=crop",
    theme: "amber",
    endsInHours: 9,
  },
];

const themeStyles = {
  red: {
    overlay: "from-[#E53E3E]/90 to-red-800/80",
    badgeText: "text-red-200",
    bodyText: "text-red-100",
    button: "bg-white text-[#E53E3E] hover:bg-red-50",
    ring: "ring-red-300",
    bar: "bg-white",
  },
  dark: {
    overlay: "from-gray-900/90 to-gray-800/80",
    badgeText: "text-gray-300",
    bodyText: "text-gray-300",
    button: "bg-[#E53E3E] text-white hover:bg-red-700",
    ring: "ring-gray-400",
    bar: "bg-[#E53E3E]",
  },
  amber: {
    overlay: "from-amber-600/90 to-orange-800/85",
    badgeText: "text-amber-100",
    bodyText: "text-amber-50",
    button: "bg-white text-amber-700 hover:bg-amber-50",
    ring: "ring-amber-300",
    bar: "bg-white",
  },
};

function useCountdown(hours) {
  const targetRef = useRef(Date.now() + hours * 60 * 60 * 1000);
  const [remaining, setRemaining] = useState(targetRef.current - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, targetRef.current - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const totalSeconds = Math.floor(remaining / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");

  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

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

function CopyCode({ code, theme }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // clipboard may be unavailable; fail silently, button still shows state
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
    >
      <Tag className="h-3.5 w-3.5" />
      {code}
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-300" />
      ) : (
        <Copy className="h-3.5 w-3.5 opacity-70" />
      )}
    </button>
  );
}

function DealCard({ deal, index, inView }) {
  const countdown = useCountdown(deal.endsInHours);
  const theme = themeStyles[deal.theme];
  const isFlash = deal.theme === "amber";

  return (
    <div
      className="dl-card group relative cursor-pointer overflow-hidden rounded-2xl"
      style={{
        transitionDelay: inView ? `${index * 110}ms` : "0ms",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
      }}
    >
      <img
        src={deal.image}
        alt={deal.title}
        className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.overlay}`} />

      {/* Discount badge */}
      <div
        className={`dl-pulse absolute right-6 top-6 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-white/15 text-center ring-2 ${theme.ring} backdrop-blur-sm`}
      >
        <span className="text-sm font-extrabold leading-none text-white">
          {deal.discount}
        </span>
        <span className="text-[8px] uppercase tracking-wide text-white/80">
          off
        </span>
      </div>

      <div className="absolute inset-0 flex flex-col justify-center p-8">
        <span
          className={`mb-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider ${theme.badgeText}`}
        >
          {isFlash && <Flame className="h-3.5 w-3.5" />}
          {deal.badge}
        </span>
        <h3 className="mb-3 text-3xl font-bold text-white">{deal.title}</h3>
        <p className={`mb-5 max-w-sm ${theme.bodyText}`}>{deal.desc}</p>

        {/* Countdown */}
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-white/90">
          <Clock className="h-3.5 w-3.5" />
          Ends in <span className="font-mono tabular-nums">{countdown}</span>
        </div>

        {/* Claimed progress */}
        <div className="mb-6 max-w-xs">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-white/80">
            <span>{deal.claimed}% claimed</span>
            <span>{100 - deal.claimed}% left</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className={`h-full rounded-full ${theme.bar} transition-all duration-1000`}
              style={{ width: inView ? `${deal.claimed}%` : "0%" }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className={`flex w-fit items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all active:scale-[0.97] ${theme.button}`}
          >
            View Offer <ArrowRight className="h-4 w-4" />
          </button>
          <CopyCode code={deal.code} theme={deal.theme} />
        </div>
      </div>
    </div>
  );
}

export default function Deals() {
  const [sectionRef, inView] = useReveal(0.15);

  return (
    <section id="deals" ref={sectionRef} className="bg-white py-20">
      <style>{`
        .dl-card { transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
        @keyframes dl-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.35); }
          50% { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
        }
        .dl-pulse { animation: dl-pulse 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .dl-card, .dl-pulse { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#E53E3E]">
            Special Offers
          </span>
          <h2 className="mb-4 mt-3 text-4xl font-bold text-gray-900">
            Discover Our Exclusive Deals
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Save big with our limited-time promotions and seasonal offers —
            grab a code below before it's gone.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {deals.slice(0, 2).map((deal, i) => (
            <DealCard key={deal.id} deal={deal} index={i} inView={inView} />
          ))}
        </div>

        {/* Flash sale gets its own full-width spotlight row */}
        <div className="mt-8">
          <DealCard deal={deals[2]} index={2} inView={inView} />
        </div>
      </div>
    </section>
  );
}