import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gomez from "../assets/gomez.jpg";
import {
  ShieldCheck,
  Award,
  Users,
  MapPin,
  Car,
  Bike,
  HardHat,
  Building2,
  Clock,
  Sparkles,
  Scale,
  HeartHandshake,
  Quote,
} from "lucide-react";

const stats = [
  { label: "Years of Legacy", value: 25, suffix: "+" },
  { label: "Business Verticals", value: 4, suffix: "" },
  { label: "Happy Customers", value: 50000, suffix: "+" },
  { label: "RERA Compliance", value: 100, suffix: "%" },
];

const services = [
  {
    icon: <Car className="h-6 w-6" />,
    title: "Rent A Car",
    desc: "Compact cars for daily commutes, premium sedans for business travel, and spacious SUVs for family trips — with flexible daily, weekly, and monthly packages, a well-maintained fleet, and zero hidden costs.",
  },
  {
    icon: <Bike className="h-6 w-6" />,
    title: "Rent A Bike",
    desc: "Quick, convenient, fuel-efficient two-wheelers to navigate Trivandrum's streets with ease — perfect for errands, daily travel, or exploring the city, every unit safety-checked regularly.",
  },
  {
    icon: <HardHat className="h-6 w-6" />,
    title: "Construction & Maintenance",
    desc: "Decades of hands-on expertise in general construction, renovations, and structural maintenance — residential upgrades and commercial upkeep, delivered with quality craftsmanship and on time.",
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "Property Management & Real Estate",
    desc: "RERA-registered, end-to-end property management — upkeep, tenant management, rentals, and strategic advisory, with strict regulatory compliance and full accountability.",
  },
];

const values = [
  {
    icon: <Award className="h-6 w-6" />,
    title: "25+ Years of Proven Legacy",
    desc: "Over two decades of local operational experience and trusted customer relationships across Kerala.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "RERA-Certified Standards",
    desc: "Full legal compliance and structured governance across every one of our property and real estate operations.",
  },
  {
    icon: <HeartHandshake className="h-6 w-6" />,
    title: "Customer-Centric Leadership",
    desc: "Guided directly by Mr. Patrick Gomez, ensuring personal accountability and high service standards in every department.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "All-in-One Service Hub",
    desc: "A single, reliable group for all your mobility, building, and property management needs in Trivandrum.",
  },
];

const pillars = [
  {
    icon: <Scale className="h-6 w-6" />,
    title: "Integrity",
    desc: "Honest pricing, clear contracts, and full RERA compliance in everything we deliver.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Reliability",
    desc: "Well-maintained rental fleets and durable, dependable construction standards.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community",
    desc: "Proudly rooted in Kumarapuram, serving Trivandrum with dedication.",
  },
];

const milestones = [
  {
    year: "The Beginning",
    title: "Millennium Group is founded",
    desc: "Mr. Patrick Gomez set out with a simple vision: seamless, dependable solutions tailored to the everyday needs of clients in Trivandrum.",
  },
  {
    year: "Early Growth",
    title: "Headquartered in Kumarapuram",
    desc: "Established roots in Kumarapuram, Trivandrum, growing from a local enterprise into a name the community trusted for mobility solutions.",
  },
  {
    year: "Expansion",
    title: "Diversifying into construction",
    desc: "Brought decades of hands-on expertise into general construction, renovations, and structural maintenance for residential and commercial clients.",
  },
  {
    year: "Today",
    title: "RERA-registered real estate services",
    desc: "Grew into a multifaceted business group offering RERA-registered property management and real estate advisory, alongside our mobility and construction services.",
  },
];

