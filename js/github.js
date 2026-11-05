/* =====================================================================
   GITHUB — live public repositories, rendered as cards.
   ===================================================================== */

// Show ONLY these repos, in this order. Leave empty to show every repo
// that passes the filters (not a fork, not archived, has a description).
const REPO_ALLOWLIST = [
  // "repo-name-one",
  // "repo-name-two",
];

const GITHUB_USER = "Suhasini1011";
const GITHUB_MAX_CARDS = 9; // only applies when the allowlist is empty

(function () {
  "use strict";
  const API = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`;
  const CACHE_KEY = `gh-repos:${GITHUB_USER}`;
  const section = document.getElementById("github");
  const list = document.getElementById("repos");
  if (!section || !list) return;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ------------------------------------------------ skeleton while fetching */
  const skeletonCount = REPO_ALLOWLIST.length || 6;
  list.innerHTML = Array.from({ length: Math.min(skeletonCount, 6) }, () => `
    <li class="repo repo--skeleton" aria-hidden="true">
      <span class="sk sk--title"></span>
      <span class="sk sk--line"></span>
      <span class="sk sk--line sk--short"></span>
      <span class="sk sk--meta"></span>
    </li>`).join("");

  /* ------------------------------------------------------------ helpers */
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  function timeAgo(iso) {
    const diff = (new Date(iso).getTime() - Date.now()) / 1000; // negative = past
    const units = [
      ["year", 31536000], ["month", 2592000], ["week", 604800],
      ["day", 86400], ["hour", 3600], ["minute", 60],
    ];
    for (const [unit, secs] of units) {
      if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
    }
    return "just now";
  }

  function readCache() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }
  function writeCache(data) {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (_) {}
  }

  async function fetchRepos() {
    const cached = readCache();
    if (cached) return cached;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(API, {
        headers: { Accept: "application/vnd.github+json" },
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`GitHub ${res.status}`); // includes 403/429 rate limit
      const json = await res.json();
      if (!Array.isArray(json)) throw new Error("Unexpected response");
      // Keep only the fields we use, so the cache stays small.
      const slim = json.map((r) => ({
        name: r.name, description: r.description, language: r.language,
        updated_at: r.updated_at, pushed_at: r.pushed_at, html_url: r.html_url,
        fork: r.fork, archived: r.archived,
      }));
      writeCache(slim);
      return slim;
    } finally {
      clearTimeout(timer);
    }
  }

  function select(repos) {
    if (REPO_ALLOWLIST.length) {
      const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));
      return REPO_ALLOWLIST.map((n) => byName.get(String(n).toLowerCase())).filter(Boolean);
    }
    return repos
      .filter((r) => !r.fork && !r.archived && r.description && r.description.trim())
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, GITHUB_MAX_CARDS);
  }

  function render(repos) {
    list.innerHTML = repos.map((r) => `
      <li class="repo tilt" data-cursor-label="Open">
        <a class="repo__link" href="${esc(r.html_url)}" target="_blank" rel="noopener">
          <h3 class="repo__name"><span class="mono">/</span>${esc(r.name)}</h3>
          <p class="repo__desc">${esc(r.description || "")}</p>
          <p class="repo__meta">
            ${r.language ? `<span class="repo__lang"><span class="repo__dot" aria-hidden="true"></span>${esc(r.language)}</span>` : ""}
            <span>Updated <time datetime="${esc(r.updated_at)}">${esc(timeAgo(r.updated_at))}</time></span>
          </p>
          <span class="repo__arrow" aria-hidden="true">↗</span>
          <span class="sr-only">(opens in a new tab)</span>
        </a>
      </li>`).join("");
    section.setAttribute("aria-busy", "false");
    document.dispatchEvent(new CustomEvent("github:ready"));
  }

  function hide() {
    section.remove(); // no error, no empty state
    document.dispatchEvent(new CustomEvent("github:hidden"));
  }

  fetchRepos()
    .then((all) => {
      const repos = select(all);
      repos.length ? render(repos) : hide();
    })
    .catch(hide);
})();
