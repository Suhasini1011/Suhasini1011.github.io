/* =====================================================================
   RENDER — builds the page from window.SITE (js/data.js).
   No animation here; js/animations.js layers motion on top.
   ===================================================================== */
(function () {
  "use strict";
  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), S);

  // A link still written as "[...]" in data.js is a placeholder.
  const isPlaceholder = (url) => !url || /^\[.*\]$/.test(String(url).trim());
  const linkAttrs = (url, external = true) =>
    isPlaceholder(url)
      ? `href="#" data-placeholder-link title="Placeholder — set this link in js/data.js"`
      : `href="${esc(url)}"${external ? ' target="_blank" rel="noopener"' : ""}`;

  const fmt = (n) => Number(n).toLocaleString("en-US");
  const fmtD = (n, d = 0) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });

  /* ---------------------------------------------------------- simple binds */
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const v = get(el.dataset.bind);
    if (v != null) el.textContent = v;
  });
  document.title = S.meta.title;
  $('meta[name="description"]').setAttribute("content", S.meta.description);

  /* ------------------------------------------------------------------ nav */
  $("#nav-links").innerHTML = S.nav.links
    .map((l) => `<li><a class="nav__link" href="${esc(l.href)}">${esc(l.label)}</a></li>`)
    .join("");

  /* ----------------------------------------------------------------- hero */
  // Each word in its own span so it can animate word by word later.
  $("#hero-headline").innerHTML = S.hero.headline
    .split(/\s+/)
    .map((w) => `<span class="word"><span class="word__inner">${esc(w)}</span></span>`)
    .join(" ");

  /* ---------------------------------------------------------------- about */
  $("#story").innerHTML = S.about.story
    .map((line, i) => `<li class="story__line" data-index="${i}">${esc(line)}</li>`)
    .join("");

  const ph = S.about.photo;
  const portrait = $("#portrait");
  if (ph && ph.src) {
    portrait.innerHTML = `
      <div class="portrait__frame">
        <picture>
          ${ph.srcset ? `<source type="image/webp" srcset="${esc(ph.srcset)}" sizes="(max-width: 767px) 90vw, 420px">` : ""}
          <img src="${esc(ph.src)}" alt="${esc(ph.alt)}" width="960" height="1200" loading="lazy" decoding="async">
        </picture>
      </div>
      ${ph.caption ? `<figcaption class="portrait__caption mono"><span aria-hidden="true">◎</span> ${esc(ph.caption)}</figcaption>` : ""}`;
  } else {
    portrait.remove();
  }

  $("#stats").innerHTML = S.about.stats
    .map(
      (s) => `
      <div class="stat">
        <dt class="stat__label">${esc(s.label)}</dt>
        <dd class="stat__value">${esc(s.prefix || "")}<span class="count" data-count="${s.value}">${fmt(s.value)}</span>${esc(s.suffix || "")}</dd>
      </div>`
    )
    .join("");

  /* --------------------------------------------------------------- skills */
  const ICONS = {
    db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
    code: '<path d="m8 6-6 6 6 6M16 6l6 6-6 6"/>',
    flow: '<rect x="2" y="3" width="7" height="6" rx="1"/><rect x="15" y="15" width="7" height="6" rx="1"/><path d="M5.5 9v4a2 2 0 0 0 2 2h7.5"/>',
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',
    spark: '<path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l3.5 3.5M15.5 15.5 19 19M5 19l3.5-3.5M15.5 8.5 19 5"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    funnel: '<path d="M3 4h18l-7 8v6l-4 2v-8z"/>',
  };
  const icon = (k) =>
    `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[k] || ICONS.chart}</svg>`;

  $("#skills-grid").innerHTML = S.skills.groups
    .map(
      (g) => `
      <li class="skill-card tilt">
        <div class="skill-card__head">${icon(g.icon)}<h3>${esc(g.area)}</h3></div>
        <ul class="chips">${g.items.map((i) => `<li class="chip">${esc(i)}</li>`).join("")}</ul>
      </li>`
    )
    .join("");

  /* --------------------------------------------------------------- charts */
  const W = 400, H = 260, PAD = { t: 24, r: 16, b: 40, l: 16 };

  function barChart(v) {
    const max = Math.max(...v.values) || 1;
    const n = v.values.length;
    const cw = (W - PAD.l - PAD.r) / n;
    const bw = Math.min(56, cw * 0.62);
    const ih = H - PAD.t - PAD.b;
    const bars = v.values
      .map((val, i) => {
        const h = (val / max) * ih;
        const x = PAD.l + i * cw + (cw - bw) / 2;
        const y = PAD.t + ih - h;
        return `
          <g class="bar" style="--i:${i}">
            <rect class="bar__rect" x="${x}" y="${y}" width="${bw}" height="${h}" rx="4"/>
            <text class="bar__value" x="${x + bw / 2}" y="${y - 8}" text-anchor="middle">${fmt(val)}${esc(v.unit || "")}</text>
            <text class="axis-label" x="${x + bw / 2}" y="${H - 14}" text-anchor="middle">${esc(v.labels[i] ?? "")}</text>
          </g>`;
      })
      .join("");
    const desc = v.labels.map((l, i) => `${l}: ${v.values[i]}${v.unit || ""}`).join(", ");
    return `<svg class="chart chart--bar" viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart. ${esc(desc)}">
      <line class="axis" x1="${PAD.l}" x2="${W - PAD.r}" y1="${H - PAD.b}" y2="${H - PAD.b}"/>${bars}</svg>`;
  }

  function lineChart(v) {
    const max = v.max ?? Math.max(...v.values), min = v.min ?? Math.min(...v.values);
    const span = max - min || 1;
    const n = v.values.length;
    const iw = W - PAD.l - PAD.r - 20, ih = H - PAD.t - PAD.b;
    const pts = v.values.map((val, i) => [
      PAD.l + 10 + (iw * i) / (n - 1 || 1),
      PAD.t + ih - ((val - min) / span) * ih * 0.85 - ih * 0.075,
    ]);
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    const area = `${d} L${pts[n - 1][0]},${H - PAD.b} L${pts[0][0]},${H - PAD.b} Z`;
    const grid = [0.25, 0.5, 0.75]
      .map((f) => `<line class="gridline" x1="${PAD.l}" x2="${W - PAD.r}" y1="${PAD.t + ih * f}" y2="${PAD.t + ih * f}"/>`)
      .join("");
    const dots = pts
      .map((p, i) => `<circle class="line__dot" style="--i:${i}" cx="${p[0]}" cy="${p[1]}" r="4"/>
        <text class="axis-label" x="${p[0]}" y="${H - 14}" text-anchor="middle">${esc(v.labels[i] ?? "")}</text>`)
      .join("");
    const last = pts[n - 1];
    const desc = v.labels.map((l, i) => `${l}: ${v.values[i]}${v.unit || ""}`).join(", ");
    return `<svg class="chart chart--line" viewBox="0 0 ${W} ${H}" role="img" aria-label="Line chart. ${esc(desc)}">
      ${grid}<line class="axis" x1="${PAD.l}" x2="${W - PAD.r}" y1="${H - PAD.b}" y2="${H - PAD.b}"/>
      <path class="line__area" d="${area}"/>
      <path class="line__path" d="${d}" pathLength="1"/>
      ${dots}
      <text class="line__end" x="${last[0]}" y="${last[1] - 12}" text-anchor="end">${fmt(v.values[n - 1])}${esc(v.unit || "")}</text>
    </svg>`;
  }

  function kpi(v) {
    return `<div class="kpis">${v.items
      .map(
        (k) => `<div class="kpi">
          <span class="kpi__value">${esc(k.prefix || "")}<span class="count" data-count="${k.value}" data-decimals="${k.decimals || 0}">${fmtD(k.value, k.decimals)}</span>${esc(k.suffix || "")}</span>
          <span class="kpi__label">${esc(k.label)}</span>
        </div>`
      )
      .join("")}</div>`;
  }

  function frame(v, cls = "shot") {
    return v.src
      ? `<figure class="${cls}"><img src="${esc(v.src)}" alt="${esc(v.alt)}" loading="lazy" decoding="async" width="1600" height="1000"></figure>`
      : `<figure class="${cls} ${cls}--placeholder" role="img" aria-label="${esc(v.alt)}">
           <span class="${cls}__ph">${esc(v.alt || "[Screenshot]")}</span>
         </figure>`;
  }

  const visual = (v) =>
    ({ bar: barChart, line: lineChart, kpi, image: (x) => frame(x) }[v.type] || (() => ""))(v);

  /* ------------------------------------------------------------- projects */
  $("#cases").innerHTML = S.projects.items
    .map(
      (p, pi) => `
      <article class="case" id="case-${esc(p.id)}" aria-labelledby="case-${esc(p.id)}-title" data-steps="${p.steps.length}">
        <div class="case__pin container">
          <header class="case__head">
            <span class="case__num">${String(pi + 1).padStart(2, "0")}</span>
            <div>
              <h3 class="case__title" id="case-${esc(p.id)}-title">${esc(p.title)}</h3>
              <p class="case__context">${esc(p.context)}</p>
            </div>
            <ul class="case__tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          </header>

          <ol class="case__progress" aria-hidden="true">
            ${p.steps.map((s, i) => `<li data-step="${i}"><span>${esc(s.label)}</span></li>`).join("")}
          </ol>

          <ol class="case__steps">
            ${p.steps
              .map(
                (s, i) => `
              <li class="case__step" data-step="${i}">
                <div class="case__text">
                  <p class="case__step-label"><span class="mono">${String(i + 1).padStart(2, "0")}</span> ${esc(s.label)}</p>
                  <h4 class="case__step-heading">${esc(s.heading)}</h4>
                  <p class="case__step-body">${esc(s.text)}</p>
                </div>
                <div class="case__visual" data-type="${esc(s.visual.type)}">${visual(s.visual)}</div>
              </li>`
              )
              .join("")}
          </ol>

          <div class="case__links">
            <a class="btn btn--primary" ${linkAttrs(p.links.github)}><span>View on GitHub</span></a>
            <a class="btn btn--ghost" ${linkAttrs(p.links.findings)}><span>Read the findings</span></a>
          </div>
        </div>
      </article>`
    )
    .join("");

  $("#gallery").innerHTML = S.projects.gallery
    .map(
      (g) => `<div class="gallery__item" data-cursor-label="View">${frame(g, "gshot")}<p class="gallery__caption">${esc(g.caption)}</p></div>`
    )
    .join("");

  /* ---------------------------------------------------- more case studies */
  const M = S.projects.more;
  if (M && M.items && M.items.length) {
    $("#more-title").textContent = M.title;
    $("#more-grid").innerHTML = M.items
      .map(
        (m) => `
      <li class="more-card tilt">
        <p class="more-card__context">${esc(m.context)}</p>
        <h4 class="more-card__title">${esc(m.title)}</h4>
        ${m.stat ? `<p class="more-card__stat"><span class="more-card__num">${esc(m.stat.prefix || "")}<span class="count" data-count="${m.stat.value}" data-decimals="${m.stat.decimals || 0}">${fmtD(m.stat.value, m.stat.decimals)}</span>${esc(m.stat.suffix || "")}</span> <span class="more-card__label">${esc(m.stat.label)}</span></p>` : ""}
        <p class="more-card__text">${esc(m.text)}</p>
        <div class="more-card__links">
          <a class="btn btn--primary btn--sm" ${linkAttrs(m.links.github)}><span>View on GitHub</span></a>
          <a class="btn btn--ghost btn--sm" ${linkAttrs(m.links.findings)}><span>Read the findings</span></a>
        </div>
      </li>`
      )
      .join("");
  } else {
    $("#more").remove();
  }

  /* -------------------------------------------------------------- process */
  $("#pipeline").innerHTML = S.process.stages
    .map(
      (s, i) => `
      <li class="stage" data-stage="${i}">
        <span class="stage__node"><span class="mono">${String(i + 1).padStart(2, "0")}</span></span>
        <h3 class="stage__name">${esc(s.name)}</h3>
        <p class="stage__text">${esc(s.text)}</p>
      </li>`
    )
    .join("");

  /* ----------------------------------------------------------- experience */
  $("#timeline").innerHTML = S.experience.roles
    .map(
      (r) => `
      <li class="role">
        <span class="role__dot" aria-hidden="true"></span>
        <div class="role__card">
          <p class="role__period mono">${esc(r.period)}</p>
          <h3 class="role__title">${esc(r.title)}</h3>
          <p class="role__org">${esc(r.org)}</p>
          <ul class="role__points">${r.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        </div>
      </li>`
    )
    .join("");

  /* -------------------------------------------------------------- contact */
  const C = S.contact;
  $("#contact-title").innerHTML = C.headline
    .map((l) => `<span class="line"><span class="line__inner">${esc(l)}</span></span>`)
    .join("");
  const email = $("#contact-email");
  email.href = `mailto:${C.email}`;
  $("#contact-address").innerHTML =
    `<span class="mono">${esc(C.email)}</span>` +
    (C.location ? `<span class="contact__sep" aria-hidden="true">·</span><span class="contact__location"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>${esc(C.location)}</span>` : "");
  const li = $("#contact-linkedin");
  if (isPlaceholder(C.linkedin)) { li.href = "#"; li.dataset.placeholderLink = ""; }
  else { li.href = C.linkedin; li.target = "_blank"; }
  const cv = $("#contact-cv");
  if (/\[.*\]/.test(C.cv)) { cv.href = "#"; cv.removeAttribute("download"); cv.dataset.placeholderLink = ""; }
  else cv.href = C.cv;
  $("#github-profile").href = S.github.profileUrl;
  $("#github-profile").target = "_blank";
  $("#github-profile").rel = "noopener";

  // Phone menu: open/close, close on link tap, Escape or tap outside.
  const navEl = $("#nav"), toggle = $(".nav__toggle", navEl);
  const setMenu = (open) => {
    navEl.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    $(".nav__toggle-text", toggle).textContent = open ? "Close" : "Menu";
  };
  toggle.addEventListener("click", () => setMenu(!navEl.classList.contains("is-open")));
  $("#nav-links").addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navEl.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener("click", (e) => { if (!navEl.contains(e.target)) setMenu(false); });

  // Placeholder links do nothing (instead of jumping to the top).
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-placeholder-link]");
    if (a) e.preventDefault();
  });

  document.documentElement.classList.add("is-rendered");
  document.documentElement.classList.remove("js-loading");
})();
