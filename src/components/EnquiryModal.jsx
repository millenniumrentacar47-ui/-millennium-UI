import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Field configs: one per service type                               */
/* ------------------------------------------------------------------ */

const VEHICLE_OPTIONS = ["CAR", "BIKE"];
const CONSTRUCTION_OPTIONS = ["Construction", "Renovation", "Maintenance"];
const PROPERTY_OPTIONS = [
  "Property Management",
  "Rental",
  "Sale",
  "Advisory",
];

const SERVICE_CONFIG = {
  vehicle: {
    radioLabel: "What type of vehicle? *",
    radioName: "vehicleType",
    radioOptions: VEHICLE_OPTIONS,
    locationLabel: "Pickup Location *",
    locationName: "pickupLocation",
    hasReturnLocation: true,
    dateLabel: "Pickup Date & Time *",
    dateName: "pickupDateTime",
    hasReturnDate: true,
    returnDateLabel: "Return Date & Time *",
    returnDateName: "returnDateTime",
    hasMessage: false,
  },
  construction: {
    radioLabel: "What service do you need? *",
    radioName: "serviceNeeded",
    radioOptions: CONSTRUCTION_OPTIONS,
    locationLabel: "Property Address *",
    locationName: "propertyAddress",
    hasReturnLocation: false,
    dateLabel: "Preferred Date & Time *",
    dateName: "preferredDateTime",
    hasReturnDate: false,
    hasMessage: true,
    messageLabel: "Tell us more about the work",
  },
  property: {
    radioLabel: "What service do you need? *",
    radioName: "serviceNeeded",
    radioOptions: PROPERTY_OPTIONS,
    locationLabel: "Property Location *",
    locationName: "propertyLocation",
    hasReturnLocation: false,
    dateLabel: "Preferred Date & Time *",
    dateName: "preferredDateTime",
    hasReturnDate: false,
    hasMessage: true,
    messageLabel: "Tell us more about your requirement",
  },
};

/** Your WhatsApp Business number, country code first, digits only
 *  (no +, no spaces, no dashes). Replace this with the real number. */
const WHATSAPP_NUMBER = "919947000500";

/** Turns the submitted form into a readable WhatsApp message. */
function buildWhatsAppMessage(serviceTitle, resolvedType, config, formData) {
  const lines = [`Hi, I'd like to enquire about *${serviceTitle}*.`, ""];

  lines.push(`${config.radioLabel.replace(" *", "")}: ${formData[config.radioName]}`);
  lines.push(`${config.locationLabel.replace(" *", "")}: ${formData[config.locationName]}`);

  if (config.hasReturnLocation) {
    const returnLoc = formData.sameReturnLocation
      ? formData[config.locationName]
      : formData.returnLocation;
    lines.push(`Return Location: ${returnLoc}`);
  }

  lines.push(`${config.dateLabel.replace(" *", "")}: ${formData[config.dateName]}`);

  if (config.hasReturnDate) {
    lines.push(
      `${config.returnDateLabel.replace(" *", "")}: ${formData[config.returnDateName]}`
    );
  }

  lines.push("");
  lines.push(`Name: ${formData.fullName}`);
  lines.push(`Mobile: ${formData.mobileNumber}`);

  if (config.hasMessage && formData.message?.trim()) {
    lines.push("");
    lines.push(`Details: ${formData.message.trim()}`);
  }

  return lines.join("\n");
}

/** Maps a card's title to which field-set it should use.
 *  Add new titles here if you add more services. */
function resolveServiceType(serviceTitle = "") {
  const t = serviceTitle.toLowerCase();
  if (t.includes("car") || t.includes("bike")) return "vehicle";
  if (t.includes("construction") || t.includes("maintenance"))
    return "construction";
  if (t.includes("property") || t.includes("real estate")) return "property";
  return "vehicle";
}

