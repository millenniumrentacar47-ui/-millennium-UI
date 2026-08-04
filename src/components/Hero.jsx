import React, { useEffect, useRef, useState } from "react";
import cars from "../assets/cars.jpg";

/**
 * CinematicHero
 * -------------
 * Direction: the page opens like a film slate. Black letterbox bars
 * pull apart on load, a timecode/scene-number HUD frames the shot like
 * a director's monitor, and the car drives across the frame leaving a
 * warm headlight trail — the one signature move this hero is built around.
 *
 * Tokens
 * Color: #0B0B0D (cinema black), #F5F3EE (screen white), #FFB648 (headlight amber),
 *        #E23B3B (taillight red), #6B6D73 (asphalt gray)
 * Type:  Display — "Bebas Neue" (condensed, cinematic, poster-like)
 *        Body    — "Inter"
 *        Utility — "JetBrains Mono" (timecode / HUD labels)
 */

export default function CinematicHero() {
  const [revealed, setRevealed] = useState(false);
  const [time, setTime] = useState("00:00:00:00");
  const startRef = useRef(Date.now());

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const totalFrames = Math.floor(elapsed / (1000 / 24)); // 24fps timecode
      const frames = totalFrames % 24;
      const totalSeconds = Math.floor(totalFrames / 24);
      const seconds = totalSeconds % 60;
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const hours = Math.floor(totalSeconds / 3600);
      const pad = (n) => String(n).padStart(2, "0");
      setTime(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`);
    }, 1000 / 24);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#0B0B0D]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .chf-display {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.01em;
        }
        .chf-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        @keyframes chf-bar-top {
          from { transform: translateY(0%); }
          to { transform: translateY(0%); }
        }
        .chf-letterbox-top {
          transition: height 1.1s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .chf-letterbox-bottom {
          transition: height 1.1s cubic-bezier(0.65, 0, 0.35, 1);
        }

        @keyframes chf-drive {
          0%   { transform: translateX(-45vw) scaleX(1); }
          48%  { transform: translateX(2vw) scaleX(1); }
          52%  { transform: translateX(2vw) scaleX(1); }
          100% { transform: translateX(60vw) scaleX(1); }
        }
        .chf-car {
          animation: chf-drive 7s cubic-bezier(0.45, 0, 0.2, 1) 0.6s 1 both;
        }

        @keyframes chf-trail-grow {
          0%   { opacity: 0; width: 0%; }
          45%  { opacity: 0; width: 0%; }
          50%  { opacity: 0.55; width: 0%; }
          100% { opacity: 0.0; width: 70%; }
        }
        .chf-trail {
          animation: chf-trail-grow 7s ease-out 0.6s 1 both;
        }

        @keyframes chf-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .chf-fade-up {
          animation: chf-fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes chf-grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -3%); }
          30% { transform: translate(3%, 2%); }
          50% { transform: translate(-1%, 3%); }
          70% { transform: translate(2%, -2%); }
          90% { transform: translate(-3%, 1%); }
        }
        .chf-grain {
          animation: chf-grain 8s steps(8) infinite;
        }

        @keyframes chf-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
        .chf-blink { animation: chf-blink 1.4s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .chf-car, .chf-trail, .chf-fade-up, .chf-grain, .chf-blink {
            animation: none !important;
          }
        }
      `}</style>

      {/* Film grain overlay */}
      <div
        className="chf-grain pointer-events-none absolute -inset-8 z-30 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-20 [box-shadow:inset_0_0_18vw_6vw_rgba(0,0,0,0.85)]" />

      {/* Background scene */}
      <div className="relative w-full" style={{ aspectRatio: "21 / 9", minHeight: "78vh" }}>
        <img
          src={cars}
          alt="Car driving through a darkened scene"
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.45] saturate-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/30 to-[#0B0B0D]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/60 via-transparent to-[#0B0B0D]/60" />

        {/* Headlight motion trail */}
        <div
          className="chf-trail absolute left-0 top-[58%] z-10 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-[#FFB648] to-transparent blur-[1px]"
        />

        {/* Driving car silhouette */}
        <div className="chf-car absolute left-1/2 top-[52%] z-10 w-[34vw] max-w-[420px] -translate-y-1/2">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-[#FFB648]/20 blur-2xl" />
            <svg viewBox="0 0 240 90" className="relative w-full drop-shadow-[0_18px_24px_rgba(0,0,0,0.6)]">
              <ellipse cx="120" cy="80" rx="100" ry="6" fill="black" opacity="0.35" />
              <path
                d="M18 60 C18 48 30 40 46 38 L62 24 C68 18 78 14 90 14 L150 14 C162 14 172 18 178 26 L194 40 C210 42 222 50 222 60 L222 62 C222 68 216 72 210 72 L24 72 C18 72 18 68 18 62 Z"
                fill="#16171B"
                stroke="#3a3c42"
                strokeWidth="1.5"
              />
              <path d="M92 18 L150 18 L172 38 L78 38 Z" fill="#0B0B0D" opacity="0.7" />
              <circle cx="62" cy="72" r="14" fill="#0B0B0D" stroke="#55575e" strokeWidth="2" />
              <circle cx="62" cy="72" r="5" fill="#55575e" />
              <circle cx="180" cy="72" r="14" fill="#0B0B0D" stroke="#55575e" strokeWidth="2" />
              <circle cx="180" cy="72" r="5" fill="#55575e" />
              {/* headlight */}
              <ellipse cx="218" cy="48" rx="6" ry="4" fill="#FFB648" />
              {/* taillight */}
              <ellipse cx="22" cy="50" rx="5" ry="3.5" fill="#E23B3B" />
            </svg>
          </div>
        </div>

        {/* Letterbox bars */}
        <div
          className="chf-letterbox-top absolute inset-x-0 top-0 z-20 bg-[#0B0B0D]"
          style={{ height: revealed ? "8%" : "32%" }}
        />
        <div
          className="chf-letterbox-bottom absolute inset-x-0 bottom-0 z-20 bg-[#0B0B0D]"
          style={{ height: revealed ? "8%" : "32%" }}
        />

        {/* HUD: top-left timecode */}
        {/* <div className="chf-mono absolute left-4 top-[9%] z-30 flex items-center gap-2 text-[11px] tracking-widest text-[#F5F3EE]/70 sm:left-8">
          <span className="chf-blink inline-block h-1.5 w-1.5 rounded-full bg-[#E23B3B]" />
          REC&nbsp;&nbsp;{time}
        </div> */}

        {/* HUD: top-right scene marker */}
        {/* <div className="chf-mono absolute right-4 top-[9%] z-30 text-[11px] tracking-widest text-[#F5F3EE]/70 sm:right-8">
          SCENE 01 — TAKE 03
        </div> */}

        {/* HUD: bottom-left aperture / lens info */}
        {/* <div className="chf-mono absolute bottom-[10%] left-4 z-30 text-[10px] tracking-widest text-[#F5F3EE]/50 sm:left-8">
          ƒ/1.8 · 35MM · GOLDEN HOUR
        </div> */}

        {/* HUD: bottom-right frame ratio */}
        {/* <div className="chf-mono absolute bottom-[10%] right-4 z-30 text-[10px] tracking-widest text-[#F5F3EE]/50 sm:right-8">
          2.35 : 1
        </div> */}

        {/* Center content */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
          <p
            className="chf-fade-up chf-mono mb-4 text-[10px] uppercase tracking-[0.35em] text-[#FFB648]/90 sm:text-xs"
            style={{ animationDelay: "1.3s" }}
          >
            Now Casting · Your Next Trip
          </p>

          <h1
            className="chf-display chf-fade-up text-[15vw] leading-[0.85] text-[#F5F3EE] sm:text-7xl md:text-8xl lg:text-9xl"
            style={{ animationDelay: "1.5s" }}
          >
            RENT A CAR FOR 
            <span className="block text-[#FFB648]">YOUR NEXT TRIP</span>
          </h1>

          <p
            className="chf-fade-up mt-5 max-w-md text-sm text-[#F5F3EE]/70 sm:text-base"
            style={{ animationDelay: "1.8s" }}
          >
            Pick up the keys, hit the open road, and let the story write
            itself. Premium cars, ready whenever your next take begins.
          </p>

          <div
            className="chf-fade-up mt-8 flex flex-col items-center gap-3 sm:flex-row"
            style={{ animationDelay: "2s" }}
          >
            <button className="rounded-sm bg-[#FFB648] px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0B0B0D] transition hover:bg-[#ffc874] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB648]">
              Start Your Trip
            </button>
            <button className="rounded-sm border border-[#F5F3EE]/30 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#F5F3EE] transition hover:border-[#F5F3EE]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F3EE]">
              View the Fleet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}