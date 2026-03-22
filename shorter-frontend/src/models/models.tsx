export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: string;
  createdAt: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  title?: string;
  clicks: number;
  createdAt?: string;
  expiresAt?: string;
  tags?: string[];
  userId?: string;
}

export interface CreateUrlPayload {
  customCode?: string;
  originalUrl: string;
  title?: string;
}

export interface UrlFilters {
  search: string;
  sortBy: "createdAt" | "clicks" | "title";
  sortOrder: "asc" | "desc";
}
export interface UrlStats {
  totalUrls: number;
  totalClicks: number;
  clicksToday: number;
  topUrl?: ShortenedUrl;
}
export interface UserSettings {
  defaultDomain: string;
  qrStyle: "square" | "rounded" | "dots";
  emailNotifications: boolean;
  weeklyReport: boolean;
}

export interface ApiResponse {
  status: boolean,
  message: string,
  data: any
}