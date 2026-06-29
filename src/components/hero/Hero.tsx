"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ChevronDown, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { scrollToId } from "@/components/providers/SmoothScroll";
import { useUI } from "@/store/ui";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// Reordered sequence (see scripts/optimize-frames.mjs):
//   seg1 hand->scatter (0..65) · seg2 sauce (66..128) · seg3 hero (129..170)
const FRAME_COUNT = 171;
const PAD = 4;
const HERO_VH = 330;
const BOUNDARIES = [0.386, 0.754]; // scene boundaries in scroll progress

// Only fetch every Nth source frame (the scrub snaps to the nearest loaded one).
// 171 image requests per homepage hit was overwhelming the host; this cuts it ~3x.
const STRIDE = 3;
const FRAMES: number[] = (() => {
  const a: number[] = [];
  for (let i = 0; i < FRAME_COUNT; i += STRIDE) a.push(i);
  if (a[a.length - 1] !== FRAME_COUNT - 1) a.push(FRAME_COUNT - 1);
  return a;
})();
const LOADED_COUNT = FRAMES.length;

type Scene = { heading: string; sub: string; body: string };
type Stat = { target: number; suffix: string; label: string };

const DEFAULT_SCENES: Scene[] = [
  {
    heading: "Built\nBy Hand",
    sub: "Stacked To Order",
    body: "Seared fillet, melted cheese, crisp lettuce and house B&H mayo — layered by hand and pressed fresh. Scroll and watch it come apart, piece by piece.",
  },
  {
    heading: "Sauced\n& Loaded",
    sub: "Drip You Can Feel",
    body: "From smooth B&H mayo to that famous Algerian kick, every FRYO is finished with sauce that refuses to quit.",
  },
  {
    heading: "This\nIs FRYO",
    sub: "Order In Seconds",
    body: "Tap a burger, build your bag and skip the queue. Your next craving is just one scroll away.",
  },
];

const DEFAULT_STATS: Stat[] = [
  { target: 25, suffix: "K+", label: "Orders Served" },
  { target: 9, suffix: "K+", label: "Happy Customers" },
  { target: 6, suffix: "", label: "Signature Dishes" },
];

