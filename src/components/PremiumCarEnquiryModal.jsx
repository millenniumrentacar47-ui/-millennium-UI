import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

/** Your WhatsApp Business number, country code first, digits only
 *  (no +, no spaces, no dashes). Replace this with the real number. */
const WHATSAPP_NUMBER = "919947000500";

const initialFormData = {
  vehicleType: "CAR",
  pickupLocation: "",
  sameReturnLocation: true,
  returnLocation: "",
  pickupDateTime: "",
  returnDateTime: "",
  fullName: "",
  mobileNumber: "",
};

function buildWhatsAppMessage(formData) {
  const returnLoc = formData.sameReturnLocation
    ? formData.pickupLocation
    : formData.returnLocation;

  const lines = [
    "Hi, I'd like to enquire about a *Premium Car*.",
    "",
    `Vehicle Type: ${formData.vehicleType}`,
    `Pickup Location: ${formData.pickupLocation}`,
    `Return Location: ${returnLoc}`,
    `Pickup Date & Time: ${formData.pickupDateTime}`,
    `Return Date & Time: ${formData.returnDateTime}`,
    "",
    `Name: ${formData.fullName}`,
    `Mobile: ${formData.mobileNumber}`,
  ];

  return lines.join("\n");
}

export default function PremiumCarEnquiryModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
      setSubmitted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
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
        updated.returnLocation = prev.pickupLocation;
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handlePickupLocationChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, pickupLocation: value };
      if (prev.sameReturnLocation) {
        updated.returnLocation = value;
      }
      return updated;
    });

    if (errors.pickupLocation) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.pickupLocation;
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = "Pickup location is required";
    }
    if (!formData.sameReturnLocation && !formData.returnLocation.trim()) {
      newErrors.returnLocation = "Return location is required";
    }
    if (!formData.pickupDateTime) {
      newErrors.pickupDateTime = "Pickup date & time is required";
    }
    if (!formData.returnDateTime) {
      newErrors.returnDateTime = "Return date & time is required";
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
    const message = buildWhatsAppMessage(formData);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setFormData(initialFormData);
      setSubmitted(false);
      onClose();
    }, 1000);
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
                Premium Cars Enquiry
              </h2>
              <p className="mt-0.5 text-xs font-medium text-[#E53E3E]">
                Tell us what you need and we'll get back to you
              </p>
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
                {/* Vehicle Type */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    What type of vehicle? *
                  </label>
                  <div className="flex gap-3">
                    {["CAR", "BIKE", "VAN"].map((type) => (
                      <label
                        key={type}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="radio"
                          name="vehicleType"
                          value={type}
                          checked={formData.vehicleType === type}
                          onChange={handleInputChange}
                          className="h-4 w-4 cursor-pointer text-[#E53E3E]"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pickup Location */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handlePickupLocationChange}
                    placeholder="Enter pickup location"
                    className={inputClass("pickupLocation")}
                  />
                  {errors.pickupLocation && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.pickupLocation}
                    </p>
                  )}
                </div>

                {/* Same return location */}
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="sameReturnLocation"
                    checked={formData.sameReturnLocation}
                    onChange={handleInputChange}
                    className="h-4 w-4 cursor-pointer rounded text-[#E53E3E]"
                  />
                  <span className="text-sm text-gray-700">
                    Same return location
                  </span>
                </label>

                {!formData.sameReturnLocation && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
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

                {/* Pickup Date & Time */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Pickup Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="pickupDateTime"
                    value={formData.pickupDateTime}
                    onChange={handleInputChange}
                    className={inputClass("pickupDateTime")}
                  />
                  {errors.pickupDateTime && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.pickupDateTime}
                    </p>
                  )}
                </div>

                {/* Return Date & Time */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Return Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="returnDateTime"
                    value={formData.returnDateTime}
                    onChange={handleInputChange}
                    className={inputClass("returnDateTime")}
                  />
                  {errors.returnDateTime && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.returnDateTime}
                    </p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
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
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
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