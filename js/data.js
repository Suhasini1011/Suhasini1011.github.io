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
      "I started in application support, using SQL to find out why things broke.",
      "At Uber, I turned ticket, licence and SLA data into reports leadership used to make decisions.",
      "I owned projects end to end in Agile sprints, from requirements to rollout, including an SSO migration for 5,000 users.",
      "Analysing escalation patterns helped me cut escalations by 50%, and showed me what good analysis can change.",
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
      { value: 3, suffix: "+", label: "Years in business systems & analysis" },
      { value: 8, suffix: "", label: "Analytics projects (7 on GitHub + MSc dissertation)" },
      { value: 50, suffix: "%", label: "Fewer escalations at Uber" },
    ],
  },

  /* ----------------------------------------------------------- SKILLS */
  skills: {
    label: "Skills",
    title: "The toolkit",
    groups: [
      { area: "SQL & Data", icon: "db",
        items: ["SQL", "PostgreSQL", "Google BigQuery", "SQLite", "Star schemas", "Data cleaning", "Cross-system reconciliation"] },
      { area: "BI & Visualisation", icon: "chart",
        items: ["Power BI", "DAX", "Tableau", "Data Studio", "Streamlit", "Dashboard design"] },
      { area: "Product Analytics", icon: "funnel",
        items: ["A/B testing", "Statistical significance", "Funnel analysis", "Cohort retention", "GA4"] },
      { area: "Excel", icon: "grid",
        items: ["Microsoft Excel", "Power Query", "Pivot tables", "What-if models"] },
      { area: "Python", icon: "code",
        items: ["Python", "pandas", "Data cleaning", "Data integration"] },
      { area: "ITSM & Delivery", icon: "flow",
        items: ["ServiceNow", "Jira", "Confluence", "ITIL", "Agile Scrum", "UAT"] },
      { area: "Business Analysis", icon: "map",
        items: ["Requirements gathering", "Process mapping", "BRDs / FRDs", "Gap analysis", "Lucidchart"] },
      { area: "Generative AI", icon: "spark",
        items: ["AI enablement & risk assessment", "Prompt engineering", "Microsoft Copilot", "Claude", "ChatGPT", "Perplexity", "Output validation", "Text-to-SQL", "LLM evaluation"] },
      { area: "Identity & Governance", icon: "lock",
        items: ["Okta", "SAML SSO", "Active Directory", "Access reviews"] },
    ],
  },

  /* --------------------------------------------------------- PROJECTS */
  projects: {
    label: "Projects",
    title: "Selected case studies",
    intro: "Four featured projects, each from question to answer. Every number shown is published in the project's repository.",

    /* visual.type options:
         "bar"   → { labels:[], values:[], unit:"" }
         "line"  → { labels:[], values:[], unit:"", min?, max? }  (min/max fix the y-axis)
         "kpi"   → { items:[{ value, prefix, suffix, label }] }
         "image" → { src:"assets/…", alt:"…" } */
    items: [
      {
        id: "ask-your-data",
        title: "Ask Your Data",
        context: "Text-to-SQL assistant on 100k Olist orders · Python · LLM (Groq) · PostgreSQL · Streamlit",
        tags: ["Python", "LLM", "SQL", "Streamlit"],
        steps: [
          {
            label: "Problem",
            heading: "Can people ask data questions in plain English and trust the answer?",
            text: "Ask a question about 100k eCommerce orders in plain English. The assistant writes the SQL, checks it, runs it read-only, and shows the answer alongside the query behind it.",
            visual: { type: "image", src: "assets/projects/ask-your-data-answer.webp", alt: "Ask Your Data app answering what percentage of customers are repeat customers (2.17) with the SQL query shown below" },
          },
          {
            label: "Approach",
            heading: "The AI writes the query, the database gives the number",
            text: "The model gets the schema plus 11 business rules. Every query passes a safety check and runs as a read-only database user with a 10-second timeout. A failed query is sent back once for self-correction.",
            visual: { type: "kpi", items: [
              { value: 4, label: "Layers of safety" },
              { value: 11, label: "Business rules given to the model" },
            ] },
          },
          {
            label: "Key finding",
            heading: "The definitions decide the answer",
            text: "Asked what share of customers come back, the naive query counts customers with 2+ orders. With the business rules it counts distinct purchase days, because one checkout can create several orders, and gets the correct answer.",
            visual: { type: "bar", unit: "%",
              labels: ["Naive query", "With business rules"],
              values: [3.04, 2.17] },
          },
          {
            label: "Impact",
            heading: "Tested, not just trusted",
            text: "On 19 questions with known answers, including 2 it must refuse, the first run scored 18/19. After three general fixes, not one-off patches, it scored 19/19 on 3 consecutive runs.",
            visual: { type: "kpi", items: [
              { value: 19, suffix: "/19", label: "Correct on 3 consecutive runs" },
            ] },
          },
        ],
        links: {
          github: "https://github.com/Suhasini1011/ask-your-data",
          findings: "https://github.com/Suhasini1011/ask-your-data/blob/HEAD/eval_results.md",
        },
      },
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
        id: "product-analytics",
        title: "Product Analytics in BigQuery",
        context: "Real GA4 store events + a mobile-game A/B test · SQL in Google BigQuery · Data Studio",
        tags: ["SQL", "BigQuery", "A/B testing", "Data Studio"],
        steps: [
          {
            label: "Problem",
            heading: "Where do shoppers drop out, and did a game change hurt retention?",
            text: "Three months of real, anonymised Google Merchandise Store events, plus the Cookie Cats A/B test, which moved a game's first gate from level 30 to level 40.",
            visual: { type: "kpi", items: [
              { value: 267116, label: "Store visitors" },
              { value: 90189, label: "A/B test players" },
            ] },
          },
          {
            label: "Approach",
            heading: "Funnels, cohorts and significance tests, all in SQL",
            text: "A conversion funnel with window functions, weekly retention cohorts based on first visit, and two-proportion z-tests with a sample ratio check, all written in BigQuery SQL and shown in Data Studio.",
            visual: { type: "image", src: "assets/projects/product-analytics-dashboard.webp", alt: "Data Studio dashboard: visitors, purchasers, conversion funnel, funnel by device, retention cohorts and A/B test results" },
          },
          {
            label: "Key finding",
            heading: "Only 1.7% of visitors buy",
            text: "77% of visitors never view a product, and 41% of shoppers who start checkout drop out at payment. All devices convert at 1.6–1.7%, so the problem is the site, not the device.",
            visual: { type: "bar", unit: "%",
              labels: ["Visit", "View item", "Cart", "Checkout", "Purchase"],
              values: [100, 22.9, 4.7, 3.6, 1.7] },
          },
          {
            label: "Impact",
            heading: "Keep the gate at 30, but check the split",
            text: "Moving the gate to level 40 lowered 7-day retention (z = −3.16, significant). But the 50/50 split failed a sample ratio check (z = 2.63), so player assignment needs auditing before the size of the effect is trusted.",
            visual: { type: "kpi", items: [
              { value: 19.02, decimals: 2, suffix: "%", label: "7-day retention · gate at 30" },
              { value: 18.20, decimals: 2, suffix: "%", label: "7-day retention · gate at 40" },
            ] },
          },
        ],
        links: {
          github: "https://github.com/Suhasini1011/product-analytics-bigquery",
          findings: "https://github.com/Suhasini1011/product-analytics-bigquery/blob/HEAD/docs/findings.md",
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
    ],

    /* Horizontal gallery after the case studies. */
    gallery: [
      { src: "assets/projects/ask-your-data-app.webp", alt: "Ask Your Data app answering top 10 product categories by revenue with a table and bar chart", caption: "Ask Your Data · Streamlit app" },
      { src: "assets/projects/olist-delivery.webp", alt: "Power BI page on delivery and reviews: late rate by state and low-score rate by lateness", caption: "Olist · Power BI delivery & reviews page" },
      { src: "assets/projects/product-analytics-dashboard.webp", alt: "Data Studio product analytics dashboard with funnel, retention cohorts and A/B test", caption: "Product Analytics · BigQuery + Data Studio" },
      { src: "assets/projects/tickets-dashboard.webp", alt: "Tableau customer ticket dashboard: weekly SLA, ticket status, team performance and CSAT", caption: "Customer Ticket Analytics · Tableau" },
      { src: "assets/projects/olist-whatif.webp", alt: "Excel what-if model estimating reviews saved and revenue gained from fewer late deliveries", caption: "Olist · Excel what-if model" },
      { src: "assets/projects/l4-to-be.webp", alt: "TO-BE swimlane diagram for IT escalations with runbook, KB and admin access checks", caption: "Escalation Analysis · TO-BE process" },
      { src: "assets/projects/olist-revenue.webp", alt: "Power BI revenue page: revenue by category and seller state", caption: "Olist · Power BI revenue page" },
    ],

    /* Smaller cards below the gallery. Same link format as above. */
    more: {
      title: "More case studies",
      items: [
        {
          title: "IAM Migration & Access Governance",
          context: "OneLogin → Okta for Figma and Adobe · SQL, Tableau, BPMN",
          stat: { value: 43.4, decimals: 1, suffix: "%", label: "of approvals were manual" },
          text: "Manual approvals took 25.1 hours on average, against 0.95 hours when automated.",
          links: {
            github: "https://github.com/Suhasini1011/IAM-Migration-Access-Governance",
            findings: "https://github.com/Suhasini1011/IAM-Migration-Access-Governance/blob/HEAD/docs/IAM_Migration_Case_Study.pdf",
          },
        },
        {
          title: "IT Support Escalation Analysis",
          context: "L1/L2 → L4 escalations · SQL, Tableau, Lucidchart",
          stat: { value: 52, suffix: "%", label: "of escalations were preventable" },
          text: "Access gaps were the top reason (29%), followed by missing knowledge articles (23%).",
          links: {
            github: "https://github.com/Suhasini1011/L4-IT-Escalation-Analysis",
            findings: "https://github.com/Suhasini1011/L4-IT-Escalation-Analysis/blob/HEAD/docs/L4-Escalations-Case-Study.pdf",
          },
        },
      ],
    },
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
      {
        period: "2018 – 2022",
        title: "B.E. Computer Engineering — CGPA 8.36/10",
        org: "Indira College of Engineering & Management, University of Pune",
        points: ["Foundation in programming, databases and software engineering."],
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