export function Hero({ scenes, stats }: { scenes?: Scene[]; stats?: Stat[] }) {
  // The scroll animation assumes 3 scenes; only the copy is dynamic.
  const SCENES = scenes && scenes.length === 3 ? scenes : DEFAULT_SCENES;
  const STATS = stats && stats.length ? stats : DEFAULT_STATS;
  const openFeatured = useUI((s) => s.openFeatured);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(0);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  /* ---------- preload frames (device-appropriate set) ---------- */
  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const base = small ? "/frames-t-sm" : "/frames-t";
    const url = (i: number) =>
      `${base}/${String(i + 1).padStart(PAD, "0")}.webp`;

    const images: HTMLImageElement[] = new Array(LOADED_COUNT);
    for (let d = 0; d < LOADED_COUNT; d++) {
      const img = new Image();
      img.decoding = "async";
      img.src = url(FRAMES[d]);
      const done = () => {
        if (cancelled) return;
        loaded++;
        setProgress(loaded / LOADED_COUNT);
        if (d === 0 && img.complete) draw(0);
        if (loaded === LOADED_COUNT) setReady(true);
      };
      img.onload = done;
      img.onerror = done;
      images[d] = img;
    }
    imagesRef.current = images;
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- canvas (always 'contain' so the full hand is visible) ---------- */
  const sizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // cap DPR at 1.5 — the burger frame redraws on every scrub step, so fill
    // cost scales with pixel count; 1.5 stays crisp while easing hero-scroll jank.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
  };

  const draw = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    currentFrame.current = index;
  };

  /* ---------- timeline + creative text reveals ---------- */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    sizeCanvas();
    draw(currentFrame.current);

    const onResize = () => {
      sizeCanvas();
      draw(currentFrame.current);
    };
    window.addEventListener("resize", onResize);

    if (!ready) {
      return () => window.removeEventListener("resize", onResize);
    }

    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const scenes = sceneRefs.current.filter(Boolean) as HTMLDivElement[];

      type Parts = {
        eyebrow: Element | null;
        headChars: Element[];
        subChars: Element[];
        bodyLines: Element[];
        btns: Element[];
      };

      const parts: Parts[] = scenes.map((el) => {
        const headSplit = new SplitText(el.querySelector(".heading"), {
          type: "lines,chars",
          linesClass: "split-line",
        });
        const subSplit = new SplitText(el.querySelector(".sub"), {
          type: "chars",
          charsClass: "split-char",
        });
        const bodySplit = new SplitText(el.querySelector(".body"), {
          type: "lines",
          linesClass: "split-line",
        });
        splits.push(headSplit, subSplit, bodySplit);
        return {
          eyebrow: el.querySelector(".eyebrow"),
          headChars: headSplit.chars,
          subChars: subSplit.chars,
          bodyLines: bodySplit.lines,
          btns: Array.from(el.querySelectorAll(".hero-btn")),
        };
      });

      const hide = (p: Parts) => {
        gsap.set(p.eyebrow, { y: 18, autoAlpha: 0 });
        gsap.set(p.headChars, { yPercent: 130, autoAlpha: 0, rotateX: -55 });
        gsap.set(p.subChars, { yPercent: 100, autoAlpha: 0 });
        gsap.set(p.bodyLines, { y: 20, autoAlpha: 0 });
        gsap.set(p.btns, { y: 22, autoAlpha: 0, scale: 0.9 });
      };
      parts.forEach(hide);

      const reveal = (i: number) => {
        const p = parts[i];
        hide(p);
        const tl = gsap.timeline();
        tl.to(p.eyebrow, {
          y: 0,
          autoAlpha: 1,
          duration: 0.4,
          ease: "power2.out",
        })
          .to(
            p.headChars,
            {
              yPercent: 0,
              autoAlpha: 1,
              rotateX: 0,
              stagger: 0.035,
              duration: 0.75,
              ease: "back.out(1.6)",
            },
            0,
          )
          .to(
            p.subChars,
            {
              yPercent: 0,
              autoAlpha: 1,
              stagger: 0.014,
              duration: 0.5,
              ease: "power3.out",
            },
            0.18,
          )
          .to(
            p.bodyLines,
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.09,
              duration: 0.5,
              ease: "power2.out",
            },
            0.34,
          )
          .to(
            p.btns,
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              stagger: 0.12,
              duration: 0.5,
              ease: "back.out(1.7)",
            },
            0.46,
          );
        return tl;
      };

      scenes.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 }));
      reveal(0);

      // stats: fade in + count up (once)
      const statsWrap = section.querySelector(".stats-wrap");
      if (statsWrap) {
        gsap.fromTo(
          statsWrap,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.5, ease: "power2.out" },
        );
        section.querySelectorAll<HTMLElement>(".stat-num").forEach((el) => {
          const t = Number(el.dataset.target || "0");
          const suffix = el.dataset.suffix || "";
          const o = { n: 0 };
          gsap.to(o, {
            n: t,
            duration: 1.5,
            delay: 0.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(o.n) + suffix;
            },
          });
        });
      }

      let active = 0;
      const setActive = (i: number) => {
        if (i === active) return;
        gsap.to(scenes[active], {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.in",
        });
        active = i;
        gsap.set(scenes[i], { autoAlpha: 1 });
        reveal(i);
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          const idx = Math.round(p * (LOADED_COUNT - 1));
          if (idx !== currentFrame.current) draw(idx);
          setActive(p < BOUNDARIES[0] ? 0 : p < BOUNDARIES[1] ? 1 : 2);
          if (hintRef.current) {
            gsap.to(hintRef.current, {
              autoAlpha: p > 0.03 ? 0 : 1,
              duration: 0.2,
              overwrite: true,
            });
          }
        },
      });
    }, section);

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === section || trigger.vars?.trigger === section) {
          trigger.kill();
        }
      });
      splits.forEach((split) => split.revert());
      ctx.revert();
      ScrollTrigger.refresh();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative"
      style={{ height: `${HERO_VH}vh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink">
        {/* readability gradients — keep text legible over the burger */}
        <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-ink via-ink/20 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-2/3 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

        {/* transparent burger — floats over the live background, flush with the
            navbar (no gap). mobile: upper band · desktop: full height */}
        <canvas
          ref={canvasRef}
          className="absolute inset-x-0 top-20 z-10 h-[52svh] w-full md:top-0 md:h-full"
        />

        {/* text scenes (single column; left-aligned on desktop) */}
        <div className="absolute inset-0 z-30">
          {SCENES.map((scene, i) => (
            <div
              key={i}
              ref={(el) => {
                sceneRefs.current[i] = el;
              }}
              className="absolute inset-0 flex flex-col items-center justify-end gap-1 px-6 pb-28 text-center opacity-0 md:items-start md:justify-center md:px-16 md:pb-0 md:text-left lg:px-24"
            >
              <div
                className="w-full md:max-w-xl"
                style={{ perspective: "800px" }}
              >
                <span className="eyebrow mb-2 inline-block font-display text-xs tracking-[0.4em] text-gold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:mb-3 md:text-sm">
                  0{i + 1} / 0{SCENES.length}
                </span>
                <h2 className="heading whitespace-pre-line font-display text-6xl leading-[0.85] text-cream drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)] sm:text-7xl lg:text-8xl">
                  {scene.heading}
                </h2>
                <h3 className="sub mt-3 font-display text-3xl tracking-wide text-gold drop-shadow-[0_3px_16px_rgba(0,0,0,0.85)] sm:text-4xl">
                  {scene.sub}
                </h3>
                <p className="body mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-base md:mx-0">
                  {scene.body}
                </p>

                {/* horizontally-aligned CTAs */}
                <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                  <button
                    onClick={openFeatured}
                    data-cursor="ORDER"
                    className="hero-btn pointer-events-auto inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-display text-lg tracking-widest text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(245,196,0,0.5)] sm:text-xl"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Order Now
                  </button>
                  <button
                    onClick={() => scrollToId("#menu")}
                    data-cursor="MENU"
                    className="hero-btn pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gold/70 px-6 py-3 font-display text-lg tracking-widest text-gold transition-all hover:bg-gold hover:text-navy sm:text-xl"
                  >
                    <UtensilsCrossed className="h-5 w-5" />
                    Explore Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* statistics (bottom-right on desktop, bottom-center on mobile) */}
        <div className="stats-wrap absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-6 md:bottom-10 md:left-auto md:right-12 md:translate-x-0 md:gap-10">
          {STATS.map((s) => (
            <div key={s.label} className="text-center md:text-right">
              <div className="font-display text-4xl leading-none text-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] md:text-5xl">
                <span
                  className="stat-num"
                  data-target={s.target}
                  data-suffix={s.suffix}
                >
                  0{s.suffix}
                </span>
              </div>
              <div className="mt-1.5 text-[10px] uppercase tracking-widest text-cream/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] md:text-xs">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* scroll hint (desktop) */}
        <div
          ref={hintRef}
          className="absolute bottom-10 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-cream/60 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] md:flex"
        >
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>

        {/* loader */}
        {!ready && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-ink">
            <div className="font-display text-7xl tracking-wide text-cream">
              FR<span className="text-gold">YO</span>
            </div>
            <div className="h-1 w-56 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gold transition-[width] duration-200"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <span className="font-display text-sm tracking-[0.3em] text-cream/60">
              Firing up the grill… {Math.round(progress * 100)}%
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
