/* =====================================================================
   SITE DATA — every word, number, project and link on the page.
   Edit this file only; the layout and animation code read from it.

   - Facts come from your CV and from the READMEs of your GitHub repos.
     Every chart value below is a number published in that repo.
   - To ADD A PROJECT: copy one object in `projects.items` and change its
     fields. Nothing else needs to change.
   - A link written as "[...]" is treated as "not set yet" (greyed out).
   ===================================================================== */

window.SITE = {
  /* ------------------------------------------------------------- META */
  meta: {
    title: "Suhasini Pillay — Data & Business Systems Analyst",
    description:
      "Portfolio of Suhasini Pillay, data and business systems analyst: SQL, Power BI, Tableau, Python and ITSM analytics case studies.",
  },

  /* -------------------------------------------------------------- NAV */
  nav: {
    logo: "SP",
    links: [
      { label: "About", href: "#about" },
      { label: "Skills", href: "#skills" },
      { label: "Projects", href: "#projects" },
      { label: "Process", href: "#process" },
      { label: "Experience", href: "#experience" },
      { label: "Contact", href: "#contact" },
    ],
  },

  /* ------------------------------------------------------------- HERO */
  hero: {
    eyebrow: "Portfolio · 2026",
    name: "Suhasini Pillay",
    role: "Data & Business Systems Analyst",
    headline: "I turn service and business data into decisions people act on.",
    scrollCue: "Scroll",
  },

  /* ------------------------------------------------------------ ABOUT */
  about: {
    label: "About",
    story: [
      "I started in application support, writing SQL to find out why things broke.",
      "Then I owned the SaaS apps that about 5,000 people at Uber relied on every day.",
      "Every ticket, licence and escalation turned out to be a dataset worth reading.",
      "Now, with a First Class MSc in Business Analytics, I build the analysis behind the decisions.",
    ],
    // Portrait beside the story. Set src to "" to hide it.
    photo: {
      src: "assets/suhasini-ucc-960.jpg",
      srcset: "assets/suhasini-ucc-480.webp 480w, assets/suhasini-ucc-960.webp 960w",
      alt: "Suhasini Pillay standing in a Gothic stone doorway at University College Cork, Ireland",
      caption: "University College Cork, Ireland",
    },
    stats: [
      { value: 3, suffix: "+", label: "Years in business systems & support" },
      { value: 5000, prefix: "~", suffix: "", label: "Users supported at Uber" },
      { value: 6, suffix: "", label: "Analytics projects (5 on GitHub + MSc dissertation)" },
    ],
  },

  /* ----------------------------------------------------------- SKILLS */
  skills: {
    label: "Skills",
    title: "The toolkit",
    groups: [
      { area: "SQL & Data", icon: "db",
        items: ["SQL", "PostgreSQL", "SQLite", "Star schemas", "Data cleaning", "Cross-system reconciliation"] },
      { area: "BI & Visualisation", icon: "chart",
        items: ["Power BI", "DAX", "Tableau", "Streamlit", "Dashboard design"] },
      { area: "Excel", icon: "grid",
        items: ["Microsoft Excel", "Power Query", "Pivot tables", "What-if models"] },
      { area: "Python", icon: "code",
        items: ["Python", "pandas", "Data cleaning", "Data integration"] },
      { area: "ITSM & Delivery", icon: "flow",
        items: ["ServiceNow", "Jira", "Confluence", "ITIL", "Agile Scrum", "UAT"] },
      { area: "Business Analysis", icon: "map",
        items: ["Requirements gathering", "Process mapping", "BRDs / FRDs", "Gap analysis", "Lucidchart"] },
      { area: "Generative AI", icon: "spark",
        items: ["AI enablement & risk assessment", "Prompt engineering", "Microsoft Copilot", "Claude", "ChatGPT", "Perplexity", "Output validation"] },
      { area: "Identity & Governance", icon: "lock",
        items: ["Okta", "SAML SSO", "Active Directory", "Access reviews"] },
    ],
  },

  /* --------------------------------------------------------- PROJECTS */
  projects: {
    label: "Projects",
    title: "Selected case studies",
    intro: "Four projects, each from question to answer. Every number shown is published in the project's repository.",

    /* visual.type options:
         "bar"   → { labels:[], values:[], unit:"" }
         "line"  → { labels:[], values:[], unit:"", min?, max? }  (min/max fix the y-axis)
         "kpi"   → { items:[{ value, prefix, suffix, label }] }
         "image" → { src:"assets/…", alt:"…" } */
    items: [
      {
        id: "olist",
        title: "Olist eCommerce Analytics",
        context: "100k real marketplace orders · PostgreSQL star schema · Power BI · Excel",
        tags: ["SQL", "Power BI / DAX", "Excel"],
        steps: [
          {
            label: "Problem",
            heading: "Why do customers leave bad reviews, and do they come back?",
            text: "Olist, a Brazilian online marketplace, published about 100,000 real orders. I set out to find what drives low review scores, repeat buying and lost revenue.",
            visual: { type: "kpi", items: [{ value: 99441, label: "Orders analysed" }] },
          },
          {
            label: "Approach",
            heading: "A star schema, checked three ways",
            text: "Loaded the raw data into cloud PostgreSQL, ran 12 data-quality checks and modelled two fact tables with four dimensions. Every headline number was calculated in SQL and matched in DAX and Excel.",
            visual: { type: "image", src: "assets/projects/olist-revenue.webp", alt: "Power BI revenue page: item revenue by category and by seller state" },
          },
          {
            label: "Key finding",
            heading: "Late delivery is the biggest driver of bad reviews",
            text: "62.4% of late orders get a 1–2 star review, against 9.2% of on-time orders. The rate climbs with every extra day late.",
            visual: { type: "bar", unit: "%",
              labels: ["On time", "1–3 days", "4–7 days", "7+ days"],
              values: [9.2, 32.1, 67.7, 79.2] },
          },
          {
            label: "Impact",
            heading: "Fix delivery for the reviews, not the revenue",
            text: "A what-if model shows halving late deliveries would avoid about 1,736 bad reviews but add only about R$3,000 in repeat revenue, because just 2.2% of customers return.",
            visual: { type: "kpi", items: [{ value: 1736, label: "Bad reviews avoided by halving late deliveries" }] },
          },
        ],
        links: {
          github: "https://github.com/Suhasini1011/olist-ecommerce-analytics",
          findings: "https://github.com/Suhasini1011/olist-ecommerce-analytics/blob/HEAD/docs/findings.md",
        },
      },
      {
        id: "service-agent",
        title: "Service Analytics Agent",
        context: "Python pipeline + LLM · synthetic ServiceNow-style tickets",
        tags: ["Python", "pandas", "LLM (Groq)"],
        steps: [
          {
            label: "Problem",
            heading: "Automating the ticket analysis I used to do by hand",
            text: "As an application support analyst I reviewed ticket exports manually. This pipeline turns a raw export into a one-page service review automatically.",
            visual: { type: "kpi", items: [{ value: 2000, label: "Tickets in one automated review" }] },
          },
          {
            label: "Approach",
            heading: "Code does the maths, the LLM does the language",
            text: "Validate, clean, compute KPIs, then use an LLM only to read free-text descriptions and write the summary. Every number is inserted by code and checked, never typed by the AI.",
            visual: { type: "kpi", items: [
              { value: 403, label: "Unique descriptions classified" },
              { value: 17, label: "API calls, thanks to batching and caching" },
            ] },
          },
          {
            label: "Key finding",
            heading: "Access requests escalate three times as often",
            text: "Access requests are 20.4% of tickets but 44.4% of escalations. The LLM also found 64 access problems filed under other request types.",
            visual: { type: "bar", unit: "%",
              labels: ["Access requests", "All other types"],
              values: [31.8, 10.2] },
          },
          {
            label: "Impact",
            heading: "A trustworthy report in one command",
            text: "The validator caught all 24 deliberately planted data defects with no false alarms, and the report shows whether its number check passed.",
            visual: { type: "image", src: "assets/projects/agent-report.webp", alt: "Generated service analytics report with KPI cards, SLA by priority and escalation rate by request type" },
          },
        ],
        links: {
          github: "https://github.com/Suhasini1011/service-analytics-agent",
          findings: "https://github.com/Suhasini1011/service-analytics-agent#key-results-on-the-synthetic-data",
        },
      },
      {
        id: "iam-migration",
        title: "IAM Migration & Access Governance",
        context: "OneLogin → Okta for Figma and Adobe · case study on synthetic data",
        tags: ["SQL", "Tableau", "Excel / Power Query", "BPMN"],
        steps: [
          {
            label: "Problem",
            heading: "Onboarding took up to 48 hours",
            text: "Figma access was auto-provisioned with no governance, while Adobe needed fully manual service-desk approval. The result was delays, over-provisioning and no view of high-risk access.",
            visual: { type: "kpi", items: [{ value: 48, suffix: " hrs", label: "Worst-case onboarding time" }] },
          },
          {
            label: "Approach",
            heading: "RBAC in Okta, plus a live governance dashboard",
            text: "Prepared the data in Excel and Power Query, analysed approvals, SLA and risk in SQL, mapped AS-IS and TO-BE in BPMN, and built a Tableau dashboard.",
            visual: { type: "image", src: "assets/projects/iam-dashboard.webp", alt: "Tableau dashboard: migration status, SLA performance, risk by department and approval distribution" },
          },
          {
            label: "Key finding",
            heading: "Manual approvals caused the SLA breaches",
            text: "43.4% of approvals were manual and took 25.1 hours on average, against 0.95 hours when automated. Only 61.2% of requests met the 5-hour SLA.",
            visual: { type: "bar", unit: " hrs",
              labels: ["Manual approval", "Automated"],
              values: [25.1, 0.95] },
          },
          {
            label: "Impact",
            heading: "Designed TO-BE: minutes, not days",
            text: "With RBAC checks in Okta, access is provisioned instantly and routed to the service desk only when a licence constraint applies.",
            visual: { type: "kpi", items: [
              { value: 96, suffix: "%", label: "Faster onboarding (projected)" },
              { value: 85, suffix: "%", label: "Less manual effort (projected)" },
            ] },
          },
        ],
        links: {
          github: "https://github.com/Suhasini1011/IAM-Migration-Access-Governance",
          findings: "https://github.com/Suhasini1011/IAM-Migration-Access-Governance/blob/HEAD/docs/IAM_Migration_Case_Study.pdf",
        },
      },
      {
        id: "escalations",
        title: "IT Support Escalation Analysis",
        context: "L1/L2 → L4 AppOps escalations · rebuilt on synthetic data from real work",
        tags: ["SQL", "Tableau", "Lucidchart", "BRD"],
        steps: [
          {
            label: "Problem",
            heading: "Avoidable escalations were eating L4 capacity",
            text: "Licence and access tickets for apps like Zoom, Box and Figma kept reaching the L4 team. That time could have gone to cost optimisation and governance.",
            visual: { type: "image", src: "assets/projects/l4-as-is.webp", alt: "AS-IS swimlane: L1 receives ticket, L2/L3 has no access or runbook, escalates to L4" },
          },
          {
            label: "Approach",
            heading: "SQL on 100 tickets, then a Tableau dashboard",
            text: "Wrote eight verified SQL queries on SLA, reasons, apps and source teams. SLA held mostly at 100%, with dips in January, February, May and October.",
            visual: { type: "line", unit: "%", min: 80, max: 100, // y-axis range
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
              values: [90.9, 88.9, 100, 100, 90, 100, 100, 100, 100, 87.5] },
          },
          {
            label: "Key finding",
            heading: "Access gaps were the top reason",
            text: "29% of escalations happened because L1/L2 lacked admin permissions, and 23% because of missing knowledge articles.",
            visual: { type: "bar", unit: "%",
              labels: ["Access gap", "Bug / tech", "Policy", "Knowledge"],
              values: [29, 24, 24, 23] },
          },
          {
            label: "Impact",
            heading: "Half of escalations are preventable",
            text: "The TO-BE process gives L2 delegated admin for routine fixes, requires a KB article after every knowledge-gap escalation, and adds a Zoom runbook.",
            visual: { type: "kpi", items: [{ value: 52, suffix: "%", label: "Of escalations preventable" }] },
          },
        ],
        links: {
          github: "https://github.com/Suhasini1011/L4-IT-Escalation-Analysis",
          findings: "https://github.com/Suhasini1011/L4-IT-Escalation-Analysis/blob/HEAD/docs/L4-Escalations-Case-Study.pdf",
        },
      },
    ],

    /* Horizontal gallery after the case studies. */
    gallery: [
      { src: "assets/projects/olist-delivery.webp", alt: "Power BI page on delivery and reviews: late rate by state and low-score rate by lateness", caption: "Olist · Power BI delivery & reviews page" },
      { src: "assets/projects/tickets-dashboard.webp", alt: "Tableau customer ticket dashboard: weekly SLA, ticket status, team performance and CSAT", caption: "Customer Ticket Analytics · Tableau" },
      { src: "assets/projects/olist-whatif.webp", alt: "Excel what-if model estimating reviews saved and revenue gained from fewer late deliveries", caption: "Olist · Excel what-if model" },
      { src: "assets/projects/l4-to-be.webp", alt: "TO-BE swimlane diagram for IT escalations with runbook, KB and admin access checks", caption: "Escalation Analysis · TO-BE process" },
      { src: "assets/projects/olist-revenue.webp", alt: "Power BI revenue page: revenue by category and seller state", caption: "Olist · Power BI revenue page" },
    ],
  },

  /* ----------------------------------------------- GITHUB (live repos) */
  // Repo list is fetched live. Allowlist & username live at the top of js/github.js.
  github: {
    label: "Open source",
    title: "Latest on GitHub",
    intro: "Pulled live from my public repositories.",
    profileUrl: "https://github.com/Suhasini1011",
  },

  /* ---------------------------------------------------------- PROCESS */
  process: {
    label: "Process",
    title: "How I work",
    stages: [
      { name: "Raw data",  text: "Pull exports from ServiceNow, Jira, databases and spreadsheets, untouched." },
      { name: "Clean",     text: "Profile, de-duplicate and reconcile, flagging problems instead of deleting them." },
      { name: "Model",     text: "Shape it into tables, star schemas and features that answer the question." },
      { name: "Analyse",   text: "Find the pattern in SQL or Python, then check it a second way." },
      { name: "Dashboard", text: "Ship it in Power BI, Tableau or Streamlit, with a recommendation attached." },
    ],
  },

  /* ------------------------------------------------------- EXPERIENCE */
  experience: {
    label: "Experience",
    title: "The journey so far",
    roles: [
      {
        period: "Sep 2025 – Sep 2026",
        title: "MSc Business Analytics — First Class Honours",
        org: "University College Cork, Ireland",
        points: [
          "Group dissertation for the Central Bank of Ireland Data Challenge 2026 on digital financial exclusion.",
          "Integrated 450,000 synthetic consumer profiles in Python and built the three-layer Streamlit dashboard.",
        ],
      },
      {
        period: "Jul 2023 – Aug 2025",
        title: "Business Systems Analyst — Enterprise Applications",
        org: "Jade Global · Client: Uber Technologies",
        points: [
          "Application owner and L3 escalation point for Figma, Adobe and Lucidchart across ~5,000 users.",
          "Cut escalations by 50% through process mapping, BRDs and L1/L2 training.",
          "Managed 595 licensed seats with SQL and Tableau; built the monthly SLA, backlog and CSAT reporting pack.",
          "Led the Okta SAML SSO migration for ~5,000 users and the generative-AI enablement risk assessment.",
        ],
      },
      {
        period: "Aug 2022 – Jun 2023",
        title: "Systems Analyst — Applications Support",
        org: "Jade Global",
        points: [
          "Resolved 30–40 L2 tickets weekly within SLA via ServiceNow and Jira.",
          "Wrote SQL to diagnose data issues; built SQL reports and Excel dashboards for management.",
        ],
      },
      {
        period: "Feb 2022 – Jul 2022",
        title: "Intern — Cloud ADM Team",
        org: "Jade Global",
        points: ["Cloud application administration, incident management and operational reporting."],
      },
    ],
  },

  /* ---------------------------------------------------------- CONTACT */
  contact: {
    label: "Contact",
    headline: ["Let's find the story", "in your data."],
    text: "Open to business analyst, data analyst and application support roles. The fastest way to reach me is email.",
    email: "pillaysuhasini346@gmail.com",
    linkedin: "https://www.linkedin.com/in/suhasini-pillay-b9a644196",
    cv: "assets/Suhasini_Pillay_CV.pdf",
  },

  footer: {
    text: "© 2026 Suhasini Pillay",
  },
};
