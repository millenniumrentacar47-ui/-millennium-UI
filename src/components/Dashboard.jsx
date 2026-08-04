import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Calendar,
  Users,
  LayoutDashboard,
  Wallet,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Phone,
  Mail,
  TrendingUp,
} from "lucide-react";

const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const formatINR = (v) => INR_FORMATTER.format(v);

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "fleet", label: "Fleet", icon: Car },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "staff", label: "Staff", icon: Users },
];

const fleet = [
  {
    name: "Toyota Camry 2022",
    type: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Gasoline",
    price: 72,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop",
  },
  {
    name: "Ford Mustang 2023",
    type: "Coupe",
    seats: 4,
    transmission: "Manual",
    fuel: "Gasoline",
    price: 95,
    status: "Rented",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop",
  },
  {
    name: "Jeep Wrangler 2022",
    type: "SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    price: 89,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&h=200&fit=crop",
  },
  {
    name: "BMW 3 Series 2023",
    type: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Gasoline",
    price: 110,
    status: "Maintenance",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop",
  },
  {
    name: "Tesla Model 3 2023",
    type: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Electric",
    price: 105,
    status: "Rented",
    image:
      "https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=300&h=200&fit=crop",
  },
  {
    name: "Honda Civic 2021",
    type: "Sedan",
    seats: 5,
    transmission: "Automatic",
    fuel: "Gasoline",
    price: 58,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=300&h=200&fit=crop",
  },
  {
    name: "Hyundai Tucson 2022",
    type: "SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    price: 68,
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop",
  },
  {
    name: "Range Rover Evoque 2023",
    type: "SUV",
    seats: 5,
    transmission: "Automatic",
    fuel: "Gasoline",
    price: 142,
    status: "Maintenance",
    image:
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=300&h=200&fit=crop",
  },
];

const bookings = [
  {
    id: "BK-1042",
    customer: "Ananya Menon",
    phone: "+91 98470 12345",
    car: "Toyota Camry 2022",
    pickup: "2026-08-02",
    dropoff: "2026-08-05",
    amount: 216,
    status: "Confirmed",
  },
  {
    id: "BK-1041",
    customer: "Rahul Nair",
    phone: "+91 94950 23456",
    car: "Ford Mustang 2023",
    pickup: "2026-08-01",
    dropoff: "2026-08-03",
    amount: 190,
    status: "Active",
  },
  {
    id: "BK-1040",
    customer: "Sneha Pillai",
    phone: "+91 97460 34567",
    car: "Tesla Model 3 2023",
    pickup: "2026-07-29",
    dropoff: "2026-07-31",
    amount: 210,
    status: "Completed",
  },
  {
    id: "BK-1039",
    customer: "Vishnu Kumar",
    phone: "+91 96330 45678",
    car: "Jeep Wrangler 2022",
    pickup: "2026-08-04",
    dropoff: "2026-08-09",
    amount: 445,
    status: "Pending",
  },
  {
    id: "BK-1038",
    customer: "Divya Raj",
    phone: "+91 95440 56789",
    car: "Honda Civic 2021",
    pickup: "2026-07-27",
    dropoff: "2026-07-28",
    amount: 58,
    status: "Completed",
  },
  {
    id: "BK-1037",
    customer: "Arjun Das",
    phone: "+91 90480 67890",
    car: "Hyundai Tucson 2022",
    pickup: "2026-08-06",
    dropoff: "2026-08-10",
    amount: 272,
    status: "Confirmed",
  },
];

