import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EnquiryModal({ isOpen, onClose, serviceTitle = "" }) {
  const [formData, setFormData] = useState({
    vehicleType: "CAR",
    pickupLocation: "",
    sameReturnLocation: true,
    returnLocation: "",
    pickupDateTime: "",
    returnDateTime: "",
    fullName: "",
    mobileNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Prevent body scroll when modal is open
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

      // If "same return location" is checked, sync the return location
      if (name === "sameReturnLocation" && checked) {
        updated.returnLocation = prev.pickupLocation;
      }

      return updated;
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePickupLocationChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, pickupLocation: value };
      // Auto-update return location if same location checkbox is checked
      if (prev.sameReturnLocation) {
        updated.returnLocation = value;
      }
      return updated;
    });

    if (errors.pickupLocation) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.pickupLocation;
        return newErrors;
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

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log("Form submitted:", formData);

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          vehicleType: "CAR",
          pickupLocation: "",
          sameReturnLocation: true,
          returnLocation: "",
          pickupDateTime: "",
          returnDateTime: "",
          fullName: "",
          mobileNumber: "",
        });
        setSubmitted(false);
        onClose();
      }, 2000);
    } else {
      setErrors(newErrors);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">Enquiry Form</h2>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {submitted ? (
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-sm font-semibold text-green-800">
                  ✓ Thank you! Your enquiry has been submitted successfully.
                </p>
                <p className="mt-2 text-xs text-green-700">
                  We'll get back to you soon.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Vehicle Type *
                  </label>
                  <div className="flex gap-3">
                    {["CAR", "BIKE", "VAN"].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="vehicleType"
                          value={type}
                          checked={formData.vehicleType === type}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#E53E3E] cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pickup Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handlePickupLocationChange}
                    placeholder="Enter pickup location"
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#E53E3E]/20 ${
                      errors.pickupLocation
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#E53E3E]"
                    }`}
                  />
                  {errors.pickupLocation && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.pickupLocation}
                    </p>
                  )}
                </div>

                {/* Same Return Location Checkbox */}
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

                {/* Return Location */}
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
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#E53E3E]/20 ${
                        errors.returnLocation
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[#E53E3E]"
                      }`}
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
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Pickup Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="pickupDateTime"
                    value={formData.pickupDateTime}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#E53E3E]/20 ${
                      errors.pickupDateTime
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#E53E3E]"
                    }`}
                  />
                  {errors.pickupDateTime && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.pickupDateTime}
                    </p>
                  )}
                </div>

                {/* Return Date & Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Return Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="returnDateTime"
                    value={formData.returnDateTime}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#E53E3E]/20 ${
                      errors.returnDateTime
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#E53E3E]"
                    }`}
                  />
                  {errors.returnDateTime && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.returnDateTime}
                    </p>
                  )}
                </div>

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
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#E53E3E]/20 ${
                      errors.fullName
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#E53E3E]"
                    }`}
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
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#E53E3E]/20 ${
                      errors.mobileNumber
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#E53E3E]"
                    }`}
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
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
