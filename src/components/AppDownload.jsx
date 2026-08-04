import { ArrowRight } from "lucide-react";
import cars from "../assets/cars.jpg";

export default function FinancingBanner() {
  return (
    <section className="relative overflow-hidden bg-[#C81E1E]">
      <div className="relative flex min-h-[220px] flex-col lg:flex-row lg:min-h-[260px]">
        {/* Photo, full-bleed on the right, fading into the red panel on the left */}
        <div className="absolute inset-0 lg:left-[40%]">
          <img
            src={cars}
            alt="Our car fleet"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Gradient that blends the photo into the red panel */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#C81E1E] via-[#C81E1E]/95 via-30% to-transparent lg:via-[44%]" />

        {/* Text content */}
        <div className="relative z-10 flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:w-[55%] lg:px-14 lg:py-14">
          <span className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-100">
            Financing Made Simple
          </span>
          <h2 className="mb-3 max-w-md text-3xl font-bold leading-tight text-white lg:text-4xl">
            Get Behind the Wheel Today
          </h2>
          <p className="mb-7 max-w-md text-sm text-white/80 lg:text-base">
            Choose from flexible financing options with competitive rates.
            Pre-qualify in minutes and drive home your perfect car.
          </p>
          <button className="flex w-fit items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#C81E1E] transition-all hover:bg-red-50 active:scale-[0.98]">
            Get Pre-Approved
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}