export default function EnquiryModal({
  isOpen,
  onClose,
  serviceTitle = "",
  serviceType, // optional: pass this directly to skip title-guessing
}) {
  const resolvedType = serviceType || resolveServiceType(serviceTitle);
  const config = SERVICE_CONFIG[resolvedType] || SERVICE_CONFIG.vehicle;

  const buildInitialFormData = () => ({
    [config.radioName]: config.radioOptions[0],
    [config.locationName]: "",
    sameReturnLocation: true,
    returnLocation: "",
    [config.dateName]: "",
    ...(config.hasReturnDate ? { [config.returnDateName]: "" } : {}),
    fullName: "",
    mobileNumber: "",
    ...(config.hasMessage ? { message: "" } : {}),
  });

  const [formData, setFormData] = useState(buildInitialFormData);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Reset the form whenever a different service is opened
  useEffect(() => {
    if (isOpen) {
      setFormData(buildInitialFormData());
      setErrors({});
      setSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, resolvedType]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };
      if (name === "sameReturnLocation" && checked) {
        updated.returnLocation = prev[config.locationName];
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [config.locationName]: value };
      if (config.hasReturnLocation && prev.sameReturnLocation) {
        updated.returnLocation = value;
      }
      return updated;
    });

    if (errors[config.locationName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[config.locationName];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData[config.locationName]?.trim()) {
      newErrors[config.locationName] = `${config.locationLabel.replace(
        " *",
        ""
      )} is required`;
    }

    if (
      config.hasReturnLocation &&
      !formData.sameReturnLocation &&
      !formData.returnLocation?.trim()
    ) {
      newErrors.returnLocation = "Return location is required";
    }

    if (!formData[config.dateName]) {
      newErrors[config.dateName] = `${config.dateLabel.replace(
        " *",
        ""
      )} is required`;
    }

    if (config.hasReturnDate && !formData[config.returnDateName]) {
      newErrors[config.returnDateName] = `${config.returnDateLabel.replace(
        " *",
        ""
      )} is required`;
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ""))) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);

      const message = buildWhatsAppMessage(
        serviceTitle || resolvedType,
        resolvedType,
        config,
        formData
      );
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`;

      // Give the user a moment to see the confirmation, then hand off to WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        setFormData(buildInitialFormData());
        setSubmitted(false);
        onClose();
      }, 1200);
    } else {
      setErrors(newErrors);
    }
  };

  if (!isOpen) return null;

  const inputClass = (field) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#E53E3E]/20 ${
      errors[field]
        ? "border-red-500"
        : "border-gray-300 focus:border-[#E53E3E]"
    }`;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
          <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white p-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Enquiry Form
              </h2>
              {serviceTitle && (
                <p className="mt-0.5 text-xs font-medium text-[#E53E3E]">
                  {serviceTitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {submitted ? (
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-sm font-semibold text-green-800">
                  ✓ Thanks! Taking you to WhatsApp to send your enquiry.
                </p>
                <p className="mt-2 text-xs text-green-700">
                  If nothing opens, check your pop-up blocker.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Radio group: vehicle type OR service needed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {config.radioLabel}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {config.radioOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={config.radioName}
                          value={opt}
                          checked={formData[config.radioName] === opt}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#E53E3E] cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {config.locationLabel}
                  </label>
                  <input
                    type="text"
                    name={config.locationName}
                    value={formData[config.locationName]}
                    onChange={handleLocationChange}
                    placeholder={`Enter ${config.locationLabel
                      .replace(" *", "")
                      .toLowerCase()}`}
                    className={inputClass(config.locationName)}
                  />
                  {errors[config.locationName] && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[config.locationName]}
                    </p>
                  )}
                </div>

                {/* Same return location (vehicle only) */}
                {config.hasReturnLocation && (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="sameReturnLocation"
                        checked={formData.sameReturnLocation}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded cursor-pointer text-[#E53E3E]"
                      />
                      <span className="text-sm text-gray-700">
                        Same return location
                      </span>
                    </label>

                    {!formData.sameReturnLocation && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Return Location *
                        </label>
                        <input
                          type="text"
                          name="returnLocation"
                          value={formData.returnLocation}
                          onChange={handleInputChange}
                          placeholder="Enter return location"
                          className={inputClass("returnLocation")}
                        />
                        {errors.returnLocation && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.returnLocation}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Date/time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {config.dateLabel}
                  </label>
                  <input
                    type="datetime-local"
                    name={config.dateName}
                    value={formData[config.dateName]}
                    onChange={handleInputChange}
                    className={inputClass(config.dateName)}
                  />
                  {errors[config.dateName] && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[config.dateName]}
                    </p>
                  )}
                </div>

                {/* Return date/time (vehicle only) */}
                {config.hasReturnDate && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {config.returnDateLabel}
                    </label>
                    <input
                      type="datetime-local"
                      name={config.returnDateName}
                      value={formData[config.returnDateName]}
                      onChange={handleInputChange}
                      className={inputClass(config.returnDateName)}
                    />
                    {errors[config.returnDateName] && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors[config.returnDateName]}
                      </p>
                    )}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={inputClass("fullName")}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className={inputClass("mobileNumber")}
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>

                {/* Optional message (construction / property only) */}
                {config.hasMessage && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {config.messageLabel}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any details that'll help us prepare"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#E53E3E]/20 focus:border-[#E53E3E]"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#E53E3E] px-4 py-3 font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-[#E53E3E] focus:ring-offset-2 active:scale-[0.98]"
                >
                  Submit Enquiry
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}