import GoogleReviews from "./GoogleReviews";
import { ArrowUpRight, MessageSquare, ScanLine } from "lucide-react";
import { business } from "../config/business";

export default function CustomerFeedback() {
  return (
    <section className="bg-[#F8F9FA] px-4 py-16 sm:px-6 lg:py-20">
      <GoogleReviews />
      <div className="mx-auto grid max-w-5xl items-center gap-10 rounded-3xl border border-gray-100 bg-white p-7 shadow-sm sm:p-10 md:grid-cols-[1fr_auto] md:gap-16 lg:p-12">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E53E3E]">
            <MessageSquare className="h-4 w-4" aria-hidden="true" /> Your feedback matters
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How was your journey?</h2>
          <p className="mt-4 max-w-lg leading-relaxed text-gray-600">
            Tell us about your experience with Millennium. Your feedback helps us improve and helps other travelers plan their next trip.
          </p>
          <a
            href={business.reviewUrl || `mailto:${business.email}?subject=Rental%20feedback`}
            target={business.reviewUrl ? "_blank" : undefined}
            rel={business.reviewUrl ? "noopener noreferrer" : undefined}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#E53E3E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600"
          >
            {business.reviewUrl ? "Write a review" : "Email your feedback"}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <figure className="mx-auto w-full max-w-[236px] text-center">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <img
              src="/google-review-qr.png"
              alt="Scan this QR code to leave a review for Millennium Group"
              width="492"
              height="493"
              loading="lazy"
              className="block h-auto w-full"
            />
          </div>
          <figcaption className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-600">
            <ScanLine className="h-4 w-4 text-[#E53E3E]" aria-hidden="true" /> Scan to leave a review
          </figcaption>
          <p className="mt-1 text-xs text-gray-400">Open your phone camera to scan</p>
        </figure>
      </div>
    </section>
  );
}
