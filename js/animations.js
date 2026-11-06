/* =====================================================================
   ANIMATIONS — GSAP + ScrollTrigger + Lenis.
   Reads nothing from data.js directly; it animates whatever render.js
   built, so adding projects/roles/skills needs no change here.

   Motion modes (decided by gsap.matchMedia, re-evaluated on resize):
     full    → desktop/tablet ≥768px, motion allowed: everything
     lite    → phones <768px, motion allowed: simple vertical reveals
     reduce  → prefers-reduced-motion: no motion, all content visible
   ===================================================================== */
(function () {
  "use strict";
  if (!window.gsap || !window.ScrollTrigger) return; // libs failed → static page still works
  gsap.registerPlugin(ScrollTrigger);

  const root = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const MQ = {
    full:   "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    lite:   "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
    reduce: "(prefers-reduced-motion: reduce)",
    fine:   "(hover: hover) and (pointer: fine)",
    wide:   "(min-width: 961px)", // pipeline runs horizontally (and pins) above this width
  };

  const App = { lenis: null };
  window.App = App;

  /* ================================================== GLOBAL: smooth scroll */
  function initLenis() {
    if (!window.Lenis) return () => {};
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    App.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      App.lenis = null;
    };
  }

  /* In-page links: smooth with Lenis, and move keyboard focus to the target. */
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute("data-placeholder-link")) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = document.getElementById(id.slice(1));
    if (!target) return;
    e.preventDefault();
    const navH = $("#nav").offsetHeight;
    const focusTarget = () => {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    if (App.lenis) {
      App.lenis.scrollTo(target, { offset: id === "#top" ? 0 : -navH + 1, duration: 1.4, onComplete: focusTarget });
    } else {
      target.scrollIntoView({ behavior: matchMedia(MQ.reduce).matches ? "auto" : "smooth" });
      focusTarget();
    }
    history.replaceState(null, "", id === "#top" ? location.pathname : id);
  });

  /* Keyboard users: whatever receives focus must be on screen and visible,
     even if a scroll animation hasn't revealed it yet. */
  window.addEventListener("keydown", (e) => { if (e.key === "Tab") root.classList.add("kbd"); });
  window.addEventListener("pointerdown", () => root.classList.remove("kbd"));
  document.addEventListener("focusin", (e) => {
    if (!App.lenis || !root.classList.contains("kbd")) return;
    const el = e.target;
    const cs = el.closest(".case");
    if (cs && cs._st && el.closest(".case__links")) {
      // jump to the end of that case study so its buttons sit in context
      App.lenis.scrollTo(cs._st.end - 2, { immediate: true });
      const scrub = cs._st.getTween && cs._st.getTween();
      if (scrub) scrub.progress(1);
      return;
    }
    const r = el.getBoundingClientRect();
    const navH = $("#nav").offsetHeight;
    if (r.top < navH + 8 || r.bottom > window.innerHeight - 8) {
      App.lenis.scrollTo(el, { offset: -window.innerHeight / 3, immediate: true });
    }
  });

  /* ================================================ GLOBAL: progress + nav */
  function initChrome() {
    // Scroll-progress bar (tied directly to scroll position, so fine for reduced motion too)
    gsap.to(".progress__bar", {
      scaleX: 1, ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: true },
    });

    // Nav shrinks + turns frosted once the hero has scrolled away
    const nav = $("#nav");
    ScrollTrigger.create({
      trigger: ".hero",
      start: () => `bottom top+=${nav.offsetHeight}`,
      end: "max",
      refreshPriority: -1, // compute after pinned sections add their spacing
      toggleClass: { targets: nav, className: "is-scrolled" },
    });

    // Active-section marker in the nav
    $$(".nav__link").forEach((link) => {
      const sec = document.getElementById(link.getAttribute("href").slice(1));
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec, start: "top center", end: "bottom center",
        refreshPriority: -1,
        onToggle: (self) => {
          link.classList.toggle("is-active", self.isActive);
          self.isActive ? link.setAttribute("aria-current", "true") : link.removeAttribute("aria-current");
        },
      });
    });
  }

  /* ========================================================= GLOBAL: cursor */
  function initCursor() {
    const el = document.createElement("div");
    el.className = "cursor is-hidden";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<div class="cursor__ring"><span class="cursor__label"></span></div><div class="cursor__dot"></div>';
    document.body.appendChild(el);
    root.classList.add("has-cursor");

    const ring = $(".cursor__ring", el), dot = $(".cursor__dot", el), label = $(".cursor__label", el);
    const dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    const INTERACTIVE = "a, button, [role='button'], input, select, textarea, label, summary";
    const onMove = (e) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      el.classList.remove("is-hidden");
    };
    const onOver = (e) => {
      const lab = e.target.closest("[data-cursor-label]");
      const link = e.target.closest(INTERACTIVE);
      el.classList.toggle("is-label", !!lab);
      el.classList.toggle("is-link", !lab && !!link);
      label.textContent = lab ? lab.dataset.cursorLabel : "";
    };
    const onLeave = () => el.classList.add("is-hidden");
    const onDown = () => el.classList.add("is-down");
    const onUp = () => el.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      el.remove();
      root.classList.remove("has-cursor");
    };
  }

  /* ================================================ HERO: data-point field */
  function initField({ animate, interactive }) {
    const canvas = $(".hero__canvas");
    if (!canvas) return () => {};
    const ctx = canvas.getContext("2d");
    const cs = getComputedStyle(root);
    const C_DOT = cs.getPropertyValue("--color-accent").trim() || "#5eead4";
    const C_LINE = cs.getPropertyValue("--color-accent-2").trim() || "#818cf8";

    let w = 0, h = 0, dpr = 1, pts = [], raf = 0, visible = true;
    const mouse = { x: -9999, y: -9999, tx: 0, ty: 0, px: 0, py: 0 };
    const LINK = 130, REPEL = 140;

    function build() {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(interactive ? 110 : 45, Math.round((w * h) / (interactive ? 13000 : 20000)));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        ox: 0, oy: 0, z: 0.4 + Math.random() * 0.6, // z = depth for parallax
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      mouse.px += (mouse.tx - mouse.px) * 0.05;
      mouse.py += (mouse.ty - mouse.py) * 0.05;

      for (const p of pts) {
        if (animate) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;
        }
        // gentle push away from the cursor
        let tx = 0, ty = 0;
        if (interactive) {
          const ddx = p.x - mouse.x, ddy = p.y - mouse.y, d = Math.hypot(ddx, ddy);
          if (d < REPEL && d > 0.01) { const f = (1 - d / REPEL) * 22; tx = (ddx / d) * f; ty = (ddy / d) * f; }
        }
        p.ox += (tx - p.ox) * 0.08; p.oy += (ty - p.oy) * 0.08;
        p.rx = p.x + p.ox + mouse.px * p.z * 18;
        p.ry = p.y + p.oy + mouse.py * p.z * 18;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], d = Math.hypot(a.rx - b.rx, a.ry - b.ry);
          if (d < LINK) {
            ctx.globalAlpha = (1 - d / LINK) * 0.35 * Math.min(a.z, b.z);
            ctx.strokeStyle = C_LINE;
            ctx.beginPath(); ctx.moveTo(a.rx, a.ry); ctx.lineTo(b.rx, b.ry); ctx.stroke();
          }
        }
      }
      ctx.fillStyle = C_DOT;
      for (const p of pts) {
        ctx.globalAlpha = 0.35 + p.z * 0.5;
        ctx.beginPath(); ctx.arc(p.rx, p.ry, p.z * 1.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    const loop = () => { draw(); raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0; };
    const start = () => { if (!raf && animate) raf = requestAnimationFrame(loop); };

    build(); draw(); start();

    // pause when the hero is off-screen or the tab is hidden (saves battery, keeps 60fps elsewhere)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    io.observe(canvas);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener("visibilitychange", onVis);

    let rt;
    const ro = new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => { build(); draw(); }, 150); });
    ro.observe(canvas);

    const hero = $(".hero");
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * -2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * -2;
    };
    const onOut = () => { mouse.x = mouse.y = -9999; mouse.tx = mouse.ty = 0; };
    if (interactive) { hero.addEventListener("pointermove", onMove, { passive: true }); hero.addEventListener("pointerleave", onOut); }

    return () => {
      cancelAnimationFrame(raf); raf = 0; io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      hero.removeEventListener("pointermove", onMove); hero.removeEventListener("pointerleave", onOut);
    };
  }

  /* ========================================================== HERO: intro */
  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.1 } });
    tl.from(".hero__canvas", { opacity: 0, duration: 2, ease: "power1.out" }, 0)
      .from(".hero .eyebrow", { y: 16, opacity: 0, duration: 0.8 }, 0.15)
      .from(".hero__name", { yPercent: 40, opacity: 0, filter: "blur(8px)" }, 0.25)
      .from(".hero__role", { y: 16, opacity: 0, duration: 0.8 }, 0.5)
      .from(".hero__headline .word__inner", { yPercent: 115, opacity: 0, stagger: 0.055, duration: 0.9 }, 0.65)
      .from(".scroll-cue", { opacity: 0, y: -10, duration: 0.8 }, "-=0.4");
    return tl;
  }

  function heroScrollOut() {
    // Content drifts up and fades as you scroll into the next chapter.
    gsap.to(".hero__content", {
      yPercent: -18, opacity: 0, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero__canvas, .hero__grid", {
      opacity: 0.25, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "center top", end: "bottom top", scrub: true },
    });
  }

  function scrollCue() {
    const cue = $(".scroll-cue");
    if (!cue) return () => {};
    const bounce = gsap.to(cue, { y: 10, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });
    const done = () => {
      if (window.scrollY < 8) return;
      bounce.kill(); cue.classList.add("is-done");
      window.removeEventListener("scroll", done);
    };
    window.addEventListener("scroll", done, { passive: true });
    return () => { bounce.kill(); window.removeEventListener("scroll", done); cue.classList.remove("is-done"); };
  }

  /* =========================================================== SHARED */
  const fmt = (n, d = 0) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const decimalsOf = (el) => parseInt(el.dataset.decimals || "0", 10) || 0;

  /* Count a .count[data-count] element from 0 to its value. */
  function countUp(el, { duration = 1.8, delay = 0 } = {}) {
    const end = parseFloat(el.dataset.count) || 0;
    const o = { v: 0 };
    el.textContent = "0";
    return gsap.to(o, {
      v: end, duration, delay, ease: "power3.out",
      onUpdate: () => (el.textContent = fmt(o.v, decimalsOf(el))),
    });
  }

  /* Count when scrolled into view (once). */
  function countOnView(scope, opts) {
    $$(".count", scope).forEach((el, i) => {
      el.textContent = "0";
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: () => countUp(el, { delay: i * 0.12, ...opts }),
      });
    });
  }

  /* =========================================================== ABOUT */
  function aboutPinned() {
    const section = $(".about");
    const pin = $(".about__pin", section);
    const lines = $$(".story__line", section);
    if (!lines.length) return () => {};

    // "01 / 04" step counter beside the story
    const meter = document.createElement("p");
    meter.className = "story__meter mono";
    meter.setAttribute("aria-hidden", "true");
    meter.innerHTML = `<span class="story__now">01</span> / ${String(lines.length).padStart(2, "0")}
      <span class="story__track"><span class="story__fill"></span></span>`;
    ($(".about__story", pin) || $(".container", pin)).appendChild(meter);
    const now = $(".story__now", meter);

    gsap.set(lines, { opacity: 0, y: 60, filter: "blur(6px)" });
    gsap.set(lines[0], { opacity: 1, y: 0, filter: "blur(0px)" });

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut", duration: 1 },
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: () => `+=${lines.length * window.innerHeight * 0.75}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const i = Math.min(lines.length - 1, Math.floor(self.progress * lines.length * 0.999));
          now.textContent = String(i + 1).padStart(2, "0");
        },
      },
    });

    tl.to(".story__fill", { scaleX: 1, ease: "none", duration: lines.length }, 0);
    lines.forEach((line, i) => {
      if (i === 0) return;
      const at = i - 0.5;
      // previous line fades back (dims, drifts up, softens) …
      tl.to(lines[i - 1], { opacity: 0, y: -60, filter: "blur(6px)", duration: 0.6, ease: "power2.in" }, at);
      // … as the next one arrives
      tl.to(line, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }, at + 0.4);
    });
    tl.to({}, { duration: 0.5 }); // hold the last line before releasing

    return () => meter.remove();
  }

  function aboutLite() {
    $$(".story__line").forEach((line) =>
      gsap.from(line, {
        opacity: 0, y: 30, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: line, start: "top 88%", once: true },
      }));
  }

  function aboutStats() {
    gsap.from(".stat", {
      opacity: 0, y: 40, duration: 0.9, ease: "power3.out", stagger: 0.12,
      scrollTrigger: { trigger: ".stats", start: "top 85%", once: true },
    });
    countOnView($(".stats"));
  }

  /* =========================================================== SKILLS */
  function skillsReveal({ depth }) {
    const cards = $$(".skill-card");
    gsap.set(cards, depth
      ? { opacity: 0, y: 70, rotateX: -18, transformOrigin: "50% 100%" }
      : { opacity: 0, y: 30 });
    ScrollTrigger.batch(cards, {
      start: "top 90%", once: true,
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
        clearProps: "transform", // hand transform back to CSS so hover tilt works
      }),
    });
  }

  /* 3D hover tilt for any .tilt element (skills, GitHub cards — even ones added later). */
  function initTilt() {
    const MAX = 8; // degrees
    let current = null;
    const reset = (el) => {
      el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--go", "0");
    };
    const onMove = (e) => {
      const el = e.target.closest(".tilt");
      if (current && current !== el) reset(current);
      current = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${(px - 0.5) * MAX * 2}deg`);
      el.style.setProperty("--rx", `${(0.5 - py) * MAX * 2}deg`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
      el.style.setProperty("--go", "1");
    };
    const onLeave = () => { if (current) reset(current); current = null; };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    root.classList.add("has-tilt");
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      $$(".tilt").forEach(reset);
      root.classList.remove("has-tilt");
    };
  }

  /* ================================================= SECTION HEADINGS */
  function revealHeadings() {
    $$("main > section:not(.hero):not(.about)").forEach((sec) => {
      const els = $$(":scope > .container > .section-label, :scope > .container > .section-title, :scope > .container > .section-intro", sec);
      if (!els.length) return;
      gsap.from(els, {
        opacity: 0, y: 36, duration: 0.9, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: els[0], start: "top 85%", once: true },
      });
    });
  }

  /* ===================================================== CHART MOTION */
  /* Builds a paused timeline that "draws" one .case__visual.
     Works for bar / line / kpi / image; the same timeline is scrubbed by
     scroll on desktop and simply played on phones. */
  function chartTimeline(visual) {
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    const type = visual.dataset.type;

    if (type === "bar") {
      const rects = $$(".bar__rect", visual);
      tl.from(rects, { scaleY: 0, transformOrigin: "50% 100%", duration: 1, stagger: 0.12 }, 0)
        .from($$(".bar__value", visual), { opacity: 0, y: 10, duration: 0.5, stagger: 0.12 }, 0.4)
        .from($$(".axis-label", visual), { opacity: 0, duration: 0.5, stagger: 0.05 }, 0);
    } else if (type === "line") {
      const path = $(".line__path", visual);
      gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
      tl.to(path, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0)
        .from($(".line__area", visual), { opacity: 0, duration: 0.8 }, 0.6)
        .from($$(".line__dot", visual), { scale: 0, transformOrigin: "50% 50%", duration: 0.4, stagger: 0.18, ease: "back.out(3)" }, 0.1)
        .from($(".line__end", visual), { opacity: 0, y: 8, duration: 0.4 }, 1.2)
        .from($$(".gridline, .axis-label", visual), { opacity: 0, duration: 0.6 }, 0);
    } else if (type === "kpi") {
      $$(".count", visual).forEach((el) => {
        const end = parseFloat(el.dataset.count) || 0, o = { v: 0 };
        tl.fromTo(o, { v: 0 }, {
          v: end, duration: 1.4, ease: "power2.out",
          onUpdate: () => (el.textContent = fmt(o.v, decimalsOf(el))),
        }, 0);
      });
      tl.from($$(".kpi__label", visual), { opacity: 0, y: 10, duration: 0.6 }, 0.3);
    } else if (type === "image") {
      const media = $("img, .shot__ph", visual);
      tl.fromTo(visual, { clipPath: "inset(12% 12% 12% 12% round 14px)" },
                        { clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1.2, ease: "power2.inOut" }, 0)
        .from(media, { scale: 1.25, duration: 1.4, ease: "power2.out" }, 0);
    }
    return tl;
  }

  /* ========================================================= PROJECTS */
  function casesPinned() {
    $$(".case").forEach((cs) => {
      const pin = $(".case__pin", cs);
      const steps = $$(".case__step", cs);
      const marks = $$(".case__progress li", cs);
      const charts = steps.map((s) => chartTimeline($(".case__visual", s)));
      const n = steps.length;

      steps.forEach((s, i) => {
        if (i === 0) return;
        gsap.set($(".case__text", s), { opacity: 0, y: 50 });
        gsap.set($(".case__visual", s), { opacity: 0, scale: 0.94 });
      });
      gsap.set($(".case__links", cs), { opacity: 0, y: 20 });

      const setActive = (i) => marks.forEach((m, k) => {
        m.classList.toggle("is-active", k === i);
        m.classList.toggle("is-done", k < i);
      });
      setActive(0);

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: pin, start: "top top",
          end: () => `+=${n * window.innerHeight}`,
          pin: true, scrub: 0.7, anticipatePin: 1,
          onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n * 0.999))),
        },
      });

      // Step 1 draws its chart as the case settles in.
      tl.add(charts[0].tweenFromTo(0, charts[0].duration(), { ease: "none" }), 0);
      let t = Math.max(1, charts[0].duration());

      for (let i = 1; i < n; i++) {
        const prev = steps[i - 1], cur = steps[i];
        tl.to($(".case__text", prev), { opacity: 0, y: -50, duration: 0.5 }, t + 0.3)
          .to($(".case__visual", prev), { opacity: 0, scale: 1.04, duration: 0.5 }, t + 0.3)
          .to($(".case__text", cur), { opacity: 1, y: 0, duration: 0.6 }, t + 0.7)
          .to($(".case__visual", cur), { opacity: 1, scale: 1, duration: 0.6 }, t + 0.7)
          .add(charts[i].tweenFromTo(0, charts[i].duration(), { ease: "none" }), t + 0.8);
        t += 0.8 + Math.max(1, charts[i].duration());
      }
      cs._st = tl.scrollTrigger; // used by keyboard focus handling
      tl.to($(".case__links", cs), { opacity: 1, y: 0, duration: 0.5 }, t)
        .to({}, { duration: 0.6 }); // hold before release
    });
  }

  function casesLite() {
    $$(".case").forEach((cs) => {
      gsap.from($(".case__head", cs), {
        opacity: 0, y: 30, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: cs, start: "top 85%", once: true },
      });
      $$(".case__step", cs).forEach((s) => {
        const chart = chartTimeline($(".case__visual", s));
        gsap.from($(".case__text", s), {
          opacity: 0, y: 30, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: s, start: "top 85%", once: true },
        });
        gsap.from($(".case__visual", s), {
          opacity: 0, y: 30, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: $(".case__visual", s), start: "top 88%", once: true, onEnter: () => chart.play(0) },
        });
      });
    });
  }

  /* Horizontal gallery driven by vertical scroll (desktop only). */
  function galleryHorizontal() {
    const wrap = $(".gallery"), track = $(".gallery__track");
    if (!wrap || !track) return;
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -distance(), ease: "none",
      scrollTrigger: {
        trigger: wrap, start: "center center", pinType: "transform",
        end: () => `+=${distance()}`,
        pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });
    // Depth: neighbouring screenshots drift up and down at different rates as they cross the screen.
    $$(".gallery__item", track).forEach((item, i) => {
      const d = i % 2 ? 36 : -36;
      gsap.fromTo(item, { y: d }, {
        y: -d, ease: "none",
        scrollTrigger: { trigger: item, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
      });
    });
  }

  function galleryLite() {
    $$(".gallery__item").forEach((item) =>
      gsap.from(item, {
        opacity: 0, y: 30, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 90%", once: true },
      }));
  }

  /* "More case studies" cards: stagger in, numbers count up. */
  function moreReveal({ depth }) {
    const wrap = $("#more");
    if (!wrap) return;
    gsap.from(".more__title", {
      opacity: 0, y: 24, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: wrap, start: "top 85%", once: true },
    });
    const cards = $$(".more-card", wrap);
    gsap.set(cards, depth ? { opacity: 0, y: 60, rotateX: -14, transformOrigin: "50% 100%" } : { opacity: 0, y: 30 });
    ScrollTrigger.batch(cards, {
      start: "top 90%", once: true,
      onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, clearProps: "transform" }),
    });
    countOnView(wrap);
  }

  /* GitHub cards arrive after a network request → animate whenever ready. */
  function githubReveal({ depth }) {
    const run = () => {
      const cards = $$("#repos .repo:not(.repo--skeleton)");
      if (!cards.length) return;
      gsap.set(cards, depth ? { opacity: 0, y: 60, rotateX: -14, transformOrigin: "50% 100%" } : { opacity: 0, y: 30 });
      ScrollTrigger.batch(cards, {
        start: "top 92%", once: true,
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, clearProps: "transform" }),
      });
      ScrollTrigger.refresh();
    };
    if ($("#repos .repo:not(.repo--skeleton)")) run();
    document.addEventListener("github:ready", run);
    return () => document.removeEventListener("github:ready", run);
  }

  /* ========================================================= PORTRAIT */
  /* Desktop: the photo opens out as the About story pins, then slowly
     zooms back while the story plays — a gentle depth effect. */
  function portraitPinned() {
    const frame = $(".portrait__frame"), img = $(".portrait__frame img");
    if (!frame) return;
    gsap.fromTo(frame,
      { clipPath: "inset(18% 14% 18% 14% round 14px)" },
      { clipPath: "inset(0% 0% 0% 0% round 14px)", ease: "power2.out",
        scrollTrigger: { trigger: ".about", start: "top 80%", end: "top top", scrub: 0.6 } });
    gsap.fromTo(img, { scale: 1.3 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: ".about", start: "top 80%", end: () => `+=${window.innerHeight * 3.2}`, scrub: 0.6 },
    });
    gsap.from(".portrait__caption", {
      opacity: 0, y: 12, duration: 0.6,
      scrollTrigger: { trigger: ".about", start: "top 30%", once: true },
    });
  }

  function portraitLite() {
    if (!$(".portrait")) return;
    gsap.from(".portrait", {
      opacity: 0, y: 40, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: ".portrait", start: "top 88%", once: true },
    });
  }

  /* ========================================================== PROCESS */
  function processPipeline({ pinned }) {
    const pipe = $(".pipeline");
    const stages = $$(".stage", pipe);
    if (!stages.length) return () => {};
    const fill = document.createElement("div");
    fill.className = "pipeline__fill";
    fill.setAttribute("aria-hidden", "true");
    $(".pipeline__stages", pipe).prepend(fill);
    root.classList.add("pipeline-on");

    const n = stages.length;
    const light = (p) => stages.forEach((s, i) => s.classList.toggle("is-lit", p >= i / (n - 1) - 0.001));
    light(-1);

    const st = pinned
      ? { trigger: ".process", start: "top top", end: () => `+=${window.innerHeight * 1.6}`, pin: true, scrub: 0.6, anticipatePin: 1 }
      : { trigger: pipe, start: "top 75%", end: "bottom 60%", scrub: 0.6 };

    const tl = gsap.timeline({ scrollTrigger: { ...st, onUpdate: (self) => light(self.progress * 1.08 - 0.02) } });
    tl.fromTo(fill, pinned ? { scaleX: 0 } : { scaleY: 0 }, pinned ? { scaleX: 1, ease: "none" } : { scaleY: 1, ease: "none" });
    if (pinned) tl.to({}, { duration: 0.15 });

    return () => { fill.remove(); root.classList.remove("pipeline-on"); stages.forEach((s) => s.classList.remove("is-lit")); };
  }

  /* ======================================================= EXPERIENCE */
  function experienceTimeline() {
    const tl = $(".timeline");
    if (!tl) return;
    const DRAW_LINE = "top 65%"; // the line's leading edge sits at 65% of the viewport
    gsap.fromTo(".timeline__fill", { scaleY: 0 }, {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: tl, start: "top 65%", end: "bottom 65%", scrub: 0.4 },
    });
    // Each role pops in when the line reaches its dot.
    $$(".role", tl).forEach((role) => {
      const dot = $(".role__dot", role), card = $(".role__card", role);
      const hidden = root.classList.contains("motion-lite")
        ? { opacity: 0, y: 30, scale: 0.97 }            // phones: no sideways offset
        : { opacity: 0, x: 40, scale: 0.94 };
      gsap.set(card, { ...hidden, transformOrigin: "0% 50%" });
      gsap.set(dot, { scale: 0 });
      ScrollTrigger.create({
        trigger: dot, start: DRAW_LINE,
        onEnter: () => {
          gsap.to(dot, { scale: 1, duration: 0.5, ease: "back.out(3)" });
          gsap.to(card, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.4)" });
          role.classList.add("is-on");
        },
        onLeaveBack: () => {
          gsap.to(dot, { scale: 0, duration: 0.3 });
          gsap.to(card, { ...hidden, duration: 0.4, ease: "power2.in" });
          role.classList.remove("is-on");
        },
      });
    });
  }

  /* ========================================================== CONTACT */
  function contactReveal() {
    const st = { trigger: ".contact", start: "top 70%", once: true };
    const tl = gsap.timeline({ scrollTrigger: st, defaults: { ease: "expo.out" } });
    tl.from(".contact .section-label", { opacity: 0, y: 20, duration: 0.8 })
      .from(".contact__headline .line__inner", { yPercent: 110, duration: 1.2, stagger: 0.12 }, 0.1)
      .from(".contact__text", { opacity: 0, y: 20, duration: 0.8 }, 0.5)
      .from(".contact__actions .btn", { opacity: 0, y: 24, duration: 0.8, stagger: 0.08 }, 0.6)
      .from(".contact__address", { opacity: 0, duration: 0.8 }, 0.9);
  }

  /* Magnetic buttons: the button leans toward the cursor, its label a bit more. */
  function initMagnetic() {
    const offs = [];
    $$(".magnetic").forEach((btn) => {
      const label = $("span", btn) || btn;
      const bx = gsap.quickTo(btn, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const by = gsap.quickTo(btn, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const lx = gsap.quickTo(label, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const ly = gsap.quickTo(label, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const move = (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        bx(x * 0.35); by(y * 0.45); lx(x * 0.15); ly(y * 0.2);
      };
      const leave = () => { bx(0); by(0); lx(0); ly(0); };
      btn.addEventListener("pointermove", move);
      btn.addEventListener("pointerleave", leave);
      offs.push(() => {
        btn.removeEventListener("pointermove", move);
        btn.removeEventListener("pointerleave", leave);
        gsap.set([btn, label], { clearProps: "transform" });
      });
    });
    return () => offs.forEach((f) => f());
  }

  /* ============================================================== BOOT */
  const mm = gsap.matchMedia();
  mm.add(MQ, (context) => {
    const { full, lite, reduce, fine, wide } = context.conditions;
    const cleanups = [];

    root.classList.toggle("motion", !!full);
    root.classList.toggle("motion-lite", !!lite);

    initChrome();

    if (reduce) {
      // Everything visible, nothing moves. Draw one still frame of the field.
      cleanups.push(initField({ animate: false, interactive: false }));
      return () => cleanups.forEach((fn) => fn && fn());
    }

    cleanups.push(initLenis());
    heroIntro();
    cleanups.push(scrollCue());

    if (full) {
      cleanups.push(initField({ animate: true, interactive: !!fine }));
      heroScrollOut();
      if (fine) { cleanups.push(initCursor()); cleanups.push(initTilt()); }
      cleanups.push(aboutPinned());
      portraitPinned();
      aboutStats();
      revealHeadings();
      skillsReveal({ depth: true });
      casesPinned();
      galleryHorizontal();
      moreReveal({ depth: true });
      cleanups.push(githubReveal({ depth: true }));
      cleanups.push(processPipeline({ pinned: !!wide }));
      experienceTimeline();
      contactReveal();
      if (fine) cleanups.push(initMagnetic());
    }
    if (lite) {
      cleanups.push(initField({ animate: true, interactive: false }));
      aboutLite();
      portraitLite();
      aboutStats();
      revealHeadings();
      skillsReveal({ depth: false });
      casesLite();
      galleryLite();
      moreReveal({ depth: false });
      cleanups.push(githubReveal({ depth: false }));
      cleanups.push(processPipeline({ pinned: false }));
      experienceTimeline();
      contactReveal();
    }

    return () => {
      cleanups.forEach((fn) => fn && fn());
      root.classList.remove("motion", "motion-lite");
    };
  });

  // The GitHub section appears/disappears after load → recompute trigger positions.
  ["github:ready", "github:hidden"].forEach((ev) =>
    document.addEventListener(ev, () => ScrollTrigger.refresh()));
  window.addEventListener("load", () => ScrollTrigger.refresh());
  // Web fonts change text sizes → re-measure pinned sections once they're in.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
