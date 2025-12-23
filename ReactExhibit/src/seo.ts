type PageDefinition = {
  title: string;
  description: string;
  robots?: string;
};

export type AppliedPageMeta = {
  title: string;
  fullTitle: string;
  description: string;
  robots: string;
  canonicalUrl: string;
};

const SITE_NAME = "ReactExhibit";
const SITE_ORIGIN = "https://x213.cz";
const SITE_BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

const DEFAULT_DESCRIPTION =
  "A showcase of modern React features, beautiful glassmorphism design, and smooth animations built with Vite, TypeScript, and Tailwind CSS.";

const PAGES: Record<string, PageDefinition> = {
  "/": {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
  "/Pomodoro": {
    title: "Pomodoro Timer",
    description: "Stay focused with the Pomodoro technique and track your productivity sessions.",
  },
  "/Kanban": {
    title: "Kanban Board",
    description: "Drag-and-drop task board demo with keyboard support and persistent local storage.",
  },
  "/Markdown": {
    title: "Markdown Editor",
    description: "Write markdown and preview it in real time, with quick formatting tools and export.",
  },
  "/Fish": {
    title: "Aquarium Planner",
    description: "Plan aquarium volume requirements and manage a fish list with live calculations.",
  },
  "/FormExScreen": {
    title: "Service Order Form",
    description: "Interactive form demo with real-time totals, dynamic inputs, and summaries.",
  },
  "/ScreenTwo": {
    title: "Animation Showcase",
    description: "Framer Motion animation demos with interactive effects and transitions.",
  },
  "*": {
    title: "Page not found",
    description: "The page you’re looking for doesn’t exist.",
    robots: "noindex,follow",
  },
};

function normalizePath(pathname: string): string {
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (withLeadingSlash !== "/" && withLeadingSlash.endsWith("/")) {
    return withLeadingSlash.slice(0, -1);
  }
  return withLeadingSlash;
}

function buildCanonicalUrl(pathname: string): string {
  const normalized = normalizePath(pathname);
  const baseUrl = `${SITE_ORIGIN}${SITE_BASE_PATH}`;
  return normalized === "/" ? `${baseUrl}/` : `${baseUrl}${normalized}`;
}

function buildFullTitle(pageTitle: string): string {
  if (!pageTitle || pageTitle === SITE_NAME) return SITE_NAME;
  return `${pageTitle} | ${SITE_NAME}`;
}

function upsertMeta(
  attributeName: "name" | "property",
  attributeValue: string,
  content: string
) {
  const selector = `meta[${attributeName}="${attributeValue}"]`;
  let meta = document.querySelector(selector) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attributeName, attributeValue);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`;
  let link = document.querySelector(selector) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function getPageMeta(pathname: string): AppliedPageMeta {
  const normalized = normalizePath(pathname);
  const page = PAGES[normalized] ?? PAGES["*"];
  const title = page.title;
  const fullTitle = buildFullTitle(title);
  const canonicalUrl = buildCanonicalUrl(normalized);
  const robots = page.robots ?? "index,follow";

  return {
    title,
    fullTitle,
    description: page.description,
    robots,
    canonicalUrl,
  };
}

export function applyPageMeta(pathname: string): AppliedPageMeta {
  const meta = getPageMeta(pathname);

  document.title = meta.fullTitle;
  upsertLink("canonical", meta.canonicalUrl);

  upsertMeta("name", "description", meta.description);
  upsertMeta("name", "robots", meta.robots);

  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:title", meta.fullTitle);
  upsertMeta("property", "og:description", meta.description);
  upsertMeta("property", "og:url", meta.canonicalUrl);

  upsertMeta("name", "twitter:card", "summary");
  upsertMeta("name", "twitter:title", meta.fullTitle);
  upsertMeta("name", "twitter:description", meta.description);

  return meta;
}
