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
} from "lucide-react";

const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatINR(value) {
  return INR_FORMATTER.format(value);
}

// WhatsApp number bookings get sent to (country code + number, no + or spaces)
const WHATSAPP_NUMBER = "919947000500";

const cars = [
  {
    name: "Toyota Camry 2022",
    seats: 5,
    transmission: "Automatic",
    fuel: "Gasoline",
    price: 72,
    rating: 4.8,
    trips: 214,
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop",
  },
  {
    name: "Nissan Altima 2021",
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    price: 62,
    rating: 4.6,
    trips: 168,
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop",
  },
  {
    name: "Ford Mustang 2023",
    seats: 4,
    transmission: "Manual",
    fuel: "Gasoline",
    price: 95,
    rating: 4.9,
    trips: 97,
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop",
  },
  {
    name: "Jeep Wrangler 2022",
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    price: 89,
    rating: 4.7,
    trips: 142,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop",
  },
  {
    name: "BMW 3 Series 2023",
    seats: 5,
    transmission: "Automatic",
    fuel: "Gasoline",
    price: 110,
    rating: 4.9,
    trips: 88,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
  },
  {
    name: "Mercedes-Benz C-Class 2022",
    seats: 5,
    transmission: "Automatic",
    fuel: "Gasoline",
    price: 118,
    rating: 4.8,
    trips: 102,
    image:
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&h=400&fit=crop",
  },
  {
    name: "Honda Civic 2021",
    seats: 5,
    transmission: "Automatic",
    fuel: "Gasoline",
    price: 58,
    rating: 4.5,
    trips: 256,
    image:
      "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=600&h=400&fit=crop",
  },
  {
    name: "Chevrolet Camaro 2023",
    seats: 4,
    transmission: "Manual",
    fuel: "Gasoline",
    price: 99,
    rating: 4.8,
    trips: 76,
    image:
      "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=600&h=400&fit=crop",
  },
  {
    name: "Tesla Model 3 2023",
    seats: 5,
    transmission: "Automatic",
    fuel: "Electric",
    price: 105,
    rating: 4.9,
    trips: 191,
    image:
      "https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=600&h=400&fit=crop",
  },
  {
    name: "Audi Q5 2022",
    seats: 5,
    transmission: "Automatic",
    fuel: "Gasoline",
    price: 115,
    rating: 4.7,
    trips: 84,
    image:
      "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=600&h=400&fit=crop",
  },
  {
    name: "Hyundai Tucson 2022",
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    price: 68,
    rating: 4.6,
    trips: 133,
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop",
  },
  {
    name: "Kia Sportage 2023",
    seats: 5,
    transmission: "Automatic",
    fuel: "Gasoline",
    price: 64,
    rating: 4.5,
    trips: 119,
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop",
  },
  {
    name: "Volkswagen Tiguan 2022",
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    price: 71,
    rating: 4.6,
    trips: 107,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
  },
  {
    name: "Range Rover Evoque 2023",
    seats: 5,
    transmission: "Automatic",
    fuel: "Gasoline",
    price: 142,
    rating: 4.9,
    trips: 61,
    image:
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&h=400&fit=crop",
  },
  {
    name: "Mazda CX-5 2021",
    seats: 5,
    transmission: "Automatic",
    fuel: "Gasoline",
    price: 60,
    rating: 4.6,
    trips: 178,
    image:
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600&h=400&fit=crop",
  },
];

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

function diffInDays(from, to) {
  const ms = new Date(to) - new Date(from);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

/** Builds a wa.me link pre-filled with the booking details. Not called in demo mode — kept here so the live WhatsApp redirect can be re-enabled by calling this in handleBook. */
function buildWhatsAppUrl({ car, pickup, dropoff, days, total }) {
  const message = [
    `Hi Millennium Group! I'd like to book the *${car.name}*.`,
    "",
    `Pick-up: ${pickup}`,
    `Drop-off: ${dropoff} (${days} day${days > 1 ? "s" : ""})`,
    `Estimated total: ${formatINR(total)}`,
    "",
    "Please confirm availability.",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Skeleton placeholder shown while listings "load" */
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
          src={car.image}
          alt={car.name}
          className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute top-4 right-4 rounded-lg bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
          <span className="text-lg font-bold text-[#E53E3E]">
            {formatINR(car.price)}
          </span>
          <span className="text-xs text-gray-500">/day</span>
        </div>

        <div className="absolute top-4 left-4 flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {car.rating}
        </div>

        {/* Quick view button revealed on hover */}
        <button
          onClick={() => onSelect(car)}
          className="absolute inset-x-4 bottom-4 translate-y-3 rounded-xl bg-white/95 py-2.5 text-sm font-semibold text-gray-900 opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Quick View
        </button>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg text-gray-900">{car.name}</h3>
        </div>
        <p className="mb-3 text-xs text-gray-400">
          {car.trips} trips completed
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
  const [step, setStep] = useState("form"); // form -> sent
  const [closing, setClosing] = useState(false);

  const days = diffInDays(pickup, dropoff);
  const subtotal = days * car.price;
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

  const handleBook = () => {
    // Demo mode: no live WhatsApp redirect — just show what would be sent
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

      <div className="lst-modal-card relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md transition hover:bg-white hover:text-gray-900"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={car.image}
            alt={car.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5 text-white">
            <h3 className="text-xl font-bold">{car.name}</h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-white/80">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {car.rating} · {car.trips} trips
            </div>
          </div>
        </div>

        {step !== "sent" ? (
          <div className="p-6">
            <div className="mb-5 flex items-center gap-4 text-sm text-gray-500">
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

            <div className="grid grid-cols-2 gap-3">
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
              Free cancellation up to 24 hours before pick-up
            </div>

            <button
              onClick={handleBook}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-semibold text-white transition-all hover:bg-[#1ebe5a] active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              Book Now via WhatsApp · {formatINR(total)}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <div className="lst-pop mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">
              Booking request ready
            </h4>
            <p className="mt-1.5 max-w-xs text-sm text-gray-500">
              In the live site, this would open WhatsApp with your booking
              details pre-filled and send them straight to our team. Here's a
              preview of that message:
            </p>

            <div className="mt-5 w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-left text-xs leading-relaxed text-gray-600">
              <p>
                Hi Millennium Group! I'd like to book the{" "}
                <span className="font-semibold">{car.name}</span>.
              </p>
              <p className="mt-2">Pick-up: {pickup}</p>
              <p>
                Drop-off: {dropoff} ({days} day{days > 1 ? "s" : ""})
              </p>
              <p>Estimated total: {formatINR(total)}</p>
              <p className="mt-2">Please confirm availability.</p>
            </div>

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-600">
              Demo mode · no message sent
            </span>

            <button
              onClick={handleClose}
              className="mt-6 w-full rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
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
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setLoading(false), 900);
    const t2 = setTimeout(() => setVisible(true), 950);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : cars.map((car, index) => (
                <CarCard
                  key={car.name}
                  car={car}
                  index={index}
                  visible={visible}
                  onSelect={setSelectedCar}
                />
              ))}
        </div>
      </div>

      {selectedCar && (
        <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </section>
  );
}
