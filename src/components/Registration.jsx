import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Car,
  Users,
  Building2,
  User,
  Phone,
  IdCard,
  Briefcase,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxPFlYns1f4-Evy6-UW1XW4lJltrlKcHppqIsZqQQ7IMif90MFapVPrrkOrTkFUCcgGLQ/exec";

const features = [
  { icon: <ShieldCheck className="h-4 w-4" />, label: "RERA Certified" },
  { icon: <Car className="h-4 w-4" />, label: "500+ Vehicles" },
  { icon: <Users className="h-4 w-4" />, label: "50,000+ Customers" },
];

const DEPARTMENTS = [
  "Fleet Operations",
  "Bookings & Support",
  "Delivery & Logistics",
  "Finance",
  "Properties",
  "Administration",
];

function FloatingField({
  label,
  type = "text",
  value,
  onChange,
  error,
  name,
  icon,
  endAdornment,
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(value) && String(value).length > 0;
  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className="relative">
      <div
        className={`relative rounded-xl transition-shadow ${
          error ? "lg-shake" : focused ? "shadow-[0_0_0_4px_rgba(229,62,62,0.1)]" : ""
        }`}
      >
        {icon && (
          <span
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              focused ? "text-[#E53E3E]" : "text-gray-400"
            }`}
          >
            {icon}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`peer w-full rounded-xl border bg-white py-4 pb-2.5 pt-5 text-sm text-gray-900 outline-none transition-colors ${
            icon ? "pl-11 pr-11" : "px-4 pr-11"
          } ${
            error
              ? "border-red-300 focus:border-red-400"
              : "border-gray-200 focus:border-[#E53E3E]"
          }`}
        />
        <label
          htmlFor={name}
          className={`pointer-events-none absolute transition-all duration-200 ${
            icon ? "left-11" : "left-4"
          } ${
            focused || hasValue
              ? "top-2 text-[11px] font-medium text-[#E53E3E]"
              : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
          }`}
        >
          {label}
        </label>
        {endAdornment && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{endAdornment}</span>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

function FloatingSelect({ label, value, onChange, error, name, icon, options }) {
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(value);
  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className="relative">
      <div
        className={`relative rounded-xl transition-shadow ${
          error ? "lg-shake" : focused ? "shadow-[0_0_0_4px_rgba(229,62,62,0.1)]" : ""
        }`}
      >
        {icon && (
          <span
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              focused ? "text-[#E53E3E]" : "text-gray-400"
            }`}
          >
            {icon}
          </span>
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`peer w-full appearance-none rounded-xl border bg-white py-4 pb-2.5 pt-5 text-sm text-gray-900 outline-none transition-colors ${
            icon ? "pl-11 pr-9" : "px-4 pr-9"
          } ${
            error
              ? "border-red-300 focus:border-red-400"
              : "border-gray-200 focus:border-[#E53E3E]"
          }`}
        >
          <option value="" disabled />
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <label
          htmlFor={name}
          className={`pointer-events-none absolute transition-all duration-200 ${
            icon ? "left-11" : "left-4"
          } ${
            focused || hasValue
              ? "top-2 text-[11px] font-medium text-[#E53E3E]"
              : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
          }`}
        >
          {label}
        </label>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordStrength({ password }) {
  const rules = [
    { test: (p) => p.length >= 8, label: "8+ characters" },
    { test: (p) => /[A-Z]/.test(p), label: "Uppercase letter" },
    { test: (p) => /[0-9]/.test(p), label: "A number" },
  ];
  const passed = rules.filter((r) => r.test(password)).length;
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {rules.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < passed
                ? passed === 3
                  ? "bg-emerald-500"
                  : passed === 2
                  ? "bg-amber-400"
                  : "bg-red-400"
                : "bg-gray-100"
            }`}
          />
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
        {rules.map((r) => (
          <span
            key={r.label}
            className={`flex items-center gap-1 text-[11px] ${
              r.test(password) ? "text-emerald-600" : "text-gray-400"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" /> {r.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function StaffSignup() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    employeeId: "",
    email: "",
    phone: "",
    department: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Enter your full name";
    if (!form.employeeId.trim()) next.employeeId = "Enter your employee ID";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = "Enter a valid 10-digit number";
    if (!form.department) next.department = "Select your department";
    if (!form.password || form.password.length < 8)
      next.password = "Password must be at least 8 characters";
    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords don't match";
    if (!agreedToPolicy) next.agreedToPolicy = "Accept the staff usage policy to continue";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setStatus("loading");

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "signup",
          name: form.fullName.trim(),
          employeeId: form.employeeId.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          department: form.department,
          password: form.password,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        setStatus("idle");
        setServerError(result.message || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setTimeout(() => navigate("/login"), 1600);
    } catch (err) {
      setStatus("idle");
      setServerError("Couldn't reach the server. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <style>{`
        .lg-reveal { transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        @keyframes lg-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(2deg); }
        }
        .lg-blob { animation: lg-float 11s ease-in-out infinite; }
        @keyframes lg-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -12px); }
        }
        .lg-car-ghost { animation: lg-drift 8s ease-in-out infinite; }
        @keyframes lg-pop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
        .lg-pop { animation: lg-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes lg-progress { from { width: 0%; } to { width: 100%; } }
        .lg-progress { animation: lg-progress 1.4s linear both; }
        @keyframes lg-shine {
          0% { transform: translateX(-120%) skewX(-15deg); }
          100% { transform: translateX(220%) skewX(-15deg); }
        }
        .lg-btn:hover .lg-shine { animation: lg-shine 0.9s ease; }
        @keyframes lg-shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .lg-shake { animation: lg-shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @media (prefers-reduced-motion: reduce) {
          .lg-reveal, .lg-blob, .lg-pop, .lg-car-ghost, .lg-shine, .lg-progress, .lg-shake { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; width: 100% !important; }
        }
      `}</style>

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT — brand panel */}
        <div className="relative hidden overflow-hidden bg-[#0F1115] lg:block">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=1400&fit=crop"
            alt="Millennium Group fleet on the road"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/85 to-[#0F1115]/60" />
          <div className="lg-blob pointer-events-none absolute -right-24 top-16 h-96 w-96 rounded-full bg-red-600/25 blur-3xl" />
          <div
            className="lg-blob pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-red-600/15 blur-3xl"
            style={{ animationDelay: "3s" }}
          />
          <Car
            className="lg-car-ghost pointer-events-none absolute -right-6 bottom-24 h-64 w-64 text-white/[0.04]"
            strokeWidth={0.8}
          />

          <div className="relative flex h-full flex-col justify-between p-12 text-white">
            <Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#E53E3E] to-red-700 shadow-lg shadow-red-900/30">
                <Car className="h-5 w-5" />
              </span>
              Millennium Group
            </Link>

            <div
              className="lg-reveal max-w-md"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                Join the team running{" "}
                <span className="text-[#E53E3E]">mobility & more</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                This portal is for Millennium Group staff only. Customers book
                vehicles directly on the site — no account needed on their end.
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                {features.map((f, i) => (
                  <span
                    key={f.label}
                    className="lg-reveal flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/80 backdrop-blur-sm"
                    style={{
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? "translateY(0)" : "translateY(12px)",
                      transitionDelay: `${150 + i * 100}ms`,
                    }}
                  >
                    <span className="text-[#E53E3E]">{f.icon}</span>
                    {f.label}
                  </span>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <IdCard className="h-5 w-5 flex-shrink-0 text-red-300/70" />
                  <div>
                    <p className="text-sm font-medium leading-relaxed text-white/85">
                      Your employee ID is verified against HR records before
                      your account is activated.
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      New accounts may need admin approval before first login.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/50">
              <Building2 className="h-4 w-4 text-emerald-400" />
              25+ years of trusted mobility, construction & real estate services
              in Trivandrum.
            </div>
          </div>
        </div>

        {/* RIGHT — form panel */}
        <div className="relative flex items-center justify-center overflow-hidden bg-[#FAFAFA] px-4 py-16 sm:px-6 lg:bg-white lg:px-12">
          <div className="pointer-events-none absolute -right-32 -top-32 hidden h-72 w-72 rounded-full bg-red-50 blur-3xl lg:block" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 hidden h-72 w-72 rounded-full bg-red-50/70 blur-3xl lg:block" />

          <div
            className="lg-reveal relative w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/60 sm:p-9"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <div className="absolute inset-x-8 top-0 h-1 -translate-y-px rounded-full bg-gradient-to-r from-[#E53E3E] via-red-400 to-[#E53E3E]" />

            <Link
              to="/"
              className="mb-8 flex items-center gap-2 text-lg font-extrabold text-gray-900 lg:hidden"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#E53E3E] to-red-700 text-white shadow-lg shadow-red-200">
                <Car className="h-5 w-5" />
              </span>
              Millennium Group
            </Link>

            {status === "success" ? (
              <div className="flex flex-col items-center py-10 text-center" role="status" aria-live="polite">
                <div className="lg-pop mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Account request sent</h2>
                <p className="mt-2 max-w-xs text-sm text-gray-500">
                  Your staff account is pending admin approval. Taking you to
                  sign in now.
                </p>
                <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-gray-100">
                  <div className="lg-progress h-full rounded-full bg-[#E53E3E]" />
                </div>
              </div>
            ) : (
              <>
                <span className="text-sm font-semibold uppercase tracking-wider text-[#E53E3E]">
                  Staff Registration
                </span>
                <h1 className="mb-2 mt-2 text-3xl font-bold text-gray-900">
                  Create your staff account
                </h1>
                <p className="mb-6 text-sm text-gray-500">
                  For Millennium Group employees only. Customers don't need an
                  account to book.
                </p>

                {serverError && (
                  <div className="mb-5 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <FloatingField
                    label="Full Name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    icon={<User className="h-4 w-4" />}
                  />

                  <FloatingField
                    label="Employee ID"
                    name="employeeId"
                    value={form.employeeId}
                    onChange={handleChange}
                    error={errors.employeeId}
                    icon={<IdCard className="h-4 w-4" />}
                  />

                  <FloatingField
                    label="Work Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon={<Mail className="h-4 w-4" />}
                  />

                  <FloatingField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "phone", value: e.target.value.replace(/\D/g, "").slice(0, 10) },
                      })
                    }
                    error={errors.phone}
                    icon={<Phone className="h-4 w-4" />}
                  />

                  <FloatingSelect
                    label="Department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    error={errors.department}
                    icon={<Briefcase className="h-4 w-4" />}
                    options={DEPARTMENTS}
                  />

                  <div>
                    <FloatingField
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      error={errors.password}
                      icon={<Lock className="h-4 w-4" />}
                      endAdornment={
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="text-gray-400 transition hover:text-gray-600"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />
                    <PasswordStrength password={form.password} />
                  </div>

                  <FloatingField
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    icon={<Lock className="h-4 w-4" />}
                    endAdornment={
                      <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="text-gray-400 transition hover:text-gray-600"
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />

                  <div>
                    <label className="flex items-start gap-2.5 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={agreedToPolicy}
                        onChange={(e) => {
                          setAgreedToPolicy(e.target.checked);
                          if (errors.agreedToPolicy) setErrors((er) => ({ ...er, agreedToPolicy: undefined }));
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#E53E3E] focus:ring-[#E53E3E]"
                      />
                      I agree to the staff data-handling and acceptable-use policy.
                    </label>
                    {errors.agreedToPolicy && (
                      <p role="alert" className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.agreedToPolicy}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="lg-btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#E53E3E] to-red-600 py-3.5 font-semibold text-white shadow-lg shadow-red-200 transition-all hover:shadow-red-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    <span className="lg-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/25" />
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
                      </>
                    ) : (
                      <>
                        Create Staff Account <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-[#E53E3E] hover:underline">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}