const staff = [
  {
    name: "Patrick Gomez",
    role: "Founder & Managing Director",
    dept: "Leadership",
    phone: "+91 99470 00500",
    email: "abhilashgomez@gmail.com",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
  },
  {
    name: "Meera Suresh",
    role: "Fleet Operations Manager",
    dept: "Rent A Car",
    phone: "+91 98470 11223",
    email: "meera.suresh@millenniumgroup.in",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
  },
  {
    name: "Vignesh Pillai",
    role: "Bike Rental Lead",
    dept: "Rent A Bike",
    phone: "+91 96330 44556",
    email: "vignesh.pillai@millenniumgroup.in",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
  },
  {
    name: "Anjali Warrier",
    role: "Site Supervisor",
    dept: "Construction",
    phone: "+91 94470 77889",
    email: "anjali.warrier@millenniumgroup.in",
    status: "On Leave",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
  },
  {
    name: "Thomas Abraham",
    role: "Property Manager",
    dept: "Real Estate",
    phone: "+91 95440 33221",
    email: "thomas.abraham@millenniumgroup.in",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=200&h=200&fit=crop",
  },
  {
    name: "Fathima Rasheed",
    role: "Customer Support Lead",
    dept: "Support",
    phone: "+91 97460 55667",
    email: "fathima.rasheed@millenniumgroup.in",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
  },
];

const fleetStatusStyle = {
  Available: "bg-emerald-50 text-emerald-600",
  Rented: "bg-amber-50 text-amber-600",
  Maintenance: "bg-red-50 text-red-600",
};
const bookingStatusStyle = {
  Confirmed: "bg-blue-50 text-blue-600",
  Active: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Completed: "bg-gray-100 text-gray-500",
};
const staffStatusStyle = {
  Active: "bg-emerald-50 text-emerald-600",
  "On Leave": "bg-amber-50 text-amber-600",
};

