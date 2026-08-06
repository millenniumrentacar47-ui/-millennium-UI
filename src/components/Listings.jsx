import { useEffect, useState } from "react";
import {
  Users,
  Settings,
  Fuel,
  X,
  Calendar,
  Star,
  ShieldCheck,
  MessageCircle,
  AlertCircle,
  Loader2,
  User,
  Phone,
} from "lucide-react";

const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatINR(value) {
  return INR_FORMATTER.format(value);
}

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw_M2ADqlFAnW3K1b70_rdbg4ULlcESyX2B5Gj8iwr5N0gzf0_-cgpGTclj5nStF6Tn6Q/exec";

// WhatsApp number bookings get sent to (country code + number, no + or spaces)
const WHATSAPP_NUMBER = "919947000500";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop";

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

function diffInDays(from, to) {
  const ms = new Date(to) - new Date(from);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function buildWhatsAppUrl({ car, customerName, customerPhone, pickup, dropoff, days, total }) {
  const message = [
    `Hi Millennium Group! I'd like to book the *${car.name}${
      car.model ? ` (${car.model})` : ""
    }*.`,
    "",
    `Name: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Pick-up: ${pickup}`,
    `Drop-off: ${dropoff} (${days} day${days > 1 ? "s" : ""})`,
    `Estimated total: ${formatINR(total)}`,
    "",
    "Please confirm availability.",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Skeleton placeholder shown while listings load */
function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="lst-shimmer h-52 w-full bg-gray-100" />
      <div className="space-y-3 p-5">
        <div className="lst-shimmer h-5 w-3/4 rounded bg-gray-100" />
        <div className="lst-shimmer h-4 w-full rounded bg-gray-100" />
        <div className="lst-shimmer h-11 w-full rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

function CarCard({ car, index, visible, onSelect }) {
  return (
    <div
      className="lst-card group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-500 hover:shadow-xl"
      style={{
        transitionDelay: visible ? `${index * 90}ms` : "0ms",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(24px) scale(0.97)",
      }}
    >
      <div className="relative overflow-hidden">
        <img
          src={car.image || FALLBACK_IMAGE}
          alt={car.name}
          className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute top-4 right-4 rounded-lg bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
          <span className="text-lg font-bold text-[#E53E3E]">
            {formatINR(car.price)}
          </span>
          <span className="text-xs text-gray-500">/day</span>
        </div>

        {Number(car.rating) > 0 && (
          <div className="absolute top-4 left-4 flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {car.rating}
          </div>
        )}

        <button
          onClick={() => onSelect(car)}
          className="absolute inset-x-4 bottom-4 translate-y-3 rounded-xl bg-white/95 py-2.5 text-sm font-semibold text-gray-900 opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Quick View
        </button>
      </div>

      <div className="p-5">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg text-gray-900">{car.name}</h3>
        </div>
        <p className="mb-3 text-xs text-gray-400">
          {[car.model, car.year].filter(Boolean).join(" · ")}
          {Number(car.trips) > 0 ? ` · ${car.trips} trips` : ""}
        </p>

        <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings className="h-4 w-4" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="h-4 w-4" />
            <span>{car.fuel}</span>
          </div>
        </div>

        <button
          onClick={() => onSelect(car)}
          className="w-full rounded-xl bg-[#E53E3E] py-3 font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98]"
        >
          Rent Now
        </button>
      </div>
    </div>
  );
}

function BookingModal({ car, onClose }) {
  const [pickup, setPickup] = useState(todayISO());
  const [dropoff, setDropoff] = useState(todayISO(2));
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [step, setStep] = useState("form"); // form -> saving -> sent
  const [closing, setClosing] = useState(false);
  const [formError, setFormError] = useState(null);

  const days = diffInDays(pickup, dropoff);
  const subtotal = days * Number(car.price || 0);
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 220);
  };

  const handleBook = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError("Please enter your name and phone number");
      return;
    }
    setFormError(null);
    setStep("saving");

    // Save the booking as "Pending" in the Bookings sheet
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "createBooking",
          carId: car.id,
          carName: `${car.name}${car.model ? ` (${car.model})` : ""}`,
          customerName: customerName.trim(),
          phone: customerPhone.trim(),
          pickup,
          dropoff,
          days,
          amount: total,
        }),
      });
    } catch (err) {
      // Even if saving fails, still let the customer reach us on WhatsApp directly
    }

    const url = buildWhatsAppUrl({
      car,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      pickup,
      dropoff,
      days,
      total,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    setStep("sent");
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        closing ? "lst-modal-out" : "lst-modal-in"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Book ${car.name}`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="lst-modal-card relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md transition hover:bg-white hover:text-gray-900"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={car.image || FALLBACK_IMAGE}
            alt={car.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5 text-white">
            <h3 className="text-xl font-bold">{car.name}</h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-white/80">
              {[car.model, car.year].filter(Boolean).join(" · ")}
              {Number(car.rating) > 0 && (
                <>
                  {" "}
                  · <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{" "}
                  {car.rating}
                </>
              )}
            </div>
          </div>
        </div>

        {step !== "sent" ? (
          <div className="p-6">
            <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {car.seats} Seats
              </div>
              <div className="flex items-center gap-1.5">
                <Settings className="h-4 w-4" /> {car.transmission}
              </div>
              <div className="flex items-center gap-1.5">
                <Fuel className="h-4 w-4" /> {car.fuel}
              </div>
            </div>

            {Array.isArray(car.features) && car.features.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-1.5">
                {car.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-medium text-[#E53E3E]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            {/* Customer details */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <User className="h-3.5 w-3.5" /> Your Name
                </span>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#E53E3E] focus:ring-2 focus:ring-red-100"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <Phone className="h-3.5 w-3.5" /> Phone Number
                </span>
                <input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="98470 XXXXX"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#E53E3E] focus:ring-2 focus:ring-red-100"
                />
              </label>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <Calendar className="h-3.5 w-3.5" /> Pick-up
                </span>
                <input
                  type="date"
                  value={pickup}
                  min={todayISO()}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#E53E3E] focus:ring-2 focus:ring-red-100"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <Calendar className="h-3.5 w-3.5" /> Drop-off
                </span>
                <input
                  type="date"
                  value={dropoff}
                  min={pickup}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#E53E3E] focus:ring-2 focus:ring-red-100"
                />
              </label>
            </div>

            {formError && (
              <p className="mt-2 text-xs font-medium text-red-500">{formError}</p>
            )}

            <div className="mt-5 space-y-2 rounded-xl bg-gray-50 p-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>
                  {formatINR(car.price)} × {days} day{days > 1 ? "s" : ""}
                </span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service fee</span>
                <span>{formatINR(serviceFee)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              2 days' rent required as advance to confirm booking
            </div>

            <button
              onClick={handleBook}
              disabled={step === "saving"}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-semibold text-white transition-all hover:bg-[#1ebe5a] active:scale-[0.98] disabled:opacity-70"
            >
              {step === "saving" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving booking…
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4" />
                  Book Now via WhatsApp · {formatINR(total)}
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <div className="lst-pop mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">
              Booking request sent
            </h4>
            <p className="mt-1.5 max-w-xs text-sm text-gray-500">
              We've saved your request and it's pending confirmation. If a new
              tab didn't open, tap below to send it on WhatsApp too.
            </p>
            <button
              onClick={() =>
                window.open(
                  buildWhatsAppUrl({
                    car,
                    customerName,
                    customerPhone,
                    pickup,
                    dropoff,
                    days,
                    total,
                  }),
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-semibold text-white transition hover:bg-[#1ebe5a]"
            >
              <MessageCircle className="h-4 w-4" /> Open WhatsApp
            </button>
            <button
              onClick={handleClose}
              className="mt-3 w-full rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Listings() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCars() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(APPS_SCRIPT_URL);
        const result = await res.json();

        if (cancelled) return;

        if (!result.success) {
          setError(result.message || "Failed to load cars");
        } else {
          setCars(result.cars || []);
        }
      } catch (err) {
        if (!cancelled) setError("Couldn't reach the server. Please try again.");
      } finally {
        if (!cancelled) {
          setLoading(false);
          setTimeout(() => setVisible(true), 50);
        }
      }
    }

    fetchCars();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="listings" className="relative bg-[#F8F9FA] py-20">
      <style>{`
        @keyframes lst-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .lst-shimmer {
          background-image: linear-gradient(90deg, #f3f4f6 25%, #ececec 37%, #f3f4f6 63%);
          background-size: 200% 100%;
          animation: lst-shimmer 1.4s ease-in-out infinite;
        }
        .lst-card { transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1); }

        @keyframes lst-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lst-fade-out { from { opacity: 1; } to { opacity: 0; } }
        .lst-modal-in { animation: lst-fade-in 0.2s ease both; }
        .lst-modal-out { animation: lst-fade-out 0.2s ease both; }

        @keyframes lst-scale-in {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lst-scale-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(16px) scale(0.96); }
        }
        .lst-modal-in .lst-modal-card { animation: lst-scale-in 0.28s cubic-bezier(0.16,1,0.3,1) both; }
        .lst-modal-out .lst-modal-card { animation: lst-scale-out 0.2s ease both; }

        @keyframes lst-pop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
        .lst-pop { animation: lst-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

        @media (prefers-reduced-motion: reduce) {
          .lst-shimmer, .lst-card, .lst-modal-in, .lst-modal-out,
          .lst-modal-card, .lst-pop { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#E53E3E]">
            Our Fleet
          </span>
          <h2 className="mb-4 mt-3 text-4xl font-bold text-gray-900">
            Popular Rental Cars
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Explore our most sought-after vehicles
          </p>
        </div>

        {error && (
          <div className="mx-auto mb-8 flex max-w-md items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : cars.map((car, index) => (
                <CarCard
                  key={car.id}
                  car={car}
                  index={index}
                  visible={visible}
                  onSelect={setSelectedCar}
                />
              ))}
        </div>

        {!loading && !error && cars.length === 0 && (
          <p className="text-center text-gray-500">
            No cars available right now. Check back soon.
          </p>
        )}
      </div>

      {selectedCar && (
        <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </section>
  );
}