/** Reveals an element with a fade/slide the first time it scrolls into view. */
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
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/** Counts a number up from 0 once it enters view. */
function Counter({ value, suffix = "", inView, duration = 1600 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function Reveal({ children, className = "", style = {}, as: Tag = "div" }) {
  const [ref, inView] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`au-reveal ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/** Tracks how far a section has scrolled through the viewport, as a 0–1 value — used to "drive" the journey line. */
function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setProgress(1);
      return;
    }

    let raf = null;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.82 - rect.top) / (rect.height + vh * 0.35);
      setProgress(Math.min(1, Math.max(0, p)));
      raf = null;
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return [ref, progress];
}

export default function AboutUs() {
  const [statsRef, statsInView] = useReveal(0.4);
  const [timelineRef, timelineProgress] = useScrollProgress();

  return (
    <main className="bg-white">
      <style>{`
        .au-reveal { transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        @keyframes au-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        .au-blob { animation: au-float 10s ease-in-out infinite; }
        .au-journey-car { transition: top 0.15s linear; }
        @media (prefers-reduced-motion: reduce) {
          .au-reveal { transition: none !important; opacity: 1 !important; transform: none !important; }
          .au-blob { animation: none !important; }
          .au-journey-car { transition: none !important; }
        }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0F1115] py-28 text-white">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=900&fit=crop"
          alt="Millennium Group fleet on the road"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/80 to-[#0F1115]/40" />
        <div className="au-blob pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-red-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-400">
            About Millennium Group
          </span>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Building Trust, Delivering Mobility,
            <span className="block text-[#E53E3E]">Elevating Living</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
            For over a quarter of a century, Millennium Group has stood as a
            symbol of reliability, quality, and community-first service in
            Trivandrum — founded and led by Mr. Patrick Gomez on a simple
            vision: seamless, dependable solutions for the everyday needs of our
            clients.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section
        ref={statsRef}
        className="border-b border-gray-100 bg-[#F8F9FA] py-14"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-[#E53E3E] sm:text-4xl">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={statsInView}
                />
              </div>
              <p className="mt-1.5 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#E53E3E]">
              Our Story
            </span>
            <h2 className="mb-5 mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Founded on a vision. Still driven by it 25 years later.
            </h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              Millennium Group was founded and is led by Mr. Patrick Gomez,
              whose journey began with a simple vision: to provide seamless,
              dependable solutions tailored to the everyday needs of our
              clients. That commitment has never wavered.
            </p>
            <p className="mb-4 text-gray-600 leading-relaxed">
              Headquartered in Kumarapuram, Trivandrum, we have grown from a
              local enterprise into a multifaceted business group spanning
              mobility solutions, construction, and RERA-registered real estate
              services. Over 25 years later, our commitment to integrity,
              customer satisfaction, and operational excellence remains
              unchanged.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether it's a car for a business trip, a bike for a quick errand,
              a renovation for your home, or the management of your most
              valuable property, Millennium Group is built to be the one name
              you trust for it all.
            </p>
          </Reveal>

          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1493238792000-8113da705763?w=900&h=700&fit=crop"
                alt="Millennium Group headquarters"
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-5 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#E53E3E]">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Headquartered in Kumarapuram
                  </p>
                  <p className="text-xs text-gray-500">Trivandrum, Kerala</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#E53E3E]">
              What We Do
            </span>
            <h2 className="mb-4 mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              One group, four ways we serve you
            </h2>
            <p className="text-gray-600">
              From the keys to a rental vehicle to the management of your most
              valuable property, every service is delivered to the same
              standard.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <Reveal
                key={service.title}
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#E53E3E]">
                  {service.icon}
                </div>
                <h3 className="mb-2 font-bold text-gray-900">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {service.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#E53E3E]">
              Why Choose Us
            </span>
            <h2 className="mb-4 mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Why choose Millennium Group?
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal
                key={value.title}
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#E53E3E]">
                  {value.icon}
                </div>
                <h3 className="mb-2 font-bold text-gray-900">{value.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {value.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CORE PILLARS */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#E53E3E]">
              Our Core Pillars
            </span>
            <h2 className="mb-4 mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              What we build every service on
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-3">
            {pillars.map((pillar, i) => (
              <Reveal
                key={pillar.title}
                className="rounded-2xl bg-white p-8 text-center shadow-sm"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#E53E3E]">
                  {pillar.icon}
                </div>
                <h3 className="mb-2 font-bold text-gray-900">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {pillar.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MILESTONES */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#E53E3E]">
              Our Journey
            </span>
            <h2 className="mb-4 mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              From a simple vision to a multifaceted group
            </h2>
          </Reveal>

          <div className="relative" ref={timelineRef}>
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200 sm:left-1/2" />
            <div
              className="au-journey-car absolute left-[15px] flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#E53E3E] text-white shadow-[0_0_0_6px_rgba(229,62,62,0.15)] sm:left-1/2"
              style={{ top: `${timelineProgress * 100}%` }}
            >
              <Car className="h-4 w-4" />
            </div>
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <Reveal
                  key={m.title}
                  className={`relative flex flex-col gap-2 pl-10 sm:w-1/2 sm:pl-0 ${
                    i % 2 === 0
                      ? "sm:pr-12 sm:text-right"
                      : "sm:ml-auto sm:pl-12"
                  }`}
                >
                  <span className="text-sm font-bold text-[#E53E3E]">
                    {m.year}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">{m.title}</h3>
                  <p className="text-sm text-gray-600">{m.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#E53E3E]">
              The Person Behind It
            </span>
            <h2 className="mb-4 mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Led personally, every step of the way
            </h2>
          </Reveal>

          <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-2xl bg-white p-8 text-center shadow-sm sm:flex-row sm:text-left">
            <img
              src={gomez}
              alt="Mr. Patrick Gomez"
              className="h-28 w-28 shrink-0 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Mr. Patrick Gomez
              </h3>
              <p className="mb-3 text-sm text-[#E53E3E]">
                Founder & Managing Director
              </p>
              <p className="text-sm leading-relaxed text-gray-600">
                Guiding Millennium Group with personal accountability and high
                service standards across mobility, construction, and real estate
                — ensuring every client relationship reflects the same trust the
                group was built on 25+ years ago.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-24">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Quote className="mx-auto mb-6 h-10 w-10 text-red-200" />
          <p className="text-xl font-medium leading-relaxed text-gray-800 sm:text-2xl">
            "Our mission is simple: to earn your trust every single day—whether
            we are handing you the keys to a vehicle or managing your most
            valuable real estate investments."
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <img
              src={gomez}
              alt="Mr. Patrick Gomez"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">
                Mr. Patrick Gomez
              </p>
              <p className="text-xs text-gray-500">
                Founder & Managing Director
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#0F1115] py-20 text-white">
        <div className="au-blob pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
        <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to experience Millennium Group?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Browse the fleet, ask about a property, or get a quote for your next
            project — one team, four services, zero hassle.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/#listings"
              className="rounded-xl bg-[#E53E3E] px-7 py-3.5 font-semibold text-white transition hover:bg-red-700 active:scale-[0.98]"
            >
              Browse the Fleet
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-white/20 px-7 py-3.5 font-semibold text-white transition hover:border-white/50"
            >
              Contact Our Team
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Kumarapuram, Trivandrum
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> 25+ years of legacy
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> 4 service verticals
            </span>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
