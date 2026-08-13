import { useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Facebook,
  Instagram,
  Twitter,
  ExternalLink,
} from "lucide-react";

const contactInfo = [
  {
    icon: <Phone className="h-5 w-5" />,
    label: "Call Us",
    value: "+91 9947000500",
    sub: "Mon–Sun, 24/7 support line",
  },
  {
    icon: <Mail className="h-5 w-5" />,
    label: "Email Us",
    value: "millenniumrentacar47@gmail.com",
    sub: "We reply within a few hours",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    label: "Visit Us",
    value: "Kumarapuram, Thiruvananthapuram",
    sub: "Kerala 695011",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: "Hours",
    value: "24/7 Roadside & Booking",
    sub: "Branch counters: 7am – 10pm",
  },
];

const subjects = [
  "General Inquiry",
  "Booking Support",
  "Fleet & Pricing",
  "Partnership",
  "Other",
];

const GOOGLE_MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir//Millennium+Group+Rent+A+Car,+1st+Floor,+Capital+Tower,+Kumarapuram,+Thiruvananthapuram,+Kerala+695011/@12.9859584,77.7551872,8788m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x3b05bdc736e6ee09:0xd5470bb53874ea21!2m2!1d76.9279914!2d8.5111438?entry=ttu";

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.9234123528!2d76.9279914!3d8.5111438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bdc736e6ee09%3A0xd5470bb53874ea21!2sMillennium%20Group%20Rent%20A%20Car!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

function useReveal(threshold = 0.15) {
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

function FloatingField({
  label,
  type = "text",
  value,
  onChange,
  error,
  textarea,
  name,
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const Tag = textarea ? "textarea" : "input";

  return (
    <div className="relative">
      <Tag
        name={name}
        type={!textarea ? type : undefined}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={textarea ? 4 : undefined}
        className={`peer w-full rounded-xl border bg-white px-4 pb-2.5 pt-5 text-sm text-gray-900 outline-none transition-colors ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-gray-200 focus:border-[#E53E3E]"
        } ${textarea ? "resize-none" : ""}`}
      />
      <label
        className={`pointer-events-none absolute left-4 transition-all duration-200 ${
          focused || hasValue
            ? "top-2 text-[11px] font-medium text-[#E53E3E]"
            : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
        } ${textarea && !(focused || hasValue) ? "top-5" : ""}`}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}

export default function ContactUs() {
  const [heroRef, heroInView] = useReveal(0.3);
  const [formRef, formInView] = useReveal(0.1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: subjects[0],
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = "Message should be at least 10 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1500);
  };

  return (
    <main className="bg-white">
      <style>{`
        .cu-reveal { transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        @keyframes cu-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        .cu-blob { animation: cu-float 9s ease-in-out infinite; }
        @keyframes cu-pop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
        .cu-pop { animation: cu-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .cu-reveal, .cu-blob, .cu-pop { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-[#0F1115] py-24 text-center text-white"
      >
        <div className="cu-blob pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
        <div
          className="cu-blob pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-red-600/15 blur-3xl"
          style={{ animationDelay: "3s" }}
        />

        <div
          className="cu-reveal relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8"
          style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-400">
            <MessageSquare className="h-3.5 w-3.5" />
            Get In Touch
          </span>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Let's Get You On the Road
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-white/70">
            Questions about a booking, your fleet options, or a partnership? Our
            team typically replies within a couple of hours.
          </p>
        </div>
      </section>

      {/* CONTACT INFO STRIP */}
      <section className="border-b border-gray-100 bg-[#F8F9FA] py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {contactInfo.map((item, i) => (
            <div
              key={item.label}
              className="cu-reveal flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              style={{ transitionDelay: `${i * 80}ms`, opacity: 1 }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#E53E3E]">
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {item.label}
                </p>
                <p className="mt-0.5 font-bold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FORM + MAP */}
      <section ref={formRef} className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
          {/* Map / branch panel */}
          <div
            className="cu-reveal relative flex flex-col overflow-hidden rounded-2xl bg-[#0F1115] text-white"
            style={{
              opacity: formInView ? 1 : 0,
              transform: formInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            {/* Embedded Interactive Google Map */}
            <div className="relative h-72 w-full overflow-hidden sm:h-80">
              <iframe
                title="Millennium Group Rent A Car Location"
                src={GOOGLE_MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full grayscale contrast-125 opacity-80 transition-all duration-500 hover:grayscale-0 hover:opacity-100"
              />
            </div>

            <div className="flex-1 space-y-5 p-7">
              <div>
                <h3 className="font-bold">Headquarters</h3>
                <p className="mt-1 text-sm text-white/60">
                  1st Floor, Capital Tower, Kumarapuram, Thiruvananthapuram,
                  Kerala 695011
                </p>
                <a
                  href={GOOGLE_MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-red-400 transition hover:text-red-300 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Get Directions on Google Maps
                </a>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <h3 className="font-bold">Need help right now?</h3>
                <p className="mt-1 text-sm text-white/60">
                  Our support line is staffed around the clock for active
                  rentals and roadside assistance.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-[#E53E3E] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div
            className="cu-reveal rounded-2xl border border-gray-100 bg-white p-7 shadow-sm sm:p-9"
            style={{
              opacity: formInView ? 1 : 0,
              transform: formInView ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "120ms",
            }}
          >
            {status === "sent" ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="cu-pop mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Message sent
                </h3>
                <p className="mt-2 max-w-xs text-sm text-gray-500">
                  Thanks for reaching out — a member of our team will get back
                  to you shortly.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: subjects[0],
                      message: "",
                    });
                  }}
                  className="mt-6 rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Send Us a Message
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Fill out the form and we'll get back to you shortly.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FloatingField
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                  />
                  <FloatingField
                    label="Phone (optional)"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <FloatingField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <div className="relative">
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition-colors focus:border-[#E53E3E]"
                  >
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <FloatingField
                  label="Your Message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  error={errors.message}
                  textarea
                />

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E53E3E] py-3.5 font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-80"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send Message <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}