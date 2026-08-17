import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

/** Your WhatsApp Business number, country code first, digits only
 *  (no +, no spaces, no dashes). Replace this with the real number. */
const WHATSAPP_NUMBER = "919947000500";

function buildWhatsAppMessage(dealTitle, formData) {
  const lines = [
    `Hi, I'd like to enquire about the *${dealTitle}* offer.`,
    "",
    `Name: ${formData.fullName}`,
    `Mobile: ${formData.mobileNumber}`,
  ];

  if (formData.message.trim()) {
    lines.push("");
    lines.push(`Details: ${formData.message.trim()}`);
  }

  return lines.join("\n");
}

const initialFormData = {
  fullName: "",
  mobileNumber: "",
  message: "",
};

export default function DealEnquiryModal({ isOpen, onClose, deal }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
      setSubmitted(false);
    }
  }, [isOpen, deal]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const next = {};
    if (!formData.fullName.trim()) next.fullName = "Full name is required";
    if (!formData.mobileNumber.trim()) {
      next.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ""))) {
      next.mobileNumber = "Please enter a valid 10-digit mobile number";
    }
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitted(true);
    const message = buildWhatsAppMessage(deal?.title || "this offer", formData);
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

  if (!isOpen || !deal) return null;

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
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Claim This Deal</h2>
              <p className="mt-0.5 text-xs font-medium text-[#E53E3E]">
                {deal.title} — {deal.discount} off
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
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={inputClass("fullName")}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={inputClass("mobileNumber")}
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Anything else we should know?
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Preferred dates, vehicle type, etc. (optional)"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#E53E3E]/20 focus:border-[#E53E3E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#E53E3E] px-4 py-3 font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-[#E53E3E] focus:ring-offset-2 active:scale-[0.98]"
                >
                  Claim Offer
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}