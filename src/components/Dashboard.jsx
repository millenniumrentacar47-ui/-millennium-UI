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
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Check,
  Ban,
} from "lucide-react";

const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const formatINR = (v) => INR_FORMATTER.format(v);

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxNa3Y0VCA624GgRHmAAo_bP6ZakNOIBSqwymfXS8sal5saJPW-gJ_6KAZBBcuFbeudcw/exec";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop";

// ---------- Apps Script action names ----------
// These must match whatever your doGet/doPost router dispatches to
// getAllUsers / updateUser / deleteUser / updateUserStatus with.
// If your router uses different strings, only these need to change.
const GET_STAFF_ACTION = "getUsers";
const UPDATE_STAFF_ACTION = "updateUser";
const DELETE_STAFF_ACTION = "deleteUser";
const UPDATE_STAFF_STATUS_ACTION = "updateUserStatus";

const ALL_NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "fleet", label: "Fleet", icon: Car, adminOnly: true },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "staff", label: "Staff", icon: Users, adminOnly: true },
];

const bookingStatusStyle = {
  Pending: "bg-amber-50 text-amber-600",
  Approved: "bg-emerald-50 text-emerald-600",
  Rejected: "bg-red-50 text-red-600",
};
// Staff/user rows share the same Pending/Approved/Rejected status values as bookings
const staffStatusStyle = bookingStatusStyle;
const activeStatusStyle = {
  Active: "bg-emerald-50 text-emerald-600",
  Inactive: "bg-gray-100 text-gray-500",
};

