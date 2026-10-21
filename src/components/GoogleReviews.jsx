import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Star, ArrowUpRight, Quote } from "lucide-react";

const listing = "https://www.google.com/search?q=Millennium+Group+Rent+A+Car+Kumarapuram#lrd=0x3b05bdc736e6ee09:0xd5470bb53874ea21,1,,,,";
const reviews = [
  { name: "Iba Kbuli", initials: "IK", rating: 5, excerpt: "The car is good and rates are reasonable.", author: "114912377825914146358" },
  { name: "Venky R", initials: "VR", rating: 5, excerpt: "They have amazing fleet of cars", author: "117613539571335860390" },
  { name: "Divya Sudhakar", initials: "DS", rating: 5, excerpt: "Customer friendly Highly recommend", author: "108619320249059936282" },
];

export default function GoogleReviews() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || interacting || reducedMotion) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % reviews.length), 4500);
    return () => window.clearInterval(timer);
  }, [paused, interacting, reducedMotion, active]);
  const move = delta => setActive(index => (index + delta + reviews.length) % reviews.length);
  return (
    <div className="mx-auto mb-10 max-w-5xl">
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#E53E3E]">Google reviews</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Good journeys. Real stories.</h2>
          <p className="mt-3 max-w-xl leading-relaxed text-gray-600">From the cars to the care along the way, hear what our customers have shared on Google.</p>
        </div>
        <a href={listing} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600 transition hover:border-red-200">
          <span className="text-2xl font-bold text-gray-900">4.8<span className="text-sm font-normal text-gray-500"> / 5</span></span>
          <span className="mt-1 block">Based on 65 Google reviews <ArrowUpRight className="inline h-4 w-4" aria-hidden="true" /></span>
        </a>
      </div>
      <div role="region" aria-roledescription="carousel" aria-label="Customer reviews from Google"
        onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}
        className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg shadow-gray-200/40">
        <div className="flex transition-transform duration-700 ease-in-out motion-reduce:transition-none" style={{ transform: `translateX(-${active * 100}%)` }}>
          {reviews.map((review, index) => (
            <article key={review.author} aria-roledescription="slide" aria-label={`${index + 1} of ${reviews.length}`} aria-hidden={index !== active} inert={index !== active ? "" : undefined} className="relative w-full shrink-0 border-t-4 border-[#E53E3E] p-7 sm:p-10 lg:p-12">
              <Quote aria-hidden="true" className="absolute right-7 top-7 h-16 w-16 text-red-50 sm:right-10 sm:top-10" />
              <div className="relative flex items-center gap-3">
                <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 font-semibold text-[#E53E3E]">{review.initials}</span>
                <div><h3 className="font-semibold text-gray-900">{review.name}</h3><p className="text-xs text-gray-500">Google reviewer</p></div>
              </div>
              <div aria-label={`${review.rating} out of 5 stars`} className="mt-5 flex gap-1 text-amber-500">{Array.from({ length: review.rating }, (_, i) => <Star key={i} aria-hidden="true" className="h-4 w-4 fill-current" />)}</div>
              <blockquote className="relative mt-5 min-h-24 max-w-2xl text-2xl font-medium leading-relaxed tracking-tight text-gray-800 sm:text-3xl">“{review.excerpt}”</blockquote>
              <a tabIndex={index === active ? 0 : -1} href={`https://www.google.com/maps/reviews/data=!4m5!14m4!1m3!1m2!1s${review.author}!2s0x3b05bdc736e6ee09:0xd5470bb53874ea21`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[#E53E3E] hover:underline">Read review on Google <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
            </article>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-7 py-4">
          <div className="flex gap-2">{reviews.map((review, index) => <button key={review.author} onClick={() => setActive(index)} aria-label={`Show review by ${review.name}`} aria-current={index === active ? "true" : undefined} className="flex h-9 w-9 items-center justify-center"><span className={`h-2 rounded-full ${index === active ? "w-6 bg-[#E53E3E]" : "w-2 bg-gray-300"}`} /></button>)}</div>
          <div className="flex gap-2">
            {!reducedMotion && <button onClick={() => setPaused(value => !value)} aria-label={paused ? "Play reviews" : "Pause reviews"} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">{paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}</button>}
            <button onClick={() => move(-1)} aria-label="Previous review" className="rounded-lg p-2 hover:bg-gray-100"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={() => move(1)} aria-label="Next review" className="rounded-lg p-2 hover:bg-gray-100"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <p>Google review excerpts · Rating checked 21 October 2026</p>
        <p>{active + 1} / {reviews.length} · {reducedMotion ? "Use arrows to explore" : paused || interacting ? "Slideshow paused" : "Reviews advance automatically"}</p>
      </div>
    </div>
  );
}