function StatusPill({ label, styleMap }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styleMap[label] || "bg-gray-100 text-gray-600"}`}
    >
      {label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, delay }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40 + delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="db-reveal rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(14px)",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E53E3E]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-0.5 text-sm text-gray-500">{label}</p>
      {sub && (
        <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
          <TrendingUp className="h-3.5 w-3.5" /> {sub}
        </p>
      )}
    </div>
  );
}

function OverviewTab() {
  const available = fleet.filter((c) => c.status === "Available").length;
  const activeBookings = bookings.filter(
    (b) => b.status === "Active" || b.status === "Confirmed",
  ).length;

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Car}
          label="Vehicles in Fleet"
          value={fleet.length}
          sub={`${available} available now`}
          delay={0}
        />
        <StatCard
          icon={Calendar}
          label="Active Bookings"
          value={activeBookings}
          sub="2 pending confirmation"
          delay={80}
        />
        <StatCard
          icon={Users}
          label="Staff Members"
          value={staff.length}
          sub="5 currently active"
          delay={160}
        />
        <StatCard
          icon={Wallet}
          label="This Month's Revenue"
          value={formatINR(148600)}
          sub="+12% vs last month"
          delay={240}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-gray-900">Recent Bookings</h3>
          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {b.customer}
                  </p>
                  <p className="text-xs text-gray-500">{b.car}</p>
                  <p className="text-xs text-gray-400">{b.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {formatINR(b.amount)}
                  </p>
                  <StatusPill label={b.status} styleMap={bookingStatusStyle} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-gray-900">Fleet Status</h3>
          <div className="space-y-3">
            {["Available", "Rented", "Maintenance"].map((status) => {
              const count = fleet.filter((c) => c.status === status).length;
              const pct = Math.round((count / fleet.length) * 100);
              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{status}</span>
                    <span className="text-gray-500">{count} vehicles</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${
                        status === "Available"
                          ? "bg-emerald-500"
                          : status === "Rented"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function FleetTab() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <h3 className="font-bold text-gray-900">Vehicle Fleet</h3>
        <span className="text-sm text-gray-500">{fleet.length} vehicles</span>
      </div>
      <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {fleet.map((car) => (
          <div
            key={car.name}
            className="overflow-hidden rounded-2xl border border-gray-100"
          >
            <div className="relative">
              <img
                src={car.image}
                alt={car.name}
                className="h-32 w-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <StatusPill label={car.status} styleMap={fleetStatusStyle} />
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-gray-900">{car.name}</h4>
              <p className="mt-0.5 text-xs text-gray-500">
                {car.type} · {car.seats} seats · {car.transmission}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[#E53E3E]">
                  {formatINR(car.price)}
                  <span className="text-xs font-normal text-gray-400">
                    /day
                  </span>
                </span>
                <span className="text-xs text-gray-400">{car.fuel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingsTab() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <h3 className="font-bold text-gray-900">All Bookings</h3>
        <span className="text-sm text-gray-500">{bookings.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-6 py-3 font-medium">Booking ID</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Contact</th>
              <th className="px-6 py-3 font-medium">Vehicle</th>
              <th className="px-6 py-3 font-medium">Pick-up</th>
              <th className="px-6 py-3 font-medium">Drop-off</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">{b.id}</td>
                <td className="px-6 py-4 text-gray-700">{b.customer}</td>
                <td className="px-6 py-4">
                  <a
                    href={`tel:${b.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-1.5 text-gray-500 transition hover:text-[#E53E3E]"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {b.phone}
                  </a>
                </td>
                <td className="px-6 py-4 text-gray-700">{b.car}</td>
                <td className="px-6 py-4 text-gray-500">{b.pickup}</td>
                <td className="px-6 py-4 text-gray-500">{b.dropoff}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {formatINR(b.amount)}
                </td>
                <td className="px-6 py-4">
                  <StatusPill label={b.status} styleMap={bookingStatusStyle} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StaffTab() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <h3 className="font-bold text-gray-900">Team Directory</h3>
        <span className="text-sm text-gray-500">{staff.length} members</span>
      </div>
      <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((person) => (
          <div
            key={person.name}
            className="rounded-2xl border border-gray-100 p-5"
          >
            <div className="flex items-start gap-3">
              <img
                src={person.image}
                alt={person.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-bold text-gray-900">
                  {person.name}
                </h4>
                <p className="truncate text-xs text-gray-500">{person.role}</p>
              </div>
              <StatusPill label={person.status} styleMap={staffStatusStyle} />
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-gray-500">
              <p className="font-medium text-gray-400">{person.dept}</p>
              <p className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {person.phone}
              </p>
              <p className="flex items-center gap-1.5 truncate">
                <Mail className="h-3.5 w-3.5 shrink-0" /> {person.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const tabComponents = {
    overview: <OverviewTab />,
    fleet: <FleetTab />,
    bookings: <BookingsTab />,
    staff: <StaffTab />,
  };

  const activeLabel = navItems.find((n) => n.id === activeTab)?.label;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <style>{`
        .db-reveal { transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1); }
        @media (prefers-reduced-motion: reduce) {
          .db-reveal { transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <div className="flex">
        {/* SIDEBAR — desktop */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#0F1115] text-white lg:flex">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-6 text-lg font-extrabold"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#E53E3E] to-red-700">
              <Car className="h-5 w-5" />
            </span>
            Millennium Group
          </Link>

          <nav className="mt-4 flex-1 space-y-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#E53E3E] text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="space-y-1 px-4 pb-6">
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white">
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <Link
              to="/login"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Link>
          </div>
        </aside>

        {/* MOBILE NAV DRAWER */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileNavOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-[#0F1115] text-white">
              <div className="flex items-center justify-between px-6 py-6">
                <span className="text-lg font-extrabold">Millennium Group</span>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 px-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileNavOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        active
                          ? "bg-[#E53E3E] text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* MAIN */}
        <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white/90 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                className="text-gray-500 lg:hidden"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {activeLabel}
                </h1>
                <p className="hidden text-xs text-gray-400 sm:block">
                  Welcome back, Patrick
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search…"
                  className="w-48 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#E53E3E] focus:bg-white"
                />
              </div>
              <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#E53E3E]" />
              </button>
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop"
                alt="Patrick Gomez"
                className="h-9 w-9 rounded-full object-cover"
              />
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {tabComponents[activeTab]}
          </main>
        </div>
      </div>
    </div>
  );
}