function getStoredUser() {
  try {
    const raw =
      localStorage.getItem("mg_user") || sessionStorage.getItem("mg_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

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

// ---------- Empty form template ----------
const emptyCarForm = {
  name: "",
  model: "",
  year: "",
  seats: "",
  transmission: "Manual",
  fuel: "Petrol",
  features: "",
  price: "",
  rating: "",
  trips: "",
  image: "",
  active: true,
};

function CarFormModal({ initialCar, onClose, onSaved, adminKey }) {
  const isEdit = Boolean(initialCar);
  const [form, setForm] = useState(
    initialCar
      ? {
          name: initialCar.name || "",
          model: initialCar.model || "",
          year: initialCar.year || "",
          seats: initialCar.seats || "",
          transmission: initialCar.transmission || "Manual",
          fuel: initialCar.fuel || "Petrol",
          features: Array.isArray(initialCar.features)
            ? initialCar.features.join(", ")
            : initialCar.features || "",
          price: initialCar.price || "",
          rating: initialCar.rating || "",
          trips: initialCar.trips || "",
          image: initialCar.image || "",
          active: initialCar.active !== false,
        }
      : emptyCarForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const carPayload = {
      name: form.name,
      model: form.model,
      year: Number(form.year) || form.year,
      seats: Number(form.seats) || form.seats,
      transmission: form.transmission,
      fuel: form.fuel,
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      price: Number(form.price) || 0,
      rating: Number(form.rating) || 0,
      trips: Number(form.trips) || 0,
      image: form.image,
      active: form.active,
    };

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(
          isEdit
            ? { action: "updateCar", key: adminKey, id: initialCar.id, car: carPayload }
            : { action: "addCar", key: adminKey, car: carPayload }
        ),
      });
      const result = await res.json();

      if (!result.success) {
        setError(result.message || "Something went wrong");
        setSaving(false);
        return;
      }

      onSaved();
    } catch (err) {
      setError("Couldn't reach the server. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="font-bold text-gray-900">
            {isEdit ? "Edit Vehicle" : "Add Vehicle"}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <label className="col-span-2 block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Vehicle Name
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Maruti - Alto - Manual"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Model
              </span>
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="Lxi"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Year
              </span>
              <input
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                placeholder="2024"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Seats
              </span>
              <input
                name="seats"
                type="number"
                value={form.seats}
                onChange={handleChange}
                placeholder="5"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Price / day (₹)
              </span>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="1000"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Transmission
              </span>
              <select
                name="transmission"
                value={form.transmission}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              >
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Fuel Type
              </span>
              <select
                name="fuel"
                value={form.fuel}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Hybrid</option>
                <option>Electric</option>
                <option>CNG</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Rating
              </span>
              <input
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={handleChange}
                placeholder="4.8"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              />
            </label>

            <label className="col-span-2 block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Features (comma-separated)
              </span>
              <input
                name="features"
                value={form.features}
                onChange={handleChange}
                placeholder="Music Audio Player System, Reverse Sensor"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              />
            </label>

            <label className="col-span-2 block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Image URL (Drive file link, not folder link)
              </span>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://drive.google.com/file/d/FILE_ID/view"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              />
            </label>

            <label className="col-span-2 flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-[#E53E3E] focus:ring-[#E53E3E]"
              />
              <span className="text-sm text-gray-700">
                Active (visible on the public site)
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#E53E3E] py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Add Vehicle"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ car, onClose, onDeleted, adminKey }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "deleteCar", key: adminKey, id: car.id }),
      });
      const result = await res.json();
      if (!result.success) {
        setError(result.message || "Delete failed");
        setDeleting(false);
        return;
      }
      onDeleted();
    } catch (err) {
      setError("Couldn't reach the server. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="font-bold text-gray-900">Delete vehicle?</h3>
        <p className="mt-2 text-sm text-gray-500">
          This will permanently remove{" "}
          <span className="font-semibold text-gray-700">{car.name}</span> from
          your fleet and the public site.
        </p>
        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {error}
          </div>
        )}
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting…
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Staff: edit form modal ----------
const emptyStaffForm = {
  name: "",
  role: "staff",
  employeeId: "",
  phone: "",
  department: "",
  status: "Pending",
};

function StaffFormModal({ staffMember, onClose, onSaved, adminKey }) {
  const [form, setForm] = useState({
    name: staffMember.name || "",
    role: staffMember.role || "staff",
    employeeId: staffMember.employeeId || "",
    phone: staffMember.phone || "",
    department: staffMember.department || "",
    status: staffMember.status || "Pending",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: UPDATE_STAFF_ACTION,
          key: adminKey,
          email: staffMember.email,
          updates: { ...form },
        }),
      });
      const result = await res.json();

      if (!result.success) {
        setError(result.message || "Something went wrong");
        setSaving(false);
        return;
      }

      onSaved();
    } catch (err) {
      setError("Couldn't reach the server. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="font-bold text-gray-900">Edit Staff Member</h3>
            <p className="mt-0.5 text-xs text-gray-400">{staffMember.email}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <label className="col-span-2 block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Full Name
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Role
              </span>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Status
              </span>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Employee ID
              </span>
              <input
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Phone
              </span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              />
            </label>

            <label className="col-span-2 block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Department
              </span>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#E53E3E]"
              />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#E53E3E] py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- Staff: delete confirm modal ----------
function DeleteStaffModal({ staffMember, onClose, onDeleted, adminKey }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: DELETE_STAFF_ACTION,
          key: adminKey,
          email: staffMember.email,
        }),
      });
      const result = await res.json();
      if (!result.success) {
        setError(result.message || "Delete failed");
        setDeleting(false);
        return;
      }
      onDeleted();
    } catch (err) {
      setError("Couldn't reach the server. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="font-bold text-gray-900">Remove staff member?</h3>
        <p className="mt-2 text-sm text-gray-500">
          This will permanently remove{" "}
          <span className="font-semibold text-gray-700">
            {staffMember.name || staffMember.email}
          </span>{" "}
          and revoke their account access.
        </p>
        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {error}
          </div>
        )}
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Removing…
              </>
            ) : (
              "Remove"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({
  fleet,
  fleetLoading,
  bookings,
  bookingsLoading,
  staffList,
  staffLoading,
  isAdmin,
}) {
  const available = fleet.filter((c) => c.active).length;
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const activeBookings = bookings.filter(
    (b) => b.status === "Pending" || b.status === "Approved",
  ).length;
  const monthlyRevenue = bookings
    .filter((b) => b.status === "Approved")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const approvedStaffCount = staffList.filter((s) => s.status === "Approved").length;

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isAdmin && (
          <StatCard
            icon={Car}
            label="Vehicles in Fleet"
            value={fleetLoading ? "…" : fleet.length}
            sub={fleetLoading ? undefined : `${available} active now`}
            delay={0}
          />
        )}
        <StatCard
          icon={Calendar}
          label="Active Bookings"
          value={bookingsLoading ? "…" : activeBookings}
          sub={bookingsLoading ? undefined : `${pendingCount} pending confirmation`}
          delay={80}
        />
        {isAdmin && (
          <StatCard
            icon={Users}
            label="Staff Members"
            value={staffLoading ? "…" : staffList.length}
            sub={staffLoading ? undefined : `${approvedStaffCount} approved`}
            delay={160}
          />
        )}
        <StatCard
          icon={Wallet}
          label="Approved Bookings Revenue"
          value={bookingsLoading ? "…" : formatINR(monthlyRevenue)}
          delay={240}
        />
      </div>

      <div className={`grid gap-6 ${isAdmin ? "lg:grid-cols-2" : ""}`}>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-gray-900">Recent Bookings</h3>
          {bookingsLoading ? (
            <p className="text-sm text-gray-400">Loading bookings…</p>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-gray-400">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {b.customerName}
                    </p>
                    <p className="text-xs text-gray-500">{b.carName}</p>
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
          )}
        </div>

        {isAdmin && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-gray-900">Fleet Status</h3>
            {fleetLoading ? (
              <p className="text-sm text-gray-400">Loading fleet…</p>
            ) : fleet.length === 0 ? (
              <p className="text-sm text-gray-400">No vehicles yet.</p>
            ) : (
              <div className="space-y-3">
                {["Active", "Inactive"].map((status) => {
                  const count = fleet.filter((c) =>
                    status === "Active" ? c.active : !c.active
                  ).length;
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
                            status === "Active" ? "bg-emerald-500" : "bg-gray-300"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FleetTab({ fleet, loading, error, onRefresh, adminKey, requireKey }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [deletingCar, setDeletingCar] = useState(null);

  const openAdd = () => {
    if (!requireKey()) return;
    setEditingCar(null);
    setFormOpen(true);
  };

  const openEdit = (car) => {
    if (!requireKey()) return;
    setEditingCar(car);
    setFormOpen(true);
  };

  const openDelete = (car) => {
    if (!requireKey()) return;
    setDeletingCar(car);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <div>
          <h3 className="font-bold text-gray-900">Vehicle Fleet</h3>
          <p className="text-sm text-gray-500">
            {loading ? "Loading…" : `${fleet.length} vehicles`}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-[#E53E3E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <Plus className="h-4 w-4" /> Add Vehicle
        </button>
      </div>

      {error && (
        <div className="m-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : fleet.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 p-16 text-center">
          <Car className="h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-500">
            No vehicles yet. Add your first one to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {fleet.map((car) => (
            <div
              key={car.id}
              className="overflow-hidden rounded-2xl border border-gray-100"
            >
              <div className="relative">
                <img
                  src={car.image || FALLBACK_IMAGE}
                  alt={car.name}
                  className="h-32 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <div className="absolute top-2 right-2">
                  <StatusPill
                    label={car.active ? "Active" : "Inactive"}
                    styleMap={activeStatusStyle}
                  />
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-900">{car.name}</h4>
                <p className="mt-0.5 text-xs text-gray-500">
                  {[car.model, car.year, `${car.seats} seats`, car.transmission]
                    .filter(Boolean)
                    .join(" · ")}
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

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openEdit(car)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => openDelete(car)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <CarFormModal
          initialCar={editingCar}
          adminKey={adminKey}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            onRefresh();
          }}
        />
      )}

      {deletingCar && (
        <DeleteConfirmModal
          car={deletingCar}
          adminKey={adminKey}
          onClose={() => setDeletingCar(null)}
          onDeleted={() => {
            setDeletingCar(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function BookingsTab({ bookings, loading, error, onRefresh, adminKey, requireKey }) {
  const [actioningId, setActioningId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const handleStatusChange = async (id, status) => {
    if (!requireKey()) return;
    setActioningId(id);
    setActionError(null);
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "updateBookingStatus", key: adminKey, id, status }),
      });
      const result = await res.json();
      if (!result.success) {
        setActionError(result.message || "Failed to update booking");
      } else {
        onRefresh();
      }
    } catch (err) {
      setActionError("Couldn't reach the server. Please try again.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <h3 className="font-bold text-gray-900">All Bookings</h3>
        <span className="text-sm text-gray-500">
          {loading ? "Loading…" : `${bookings.length} total`}
        </span>
      </div>

      {(error || actionError) && (
        <div className="m-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error || actionError}
        </div>
      )}

      {loading ? (
        <div className="space-y-3 p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 p-16 text-center">
          <Calendar className="h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-500">No bookings yet.</p>
        </div>
      ) : (
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
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    BK-{String(b.id).padStart(4, "0")}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{b.customerName}</td>
                  <td className="px-6 py-4">
                    <a
                      href={`tel:${String(b.phone).replace(/\s+/g, "")}`}
                      className="flex items-center gap-1.5 text-gray-500 transition hover:text-[#E53E3E]"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {b.phone}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{b.carName}</td>
                  <td className="px-6 py-4 text-gray-500">{b.pickup}</td>
                  <td className="px-6 py-4 text-gray-500">{b.dropoff}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {formatINR(b.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill label={b.status} styleMap={bookingStatusStyle} />
                  </td>
                  <td className="px-6 py-4">
                    {b.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(b.id, "Approved")}
                          disabled={actioningId === b.id}
                          className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100 disabled:opacity-60"
                        >
                          {actioningId === b.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(b.id, "Rejected")}
                          disabled={actioningId === b.id}
                          className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                        >
                          {actioningId === b.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Ban className="h-3 w-3" />
                          )}
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StaffTab({ staff, loading, error, onRefresh, adminKey, requireKey }) {
  const [editingStaff, setEditingStaff] = useState(null);
  const [deletingStaff, setDeletingStaff] = useState(null);
  const [actioningEmail, setActioningEmail] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Only show staff/admin accounts here, not customer signups
  const staffOnly = staff.filter((s) => s.role !== "customer");

  const openEdit = (member) => {
    if (!requireKey()) return;
    setEditingStaff(member);
  };

  const openDelete = (member) => {
    if (!requireKey()) return;
    setDeletingStaff(member);
  };

  const handleQuickStatus = async (member, status) => {
    if (!requireKey()) return;
    setActioningEmail(member.email);
    setActionError(null);
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: UPDATE_STAFF_STATUS_ACTION,
          key: adminKey,
          email: member.email,
          status,
        }),
      });
      const result = await res.json();
      if (!result.success) {
        setActionError(result.message || "Failed to update status");
      } else {
        onRefresh();
      }
    } catch (err) {
      setActionError("Couldn't reach the server. Please try again.");
    } finally {
      setActioningEmail(null);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <div>
          <h3 className="font-bold text-gray-900">Team Directory</h3>
          <p className="text-sm text-gray-500">
            {loading ? "Loading…" : `${staffOnly.length} members`}
          </p>
        </div>
      </div>

      {(error || actionError) && (
        <div className="m-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error || actionError}
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : staffOnly.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 p-16 text-center">
          <Users className="h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-500">No staff accounts yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {staffOnly.map((person) => (
            <div
              key={person.email}
              className="rounded-2xl border border-gray-100 p-5"
            >
              <div className="flex items-start gap-3">
                <img
                  src={FALLBACK_AVATAR}
                  alt={person.name || person.email}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-bold text-gray-900">
                    {person.name || "(no name)"}
                  </h4>
                  <p className="truncate text-xs capitalize text-gray-500">
                    {person.role}
                  </p>
                </div>
                <StatusPill
                  label={person.status || "Approved"}
                  styleMap={staffStatusStyle}
                />
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-gray-500">
                <p className="font-medium text-gray-400">
                  {person.department || "—"}
                </p>
                {person.phone && (
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {person.phone}
                  </p>
                )}
                <p className="flex items-center gap-1.5 truncate">
                  <Mail className="h-3.5 w-3.5 shrink-0" /> {person.email}
                </p>
                {person.employeeId && (
                  <p className="text-gray-400">ID: {person.employeeId}</p>
                )}
              </div>

              {person.status === "Pending" && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleQuickStatus(person, "Approved")}
                    disabled={actioningEmail === person.email}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-50 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100 disabled:opacity-60"
                  >
                    {actioningEmail === person.email ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleQuickStatus(person, "Rejected")}
                    disabled={actioningEmail === person.email}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-50 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                  >
                    {actioningEmail === person.email ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Ban className="h-3 w-3" />
                    )}
                    Reject
                  </button>
                </div>
              )}

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => openEdit(person)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => openDelete(person)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingStaff && (
        <StaffFormModal
          staffMember={editingStaff}
          adminKey={adminKey}
          onClose={() => setEditingStaff(null)}
          onSaved={() => {
            setEditingStaff(null);
            onRefresh();
          }}
        />
      )}

      {deletingStaff && (
        <DeleteStaffModal
          staffMember={deletingStaff}
          adminKey={adminKey}
          onClose={() => setDeletingStaff(null)}
          onDeleted={() => {
            setDeletingStaff(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function AdminKeyModal({ onSubmit, onClose }) {
  const [key, setKey] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="font-bold text-gray-900">Admin key required</h3>
        <p className="mt-2 text-sm text-gray-500">
          Enter your admin key to manage vehicles, bookings, or staff.
        </p>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Admin key"
          autoFocus
          className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#E53E3E]"
        />
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => key.trim() && onSubmit(key.trim())}
            className="flex-1 rounded-xl bg-[#E53E3E] py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [currentUser] = useState(() => getStoredUser());
  const isAdmin = currentUser?.role === "admin";

  // Nav items visible to this user (staff only see Overview + Bookings)
  const navItems = ALL_NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  const [activeTab, setActiveTab] = useState(
    isAdmin ? "overview" : "bookings"
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [fleet, setFleet] = useState([]);
  const [fleetLoading, setFleetLoading] = useState(true);
  const [fleetError, setFleetError] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  const [staffList, setStaffList] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staffError, setStaffError] = useState(null);

  const [adminKey, setAdminKey] = useState(
    () => sessionStorage.getItem("mg_admin_key") || ""
  );
  const [keyModalOpen, setKeyModalOpen] = useState(false);

  const fetchFleet = async () => {
    setFleetLoading(true);
    setFleetError(null);
    try {
      const res = await fetch(`${APPS_SCRIPT_URL}?includeInactive=true`);
      const result = await res.json();
      if (!result.success) {
        setFleetError(result.message || "Failed to load fleet");
      } else {
        setFleet(result.cars || []);
      }
    } catch (err) {
      setFleetError("Couldn't reach the server. Please try again.");
    } finally {
      setFleetLoading(false);
    }
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const res = await fetch(`${APPS_SCRIPT_URL}?action=getBookings`);
      const result = await res.json();
      if (!result.success) {
        setBookingsError(result.message || "Failed to load bookings");
      } else {
        setBookings(result.bookings || []);
      }
    } catch (err) {
      setBookingsError("Couldn't reach the server. Please try again.");
    } finally {
      setBookingsLoading(false);
    }
  };

  // Pulls the Users sheet via getAllUsers() on the Apps Script side.
  // Expects a response shaped like { success: true, users: [...] }.
  const fetchStaff = async () => {
    setStaffLoading(true);
    setStaffError(null);
    try {
      const res = await fetch(`${APPS_SCRIPT_URL}?action=${GET_STAFF_ACTION}`);
      const result = await res.json();
      if (!result.success) {
        setStaffError(result.message || "Failed to load staff");
      } else {
        setStaffList(result.users || []);
      }
    } catch (err) {
      setStaffError("Couldn't reach the server. Please try again.");
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    // Staff don't need fleet or user-management data at all — skip those fetches for them.
    if (isAdmin) {
      fetchFleet();
      fetchStaff();
    }
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensures an admin key is set before any write action; opens a prompt if missing.
  const requireKey = () => {
    if (adminKey) return true;
    setKeyModalOpen(true);
    return false;
  };

  const handleKeySubmit = (key) => {
    setAdminKey(key);
    sessionStorage.setItem("mg_admin_key", key);
    setKeyModalOpen(false);
  };

  const tabComponents = {
    overview: (
      <OverviewTab
        fleet={fleet}
        fleetLoading={fleetLoading}
        bookings={bookings}
        bookingsLoading={bookingsLoading}
        staffList={staffList}
        staffLoading={staffLoading}
        isAdmin={isAdmin}
      />
    ),
    ...(isAdmin && {
      fleet: (
        <FleetTab
          fleet={fleet}
          loading={fleetLoading}
          error={fleetError}
          onRefresh={fetchFleet}
          adminKey={adminKey}
          requireKey={requireKey}
        />
      ),
    }),
    bookings: (
      <BookingsTab
        bookings={bookings}
        loading={bookingsLoading}
        error={bookingsError}
        onRefresh={fetchBookings}
        adminKey={adminKey}
        requireKey={requireKey}
      />
    ),
    ...(isAdmin && {
      staff: (
        <StaffTab
          staff={staffList}
          loading={staffLoading}
          error={staffError}
          onRefresh={fetchStaff}
          adminKey={adminKey}
          requireKey={requireKey}
        />
      ),
    }),
  };

  // Guard against a stale activeTab (e.g. staff account with "fleet" cached) — fall back safely.
  const safeActiveTab = tabComponents[activeTab] ? activeTab : "bookings";
  const activeLabel = navItems.find((n) => n.id === safeActiveTab)?.label;

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
              const active = safeActiveTab === item.id;
              const pendingCount =
                item.id === "bookings"
                  ? bookings.filter((b) => b.status === "Pending").length
                  : item.id === "staff"
                  ? staffList.filter((s) => s.status === "Pending").length
                  : 0;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#E53E3E] text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {pendingCount > 0 && (
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                        active ? "bg-white text-[#E53E3E]" : "bg-amber-400 text-gray-900"
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="space-y-1 px-4 pb-6">
            {isAdmin && (
              <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            )}
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
                  const active = safeActiveTab === item.id;
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
                  Welcome back{currentUser?.name ? `, ${currentUser.name}` : ""}
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
                {bookings.filter((b) => b.status === "Pending").length > 0 && (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#E53E3E]" />
                )}
              </button>
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop"
                alt="Profile"
                className="h-9 w-9 rounded-full object-cover"
              />
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {tabComponents[safeActiveTab]}
          </main>
        </div>
      </div>

      {keyModalOpen && (
        <AdminKeyModal
          onSubmit={handleKeySubmit}
          onClose={() => setKeyModalOpen(false)}
        />
      )}
    </div>
  );
}