import { genCode } from "./helper";
import type { CreateUrlPayload, ShortenedUrl, UserSettings } from "../models/models";

const MOCK_URLS: ShortenedUrl[] = [
  {
    id: "1",
    originalUrl: "https://www.figma.com/file/abc123/design-system",
    shortCode: "swift-fox",
    shortUrl: "snip.ly/swift-fox",
    title: "Design System Figma",
    clicks: 142,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ["design"],
  },
  {
    id: "2",
    originalUrl: "https://github.com/vercel/next.js",
    shortCode: "neat-owl",
    shortUrl: "snip.ly/neat-owl",
    title: "Next.js GitHub",
    clicks: 89,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ["dev"],
  },
  {
    id: "3",
    originalUrl: "https://linear.app/team/project/roadmap",
    shortCode: "bold-ray",
    shortUrl: "snip.ly/bold-ray",
    title: "Q2 Roadmap",
    clicks: 34,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    tags: ["work"],
  },
  {
    id: "4",
    originalUrl: "https://docs.anthropic.com/claude/reference",
    shortCode: "keen-arc",
    shortUrl: "snip.ly/keen-arc",
    title: "Claude API Docs",
    clicks: 217,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    tags: ["ai", "dev"],
  },
  {
    id: "5",
    originalUrl: "https://stripe.com/docs/api/payment_intents",
    shortCode: "crisp-dot",
    shortUrl: "snip.ly/crisp-dot",
    title: "Stripe Payments",
    clicks: 56,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
];

export const shortenUrl = async (p: CreateUrlPayload) => {
  const code = p.customCode || genCode();
  const u: ShortenedUrl = {
    id: Date.now().toString(),
    originalUrl: p.originalUrl,
    shortCode: code,
    shortUrl: `snip.ly/${code}`,
    title: p.title,
    clicks: 0,
  };
  MOCK_URLS.unshift(u);
  return u;
};

export const getAllUrl = async (f: ShortenedUrl) => {
  let urls = [...MOCK_URLS];

  return urls;
};

export const getRecentUrl = async (n = 5) => {
  return MOCK_URLS.slice(0, n);
};

export const deleteUrl = async (id: string) => {
  const i = MOCK_URLS.findIndex((u) => u.id === id);

  if (i !== -1) MOCK_URLS.splice(i, 1);
};

export const getStatsUrl = async () => {
  return {
    totalUrls: MOCK_URLS.length,
    totalClicks: MOCK_URLS.reduce((s, u) => s + u.clicks, 0),
    clicksToday: 47,
    topUrl: MOCK_URLS[0],
  };
};

export const getSettings = async () => {
  return {
    defaultDomain: "snip.ly",
    qrStyle: "rounded",
    emailNotifications: true,
    weeklyReport: false,
  };
};

export const updateSettings = async (s: UserSettings) => {
  return {
    ...s,
  };
};
